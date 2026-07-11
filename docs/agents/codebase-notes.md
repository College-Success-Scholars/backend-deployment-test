# Codebase Notes

## Standard check results

- Backend check: `npm --prefix backend run build` passes.
- Frontend check: `npm --prefix frontend run lint` passes.
- Frontend tests: `npm --prefix frontend run test` passes.

## High-level architecture

This repository is a two-app setup:

- `backend/`: Express + TypeScript API service.
- `frontend/`: Next.js 16 (App Router) web app.

Core data/auth platform is Supabase. The frontend obtains user session/JWT and calls backend endpoints with `Authorization: Bearer <token>`. The backend validates that JWT and then performs user-scoped Supabase queries.

## Backend how it works

Entry point: `backend/src/server.ts`.

- Registers CORS (comma-separated `CORS_ORIGIN`, default `http://localhost:3002` — must match the frontend origin), JSON parsing, request logger, route groups, and a global error handler.
- Routes are mounted under `/api/*` with domain-specific modules (`auth`, `users`, `session-logs`, `session-records`, `traffic`, `form-logs`, `daily-activity`, `memo`, `tutor-reports`, `dev`).

Request flow pattern:

1. Route-level auth middleware (`requireAuth`, `requireTeamLeaderOrAbove`, or `requireDeveloper`).
2. Controller validates inputs and orchestrates service calls.
3. Service reads/writes Supabase and returns domain data.
4. Controller returns `{ data }` or `{ error }`.

Auth and Supabase context:

- `auth.controller.ts` extracts JWT from header and verifies with Supabase auth.
- It stores token/user/profile on `req`.
- `supabase.service.ts` uses `AsyncLocalStorage` to bind the JWT per request via `runWithToken(...)`.
- `getSupabaseClient()` reads that token and creates a client with `Authorization` header, so RLS is applied consistently.

Important backend domains:

- `session-log.*`: fetches and cleans raw check-in/out logs.
- `session-record.*`: computes weekly minute totals, syncs records into `front_desk_records` / `study_session_records`, supports excuse updates.
- `form-log.*`: MCF/WHAF/WPL and related aggregation endpoints.
- `memo.*`: memo aggregation endpoints and sync/refresh operations.
- `traffic.*`: weekly traffic counts and session entries.

## Frontend how it works

Frontend uses Next.js App Router with route groups in `frontend/app/`.

- `frontend/middleware.ts` wires Supabase session update middleware (`lib/supabase/middleware.ts` → `updateSession`).
- Middleware redirects unauthenticated users to `/auth/login`, with public exceptions for `/`, `/auth/*`, and `/traffic` (kiosk check-in).
- App includes dashboard routes, auth routes, standalone `/memo` and `/traffic` views, and developer pages under `app/dev/*`.
- Theme, fonts, and toaster are initialized in `app/layout.tsx`.

Data access pattern:

- `frontend/lib/server/data.ts` acts as a typed backend API client wrapper for many `/api/*` calls.
- Frontend server/client features consume these wrappers instead of duplicating fetch logic.
- Developer tools pages (`/dev/session-records`, `/dev/session-logs`, etc.) are present for operational/debug workflows.

## Typical end-to-end flow (example)

For an authenticated session record request:

1. User logs in through Supabase in frontend.
2. Frontend sends JWT to backend endpoint (for example `/api/session-records/...`).
3. Backend `requireAuth` verifies token and loads profile.
4. Controller parses week/uid input.
5. Service queries Supabase tables and optionally computes/updates derived records.
6. Backend returns normalized JSON response.

## Operational notes

- Backend tests: `npm --prefix backend run test` (Vitest + supertest).
- API reference is documented in `backend/API.md` and is comprehensive.
- Set `CORS_ORIGIN` to the actual frontend URL in each environment (Docker defaults to `http://localhost:3000`; bare `app.ts` default is `http://localhost:3002`).
- Developers can switch to curated test personas via `dev_test_profiles` (see `docs/dev/supabase/README.md`).
