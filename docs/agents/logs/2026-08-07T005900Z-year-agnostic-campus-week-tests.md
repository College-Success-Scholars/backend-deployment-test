# year-agnostic-campus-week-tests

**Date:** 2026-08-07T005900Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
run the front end test again

---

please update those tests, to be ambigous to future years too

---

log it
```

---

## Purpose

Make campus-week frontend/shared tests derive dates from time-config so they survive academic-year updates.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Re-ran frontend tests (14 failures after time-config moved to 2026-08-31). Rewrote shared/campus-calendar.test.ts, personal/utils.test.ts, and mentee-monitoring/utils.test.ts to use FALL_SEMESTER_FIRST_DAY, winter-break constants, campusWeekToDateRange, and Eastern helpers instead of hardcoded 2025 dates. Frontend suite: 84 passed.

---

## Code Changes

- `shared/campus-calendar.test.ts`
- `frontend/components/personal/utils.test.ts`
- `frontend/components/mentee-monitoring/utils.test.ts`
- `shared/time-config.ts`
