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

## Supabase email template (required for sign-up confirmation)

`/auth/confirm` expects `token_hash` and `type` query parameters and exchanges them server-side via `verifyOtp()`. The default Supabase **Confirm signup** template uses `{{ .ConfirmationURL }}`, which redirects with a PKCE `code` (or hash tokens) that this route does not handle — users see `No token hash or type` after clicking the email link.

### Dashboard setup

1. Open [Authentication → Email Templates → Confirm signup](https://supabase.com/dashboard/project/_/auth/templates).
2. Replace the confirmation link with the version-controlled template in [`email-templates/confirm-signup.html`](email-templates/confirm-signup.html):

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard">
     Confirm your email address
   </a>
   ```

3. Under [Authentication → URL Configuration](https://supabase.com/dashboard/project/_/auth/url-configuration):
   - **Site URL:** production origin (e.g. `https://cssatlas.org`)
   - **Redirect URLs:** include `https://cssatlas.org/auth/confirm**` (and local dev if needed)

### Scripted setup (Management API)

```bash
SUPABASE_ACCESS_TOKEN=... \
SUPABASE_PROJECT_REF=... \
./scripts/configure-supabase-confirm-email-template.sh
```

Create a personal access token at [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens). The script reads the HTML from `email-templates/confirm-signup.html` and PATCHes `mailer_templates_confirmation_content`.

---

## Standards

- **No auth guards here** — these routes are deliberately public.
- **Use form components from `components/`** — `LoginForm`, `SignUpForm`, `ForgotPasswordForm`, `UpdatePasswordForm` live in `frontend/components/`.
- **Redirect to `/dashboard` on success** — all successful auth flows redirect there.
- **`confirm/route.ts` is a route handler, not a page** — it handles the Supabase email confirmation callback (`token_hash` + `type`) and redirects.
- **Invite links** — handled by `components/auth/invite-from-hash-redirect.tsx` which reads the hash fragment from the email magic link.
