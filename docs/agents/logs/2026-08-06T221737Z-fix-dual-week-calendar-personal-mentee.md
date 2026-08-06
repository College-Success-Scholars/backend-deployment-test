# fix-dual-week-calendar-personal-mentee

**Date:** 2026-08-06T221737Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
what issue relates to the moving from semester tables to time.config.ts

---

pull it, and plan to tackle it

---

where would the semester table be used?

---

Plan: Fix dual-week calendar (#19)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.
```

---

## Purpose

Resolve architecture alert #19 by making shared campus calendar canonical on Personal and Mentee

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented #19: rewrote Personal/Mentee week pickers and form/activity matching onto dateToCampusWeek/campusWeekToDateRange; dropped getActiveSemester and ISO week UI from those pages; removed getCampusWeekForIsoWeek from shared and legacy; added component utils tests and included components/**/*.test.ts in vitest; updated campus-weeks docs. Frontend tests 77 passed; frontend build passed. graphify CLI not installed in this environment.

---

## Code Changes

- `docs/dev/README.md`
- `docs/dev/onboarding/campus-weeks.md`
- `frontend/app/dashboard/mentee/page.tsx`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/components/mentee-monitoring/mentee-monitoring-client.tsx`
- `frontend/components/mentee-monitoring/utils.test.ts`
- `frontend/components/mentee-monitoring/utils.ts`
- `frontend/components/personal/personal-client.tsx`
- `frontend/components/personal/utils.ts`
- `frontend/components/personal/utils.test.ts`
- `frontend/legacy/lib/time/index.ts`
- `frontend/legacy/lib/time/iso-campus-week.ts` (deleted)
- `frontend/lib/types/supabase.ts`
- `frontend/vitest.config.ts`
- `shared/time.ts`
