-- Enable RLS
alter table public.profiles enable row level security;
alter table public.coach_assignments enable row level security;
alter table public.diary_entries enable row level security;
alter table public.comments enable row level security;
alter table public.smart_goals enable row level security;

-- profiles: users can read their profile; coaches can read assigned apprentices; admins via dashboard (optional)
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "coach read apprentices" on public.profiles
  for select using (
    exists (
      select 1 from public.coach_assignments ca
      where ca.apprentice_id = profiles.id and ca.coach_id = auth.uid()
    )
  );

-- coach_assignments: only coaches or admins should see their mappings
create policy "coach sees assignments" on public.coach_assignments
  for select using (coach_id = auth.uid());

-- diary_entries
create policy "owner can crud" on public.diary_entries
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "coach can read assigned apprentices" on public.diary_entries
  for select using (
    exists (
      select 1 from public.coach_assignments ca
      where ca.coach_id = auth.uid() and ca.apprentice_id = diary_entries.user_id
    )
  );

-- comments
create policy "coach can insert comment for assigned apprentice" on public.comments
  for insert with check (
    exists (
      select 1 from public.diary_entries de
      join public.coach_assignments ca on ca.apprentice_id = de.user_id
      where de.id = entry_id and ca.coach_id = auth.uid()
    )
  );

create policy "read comments if owner or assigned coach" on public.comments
  for select using (
    exists (
      select 1 from public.diary_entries de
      where de.id = comments.entry_id and (
        de.user_id = auth.uid() or exists (
          select 1 from public.coach_assignments ca
          where ca.coach_id = auth.uid() and ca.apprentice_id = de.user_id
        )
      )
    )
  );

-- smart_goals
create policy "owner goals crud" on public.smart_goals
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "coach read apprentice goals" on public.smart_goals
  for select using (
    exists (
      select 1 from public.coach_assignments ca
      where ca.coach_id = auth.uid() and ca.apprentice_id = smart_goals.user_id
    )
  );
