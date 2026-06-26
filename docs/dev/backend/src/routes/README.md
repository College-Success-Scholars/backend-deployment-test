# routes/

**Location:** [`backend/src/routes/`](../../../../../backend/src/routes/)  
**Docs:** `docs/dev/backend/src/routes/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › routes

---

## Purpose

Express Router definitions. Each route file declares HTTP method + path combinations, attaches auth middleware, and delegates to the appropriate controller function. Route files contain **no business logic** — they are purely structural.

---

## Files

| File | Source Link | Mount Path | Auth Level |
|------|-------------|------------|------------|
| `auth.routes.ts` | [source](../../../../../backend/src/routes/auth.routes.ts) | `/api/auth` | `requireAuth` |
| `user.routes.ts` | [source](../../../../../backend/src/routes/user.routes.ts) | `/api/users` | `requireTeamLeaderOrAbove` |
| `session-log.routes.ts` | [source](../../../../../backend/src/routes/session-log.routes.ts) | `/api/session-logs` | `requireTeamLeaderOrAbove` |
| `session-record.routes.ts` | [source](../../../../../backend/src/routes/session-record.routes.ts) | `/api/session-records` | `requireAuth` + `requireSelfOrTeamLeader` |
| `form-log.routes.ts` | [source](../../../../../backend/src/routes/form-log.routes.ts) | `/api/form-logs` | mixed (`requireAuth` / `requireTeamLeaderOrAbove`) |
| `memo.routes.ts` | [source](../../../../../backend/src/routes/memo.routes.ts) | `/api/memo` | `requireTeamLeaderOrAbove` |
| `traffic.routes.ts` | [source](../../../../../backend/src/routes/traffic.routes.ts) | `/api/traffic` | `requireTeamLeaderOrAbove` |
| `activity.routes.ts` | [source](../../../../../backend/src/routes/activity.routes.ts) | `/api/daily-activity` | `requireAuth` |
| `tutor-report-log.routes.ts` | [source](../../../../../backend/src/routes/tutor-report-log.routes.ts) | `/api/tutor-reports` | `requireTeamLeaderOrAbove` |
| `dev.routes.ts` | [source](../../../../../backend/src/routes/dev.routes.ts) | `/api/dev` | `requireDeveloper` |

All routers are mounted in [`backend/src/app.ts`](../../../../../backend/src/app.ts).

---

## Auth Middleware Reference

| Middleware | Who can call |
|-----------|-------------|
| `requireAuth` | Any authenticated user (any role) |
| `requireTeamLeaderOrAbove` | `team_leader` or `developer` |
| `requireDeveloper` | `developer` only |
| `requireSelfOrTeamLeader` | Own data, or `team_leader`/`developer` — use after `requireAuth` |

All auth middleware is exported from `controllers/auth.controller.ts`.

---

## Standards

- **One router file per domain** — must match the corresponding controller and service files.
- **No logic in route files** — only: `router.get("/path", middleware, controller)`.
- **Auth middleware on every route** — the only unprotected route is `GET /` (health check in `app.ts`).
- **Register in `app.ts`** — all routers are imported and mounted in `app.ts`; do not create floating routers.
- **Naming pattern** — file: `<domain>.routes.ts`, mount: `/api/<domain>`.
- **Full API reference** — see [`backend/API.md`](../../../../../backend/API.md) for all endpoints with params and response shapes.
