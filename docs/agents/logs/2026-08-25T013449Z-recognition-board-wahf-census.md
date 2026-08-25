# recognition-board-wahf-census

**Date:** 2026-08-25T013449Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
You are implementing the Weekly Memo Recognition board as a full WAHF grade census in `/Users/miguelventura/Documents/GitHub/backend-deployment-test`.

A sibling agent is filing GitHub issue **"Add: Recognition board shows full WAHF grade breakdown"** on `College-Success-Scholars/css-atlas-v2`. You implement; they file.

## Issue number
After you start, find the issue (it may appear a few seconds later). Retry with `gh` + `required_permissions: ["all"]`:

```bash
gh issue list --state open --search "Recognition board shows full WAHF" --json number,title,url --limit 5
```

Use that number in comments/tests as `Fixes #<N>` if you mention the issue. Do NOT commit, push, or open a PR unless you are explicitly asked (you are not). Leave changes in the working tree.

If the issue is not found after a few retries, implement anyway and note that Fixes # is pending.

## Product goal
Recognition board on `/dashboard/memo` must show **every assignment grade** parsed from that campus week's WAHF (`gradeBreakdown` high / mid / low), not a 5-item hours/TL shout-out.

## UI (critical — user iterated the plan)
Port the **legacy three-band structure**, NOT the legacy components, and NOT a tabbed DataTable.

Legacy reference (do not import): `frontend/legacy/app/memo/memo-content.tsx` ~1077–1157 (`GradeBreakdownSection` / `GradeBreakdownCard`).

Structure to keep:
- Outer section stays `MemoAccordionSection` titled **Recognition board**
- Empty week: “No assignment grades submitted this week.”
- Otherwise `grid-cols-1 md:grid-cols-3` of three bands: **90 – 100%**, **70 – 89%**, **Below 70%**
- Each band: title + count, list of `Scholar · course · assessment` with grade on the right; empty band = “None”

Memo feel (rebuild locally):
- Inner bands: `rounded-md bg-muted/40 p-3` like `full-attendance-detail-section.tsx` WAHF census — not nested shadcn Cards
- Count chips: existing memo `Badge` variants — high `success`, mid `warning`, low `destructive`
- Grade values: `tabular-nums` + tokens `text-success` / `text-warning-muted-foreground` / `text-destructive` (same as WAHF on-time/late/missing) — NO hardcoded emerald/amber/red
- No DataTable, no band tabs
- Short description: grades from this week's WAHF; lows also appear on scholar follow-up

Do NOT import or copy `GradeBreakdownSection` / `GradeBreakdownCard` from `frontend/legacy/`.

## Implementation steps

1. **Assembler** `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`: replace `items: string[]` shout-outs with three bands from `data.gradeBreakdown`. Badge = total parsed grades. Right label = `90–100% · 70–89% · Below 70%`.

2. **Types** `frontend/app/dashboard/memo/types.ts`: `RecognitionBoardSectionData` = `{ badgeText, rightLabel, bands: { id, label, entries }[] }` with entries scholar/course/assessment/grade/percent. Drop unused `WeeklyAccordionSection` if nothing else uses it.

3. **UI** `frontend/app/dashboard/memo/_components/recognition-board-section.tsx` as specified above.

4. **Skeleton** `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.tsx`: three muted band placeholders, not bullets/tabs.

5. **Docs:** `docs/agents/ubiquitous_language.md`, `docs/dev/frontend/app/dashboard/memo/README.md`, `frontend/app/dashboard/memo/_lib/memo-section-guide.ts`. Recognition board = full WAHF grade census. Follow-up still owns low-grade Issues. Missing/late WAHF stay on follow-up.

6. **Backend (small):** In `backend/src/services/memo-page.service.ts`, parse grades from the **latest** WAHF per scholar (`latestScholarWahf` already exists) so resubmits do not duplicate. Add unit tests in `backend/src/tests/memo.test.ts`. Mention `gradeBreakdown` on `GET /api/memo/page-data` in `backend/API.md`.

7. **Tests/mocks:** Update assembler + `weekly-memo-async-content.test.tsx` (they currently expect `"Alice Scholar - Strong completion this week"`). Add section tests. Update `frontend/app/dashboard/memo/mock-data.ts` for memo-legacy. Scholar follow-up must still only list low grades.

8. **Out of scope:** #64 streaks, #21 deleting legacy memo, roster rows for scholars with no WAHF, hours/TL shout-outs, renaming the accordion.

## Validate (required)
- `cd frontend && npm test`
- `cd frontend && npm run build`
- `cd backend && npm test`
- `cd backend && npm run build`
- If browser tools exist, check `/dashboard/memo`: three bands on desktop, stacked on narrow viewport, follow-up still only lows.
- After code changes, run `graphify update .` if the CLI exists (AST-only). If missing, skip and note it.

Fix failures before finishing. Match existing code style. Do not commit.

## Return to parent
- Issue number/URL used (or pending)
- Files changed
- Tests/builds that ran and outcomes
- Anything you could not verify (browser, graphify)
- Remaining follow-ups

---

GitHub issue is filed. Use this for all Fixes references:

- **#65** — https://github.com/College-Success-Scholars/css-atlas-v2/issues/65
- Milestone: M1 Memo MVP
- Labels: feature + needs-triage (do not change triage)
- Project board In Progress failed (token lacks project scopes). Assignee was set instead. Continue implementing; do not try to fix the project board.

Continue (or finish) the Recognition board WAHF grade census work. Do not commit or open a PR. If you already finished, just confirm you used #65 / note it in your return summary.
```

---

## Purpose

Replace Recognition board shout-outs with a full WAHF grade census (Fixes #65).

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented Recognition board as a three-band WAHF grade census for Fixes #65. Assembler maps gradeBreakdown high/mid/low into bands with a total-grades badge; UI rebuilds the legacy three-column structure with memo tokens (no legacy imports, no DataTable). Backend buildGradeBreakdown now parses assignment grades from the latest WAHF per scholar so resubmits do not duplicate. Follow-up still only lists low-grade Issues. Docs and mocks updated. Frontend 94 tests and backend 60 tests passed; both production builds passed. graphify CLI was not installed; no browser tools were available to verify /dashboard/memo layout.

---

## Code Changes

- `backend/API.md`
- `backend/src/services/memo-page.service.ts`
- `backend/src/tests/memo.test.ts`
- `docs/agents/ubiquitous_language.md`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `frontend/app/dashboard/memo/_components/recognition-board-section.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.tsx`
- `frontend/app/dashboard/memo/_lib/memo-section-guide.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo/types.ts`
