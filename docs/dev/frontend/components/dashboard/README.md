# components/dashboard

**Location:** [`frontend/components/dashboard/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dashboard)  
**Docs:** `docs/dev/frontend/components/dashboard/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › dashboard

Children: [roles/](roles/README.md) · [widgets/](widgets/README.md)

---

## Purpose

Dashboard-specific components split into role home views and reusable feature widgets.

---

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `roles/` | Home dashboard per `app_role` — rendered by `app/dashboard/page.tsx` |
| `widgets/` | Feature widgets used inside dashboard routes (activity log, directory, …) |

Layout chrome (`dashboard-header`, `dashboard-breadcrumb`, sidebar nav) lives in `components/layout/`, not here.

Charts live in `components/charts/`. Non-component dictionaries live in `lib/dashboard/`.

---

## Standards

- **Server/client split** — use `foo.tsx` + `foo-client.tsx`: server fetches, client interacts.
- **Role selection in `app/dashboard/page.tsx`** — do not switch roles inside dashboard components.
- **New role dashboard** — add to `roles/` and wire in `app/dashboard/page.tsx`.
- **New feature widget** — add to `widgets/` unless it is route-private (then use `_components/`).
