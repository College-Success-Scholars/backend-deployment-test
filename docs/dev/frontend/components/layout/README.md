# components/layout

**Location:** [`frontend/components/layout/`](../../../../../frontend/components/layout/)  
**Docs:** `docs/dev/frontend/components/layout/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › layout

---

## Purpose

Application chrome shared across authenticated and public routes: sidebar navigation, dashboard header, breadcrumbs, and global providers.

---

## Files

| File | Description |
|------|-------------|
| `app-sidebar.tsx` | Main sidebar with role-based nav items |
| `nav-main.tsx` | Primary navigation items |
| `nav-projects.tsx` | Section/project links in sidebar |
| `nav-secondary.tsx` | Bottom secondary nav items |
| `nav-user.tsx` | User avatar/menu in sidebar footer |
| `nav-sidebar-icon.tsx` | Icon helper for sidebar items |
| `dashboard-header.tsx` | Dashboard top bar — sidebar trigger + breadcrumb |
| `dashboard-breadcrumb.tsx` | Client breadcrumb using `resolveDashboardBreadcrumb()` |
| `idle-reset-provider.tsx` | Signs user out after inactivity (used on `/traffic`) |
| `env-var-warning.tsx` | Banner when required env vars are missing |

---

## Standards

- **Layout chrome only** — no domain data fetching or business logic.
- **Nav items are role-aware** — use helpers from `lib/auth.ts` in `app-sidebar.tsx`.
- **Breadcrumb labels** — add new dashboard routes to `lib/dashboard-breadcrumb.ts`.
