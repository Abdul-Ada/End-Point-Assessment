-- Enable UUID + useful extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Users & Roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  role text check (role in ('APPRENTICE','COACH')) default 'APPRENTICE',
  created_at timestamp with time zone default now()
);

-- Create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Apprentice ↔ Coach assignment
create table if not exists public.coach_assignments (
  apprentice_id uuid references public.profiles(id) on delete cascade,
  coach_id uuid references public.profiles(id) on delete cascade,
  primary key (apprentice_id, coach_id)
);

-- Diary entries
create type entry_status as enum ('DRAFT','SUBMITTED','APPROVED');

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  title text not null,
  body text not null,
  minutes_spent int not null check (minutes_spent > 0),
  ksb_tags text[] not null default '{}',
  evidence_urls text[] not null default '{}',
  status entry_status not null default 'DRAFT',
  created_at timestamptz default now()
);

-- Comments (coach -> entry)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references public.diary_entries(id) on delete cascade,
  coach_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);

-- SMART goals
create table if not exists public.smart_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  start_date date not null,
  target_date date not null,
  measure text not null,
  relevant_ksbs text[] not null default '{}',
  status text not null default 'ACTIVE',
  created_at timestamptz default now()
);

-- Helper views
create or replace view public.coach_apprentices as
select c.coach_id, c.apprentice_id
from public.coach_assignments c;

-- RPC: submit and approve
create or replace function public.submit_entry(p_entry_id uuid)
returns void as $$
begin
  update public.diary_entries
  set status = 'SUBMITTED'
  where id = p_entry_id and auth.uid() = user_id;
end;$$ language plpgsql security definer;

create or replace function public.approve_entry(p_entry_id uuid)
returns void as $$
declare v_user uuid := auth.uid();
        v_is_coach boolean;
        v_owner uuid;
begin
  select (role = 'COACH') into v_is_coach from public.profiles where id = v_user;
  if not v_is_coach then
    raise exception 'Only coaches can approve';
  end if;
  select user_id into v_owner from public.diary_entries where id = p_entry_id;
  if not exists (
    select 1 from public.coach_assignments where coach_id = v_user and apprentice_id = v_owner
  ) then
    raise exception 'Coach not assigned to this apprentice';
  end if;
  update public.diary_entries set status = 'APPROVED' where id = p_entry_id;
end;$$ language plpgsql security definer;