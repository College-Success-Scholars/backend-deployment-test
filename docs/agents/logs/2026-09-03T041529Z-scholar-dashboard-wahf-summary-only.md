# scholar-dashboard-wahf-summary-only

**Date:** 2026-09-03T041529Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
a scholar was able to see all form data, even though he was not yet promoted to a team leader, why is this the case?

---

do so

---

does it pas tests?

---

but the front end dump on the scholar dashboard is removed as well?

---

but i had a scholar (team leader on user_roster) able to see this form dump data

---

is there a fallback to check user_roster app_role for the app?

---

alright make the change for the dashboard
```

---

## Purpose

Remove scholar dashboard form-field dump so unpromoted roster TLs do not see WPL/MCF payloads.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Stopped the scholar home Activity Log from dumping form payloads. UI now shows WAHF type + submitted time only and drops WPL/MCF. POST /api/form-logs/recent-submissions returns WAHF summaries (no grades) for callers below team_leader; team leaders still get full WAHF/WPL/MCF. Added toScholarHomeActivityEntries and assembleRecentFormSubmissions tests. Backend 55 tests + build passed; frontend 99 tests passed. Could not browser-verify (signed-in scholar session). Personal monitoring dump is unchanged (team_leader+).

---

## Code Changes

- `backend/API.md`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/controllers/form-log.controller.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/services/form-log.service.ts`
- `docs/agents/codebase-notes.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/frontend/app/dashboard/README.md`
- `docs/dev/frontend/components/dashboard/README.md`
- `docs/dev/onboarding/auth-rls-runbook.md`
- `docs/dev/onboarding/roles-and-personas.md`
- `docs/dev/shared/src/README.md`
- `docs/dev/supabase/README.md`
- `frontend/components/dashboard/widgets/activity-log-client.tsx`
- `frontend/components/dashboard/widgets/activity-log.tsx`
- `shared/auth.test.ts`
- `shared/auth.ts`
- `supabase/README.md`
