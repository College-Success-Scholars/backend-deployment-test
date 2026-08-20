# excuse-week-start-identity

**Date:** 2026-08-20T232305Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
catch me up to speed on the current working tree directory

---

great, so make a branch off of develop, bring the changes there, make a summary in a copy paste from the agent log so i can paste it. dont actually make the pr, ill handle that

---

before pushing, i want to add in a created at for the excuse table, so we can differentiate between the academic years. what do you reccomend?

---

so you reccomend adding in what year the excuse is for?

---

how do other tables with this problem solve for it?

---

alrght, so storing the date of the first monday of that week sounds like a plan?

---

alright, do so

---

would it be wise to antiquate week num altogether?

---

alright, log it
```

---

## Purpose

Key scholar_week_excuses by campus-week start date so week numbers can repeat across academic years.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Caught the developer up on uncommitted Stage 2 lite attendance work, moved it onto `feat/attendance-week-boards` off develop, and committed it (no PR). Advised against using `created_at` to split academic years: campus `week_num` resets each fall, so year must be part of row identity. Compared existing tables (`semester_id` on weekly stats/traffic summaries; dated event logs; `*_records` which do not solve it). Agreed `week_start` (campus-week range start from `campusWeekToDateRange`) is the key, not a created-at heuristic. Implemented PK `(scholar_uid, week_start, kind)`, kept denormalized `week_num`, derived `week_start` on GET/PATCH, added follow-up migration for already-applied DBs, and recommended keeping `week_num` on the row and in the API so historical week labels survive `time-config` rollover. Logged this session; did not commit the `week_start` follow-up.

---

## Code Changes

- `backend/API.md`
- `backend/src/models/attendance-week.model.ts`
- `backend/src/routes/attendance.routes.ts`
- `backend/src/services/attendance-week.service.ts`
- `backend/src/supabase/database.types.ts`
- `backend/src/tests/attendance-week.test.ts`
- `backend/src/tests/database-model-align.test.ts`
- `docs/agents/codebase-notes.md`
- `docs/dev/backend/src/models/README.md`
- `docs/dev/supabase/README.md`
- `frontend/lib/types/attendance-week.ts`
- `supabase/migrations/20260811213000_scholar_week_excuses.sql`
- `supabase/migrations/20260820230000_scholar_week_excuses_week_start.sql`
