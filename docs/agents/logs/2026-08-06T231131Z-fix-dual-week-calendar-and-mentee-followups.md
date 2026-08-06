# fix-dual-week-calendar-and-mentee-followups

**Date:** 2026-08-06T231131Z
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

---

@/Users/miguelventura/.cursor/projects/Users-miguelventura-Documents-GitHub-backend-deployment-test/terminals/2.txt:103-145

---

the column "week_num" should not be relied on for accurate data on week num, only rely on the backend time

---

what happens on the mentee page when a number exceeds 100 percent?

---

clamp it to max, i think its screwing with the progress bar

---

wher is the tutoring data coming from?

---

and how is duration calculated?

---

does that make sense for the data type? im getting 0h on the front end

---

yeas, sample of a time in that column is 15:00

---

log it
```

---

## Purpose

Resolve #19 campus-week Personal/Mentee migration and follow-up mentee tutoring/hours fixes

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented architecture alert #19: Personal and Mentee use shared campus calendar (dateToCampusWeek/campusWeekToDateRange); dropped semester/ISO week loads and getCampusWeekForIsoWeek bridge. Follow-ups: activity week filter uses activity_date not week_num; fixed mentee crash on invalid tutoring start_time by preferring date; parse tutor_report_logs clock text (e.g. 15:00) for duration; clamped HoursCard progress bar to 100%; answered tutoring data source and over-100% UI behavior. Frontend utils tests passed.

---

## Code Changes

- `docs/dev/README.md`
- `docs/dev/onboarding/campus-weeks.md`
- `frontend/app/dashboard/mentee/page.tsx`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/components/mentee-monitoring/hours-card.tsx`
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
