# components/auth

**Location:** [`frontend/components/auth/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/auth)  
**Docs:** `docs/dev/frontend/components/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › auth

---

## Purpose

All authentication UI: login/sign-up forms, password flows, profile completion, MFA enroll/verify, and auth-flow helpers.

---

## Files

| File | Description |
|------|-------------|
| `login-form.tsx` | Email/password login → AAL routing via `resolvePostAuthPath` |
| `sign-up-form.tsx` | Registration form |
| `forgot-password-form.tsx` | Password reset request |
| `update-password-form.tsx` | Password update (reset + set-password flows) |
| `complete-profile-form.tsx` | Scholar profile completion → redirects to `/auth/mfa/enroll` |
| `mfa-enroll-form.tsx` | TOTP enroll (QR + first code) |
| `mfa-verify-form.tsx` | TOTP challenge after password login |
| `logout-button.tsx` | Sign-out button |
| `auth-button.tsx` | Login/logout toggle (landing/debug use) |
| `invite-from-hash-redirect.tsx` | Magic-link invite hash → set-password redirect |

---

## Standards

- **All auth UI lives here** — do not add auth forms at `components/` root.
- **Pages stay thin** — `app/auth/*/page.tsx` imports a form component and renders it.
- **Supabase client** — use `@/lib/supabase/client` in client forms, `@/lib/supabase/server` in server components.
- **Post-auth redirects** — use `getPostAuthRedirectPath` / `resolvePostAuthPath`; do not hard-code `/dashboard` after password alone when MFA may be required.
- **TOTP friendly names** — use `nextTotpFriendlyName()` from `lib/supabase/mfa.ts`. Never reuse a fixed name like `"Authenticator"` (Supabase rejects duplicates per user).
- **Unverified factors** — call `unenrollUnverifiedFactors` before a new `mfa.enroll`; clean up pending factors on effect teardown (React Strict Mode remounts).
- **MFA reset** — not in-app; Dashboard walkthrough in [`docs/dev/supabase/mfa-reset.md`](../../../supabase/mfa-reset.md).
