# dual-week-calendar-personal-mentee

**Date:** 2026-07-11T061357Z
**Severity:** warning
**Category:** integrity

---

## Description

Two incompatible week systems coexist: shared/ campus calendar (fall→summer, winter break = one week) drives backend data, memo, form deadlines, and week_num in tables; Personal and Mentee pages use ISO weeks (date-fns getISOWeek) bounded by Supabase semesters (GET /api/auth/semester). iso_week_offset is fetched but unused. HistoryWeekBlock shows ISO week numbers (e.g. Week 19) while stored activity uses campus week_num — bridged only via getCampusWeekForIsoWeek. Originated in ben's Apr 11 2026 personal/mentee refactor; Miguel migrated through frontend split. Do not tackle tonight — shelve for a dedicated migration.

---

## Affected Files

- `shared/time-config.ts`
- `shared/time.ts`
- `frontend/components/personal/utils.ts`
- `frontend/components/personal/personal-client.tsx`
- `frontend/components/mentee-monitoring/utils.ts`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/app/dashboard/mentee/page.tsx`
- `frontend/lib/server/queries.ts`
- `backend/src/controllers/auth.controller.ts`

---

## Recommendation

Make shared campus calendar canonical: rewrite computeWeekOptions to use dateToCampusWeek/campusWeekToDateRange, drop getActiveSemester from Personal/Mentee page loads, remove ISO-week UI and getCampusWeekForIsoWeek bridge. Keep semesters table only for legacy RPCs needing semester_id until refactored. Annual updates stay in shared/time-config.ts.
