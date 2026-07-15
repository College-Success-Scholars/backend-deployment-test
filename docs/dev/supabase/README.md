# Cloud Supabase

Schema source of truth is the repo-root CLI folder: [`supabase/migrations/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/supabase/migrations). See [`supabase/README.md`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/supabase/README.md).

Dashboard SQL Editor is **emergency / one-off ops only** — every lasting schema/RLS/RPC change should land as a migration PR.

## Access pattern

Domain data reaches Postgres **only through the Express backend** via `getSupabaseClient()` (table queries and Postgres RPCs such as `get_mentee_activity`).

| Do | Don’t |
|----|--------|
| Call Supabase from `backend/src/services/*` (`.from(…)`, `.rpc(…)`) | Deploy or invoke **Supabase Edge Functions** |
| Keep business logic in the Express app | Put domain logic in Deno edge functions under `supabase/functions/` |

Auth session management on the frontend still uses the Supabase JS client; that is not domain data access. PostgreSQL functions/triggers in migrations are fine — they are database objects, not Edge Functions.

### Typed client (backend only)

Generated schema types and `createClient<Database>` live under [`backend/src/supabase/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/supabase) — not in `shared/`, and not bundled for the frontend. Regen after migrations: `npm run db:types --prefix backend`.

Frontend types should describe **route response shapes** (what each page/API returns), not a mirror of Postgres tables. Backend maps query results to those DTOs.

See [backend supabase docs](../backend/src/supabase/README.md).

## Schema baseline + migration history

Captured with `supabase db dump --linked --schema public` → [`supabase/migrations/20260715051600_baseline.sql`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/supabase/migrations/20260715051600_baseline.sql) (2026-07-15).

**Migration history (Step 2, 2026-07-15):** orphan remote versions (`20260329*` … `20260414*`) were marked `reverted`; baseline `20260715051600` was marked `applied`. Local and linked remote now agree on that single version (`supabase migration list --linked`). Repair only touched the migration history table — not app schema or data.

**Do not** `supabase db push` the baseline onto production (objects already exist). New schema/RLS/RPC changes: `supabase migration new <name>` → PR → `db push` staging → prod.

### Inventory — tables in dump

`am_pm_form_logs`, `daily_scholar_activity`, `dev_test_profiles`, `front_desk_logs`, `front_desk_records`, `mcf_form_logs`, `mentor_mentee`, `profiles`, `scholar_weekly_stats`, `semester_breaks`, `semesters`, `study_session_logs`, `study_session_records`, `traffic`, `traffic_weekly_summary`, `tutor_report_logs`, `user_roster`, `whaf_form_logs`, `wpl_form_logs`

### Inventory — notable RPCs / functions

`get_mentee_activity`, `get_my_mentees`, `get_week_breaks`, `get_weekly_memo`, `get_effective_requirement`, `handle_new_user`, `is_developer`, `sync_daily_scholar_activity`, …

### Drift checklist (dump vs hand-written types)

Findings to clear in later phases (types / generated `Database`); **not** fixed by changing prod to match models:

| Area | Dump (Postgres) | Codebase |
|------|-----------------|----------|
| `profiles.student_id` | `text` | Backend `ProfilesRow.student_id: number \| null`; frontend `ProfileRow` uses `string \| null` |
| `profiles.full_name` | `GENERATED ALWAYS … STORED` | Treated as a normal writable/readable field in places (inserts must omit it) |
| `profiles.mentee_uids` | **Not a column** on `profiles` | Frontend `ProfileRow.mentee_uids` — lives on `user_roster` / `dev_test_profiles` instead |
| `get_mentee_activity` | Returns `scholar_uid`, `activity_date`, `log_source`, `duration_minutes` | Frontend `MenteeActivityRpcRow` also requires `week_num` (not in RPC) |
| `tutor_report_logs.date` | Column present | Frontend `TutoringRow` omits `date` |
| Auth / redirects | Dashboard Auth config (not in SQL dump) | App assumes Site URL + redirect URLs match frontend origin — verify in Dashboard separately |

Domain-semantics drift (campus week vs ISO week) is a separate alert — out of scope here.

---

## Dev test profiles (Dashboard runbooks)

These scripts under `docs/dev/supabase/` are **historical / ops runbooks**. Objects they create are already in the Phase 1 baseline when applied on the live project. Prefer a new migration for further changes; use these only if re-seeding or reconstructing a project by hand.

### Run order

1. [`001_dev_test_profiles.sql`](001_dev_test_profiles.sql) — `is_developer()`, `dev_test_profiles` table, RLS
2. [`002_rls_developer_read.sql`](002_rls_developer_read.sql) — developer SELECT policies on data tables
3. [`003_seed_test_profiles.sql`](003_seed_test_profiles.sql) — five persona rows (edit `REPLACE_*` uids first)
4. [`004_traffic_public_insert.sql`](004_traffic_public_insert.sql) — optional: INSERT-only RLS for public `/traffic` kiosk (no anon SELECT)

### Before seeding

Replace placeholders in `003_seed_test_profiles.sql`:

| Persona | Pick a `user_roster.uid` where… |
|---------|----------------------------------|
| Scholar — on track | Scholar with healthy hours / forms |
| Scholar — at risk | Scholar with low completion or missing forms |
| Team leader — with mentees | TL with `mentor_mentee` rows |
| Team leader — no mentees | TL with zero mentees |
| Team leader — with team | TL with team names on profile + mentees |

Verify in SQL Editor:

```sql
SELECT uid, program_role, app_role, mentee_count FROM public.user_roster WHERE uid = '<uid>';
SELECT * FROM public.mentor_mentee WHERE mentor_id = '<uid>' OR mentor_id IN (SELECT id::text FROM public.profiles WHERE student_id = '<uid>');
```

### Verification

1. **Policies** — Dashboard → Authentication → Policies: `dev_test_profiles` has four policies gated on `is_developer()`.
2. **As developer** — `SELECT * FROM public.dev_test_profiles` returns five rows.
3. **As non-developer** — same query returns zero rows.
4. **App** — deploy backend/frontend after SQL is applied; profile switcher lists personas at `/dev`.

### Rollback

```sql
DROP TABLE IF EXISTS public.dev_test_profiles;
DROP FUNCTION IF EXISTS public.is_developer();
-- Drop developer_read_* policies individually if needed (see 002 script policy names).
```

### Security

- Clients send only `dev_test_profiles.id` (UUID), never raw `roster_uid`.
- Test profiles are invisible to non-developers (RLS).
- Acting as a test profile is read-only for mutations (denylist in `rejectWritesWhenActing`; read-via-POST endpoints are allowed). See [`docs/dev/backend/src/middleware/README.md`](../backend/src/middleware/README.md).
