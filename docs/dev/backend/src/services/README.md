# services/

**Location:** [`backend/src/services/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services)  
**Docs:** `docs/dev/backend/src/services/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › services

---

## Purpose

The only layer that touches Supabase. Services contain all database queries, data transformation, and business logic. They are called by controllers and return typed domain objects. They never import `express` or touch `req`/`res`.

---

## Modules

One `*.service.ts` per domain, plus `supabase.service.ts` (JWT-bound client) and `dev-profile.service.ts`. Source: [`backend/src/services/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services). Symbol docs: [API Reference](../../../../reference/README.md).

---

## The Supabase Client Pattern

Every service that queries Supabase calls `getSupabaseClient()` at query time (not at module load). This creates a per-request client with the user's JWT set as the `Authorization` header, so **Supabase RLS is automatically applied**.

```typescript
// Correct — client is created per-call, JWT from AsyncLocalStorage
const supabase = getSupabaseClient();
const { data } = await supabase.from("profiles").select("*");

// Wrong — never create the client at module level or cache it across requests
const supabase = getSupabaseClient(); // ← do not do this at module top-level
```

The JWT reaches `getSupabaseClient()` via:
1. `auth.controller.ts` calls `runWithToken(token, () => next())` after verifying auth.
2. `runWithToken` stores the token in `AsyncLocalStorage`.
3. `getSupabaseClient()` reads the token from `AsyncLocalStorage`.

---

## Standards

- **No `req`/`res`/`next`** — services are pure TypeScript functions; they know nothing about HTTP.
- **Always call `getSupabaseClient()` inside the function body**, never at module scope.
- **Return typed values** — use the model types from `models/`.
- **Throw on fatal errors** — services throw `Error` on unexpected failures; controllers catch and convert to HTTP responses.
- **One service file per domain** — aligns with controllers and models.
- **`supabase.service.ts` is not a domain service** — it is infrastructure. Do not add domain logic there.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures. Module indexes below; full catalog: [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `daily-scholar-activity.service` | [API](../../../../reference/api/backend/src/services/daily-scholar-activity.service/README.md) |
| `dev-profile.service` | [API](../../../../reference/api/backend/src/services/dev-profile.service/README.md) |
| `form-log.service` | [API](../../../../reference/api/backend/src/services/form-log.service/README.md) |
| `memo-page.service` | [API](../../../../reference/api/backend/src/services/memo-page.service/README.md) |
| `memo.service` | [API](../../../../reference/api/backend/src/services/memo.service/README.md) |
| `mentee.service` | [API](../../../../reference/api/backend/src/services/mentee.service/README.md) |
| `session-log.service` | [API](../../../../reference/api/backend/src/services/session-log.service/README.md) |
| `session-record.service` | [API](../../../../reference/api/backend/src/services/session-record.service/README.md) |
| `supabase.service` | [API](../../../../reference/api/backend/src/services/supabase.service/README.md) |
| `time.service` | [API](../../../../reference/api/backend/src/services/time.service/README.md) |
| `traffic.service` | [API](../../../../reference/api/backend/src/services/traffic.service/README.md) |
| `tutor-report-log.service` | [API](../../../../reference/api/backend/src/services/tutor-report-log.service/README.md) |
| `user.service` | [API](../../../../reference/api/backend/src/services/user.service/README.md) |

<!-- AUTO-API-REFERENCE:END -->
