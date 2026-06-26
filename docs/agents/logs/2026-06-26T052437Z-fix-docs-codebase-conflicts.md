# fix-docs-codebase-conflicts

**Date:** 2026-06-26T052437Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
now look at the code, cross reference it with the documentation. ensure that the documentaiton is correct, and there is no 'Does not belong here' code in the files. as in, the code should now match the documentaiton, and list out when it doesnt
```

---

## Purpose

Audit codebase against its own documentation standards, identify where code violated 'does not belong here' rules, then fix all violations

---

## Agent Response Summary

Audit found 5 violation categories:

1. form-log.controller.ts — 6 handlers (whafByUids, mcfByUids, wplByUids, tutorReportsByUids, dailyActivityByUids, getFormLog) contained direct Supabase queries. Header says these do not belong. New service functions added to form-log.service.ts, tutor-report-log.service.ts, and daily-scholar-activity.service.ts; controller updated to delegate.

2. memo.controller.ts — weeklyMemo() called supabase.rpc() directly; refreshStats() made a raw fetch() to a Supabase Edge Function URL. Both extracted into getWeeklyMemo() and triggerRefreshStats() in memo.service.ts.

3. frontend/lib/supabase/server.ts — hasRoleAtLeast() was a stub returning true unconditionally, making requireTeamLeaderOrAbove() grant access to all authenticated users. Fixed by implementing a ROLE_ORDER map (team_leader=1, developer=2) and comparing numeric levels.

4. frontend/lib/auth.ts — contained dead functions getUserRole() and getUserProfile() not imported anywhere, and was missing a @file header. Dead functions removed, header added.

5. frontend/lib/auth/ and frontend/lib/auth.ts — entire subdirectory and root file were absent from docs/dev/frontend/lib/README.md. Both added to the files and subdirectories tables; docs/dev/frontend/lib/auth/README.md created; @file header added to safe-next-path.ts.

---

## Code Changes

- `backend/src/controllers/dev.controller.ts`
- `backend/src/controllers/form-log.controller.ts`
- `backend/src/controllers/memo.controller.ts`
- `backend/src/services/daily-scholar-activity.service.ts`
- `backend/src/services/form-log.service.ts`
- `backend/src/services/memo.service.ts`
- `backend/src/services/tutor-report-log.service.ts`
- `docs/dev/frontend/lib/README.md`
- `docs/dev/scripts/README.md`
- `frontend/lib/auth.ts`
- `frontend/lib/auth/safe-next-path.ts`
- `frontend/lib/supabase/server.ts`
