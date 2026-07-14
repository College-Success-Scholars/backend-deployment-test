# tests/

**Location:** [`backend/src/tests/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests)  
**Docs:** `docs/dev/backend/src/tests/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › tests

---

## Purpose

Vitest integration tests for the backend API. Tests import the Express `app` directly (from `app.ts`) and use `supertest` to make HTTP requests, so they exercise the full request pipeline without starting a real server.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `health.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/health.test.ts) | Tests the `GET /` health check endpoint |
| `auth.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/auth.test.ts) | Tests auth middleware behavior (unauthorized, forbidden, valid token) |
| `jwt-aal.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/jwt-aal.test.ts) | Unit tests for `getJwtAal` (JWT `aal` claim parsing) |
| `user.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/user.test.ts) | Tests user data endpoints |
| `session-log.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/session-log.test.ts) | Tests session log endpoints |
| `memo.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/tests/memo.test.ts) | Tests memo endpoints |

---

## Running Tests

```bash
npm run test          # vitest run (single pass)
npm run test:watch    # vitest (watch mode)
```

Tests are configured in [`backend/vitest.config.ts`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/vitest.config.ts).

---

## Standards

- **Test via `supertest`** — import `app` from `../app.js` and use `supertest(app)`. Never start a live server.
- **One test file per domain** — mirrors the route/controller/service structure.
- **Mock Supabase for unit-like tests** — avoid hitting the real database in CI; use `vi.mock` or inject test tokens only if a real Supabase test project is configured.
- **Test auth levels** — every endpoint should have a test for 401 (no token), 403 (wrong role), and 200 (correct token).
- **No shared mutable state** — reset mocks in `beforeEach`/`afterEach`.
- **Test file naming** — `<domain>.test.ts`.
