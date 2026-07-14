# Cloud Supabase

Ops docs for the hosted Supabase project. Do **not** commit project refs, API URLs (`https://<project-ref>.supabase.co`), or keys.

| Doc | Purpose |
|-----|---------|
| [MFA (TOTP) enable](mfa.md) | Turn on authenticator MFA for the project |
| [MFA reset walkthrough](mfa-reset.md) | Remove a user’s TOTP factors in the Dashboard |
| Below | Dev test-profile SQL |

---

# Dev test profiles

Schema for developer test-profile switching is applied **manually** in the [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**. Do not use the repo-root `supabase/` CLI folder.

## Run order

1. [`001_dev_test_profiles.sql`](001_dev_test_profiles.sql) — `is_developer()`, `dev_test_profiles` table, RLS
2. [`002_rls_developer_read.sql`](002_rls_developer_read.sql) — developer SELECT policies on data tables
3. [`003_seed_test_profiles.sql`](003_seed_test_profiles.sql) — five persona rows (edit `REPLACE_*` uids first)

## Before seeding

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

## Verification

1. **Policies** — Dashboard → Authentication → Policies: `dev_test_profiles` has four policies gated on `is_developer()`.
2. **As developer** — `SELECT * FROM public.dev_test_profiles` returns five rows.
3. **As non-developer** — same query returns zero rows.
4. **App** — deploy backend/frontend after SQL is applied; profile switcher lists personas at `/dev`.

## Rollback

```sql
DROP TABLE IF EXISTS public.dev_test_profiles;
DROP FUNCTION IF EXISTS public.is_developer();
-- Drop developer_read_* policies individually if needed (see 002 script policy names).
```

## Security

- Clients send only `dev_test_profiles.id` (UUID), never raw `roster_uid`.
- Test profiles are invisible to non-developers (RLS).
- Acting as a test profile is read-only for mutations (denylist in `rejectWritesWhenActing`; read-via-POST endpoints are allowed). See [`docs/dev/backend/src/middleware/README.md`](../backend/src/middleware/README.md).
