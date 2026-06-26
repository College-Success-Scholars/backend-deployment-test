# app/auth

**Location:** [`frontend/app/auth/`](../../../../../frontend/app/auth/)  
**Docs:** `docs/dev/frontend/app/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [app](../README.md) › auth

---

## Purpose

Authentication UI routes. All pages in this directory handle unauthenticated flows: login, registration, password management, and email confirmation. These pages are public (no auth guard) and redirect to `/dashboard` on success.

---

## Files

| File | Source Link | URL | Description |
|------|-------------|-----|-------------|
| `login/page.tsx` | [source](../../../../../frontend/app/auth/login/page.tsx) | `/auth/login` | Login form with university image background |
| `sign-up/page.tsx` | [source](../../../../../frontend/app/auth/sign-up/page.tsx) | `/auth/sign-up` | New user registration |
| `sign-up-success/page.tsx` | [source](../../../../../frontend/app/auth/sign-up-success/page.tsx) | `/auth/sign-up-success` | Post-signup confirmation message |
| `forgot-password/page.tsx` | [source](../../../../../frontend/app/auth/forgot-password/page.tsx) | `/auth/forgot-password` | Send password reset email |
| `set-password/page.tsx` | [source](../../../../../frontend/app/auth/set-password/page.tsx) | `/auth/set-password` | Set initial password (new account from invite) |
| `update-password/page.tsx` | [source](../../../../../frontend/app/auth/update-password/page.tsx) | `/auth/update-password` | Change existing password |
| `confirm/route.ts` | [source](../../../../../frontend/app/auth/confirm/route.ts) | `/auth/confirm` | Email confirmation callback handler (GET with token) |
| `error/page.tsx` | [source](../../../../../frontend/app/auth/error/page.tsx) | `/auth/error` | Auth error display page |

---

## Standards

- **No auth guards here** — these routes are deliberately public.
- **Use form components from `components/`** — `LoginForm`, `SignUpForm`, `ForgotPasswordForm`, `UpdatePasswordForm` live in `frontend/components/`.
- **Redirect to `/dashboard` on success** — all successful auth flows redirect there.
- **`confirm/route.ts` is a route handler, not a page** — it handles the Supabase email confirmation callback and redirects.
- **Invite links** — handled by `components/auth/invite-from-hash-redirect.tsx` which reads the hash fragment from the email magic link.
