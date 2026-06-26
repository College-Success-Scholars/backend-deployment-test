# frontend/lib/auth

**Location:** [`frontend/lib/auth/`](../../../../../frontend/lib/auth/)  
**Docs:** `docs/dev/frontend/lib/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › auth

---

## Purpose

Auth redirect safety utilities. Prevents open-redirect vulnerabilities by validating that paths passed to `redirect()` are internal in-app paths before following them.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `safe-next-path.ts` | [source](../../../../../frontend/lib/auth/safe-next-path.ts) | `getSafeInternalPath()` — validates a redirect path is a safe in-app path; rejects protocol-relative and external URLs |

---

## Standards

- **Pure functions only** — no Supabase calls, no Next.js imports
- **No access guards here** — role enforcement lives in `lib/supabase/server.ts` (`requireTeamLeaderOrAbove`, `requireDeveloper`)
- **No auth flows here** — sign-in, sign-out, PKCE flow all live in `lib/supabase/server.ts` and `lib/supabase/client.ts`
