# lib/supabase

**Location:** [`frontend/lib/supabase/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/supabase)  
**Docs:** `docs/dev/frontend/lib/supabase/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › supabase

---

## Purpose

Supabase client factories and authentication helpers. Used **only for auth** (session management, user identity, role checks). Domain data queries go through the backend via `lib/server/api-client.ts` — not through Supabase directly.

---

## Files

| File | Source Link | Environment | Description |
|------|-------------|-------------|-------------|
| `server.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/supabase/server.ts) | Server only | Server-side Supabase client (PKCE flow) + all auth helper functions |
| `client.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/supabase/client.ts) | Client only | Browser-side Supabase client for session refresh and client-side auth |
| `middleware.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/supabase/middleware.ts) | Middleware | Session refresh logic — called by `frontend/middleware.ts` |
| `public-key.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/supabase/public-key.ts) | Both | Reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from env |

---

## Auth Helper Functions (`server.ts`)

| Function | Returns | Use case |
|----------|---------|----------|
| `createClient()` | `SupabaseClient` | Raw client for custom queries |
| `getCurrentUser()` | `User \| null` | Soft auth check — public + personalized views |
| `getCurrentUserWithProfile()` | `{ user, profile }` | Need profile fields (role, name, student_id) |
| `requireUser()` | `User` (throws) | Any page that requires auth |
| `requireUserWithProfile()` | `{ user, profile }` (throws) | Auth + profile needed, no redirect |
| `requireTeamLeaderOrAbove()` | `User` (redirects) | Pages restricted to team leaders+ |
| `requireDeveloper()` | `User` (redirects) | Pages restricted to developers |
| `getDeveloperUser()` | `User \| null` | Soft check for developer role |
| `getTeamLeaderOrAboveUser()` | `User \| null` | Soft check for team leader+ role |

---

## Profile Source

Profiles come from `public.profiles` joined with `public.user_roster`. The join is done in `getCurrentUserWithProfile()` — fields from `user_roster` (first_name, last_name, program_role, etc.) are merged into the profile object for legacy compatibility.

---

## Standards

- **`server.ts` has `import "server-only"`** — never import it from a Client Component.
- **`client.ts` is for browser use only** — session refresh and client-side Supabase mutations.
- **Never query domain tables here** — `profiles`, `semesters` for auth is OK. `session_logs`, `form_logs`, etc. must go through the backend.
- **Do not create a Supabase client at module scope** — always call `createClient()` inside the function body (important for Fluid Compute / Edge compatibility).
- **`middleware.ts` is called from `frontend/middleware.ts`** — do not call it directly from components.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `client` | [API](../../../../reference/api/frontend/lib/supabase/client/README.md) |
| `middleware` | [API](../../../../reference/api/frontend/lib/supabase/middleware/README.md) |
| `public-key` | [API](../../../../reference/api/frontend/lib/supabase/public-key/README.md) |
| `server` | [API](../../../../reference/api/frontend/lib/supabase/server/README.md) |

<details>
<summary>All exports (13)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `createClient` | functions | [docs](../../../../reference/api/frontend/lib/supabase/client/functions/createClient.md) |
| `createClient` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/createClient.md) |
| `getCurrentUser` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/getCurrentUser.md) |
| `getCurrentUserWithProfile` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/getCurrentUserWithProfile.md) |
| `getDeveloperUser` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/getDeveloperUser.md) |
| `getSupabasePublicKey` | functions | [docs](../../../../reference/api/frontend/lib/supabase/public-key/functions/getSupabasePublicKey.md) |
| `getTeamLeaderOrAboveUser` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/getTeamLeaderOrAboveUser.md) |
| `ProfilesRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/supabase/server/type-aliases/ProfilesRow.md) |
| `requireDeveloper` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/requireDeveloper.md) |
| `requireTeamLeaderOrAbove` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/requireTeamLeaderOrAbove.md) |
| `requireUser` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/requireUser.md) |
| `requireUserWithProfile` | functions | [docs](../../../../reference/api/frontend/lib/supabase/server/functions/requireUserWithProfile.md) |
| `updateSession` | functions | [docs](../../../../reference/api/frontend/lib/supabase/middleware/functions/updateSession.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
