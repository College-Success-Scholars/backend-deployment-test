---
name: Project architecture - frontend/backend split
description: CSS Atlas uses a split architecture with Express backend (port 3001) and Next.js frontend (port 3002). Frontend calls backend API for all data via lib/server/api-client.ts.
type: project
---

CSS Atlas is split into two folders:

- `backend/` — Express API (port 3001), 4-folder structure: models, services, controllers, routes
- `frontend/` — Next.js app (port 3002), calls backend for all data

**Backend auth:** Uses publishable key + user JWT per-request (AsyncLocalStorage), no service role key. Two Supabase clients: `getSupabaseAuthClient()` for token verification, `getSupabaseClient()` for data queries with user RLS.

**Frontend→Backend flow:** `lib/server/api-client.ts` extracts Supabase access token from `sb-*-auth-token` cookies (base64url-decoded, @supabase/ssr v0.7 format), sends as Bearer token. Auto-unwraps `{ data: ... }` wrapper from backend responses.

**Why:** Migration from Next.js API routes + direct Supabase calls to a dedicated Express backend. Auth login/signup stays on frontend (cookie-based Supabase auth).

**How to apply:** When adding new data operations, add endpoint to backend (controller + route + service), then call via `backendGet`/`backendPost` in the frontend's `lib/server/` layer.
