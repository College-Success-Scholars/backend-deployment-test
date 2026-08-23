# follow-up-required-hours

**Date:** 2026-08-22T205141Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
in scholar follow-up, add in how many required hours they need to give more context how what the percentages mean
```

---

## Purpose

Show required FD/SS minutes on scholar follow-up so completion % has context.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Passed fdRequired and ssRequired from MemoScholarRow onto ScholarFollowUpRow in the risk classifier. Scholar follow-up now shows muted secondary text under each CompletionMeter (e.g. 'of 120 min') so FD/SS percentages are readable against the required minutes. Kept minutes (not hours) to match Full attendance detail. Updated mock data and classifier/assembler/async-content tests. Frontend tests (89) and production build passed.

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
