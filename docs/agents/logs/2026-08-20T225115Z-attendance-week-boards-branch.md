# attendance-week-boards-branch

**Date:** 2026-08-20T225115Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
catch me up to speed on the current working tree directory

---

great, so make a branch off of develop, bring the changes there, make a summary in a copy paste from the agent log so i can paste it. dont actually make the pr, ill handle that
```

---

## Purpose

Move uncommitted campus-week attendance boards off develop onto a feature branch and hand off a PR-ready summary.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Caught the developer up on the uncommitted Stage 2 lite attendance work on develop, then moved it onto `feat/attendance-week-boards` and committed it. Did not open a PR.

Landed campus-week FD/SS team boards that compute minutes on read from cleaned session tickets and store TL excuses in `scholar_week_excuses` (does not write `front_desk_records` / `study_session_records`). Added `/api/attendance` (`GET /week/:weekNum?kind=`, `PATCH /excuse`, TL+), two migrations (table + write RLS via `is_team_leader_or_above()`), temporary product pages at `/dashboard/teams/front-desk` and `/dashboard/teams/study` (same gate as Weekly Memo), shared `ExcuseDialog`, and a Teams sidebar entry for team leaders. Slimmed `/dev/session-records` to reuse the shared dialog on the legacy save path. Documented the split in API.md, route/Supabase READMEs, and codebase-notes. Left production 2026–27 dates in `shared/time-config.ts` (local 2025–26 rollback was already reverted) and left unrelated 2026-08-11 / 2026-08-19 session logs untracked.

---

## Code Changes

- `backend/API.md`
- `backend/src/app.ts`
- `backend/src/controllers/attendance-week.controller.ts`
- `backend/src/models/attendance-week.model.ts`
- `backend/src/routes/attendance.routes.ts`
- `backend/src/services/attendance-week.service.ts`
- `backend/src/supabase/database.types.ts`
- `backend/src/tests/attendance-week.test.ts`
- `backend/src/tests/database-model-align.test.ts`
- `docs/agents/codebase-notes.md`
- `docs/agents/logs/2026-08-20T225115Z-attendance-week-boards-branch.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/supabase/README.md`
- `frontend/app/dashboard/teams/_components/teams-attendance-client.tsx`
- `frontend/app/dashboard/teams/front-desk/page.tsx`
- `frontend/app/dashboard/teams/layout.tsx`
- `frontend/app/dashboard/teams/study/page.tsx`
- `frontend/app/dev/session-records/page.tsx`
- `frontend/components/attendance/excuse-dialog.tsx`
- `frontend/components/layout/app-sidebar.tsx`
- `frontend/lib/types/attendance-week.ts`
- `supabase/migrations/20260811213000_scholar_week_excuses.sql`
- `supabase/migrations/20260811220000_scholar_week_excuses_write_rls.sql`
