# components/data-display

**Location:** [`frontend/components/data-display/`](../../../../../frontend/components/data-display/)  
**Docs:** `docs/dev/frontend/components/data-display/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › data-display

---

## Purpose

Reusable data presentation components: tables, cards, progress indicators, and completion meters. These are domain-agnostic building blocks used across dashboard, dev, and memo views.

---

## Files

| File | Description |
|------|-------------|
| `data-table.tsx` | Generic sortable/filterable table (TanStack Table) |
| `scholar-data-table.tsx` | Scholar-specific table variant with collapsible sections |
| `campus-week-card.tsx` | Campus week selector with date range display |
| `form-completion-overview-card.tsx` | Form submission completion donut/card |
| `completion-meter.tsx` | Progress meter for completion percentages |
| `progress-cell.tsx` | Pill-style progress cell (time or count mode) |
| `double-entry-checker.tsx` | Validates check-in/out pairs for duplicates |

---

## Standards

- **Presentation only** — receive data via props; no fetching.
- **Reuse before duplicating** — if two routes need the same cell/table, add it here.
- **Export types alongside components** when consumers need them (e.g. `ProgressCellProps`).
