# follow-up-issues-column

**Date:** 2026-08-23T042851Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
lets refomat the front desk and study sessions columns into a generic "issues" column. The idea is to show just the stat that is concerning, grades should be shown with assignment title, and percentage. Late and missing whafs should be shown as what time they submitted (if submission is found). Add a comment in the code to expand this to streaks of missing wahfs or hours, in the past few weeks, highlighting reoccuring offenders. Reminder, this streaks system is not to be made in this session, just making a comment and a github issue
```

---

## Purpose

Replace FD/SS follow-up meters with an Issues column; file streaks issue without implementing streaks.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Replaced scholar follow-up Front desk and Study session CompletionMeters with a single Issues column that lists only concerning stats: low hours as "Front desk 50% of 120 min" / "Study session …", low grades as course · assessment + percent from gradeBreakdown.low, and late/missing WAHF with form-log submitted-at (or "no submission"). Added wahfSubmittedAt on backend page-data scholar rows from the latest weekly WAHF created_at (same latest-row logic as scholarWahfStatus). Folded Flags into Issues so healthy meters are not shown. Left a classifier comment pointing at streaks follow-up issue #64 without implementing streaks. Updated classifier/assembler/async-content tests, mock-data, memo README, ubiquitous language, and API.md. Frontend 90 tests and backend 57 tests passed; both production builds passed. graphify CLI was not installed.

GitHub issue: https://github.com/College-Success-Scholars/css-atlas-v2/issues/64

---

## Code Changes

- `backend/API.md`
- `backend/src/services/memo-page.service.ts`
- `backend/src/tests/memo.test.ts`
- `docs/agents/ubiquitous_language.md`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/app/dashboard/memo/_components/form-submissions-section.tsx`
- `frontend/app/dashboard/memo/_components/full-attendance-detail-section.tsx`
- `frontend/app/dashboard/memo/_components/memo-accordion-section.tsx`
- `frontend/app/dashboard/memo/_components/scholar-follow-up-table.tsx`
- `frontend/app/dashboard/memo/_components/team-leader-performance-table.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-header-shell.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-header.tsx`
- `frontend/app/dashboard/memo/_lib/risk-classifier.test.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo/types.ts`
