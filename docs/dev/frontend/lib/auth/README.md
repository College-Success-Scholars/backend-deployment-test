# frontend/lib/auth

**Location:** [`frontend/lib/auth/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/auth)  
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
| `safe-next-path.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/auth/safe-next-path.ts) | `getSafeInternalPath()` — validates a redirect path is a safe in-app path; rejects protocol-relative and external URLs |

---

## Standards

- **Pure functions only** — no Supabase calls, no Next.js imports
- **No access guards here** — role enforcement lives in `lib/supabase/server.ts` (`requireTeamLeaderOrAbove`, `requireDeveloper`)
- **No auth flows here** — sign-in, sign-out, PKCE flow all live in `lib/supabase/server.ts` and `lib/supabase/client.ts`

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). Module index: [browse folder](../../../../reference/api/frontend/lib/auth/README.md).

### Functions

| Symbol | Detail |
|--------|--------|
| `canAccessMenteeMonitoring` | [docs](../../../../reference/api/frontend/lib/auth/functions/canAccessMenteeMonitoring.md) |
| `canAccessWeeklyMemo` | [docs](../../../../reference/api/frontend/lib/auth/functions/canAccessWeeklyMemo.md) |
| `formatUserRoleLabel` | [docs](../../../../reference/api/frontend/lib/auth/functions/formatUserRoleLabel.md) |
| `getSafeInternalPath` | [docs](../../../../reference/api/frontend/lib/auth/safe-next-path/functions/getSafeInternalPath.md) |
| `hasAssignedMentees` | [docs](../../../../reference/api/frontend/lib/auth/functions/hasAssignedMentees.md) |
| `isDeveloperProfile` | [docs](../../../../reference/api/frontend/lib/auth/functions/isDeveloperProfile.md) |
| `resolveUserRole` | [docs](../../../../reference/api/frontend/lib/auth/functions/resolveUserRole.md) |

### Type aliases

| Symbol | Detail |
|--------|--------|
| `UserRole` | [docs](../../../../reference/api/frontend/lib/auth/type-aliases/UserRole.md) |

<!-- AUTO-API-REFERENCE:END -->
