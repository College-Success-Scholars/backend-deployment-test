# issue-59-year-not-started

**Date:** 2026-08-07T004819Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
/issue-solve #59

---

Issue solve plan: #59 — Add year-not-started empty states

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

log it
```

---

## Purpose

Implement year-not-started empty states when campus calendar has no current week (#59).

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Planned and implemented #59: added shared isCollectionYearStarted + tests; YearNotStartedState UI; stopped memo current??1 fallback with yearNotStarted API payload; gated scholar/personal/mentee week-scoped UI while keeping identity chrome; fixed DailyActivityMinutesNote and CampusWeekCard null→1 pretenses; updated campus-weeks/shared docs. Frontend 84 tests, backend 42 tests, and both builds passed. Docker compose unavailable (daemon not running).

---

## Code Changes

- `shared/time.ts`
- `shared/time.test.ts`
- `backend/src/services/memo-default-week.ts`
- `backend/src/controllers/memo.controller.ts`
- `backend/src/tests/memo.test.ts`
- `frontend/components/dashboard/widgets/year-not-started-state.tsx`
- `frontend/components/dashboard/roles/scholar-dashboard.tsx`
- `frontend/components/personal/personal-client.tsx`
- `frontend/components/mentee-monitoring/mentee-monitoring-client.tsx`
- `frontend/components/dashboard/widgets/daily-activity-minutes-note.tsx`
- `frontend/components/data-display/campus-week-card.tsx`
- `frontend/app/dashboard/memo/types.ts`
- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-header-shell.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-nav-context.tsx`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.test.ts`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `docs/dev/onboarding/campus-weeks.md`
- `docs/dev/shared/src/README.md`
