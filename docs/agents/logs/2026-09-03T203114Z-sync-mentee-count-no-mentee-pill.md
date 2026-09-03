# sync-mentee-count-no-mentee-pill

**Date:** 2026-09-03T203114Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
on the weekly memo, what is the logic for determining if a tl has submitted all of their mcfs for the week?

---

how would moving the ground truth to the mentor_mentee page look?

---

what about just a one time script to update that number based on the mentor mentee table?

---

do so, if they have a profile and are a team leader, they should have at least on entry in the mentees table. cross reference this with the roster, if there is a team leader in roster, but no entry in the mentor mentee table, then set the column to -1 to signify there is relationship yet. after that, update the weekly memo to show the mcf form submission completed, but in small text that they dont have a mentee right next to the pill
```

---

## Purpose

Sync roster mentee_count from mentor_mentee (-1 when a TL has no assignment) and show no-mentee next to the weekly memo MCF pill.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added scripts/sync-mentee-count-from-mentor-mentee.sh to set team-leader mentee_count from mentor_mentee (join via profiles.id), using -1 and empty mentee_uids when there is no relationship. Weekly memo now treats required ≤ 0 as MCF on-time and renders small “no mentee” text beside the pill; overall MCF totals ignore the -1 sentinel.

---

## Code Changes

- `backend/API.md`
- `backend/src/services/form-log.service.ts`
- `backend/src/services/memo-page.service.ts`
- `backend/src/services/user.service.ts`
- `backend/src/tests/form-log.test.ts`
- `backend/src/tests/user.service.test.ts`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `docs/dev/scripts/README.md`
- `docs/dev/supabase/README.md`
- `docs/dev/supabase/public-schema.md`
- `frontend/app/dashboard/memo/_components/team-leader-performance-table.tsx`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo/types.ts`
- `frontend/app/dev/form-logs/page.tsx`
- `frontend/app/dev/form-logs/team-leaders-table.tsx`
