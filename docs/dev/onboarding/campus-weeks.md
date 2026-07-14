# Campus weeks

**Docs:** `docs/dev/onboarding/campus-weeks.md`

## Navigation

[← Onboarding](README.md) › Campus weeks

**Source of truth:** [`shared/time-config.ts`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/time-config.ts) · helpers in [`shared/time.ts`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/time.ts)

---

## Purpose

Stop ISO-week bugs before they ship. Most backend and Memo queries use **campus week numbers** (`weekNum` / `week_num`), not calendar ISO weeks.

---

## Rules of thumb

1. **Default to campus weeks** from `shared/` (`FALL_SEMESTER_FIRST_DAY`, winter-break handling, `campusWeekToDateRange`, etc.).
2. **Do not** use `date-fns` `getISOWeek` (or similar) for Memo, attendance, form deadlines, or anything keyed by `week_num` in tables.
3. **`GET /api/auth/semester` / `getActiveSemester`** — use sparingly: when the server-owned campus frame does not apply (historical data, collection year not started, or you truly need a Supabase `semesters` row). Handbook note: [Campus Week System](../README.md#campus-week-system).

---

## Day exercise

1. Open Memo (or another week-scoped screen) and note the displayed week.
2. In code, find where that week is computed or passed (`weekNum` into API).
3. In a Node REPL or quick test, call `campusWeekToDateRange(weekNum)` from `shared` and confirm the date range matches UI expectations.
4. Read `FALL_SEMESTER_FIRST_DAY` in `shared/time-config.ts` — know that this constant is updated per academic year (ask before changing it).

---

## Success criteria

- [ ] You can explain why “Week 19” ISO ≠ campus week 19
- [ ] Your first PR either avoids inventing a new week system or explicitly uses `shared` helpers
- [ ] You know to ping someone before editing `time-config.ts` dates — [Ask / don’t touch](ask-and-dont-touch.md)
