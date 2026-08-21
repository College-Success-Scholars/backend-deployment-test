# controllers/

**Location:** [`backend/src/controllers/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers)  
**Docs:** `docs/dev/backend/src/controllers/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › controllers

---

## Purpose

Express request handlers. A controller receives a validated `AuthenticatedRequest`, reads route/query params, calls one or more services, and returns a JSON response. Controllers contain no Supabase queries and no business logic beyond input validation and response shaping.

---

## Modules

One `*.controller.ts` per domain (auth, user, session-log, form-log, memo, traffic, activity, tutor-report-log, attendance-week, dev). Source: [`backend/src/controllers/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers). Symbol docs: [API Reference](../../../../reference/README.md).

---

## Standards

- **One controller per domain** — matches the corresponding service and route files.
- **Controllers do not import from `@supabase/supabase-js`** — all DB access goes through services.
- **Input validation at the top** — check params/query before any service call; return 400 immediately on bad input.
- **Response shape** — success: `res.json({ data: ... })` · error: `res.status(4xx|5xx).json({ error: "message" })`.
- **Use `AuthenticatedRequest`** from `auth.controller.ts` instead of plain `Request` so TypeScript knows about `authUser`, `profile`, and `accessToken`.
- **Auth middleware goes in the route file**, not the controller. Controllers assume auth has already been verified.
- **No `next()` calls** — controllers are terminal handlers; they always send a response.
- **Naming** — export functions as camelCase verbs: `getScholarNames`, `upsertExcuse`.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures. Module indexes below; full catalog: [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `activity.controller` | [API](../../../../reference/api/backend/src/controllers/activity.controller/README.md) |
| `auth.controller` | [API](../../../../reference/api/backend/src/controllers/auth.controller/README.md) |
| `dev.controller` | [API](../../../../reference/api/backend/src/controllers/dev.controller/README.md) |
| `form-log.controller` | [API](../../../../reference/api/backend/src/controllers/form-log.controller/README.md) |
| `memo.controller` | [API](../../../../reference/api/backend/src/controllers/memo.controller/README.md) |
| `session-log.controller` | [API](../../../../reference/api/backend/src/controllers/session-log.controller/README.md) |
| `traffic.controller` | [API](../../../../reference/api/backend/src/controllers/traffic.controller/README.md) |
| `tutor-report-log.controller` | [API](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/README.md) |
| `user.controller` | [API](../../../../reference/api/backend/src/controllers/user.controller/README.md) |

<!-- AUTO-API-REFERENCE:END -->
