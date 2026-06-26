# middleware/

**Location:** [`backend/src/middleware/`](../../../../../backend/src/middleware/)  
**Docs:** `docs/dev/backend/src/middleware/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › middleware

---

## Purpose

Express middleware that runs on every request (or a broad set of requests). Distinct from auth middleware — auth middleware lives in `controllers/auth.controller.ts` because it populates `req.authUser` and `req.profile`, making it tightly coupled to the controller layer.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `request-logger.ts` | [source](../../../../../backend/src/middleware/request-logger.ts) | Logs each incoming request: HTTP method, URL, response status code, and duration in milliseconds |

---

## Standards

- **Application-wide middleware here** — middleware that applies to all or most routes belongs in this directory and is registered in `app.ts` via `app.use(middleware)`.
- **Route-specific middleware belongs in routes** — if middleware only applies to one route group, pass it as an argument to the route definition in `routes/*.routes.ts`.
- **Auth middleware lives in `controllers/auth.controller.ts`** — not here, because it needs to populate request context fields.
- **Keep middleware stateless** — middleware should not hold per-request state outside of the request object.
- **Naming** — `<purpose>.ts` (e.g., `request-logger.ts`, `rate-limiter.ts`).
