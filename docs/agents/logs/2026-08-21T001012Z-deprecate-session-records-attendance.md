# deprecate-session-records-attendance

**Date:** 2026-08-21T001012Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
solve issue #29

---

explain compute on read?

---

Issue solve plan: #29 — Deprecate session records as attendance source of truth

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.
```

---

## Purpose

Implement issue #29 remaining stages: Memo compute-on-read, stop *_records writes, freeze tables.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented remaining #29 stages in one change set. Extracted computeWeeklyMinutesByUid and getCampusWeekAttendance so Memo GET page-data uses tickets + scholar_week_excuses (same math as teams boards). Front desk KPI now averages scholar fdPct; attendance tabs use logged+excuse including zeros. Documented compute-on-read in docs/adr/001. Made POST /api/memo/sync a no-op, removed /api/session-records and /api/dev/session-records write/read routes, cleaned the acting denylist, and retired /dev/session-records to a pointer page. Added a freeze migration renaming *_records to *_legacy and regenerating Database types by hand. Updated API.md, codebase-notes, supabase README, smoke-test, and related handbook pages. Backend tests 54/54, frontend 88/88, both production builds passed. graphify CLI not installed so the knowledge graph was not updated.

---

## Code Changes

- `.github/ISSUE_TEMPLATE/bug.yml`
- `backend/API.md`
- `backend/src/app.ts`
- `backend/src/controllers/dev.controller.ts`
- `backend/src/controllers/session-record.controller.ts`
- `backend/src/middleware/reject-writes-when-acting.ts`
- `backend/src/models/attendance-week.model.ts`
- `backend/src/models/session-record.model.ts`
- `backend/src/routes/dev.routes.ts`
- `backend/src/routes/session-record.routes.ts`
- `backend/src/services/attendance-week.service.ts`
- `backend/src/services/memo-page.service.ts`
- `backend/src/services/memo.service.ts`
- `backend/src/services/session-log.service.ts`
- `backend/src/services/session-record.service.ts`
- `backend/src/supabase/database.types.ts`
- `backend/src/tests/attendance-week.test.ts`
- `backend/src/tests/auth.test.ts`
- `backend/src/tests/memo.test.ts`
- `backend/src/tests/reject-writes-when-acting.test.ts`
- `backend/src/tests/session-log.test.ts`
- `docs/agents/codebase-notes.md`
- `docs/dev/backend/src/controllers/README.md`
- `docs/dev/backend/src/middleware/README.md`
- `docs/dev/backend/src/models/README.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/backend/src/services/README.md`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `docs/dev/frontend/app/dev/README.md`
- `docs/dev/frontend/lib/README.md`
- `docs/dev/supabase/README.md`
- `frontend/app/dashboard/memo/_components/full-attendance-detail-section.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo/types.ts`
- `frontend/app/dev/page.tsx`
- `frontend/app/dev/profiles/[uid]/page.tsx`
- `frontend/app/dev/session-records/layout.tsx`
- `frontend/app/dev/session-records/page.tsx`
- `frontend/components/attendance/excuse-dialog.tsx`
- `frontend/lib/server/data.ts`
- `frontend/lib/types/session-record.ts`
- `scripts/smoke-test.sh`
