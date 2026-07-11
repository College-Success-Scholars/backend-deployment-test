# frontend/lib

**Location:** [`frontend/lib/`](../../../../frontend/lib/)  
**Docs:** `docs/dev/frontend/lib/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › lib

Children: [server/](server/README.md) · [client/](client/README.md) · [supabase/](supabase/README.md) · [auth/](auth/README.md) · [types/](types/README.md) · [format/](format/README.md) · dev _(inline below)_

---

## Purpose

All non-component TypeScript utilities for the frontend. Organized by execution environment (server vs client) and concern (API access, Supabase auth, types, formatting). The golden rule: **server-only modules are never bundled for the client**.

---

## Files (root-level)

| File | Source Link | Description |
|------|-------------|-------------|
| `api-log.ts` | [source](../../../../frontend/lib/api-log.ts) | Logging helpers for API requests/responses (`logApiRequest`, `logApiResponse`, `logApiError`, `buildBackendRequestUrl`) |
| `auth.ts` | [source](../../../../frontend/lib/auth.ts) | UI role helpers: `resolveUserRole`, `isDeveloperProfile`, `hasAssignedMentees`, `canAccessMenteeMonitoring`, `canAccessWeeklyMemo`, `formatUserRoleLabel` |
| `dashboard-breadcrumb.ts` | [source](../../../../frontend/lib/dashboard-breadcrumb.ts) | `resolveDashboardBreadcrumb()` — breadcrumb trail for dashboard routes |
| `nav-active.ts` | [source](../../../../frontend/lib/nav-active.ts) | Navigation state helpers — determines which nav item is active based on the current path |
| `utils.ts` | [source](../../../../frontend/lib/utils.ts) | General-purpose utilities: `cn()` Tailwind class merger |

---

## Subdirectories

| Directory | Docs | Environment | Description |
|-----------|------|-------------|-------------|
| `auth/` | [auth/README.md](auth/README.md) | Both | Auth redirect safety utilities (open-redirect prevention) |
| `server/` | [server/README.md](server/README.md) | Server only | Backend API client, server actions, data functions, query builders |
| `client/` | [client/README.md](client/README.md) | Client only | Browser-side backend API fetch wrapper |
| `supabase/` | [supabase/README.md](supabase/README.md) | Server + Client | Supabase client factories and auth helpers |
| `types/` | [types/README.md](types/README.md) | Both | Shared TypeScript type definitions |
| `format/` | [format/README.md](format/README.md) | Both | Display formatting utilities |
| `dev/` | _(inline below)_ | Both | Developer helpers (`effective-uid.ts`) |

### `dev/`

| File | Source Link | Description |
|------|-------------|-------------|
| `effective-uid.ts` | [source](../../../../frontend/lib/dev/effective-uid.ts) | Resolves effective scholar UID when a developer is acting as a test profile |

---

## Environment Rules

| Module | `"use client"` OK? | Notes |
|--------|-------------------|-------|
| `lib/server/*` | No | Contains `import "server-only"` — will throw at runtime if imported on client |
| `lib/client/*` | Yes | Browser-only; uses `window`, `fetch` from browser context |
| `lib/supabase/server.ts` | No | `import "server-only"` |
| `lib/supabase/client.ts` | Yes | Uses `createBrowserClient` |
| `lib/types/*` | Yes | Pure types, safe everywhere |
| `lib/format/*` | Yes | Pure functions, safe everywhere |
| `lib/utils.ts` | Yes | Pure utilities |
| `lib/api-log.ts` | Yes (carefully) | Pure functions; server usage logs to console, client usage is a no-op |

---

## Standards

- **`import "server-only"` in server modules** — any module in `lib/server/` and `lib/supabase/server.ts` must have this as its first import.
- **No Supabase domain queries outside `lib/server/`** — Supabase client from `lib/supabase/` is for auth only (session, user identity). Domain data comes from the backend via `lib/server/api-client.ts`.
- **`lib/utils.ts` is for generic utilities only** — `cn()`, type guards, etc. Domain logic goes in subdirectories.
- **Types in `lib/types/`** — do not scatter `.d.ts` or interface declarations across lib files.
- **Formatting in `lib/format/`** — display formatting (dates, labels) belongs there, not in components.
