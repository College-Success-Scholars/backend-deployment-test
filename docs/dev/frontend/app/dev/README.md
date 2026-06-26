# app/dev

**Location:** [`frontend/app/dev/`](../../../../../frontend/app/dev/)  
**Docs:** `docs/dev/frontend/app/dev/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [app](../README.md) › dev

---

## Purpose

Developer-only diagnostic pages. Accessible only to users with `app_role = "developer"`. These pages allow developers to inspect raw data, test API integrations, and debug issues without writing one-off scripts.

---

## Files

| File | Source Link | URL | Description |
|------|-------------|-----|-------------|
| `layout.tsx` | [source](../../../../../frontend/app/dev/layout.tsx) | `/dev/*` | Dev section layout — enforces `requireDeveloper` guard |
| `page.tsx` | [source](../../../../../frontend/app/dev/page.tsx) | `/dev` | Dev tools home / index |
| `form-logs/page.tsx` | [source](../../../../../frontend/app/dev/form-logs/page.tsx) | `/dev/form-logs` | Browse raw MCF/WHAF/WPL form submissions |
| `profiles/page.tsx` | [source](../../../../../frontend/app/dev/profiles/page.tsx) | `/dev/profiles` | User profile lookup by UID |
| `session-logs/page.tsx` | [source](../../../../../frontend/app/dev/session-logs/page.tsx) | `/dev/session-logs` | Raw session check-in/out logs with heat map |
| `session-records/page.tsx` | [source](../../../../../frontend/app/dev/session-records/page.tsx) | `/dev/session-records` | Aggregated weekly session records |
| `traffic/page.tsx` | [source](../../../../../frontend/app/dev/traffic/page.tsx) | `/dev/traffic` | Traffic count analytics |

---

## Standards

- **`requireDeveloper()` must be called in `layout.tsx`** — not in individual pages. The layout enforces access for the entire `/dev/*` subtree.
- **Read-only by default** — dev pages display data; mutation operations (sync, excuse update) should be clearly labeled and confirmed.
- **These pages call `/api/dev/*` backend endpoints** — not the standard `/api/*` endpoints. The dev endpoints may return more raw/unfiltered data.
- **Do not add production features here** — if a feature is needed for team leaders, build it in `dashboard/`, not `dev/`.
- **No public access** — never remove the developer guard from this route group.
