# backend/src

**Location:** [`backend/src/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src)  
**Docs:** `docs/dev/backend/src/README.md`

## Navigation

[← Root](../../README.md) › [Backend](../README.md) › src

Children: [controllers/](controllers/README.md) · [models/](models/README.md) · [services/](services/README.md) · [routes/](routes/README.md) · [middleware/](middleware/README.md) · [tests/](tests/README.md)

---

## Purpose

The root of all backend TypeScript source code. Contains the application entry point (`server.ts`), the Express app factory (`app.ts`), and the four-layer architecture: routes → controllers → services → models.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `server.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/server.ts) | Process entry point — validates env vars, starts HTTP server, handles graceful shutdown |
| `app.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/app.ts) | Express app factory — registers CORS, JSON parsing, middleware, all route groups, global error handler |

---

## Subdirectories

| Directory | Docs | Description |
|-----------|------|-------------|
| `controllers/` | [controllers/README.md](controllers/README.md) | Request handlers: parse inputs, call services, return responses |
| `models/` | [models/README.md](models/README.md) | TypeScript types and constants for domain data shapes |
| `services/` | [services/README.md](services/README.md) | Business logic and all Supabase database access |
| `routes/` | [routes/README.md](routes/README.md) | Express Router definitions — wire middleware to controllers |
| `middleware/` | [middleware/README.md](middleware/README.md) | Express middleware (logging, etc.) |
| `tests/` | [tests/README.md](tests/README.md) | Vitest integration tests |

---

## Layer Responsibilities

```
Request → Route → Middleware (auth) → Controller → Service → Supabase
                                          ↑
                                        Model (types)
```

| Layer | File pattern | Responsibility |
|-------|-------------|----------------|
| Route | `routes/*.routes.ts` | Declare HTTP method + path; attach auth middleware; call controller |
| Controller | `controllers/*.controller.ts` | Parse/validate params; orchestrate service calls; format response |
| Service | `services/*.service.ts` | All Supabase queries; business logic; data transformation |
| Model | `models/*.model.ts` | TypeScript types only — no runtime logic |

---

## Standards

- **`server.ts` vs `app.ts`**: `server.ts` owns the process (env check, `listen`, signals). `app.ts` owns the Express configuration. Tests import `app` directly.
- **No Supabase in controllers** — controllers call services; services call Supabase.
- **No HTTP logic in services** — services never touch `req`/`res`.
- **Error responses** — use `res.status(4xx).json({ error: "message" })`. The global error handler in `app.ts` catches unhandled throws.
- **Async handlers** — all async route handlers must either catch errors themselves or use a try/catch that calls `next(err)`.
