# app/dashboard/memo

**Location:** [`frontend/app/dashboard/memo/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo)  
**Docs:** `docs/dev/frontend/app/dashboard/memo/README.md`

## Navigation

[← Root](../../../../README.md) › [Frontend](../../../README.md) › [app](../../README.md) › [dashboard](../README.md) › memo

---

## Purpose

The weekly memo page — the most complex view in the application. It aggregates all scholar activity for a given campus week into a single report: KPI cards, attendance detail, form submission rates, scholar follow-up tables, recognition board, and team leader performance metrics.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/page.tsx) | Memo page server component — fetches data, renders memo layout |

---

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `_components/` | Memo-specific subcomponents (prefixed `_` = route-private, not shared globally) |
| `_lib/` | Memo-specific utilities and assembler logic |

### `_components/`

| File | Source Link | Description |
|------|-------------|-------------|
| `form-submissions.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/form-submissions.tsx) | Form submission rate display |
| `full-attendance-detail.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/full-attendance-detail.tsx) | Expanded attendance breakdown |
| `accordion.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/accordion.tsx) | Memo section accordion wrapper |
| `recognition-board.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/recognition-board.tsx) | Scholar recognition display |
| `scholar-follow-up-table.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/scholar-follow-up-table.tsx) | Scholars needing follow-up |
| `team-leader-performance-table.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/team-leader-performance-table.tsx) | Team leader performance metrics |
| `weekly-kpi-cards.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/weekly-kpi-cards.tsx) | Weekly KPI summary cards |
| `weekly-memo-header.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_components/weekly-memo-header.tsx) | Memo header with week selector |

### `_lib/`

| File | Source Link | Description |
|------|-------------|-------------|
| `memo-source.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_lib/memo-source.ts) | Data fetching layer for memo page |
| `risk-classifier.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_lib/risk-classifier.ts) | Scholar risk level classification logic |
| `weekly-memo-assembler.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts) | Assembles all memo data into the final shape for rendering |
| `weekly-memo-assembler.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts) | Unit tests for the assembler |

---

## Standards

- **`_` prefix = route-private** — components and lib files in `_components/` and `_lib/` are for this route only. If a component is needed elsewhere, move it to `frontend/components/`.
- **Assembler owns data shape** — `weekly-memo-assembler.ts` is the single place that transforms raw API data into the memo display model. Do not transform data in individual components.
- **Test the assembler** — the assembler contains the most business logic; tests must be kept current.
- **Risk classification is in `risk-classifier.ts`** — do not hardcode thresholds in components.
