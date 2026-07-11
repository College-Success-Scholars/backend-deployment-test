# components/dashboard

**Location:** [`frontend/components/dashboard/`](../../../../../frontend/components/dashboard/)  
**Docs:** `docs/dev/frontend/components/dashboard/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › dashboard

---

## Purpose

Role-specific dashboard views and shared activity components used across the main dashboard area. The top-level role variant components (`team-leader-dashboard.tsx`, `scholar-dashboard.tsx`, etc.) are what `app/dashboard/page.tsx` renders based on the user's `app_role`.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `team-leader-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/team-leader-dashboard.tsx) | Dashboard view for team leaders — shows mentee overview, form stats, activity |
| `scholar-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/scholar-dashboard.tsx) | Dashboard view for regular scholars |
| `admin-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/admin-dashboard.tsx) | Dashboard view for admin users |
| `exec-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/exec-dashboard.tsx) | Dashboard view for executives |
| `dashboard-header.tsx` | [source](../../../../../frontend/components/dashboard/dashboard-header.tsx) | Dashboard top bar — sidebar trigger + breadcrumb |
| `dashboard-breadcrumb.tsx` | [source](../../../../../frontend/components/dashboard/dashboard-breadcrumb.tsx) | Client breadcrumb component using `resolveDashboardBreadcrumb()` |
| `default-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/default-dashboard.tsx) | Fallback dashboard when role is unrecognized |
| `directory-dashboard.tsx` | [source](../../../../../frontend/components/dashboard/directory-dashboard.tsx) | Scholar directory view |
| `activity-log.tsx` | [source](../../../../../frontend/components/dashboard/activity-log.tsx) | Server component — fetches and passes activity data |
| `activity-log-client.tsx` | [source](../../../../../frontend/components/dashboard/activity-log-client.tsx) | Client component — renders activity log with interaction |
| `activity-log-dictionary.ts` | [source](../../../../../frontend/components/dashboard/activity-log-dictionary.ts) | Maps activity log type codes to display labels |
| `personal-activity-log.tsx` | [source](../../../../../frontend/components/dashboard/personal-activity-log.tsx) | Server component — fetches personal activity data |
| `personal-activity-log-client.tsx` | [source](../../../../../frontend/components/dashboard/personal-activity-log-client.tsx) | Client component — renders personal activity with filters |
| `daily-activity-minutes-note.tsx` | [source](../../../../../frontend/components/dashboard/daily-activity-minutes-note.tsx) | Note/tooltip explaining daily activity minute calculation |
| `study-session-chart.tsx` | [source](../../../../../frontend/components/dashboard/study-session-chart.tsx) | Chart visualizing study session hours |
| `front-desk-chart.tsx` | [source](../../../../../frontend/components/dashboard/front-desk-chart.tsx) | Chart visualizing front desk session hours |
| `tutoring-hours.tsx` | [source](../../../../../frontend/components/dashboard/tutoring-hours.tsx) | Tutoring hours display card |
| `mentee-wahf-card.tsx` | [source](../../../../../frontend/components/dashboard/mentee-wahf-card.tsx) | Mentee weekly activity hours form status card |
| `submission-details-modal.tsx` | [source](../../../../../frontend/components/dashboard/submission-details-modal.tsx) | Modal showing form submission details |

---

## Standards

- **Server/client split** — use the `foo.tsx` + `foo-client.tsx` pattern: the server component fetches data, the client component handles interaction. Do not merge them.
- **Dashboard variants are selected by `app/dashboard/page.tsx`** — the page checks `profile.app_role` and renders the appropriate variant. Do not add role-switching logic inside dashboard components.
- **Dictionary files** (`activity-log-dictionary.ts`) — put type-code-to-label mappings here, not inline in components.
- **Charts use Recharts** — wrap with the `<ChartContainer>` from `components/ui/chart.tsx`.
