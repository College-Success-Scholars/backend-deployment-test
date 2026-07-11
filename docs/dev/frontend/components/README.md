# frontend/components

**Location:** [`frontend/components/`](../../../../frontend/components/)  
**Docs:** `docs/dev/frontend/components/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › components

Children: [ui/](ui/README.md) · [dashboard/](dashboard/README.md) · [mentee-monitoring/](mentee-monitoring/README.md) · [auth/](auth/README.md) · [marketing/](marketing/README.md) · [settings/](settings/README.md) · [personal/](personal/README.md) · dev _(inline below)_

---

## Purpose

Reusable React components. Split into domain-specific subdirectories and a `ui/` directory for primitive UI elements. Components here are shared across multiple pages; route-private components live in the route's `_components/` folder.

---

## Files (root-level components)

| File | Source Link | Description |
|------|-------------|-------------|
| `app-sidebar.tsx` | [source](../../../../frontend/components/app-sidebar.tsx) | Main application sidebar with nav items and project selector |
| `auth-button.tsx` | [source](../../../../frontend/components/auth-button.tsx) | Login/logout button (shows state based on session) |
| `login-form.tsx` | [source](../../../../frontend/components/login-form.tsx) | Login form with email/password fields |
| `logout-button.tsx` | [source](../../../../frontend/components/logout-button.tsx) | Logout button that calls Supabase signOut |
| `sign-up-form.tsx` | [source](../../../../frontend/components/sign-up-form.tsx) | Registration form |
| `update-password-form.tsx` | [source](../../../../frontend/components/update-password-form.tsx) | Password update form |
| `forgot-password-form.tsx` | [source](../../../../frontend/components/forgot-password-form.tsx) | Password reset request form |
| `idle-reset-provider.tsx` | [source](../../../../frontend/components/idle-reset-provider.tsx) | Provider that signs the user out after a period of inactivity |
| `data-table.tsx` | [source](../../../../frontend/components/data-table.tsx) | Generic sortable/filterable data table (TanStack Table) |
| `scholar-data-table.tsx` | [source](../../../../frontend/components/scholar-data-table.tsx) | Data table variant for scholar-specific data |
| `form-completion-overview-card.tsx` | [source](../../../../frontend/components/form-completion-overview-card.tsx) | Card showing form submission completion status |
| `campus-week-card.tsx` | [source](../../../../frontend/components/campus-week-card.tsx) | Campus week selector card with date range display |
| `complete-profile-form.tsx` | [source](../../../../frontend/components/complete-profile-form.tsx) | Form for scholars to complete missing profile fields |
| `double-entry-checker.tsx` | [source](../../../../frontend/components/double-entry-checker.tsx) | Validates check-in/out pairs for duplicates |
| `completion-meter.tsx` | [source](../../../../frontend/components/completion-meter.tsx) | Progress meter for completion percentages |
| `chart-radial-stacked.tsx` | [source](../../../../frontend/components/chart-radial-stacked.tsx) | Stacked radial chart component |
| `chart-radial-text.tsx` | [source](../../../../frontend/components/chart-radial-text.tsx) | Radial chart with center text label |
| `hero.tsx` | [source](../../../../frontend/components/hero.tsx) | Landing page hero section |
| `deploy-button.tsx` | [source](../../../../frontend/components/deploy-button.tsx) | Vercel deploy button |
| `env-var-warning.tsx` | [source](../../../../frontend/components/env-var-warning.tsx) | Warning banner when required env vars are missing |
| `nav-main.tsx` | [source](../../../../frontend/components/nav-main.tsx) | Primary navigation items in sidebar |
| `nav-projects.tsx` | [source](../../../../frontend/components/nav-projects.tsx) | Project/section selector in sidebar |
| `nav-secondary.tsx` | [source](../../../../frontend/components/nav-secondary.tsx) | Secondary (bottom) navigation items |
| `nav-user.tsx` | [source](../../../../frontend/components/nav-user.tsx) | User avatar/menu in sidebar footer |
| `nav-sidebar-icon.tsx` | [source](../../../../frontend/components/nav-sidebar-icon.tsx) | Icon helper for sidebar navigation items |
| `next-logo.tsx` | [source](../../../../frontend/components/next-logo.tsx) | Next.js logo SVG |
| `supabase-logo.tsx` | [source](../../../../frontend/components/supabase-logo.tsx) | Supabase logo SVG |

---

## Subdirectories

| Directory | Docs | Description |
|-----------|------|-------------|
| `ui/` | [ui/README.md](ui/README.md) | shadcn/ui primitive components (Radix UI wrappers) |
| `dashboard/` | [dashboard/README.md](dashboard/README.md) | Role-specific dashboard views and activity components |
| `mentee-monitoring/` | [mentee-monitoring/README.md](mentee-monitoring/README.md) | Mentee monitoring cards and client |
| `auth/` | [auth/README.md](auth/README.md) | Auth flow helper components |
| `marketing/` | [marketing/README.md](marketing/README.md) | Landing page marketing components |
| `settings/` | [settings/README.md](settings/README.md) | Settings page client |
| `personal/` | [personal/README.md](personal/README.md) | Personal dashboard client and utilities |
| `dev/` | _(inline below)_ | Developer test-profile UI (profile switcher, acting banner) |

### `dev/`

| File | Source Link | Description |
|------|-------------|-------------|
| `profile-switcher.tsx` | [source](../../../../frontend/components/dev/profile-switcher.tsx) | Dropdown to switch between developer's own profile and test personas |
| `dev-acting-banner.tsx` | [source](../../../../frontend/components/dev/dev-acting-banner.tsx) | Banner shown when a developer is acting as a test profile |

---

## Standards

- **Shared components only** — if a component is used by exactly one route, put it in that route's `_components/` folder.
- **Props over context** — pass data down via props from server components; avoid React context unless truly needed.
- **Client components are explicit** — add `"use client"` only when the component needs browser APIs, event handlers, or React hooks.
- **`ui/` components are untouched** — do not edit files in `components/ui/`. Add new ones via `npx shadcn@latest add <component>`.
- **No data fetching in components** — components receive data as props. Data fetching happens in pages or dedicated client hooks.
- **Naming** — PascalCase component files (e.g., `DataTable.tsx`) would be fine but this project uses kebab-case (e.g., `data-table.tsx`) — match existing convention.
