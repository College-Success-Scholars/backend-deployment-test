# components/auth

**Location:** [`frontend/components/auth/`](../../../../../frontend/components/auth/)  
**Docs:** `docs/dev/frontend/components/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › auth

---

## Purpose

Helper components for authentication flows that don't fit neatly into a single page.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `invite-from-hash-redirect.tsx` | [source](../../../../../frontend/components/auth/invite-from-hash-redirect.tsx) | Handles Supabase magic-link invites where the token is in the URL hash fragment. Reads `#access_token=...` and redirects to the set-password flow. |

---

## Standards

- **Auth helpers only** — components here handle edge cases in the auth flow (hash fragments, token exchange, etc.), not general auth UI.
- **Auth UI lives in `components/` root** — `LoginForm`, `SignUpForm`, etc. are at the root of `components/`, not here.
