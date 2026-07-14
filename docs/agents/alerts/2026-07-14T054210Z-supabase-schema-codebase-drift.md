# supabase-schema-codebase-drift

**Date:** 2026-07-14T054210Z
**Severity:** warning
**Category:** integrity

---

## Description

Schema and app types are out of sync because cloud Supabase is the live schema (manual Dashboard SQL Editor applies), while the codebase maintains parallel hand-written shapes in backend models and frontend types, and uses an untyped Supabase client (`createClient` without a `Database` generic).

Current process explicitly versions only a few ad-hoc scripts under `docs/dev/supabase/` and tells developers not to use a repo-root CLI `supabase/` migrations folder. There is no migration history for the full public schema, no CI schema snapshot, and no generated types from Postgres. Result: drift is discovered at runtime (e.g. `student_id` string vs numeric, inserting generated `full_name`, RLS/policies, auth email templates) rather than at compile or PR time.

Do not conflate this with domain-semantics drift (e.g. dual campus vs ISO week calendars) — that is a separate product decision. This alert is about making versioned SQL → typed clients → shared API DTOs the pipeline so column/RLS/RPC contracts stop diverging silently.

---

## Affected Files

- `docs/dev/supabase/README.md`
- `docs/dev/supabase/001_dev_test_profiles.sql`
- `docs/dev/supabase/002_rls_developer_read.sql`
- `docs/dev/supabase/003_seed_test_profiles.sql`
- `backend/src/services/supabase.service.ts`
- `backend/src/models/user.model.ts`
- `backend/src/models/session-log.model.ts`
- `backend/src/models/session-record.model.ts`
- `backend/src/models/form-log.model.ts`
- `frontend/lib/types/supabase.ts`
- `docs/dev/frontend/lib/types/README.md`
- `docs/dev/backend/src/models/README.md`

---

## Recommendation

Make Postgres the source of truth; stop re-describing it by hand in three places. Execute in phases:

### Phase 1 — Inventory / baseline (no rewrite)
1. Dump live public schema (tables, views, RPCs, policies) from the cloud project.
2. Diff against hand-written row types (`backend/src/models/*`, `frontend/lib/types/supabase.ts` and related).
3. List RLS policies and auth config the app assumes (redirect URLs, confirm-email template).
4. Record the dump as the checked-in baseline — do not invent a greenfield schema from models and force it onto prod.

### Phase 2 — Source of truth in git
1. Introduce `supabase/migrations/` (or equivalent numbered SQL) seeded from the Phase 1 dump.
2. Policy: every future schema/RLS/RPC change is a migration PR; apply staging → prod.
3. Treat Dashboard SQL without a matching migration as an incident.
4. Update `docs/dev/supabase/README.md` to reverse “do not use CLI migrations”; Dashboard becomes emergency-only.
5. Local Supabase is optional later — versioned DDL + apply path is the minimum.

### Phase 3 — Generated DB types on the backend client
1. Generate `Database` types from schema into e.g. `shared/database.ts` or `backend/src/types/database.ts`.
2. Pass `createClient<Database>(…)` only through `supabase.service.ts`.
3. Refactor backend models toward thin projections of `Tables[…]['Row']` / Insert types — not independent copies.
4. Keep full `Database` out of the frontend bundle; frontend continues to use API DTOs only (preserves “no domain queries from frontend”).

### Phase 4 — Kill the triple mirror
1. Define shared API DTOs for wire shapes the frontend needs.
2. Frontend imports those DTOs from `shared/` instead of maintaining a second `lib/types/supabase.ts` mirror.
3. Shrink hand-written FE/BE row types until they are intentional DTOs only.

### Phase 5 — Detect drift in CI
1. Dump or regenerate types in CI; fail the job on git diff against checked-in artifacts.
2. Add smoke coverage for critical RPCs/tables (`get_mentee_activity`, `get_week_breaks`, profile insert path).
3. Optional later: local Supabase for PR previews.

### Explicit non-goals
- Big-bang regenerate + rewrite the app.
- Auto-generating full schema types into the browser bundle.
- Fixing dual week-calendar semantics under this alert (see dual-week-calendar alert).
