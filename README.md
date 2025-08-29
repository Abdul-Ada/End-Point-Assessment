## Features
- Sign up / Sign in with Supabase Auth
- Create **Diary Entries** with KSB tags, minutes spent, evidence links
- **Submit/Approve** flow (APPRENTICE → COACH)
- **SMART Goals** with progress breakdown
- **Coach dashboard** (filter by apprentice, status, KSB)
- Storage bucket for evidence (optional; links also supported)

## Tech
- Frontend: React + Vite + TypeScript
- Backend: Supabase (Postgres tables, RLS policies, SQL RPC functions)
- Hosting: GitHub Pages / Vercel; DB/Auth/Storage on Supabase


## 1. Setup
1. **Create Supabase project** → get URL + anon key.
2. In Supabase SQL editor, run scripts in order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/storage-policies.sql`
   - (optional) `supabase/seed.sql`
3. **Configure env**: copy `web/.env.example` to `web/.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. **Run locally**
   ```bash
   cd web
   npm i
   npm run dev

   apprenticeship-tracker/
├─ README.md
├─ supabase/
│  ├─ schema.sql
│  ├─ policies.sql
│  ├─ storage-policies.sql
│  └─ seed.sql
├─ admin/                          # one-time local seeding (service role key, not committed)
│  ├─ package.json
│  ├─ .env.example                 # copy to .env with SUPABASE_URL + SERVICE_ROLE_KEY
│  └─ seed-coach.js
└─ web/
   ├─ index.html
   ├─ package.json
   ├─ tsconfig.json
   ├─ vite.config.ts
   ├─ postcss.config.js
   ├─ tailwind.config.ts
   ├─ .env                         # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
   ├─ public/
   │  └─ favicon.svg
   └─ src/
      ├─ index.css                 # Tailwind entry
      ├─ main.tsx
      ├─ App.tsx                   # App Shell (Topbar + Sidebar + <Outlet/>)
      ├─ types.ts
      ├─ lib/
      │  ├─ supabaseClient.ts
      │  └─ rpc.ts
      ├─ components/
      │  ├─ Topbar.tsx
      │  ├─ Sidebar.tsx            # hides Coach link unless role === 'COACH'
      │  ├─ EntryList.tsx
      │  └─ ui/
      │     ├─ Button.tsx
      │     ├─ Input.tsx
      │     ├─ Textarea.tsx
      │     ├─ Card.tsx
      │     └─ cn.ts
      └─ pages/
         ├─ Login.tsx
         ├─ Dashboard.tsx
         ├─ NewEntry.tsx
         ├─ EntryView.tsx
         ├─ Goals.tsx
         └─ Coach.tsx


