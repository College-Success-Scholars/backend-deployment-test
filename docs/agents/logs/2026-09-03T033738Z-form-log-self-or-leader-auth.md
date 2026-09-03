# form-log-self-or-leader-auth

**Date:** 2026-09-03T033738Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
a scholar was able to see all form data, even though he was not yet promoted to a team leader, why is this the case?

---

do so
```

---

## Purpose

Stop scholars from reading program-wide form logs without team-leader promotion.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Gated /api/form-logs so week-wide, batch, stats, and generic id lookups require team_leader+ (requireTeamLeaderRole after requireAuth). Uid-scoped GETs use requireSelfOrTeamLeader; recent-submissions uses requireSelfScholarIdOrTeamLeader so scholars can only request their own roster uid. Added shared canAccessRequestedScholarId / parseRequestedScholarId helpers and unit tests. Added Supabase migration 20260903033000_form_log_rls_own_or_leaders.sql: drop USING (true) on MCF/WPL, replace stale WAHF policy, own-row via roster_uid() (profiles.student_id) plus is_team_leader_or_above(). Updated API.md, routes README, roles/RLS/supabase docs. Backend 54 tests and build passed; frontend 97 tests passed (includes shared auth tests). graphify CLI not installed; Docker daemon was not running.

---

## Code Changes

- `backend/API.md`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/controllers/form-log.controller.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/tests/form-log.test.ts`
- `docs/agents/codebase-notes.md`
- `docs/dev/backend/api.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/onboarding/auth-rls-runbook.md`
- `docs/dev/onboarding/roles-and-personas.md`
- `docs/dev/shared/src/README.md`
- `docs/dev/supabase/README.md`
- `shared/auth.test.ts`
- `shared/auth.ts`
- `supabase/README.md`
- `supabase/migrations/20260903033000_form_log_rls_own_or_leaders.sql`
