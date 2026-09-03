# components/dashboard

**Location:** [`frontend/components/dashboard/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dashboard)  
**Docs:** `docs/dev/frontend/components/dashboard/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › dashboard

---

## Purpose

Dashboard-specific components split into role home views and reusable feature widgets.

---

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `roles/` | Home dashboard per `app_role` — selected by `app/dashboard/page.tsx` via `resolveUserRole()` |
| `widgets/` | Feature widgets used inside dashboard routes (activity log, directory, …). Scholar `ActivityLog` is WAHF type + timestamp only; full payloads stay on Personal (`PersonalActivityLog`, team_leader+). |

Layout chrome (`dashboard-header`, `dashboard-breadcrumb`, sidebar nav) lives in `components/layout/`, not here.

Charts live in `components/charts/`. Non-component dictionaries live in `lib/dashboard/`.

---

## Standards

- **Server/client split** — use `foo.tsx` + `foo-client.tsx`: presentational server shell + interactive client. Domain fetching stays in pages (or thin role parents that only receive props from the page); pass results as props.
- **Role selection in `app/dashboard/page.tsx`** — do not switch roles inside dashboard components; roles import widgets from `widgets/` and charts from `components/charts/`.
- **New role dashboard** — add to `roles/` and wire in `app/dashboard/page.tsx`.
- **New feature widget** — add to `widgets/` unless it is route-private (then use `_components/`).
- **WA HF status** — single canonical card in `mentee-monitoring/wahf-card.tsx` (do not duplicate under widgets).
