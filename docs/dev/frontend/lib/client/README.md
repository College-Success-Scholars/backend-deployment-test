# lib/client

**Location:** [`frontend/lib/client/`](../../../../../frontend/lib/client/)  
**Docs:** `docs/dev/frontend/lib/client/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › client

---

## Purpose

Browser-side API client for Client Components that need to fetch backend data after the initial page load (e.g., on user interaction, polling, or dynamic filters). Runs in the browser, reads the auth token from the Supabase JS client, and calls the backend.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `api-client.ts` | [source](../../../../../frontend/lib/client/api-client.ts) | Browser fetch wrapper — attaches Supabase session token, calls `/api/*` backend endpoints, handles errors |

---

## When to Use

| Scenario | Use |
|----------|-----|
| Initial page data, SSR | `lib/server/api-client.ts` or `lib/server/data.ts` |
| Client-side data fetch on interaction | `lib/client/api-client.ts` |
| Supabase auth state | `lib/supabase/client.ts` |

---

## Standards

- **Do not add `import "server-only"`** — this runs in the browser.
- **Do not use `next/headers` or `cookies()`** — those are server-only APIs.
- **Token source** — use the Supabase browser client's `getSession()` to get the access token; do not hardcode or read cookies manually.
- **Mirror `lib/server/data.ts`** — if a client-side equivalent of a server data function is needed, add it here with the same function name suffix (e.g., `getSessionRecordsClient`).
