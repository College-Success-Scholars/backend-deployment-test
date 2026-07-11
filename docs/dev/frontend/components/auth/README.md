# components/auth

**Location:** [`frontend/components/auth/`](../../../../../frontend/components/auth/)  
**Docs:** `docs/dev/frontend/components/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › auth

---

## Purpose

All authentication UI: login/sign-up forms, password flows, profile completion, and auth-flow helpers.

---

## Files

| File | Description |
|------|-------------|
| `login-form.tsx` | Email/password login |
| `sign-up-form.tsx` | Registration form |
| `forgot-password-form.tsx` | Password reset request |
| `update-password-form.tsx` | Password update (reset + set-password flows) |
| `complete-profile-form.tsx` | Scholar profile completion |
| `logout-button.tsx` | Sign-out button |
| `auth-button.tsx` | Login/logout toggle (landing/debug use) |
| `invite-from-hash-redirect.tsx` | Magic-link invite hash → set-password redirect |

---

## Standards

- **All auth UI lives here** — do not add auth forms at `components/` root.
- **Pages stay thin** — `app/auth/*/page.tsx` imports a form component and renders it.
- **Supabase client** — use `@/lib/supabase/client` in client forms, `@/lib/supabase/server` in server components.
