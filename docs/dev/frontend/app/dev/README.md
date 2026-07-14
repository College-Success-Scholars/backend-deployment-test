# app/dev

**Location:** [`frontend/app/dev/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/dev)  
**Docs:** `docs/dev/frontend/app/dev/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [app](../README.md) › dev

---

## Purpose

Developer-only scratchpad for testing backend API integrations and inspecting raw data. These pages were built to validate Express backend endpoints during the migration away from Next.js API routes. **They are not kept in sync with production UI patterns** and should not be treated as a component library or source of reusable widgets.

For production features, build in `app/dashboard/` and shared components in `components/`.

---

## Files

| File | URL | Description |
|------|-----|-------------|
| `layout.tsx` | `/dev/*` | Dev section layout — enforces `requireDeveloper` guard |
| `page.tsx` | `/dev` | Dev tools home / index |
| `form-logs/page.tsx` | `/dev/form-logs` | Browse raw MCF/WHAF/WPL form submissions |
| `profiles/page.tsx` | `/dev/profiles` | User profile lookup by UID |
| `profiles/[uid]/page.tsx` | `/dev/profiles/:uid` | Per-user detail: session records, logs, and form submissions |
| `session-logs/page.tsx` | `/dev/session-logs` | Raw session check-in/out logs with heat map |
| `session-records/page.tsx` | `/dev/session-records` | Aggregated weekly session records |
| `traffic/page.tsx` | `/dev/traffic` | Traffic count analytics |

---

## Standards

- **`requireDeveloper()` in `layout.tsx`** — guards the entire `/dev/*` subtree.
- **Scratchpad quality bar** — large client `page.tsx` files are acceptable here; do not copy this pattern to `dashboard/`.
- **Do not import from `app/dev/` in production routes** — if a chart or table is needed elsewhere, move it to `components/charts/` or `components/data-display/`.
- **Calls `/api/dev/*` or standard `/api/*`** — may return more raw/unfiltered data than production pages.
- **No public access** — never remove the developer guard.
