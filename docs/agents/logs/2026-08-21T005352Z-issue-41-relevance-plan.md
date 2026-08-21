# issue-41-relevance-plan

**Date:** 2026-08-21T005352Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
solve issue #41, do we still need this?
```

---

## Purpose

Verify whether GitHub issue #41 is still needed and plan the remaining Memo form-submissions work.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Pulled issue #41 (needs-triage, feature, M1 Memo MVP) and compared it to the current Memo assembler, memo-page.service, KPI cards, and form-submissions section. Verdict PARTIALLY_FIXED: attendance detail already uses logged+excuse minutes matching backend scholar %, KPI title/value already agree on front-desk attendance, and assembler tests cover excuse-aware attendance. Remaining gap: Form submissions table rows still invent WAHF/WPL/MCF status from follow-up heuristics (frontDeskPct < 75, Low flags) instead of teamLeaderFormStats / form logs already on /api/memo/page-data. Summaries already come from TL form stats. Did not implement; did not mutate the issue. Flagged the needs-triage label and an ask-before on scholar-shaped rows vs TL form-log truth.

---

## Code Changes

- `docs/dev/frontend/app/dashboard/README.md`
- `docs/dev/frontend/components/dashboard/README.md`
- `frontend/app/dashboard/page.tsx`
- `frontend/components/dashboard/roles/admin-dashboard.tsx`
- `frontend/components/dashboard/roles/exec-dashboard.tsx`
- `frontend/components/dashboard/roles/team-leader-dashboard.tsx`
- `frontend/components/layout/app-sidebar.tsx`
- `frontend/lib/auth.test.ts`
- `frontend/lib/auth.ts`
- `frontend/lib/dashboard-breadcrumb.test.ts`
- `frontend/lib/dashboard-breadcrumb.ts`
