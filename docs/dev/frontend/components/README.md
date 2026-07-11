# frontend/components

**Location:** [`frontend/components/`](../../../../frontend/components/)  
**Docs:** `docs/dev/frontend/components/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › components

Children: [ui/](ui/README.md) · [layout/](layout/README.md) · [auth/](auth/README.md) · [data-display/](data-display/README.md) · [charts/](charts/README.md) · [dashboard/](dashboard/README.md) · [mentee-monitoring/](mentee-monitoring/README.md) · [marketing/](marketing/README.md) · [settings/](settings/README.md) · [personal/](personal/README.md) · [dev/](dev/README.md)

---

## Purpose

Reusable React components organized by domain. Components here are shared across multiple routes. Route-private components live in the route's `_components/` folder (see `app/dashboard/memo/_components/` for the canonical example).

---

## Directory layout

```
components/
  ui/                  shadcn/ui primitives — add via `npx shadcn@latest add`
  layout/              App chrome: sidebar, nav, dashboard header/breadcrumb
  auth/                Login, sign-up, password, and profile-completion forms
  data-display/        Tables, cards, progress cells, completion meters
  charts/              Recharts/D3 visualizations shared across routes
  dashboard/
    roles/             Role-specific home dashboards (scholar, team-leader, …)
    widgets/           Dashboard feature widgets (activity log, directory, …)
  mentee-monitoring/   Mentee monitoring cards and client
  personal/            Personal dashboard client
  settings/            Settings page client
  marketing/           Landing page sections
  dev/                 Developer UI (profile switcher, acting banner)
```

Non-component utilities (dictionaries, assemblers, formatters) belong in `lib/`, not here. Example: `lib/dashboard/activity-log-dictionary.ts`.

---

## Placement rules

| If the component… | Put it in… |
|-------------------|------------|
| Is a shadcn primitive | `ui/` (via CLI) |
| Is app chrome (sidebar, nav, header) | `layout/` |
| Is an auth form or auth-flow helper | `auth/` |
| Is a generic table, card, or progress display | `data-display/` |
| Is a chart or heat map | `charts/` |
| Is a role-specific dashboard home view | `dashboard/roles/` |
| Is a dashboard feature widget | `dashboard/widgets/` |
| Is used by exactly one route | That route's `_components/` |
| Is a pure `.ts` utility (no JSX) | `lib/` (never `components/`) |

---

## Standards

- **Shared components only** — single-route components go in `_components/`.
- **Props over context** — pass data from server components via props.
- **Client components are explicit** — add `"use client"` only when needed.
- **`ui/` is managed by shadcn** — do not hand-edit; add via CLI.
- **No data fetching in components** — fetch in pages; pass data as props.
- **kebab-case file names** — e.g. `data-table.tsx`, not `DataTable.tsx`.
- **No imports from `legacy/`** — deprecated code is excluded from the build.
- **No imports from `app/dev/` in production routes** — dev pages are scratchpads for backend testing, not a component library.

---

## Route colocation (canonical pattern)

Follow `app/dashboard/memo/`:

```
app/dashboard/memo/
  page.tsx              thin server page — auth + orchestration
  _components/          route-private UI
  _lib/                 pure logic + tests
```

Do not grow 500+ line `page.tsx` files. Extract to `_components/` and `*-client.tsx` as needed.
