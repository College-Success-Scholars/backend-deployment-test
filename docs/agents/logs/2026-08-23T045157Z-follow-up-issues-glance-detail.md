# follow-up-issues-glance-detail

**Date:** 2026-08-23T045157Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
the tabl should have a seperate coulmn showing extra information in a flex box, seperating it out from just a quick glance. to be clear, one col should see whats missing, the other should have a fun indicator on *how* its missing (sliders and time indicators).
```

---

## Purpose

Split scholar follow-up Issues into glance vs how-missing indicators.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Split scholar follow-up from a single Issues chip list into What's missing (short labels only) and How it's missing (flex-stacked indicators). Hours and grades use CompletionMeter; hours also show of N min; WAHF uses a clock time (submitted-at) or No submission. Classifier now emits structured glance/pct/requiredMinutes/submittedAtLabel instead of combined label strings. Updated mock data, classifier/assembler/async-content tests, added a table render test, and refreshed memo README plus ubiquitous language. Frontend 91 tests and production build passed. graphify CLI was not installed. Could not click through in a browser.

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
