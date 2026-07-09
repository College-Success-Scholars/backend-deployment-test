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
| `complete-profile/page.tsx` | [source](../../../../../frontend/app/auth/complete-profile/page.tsx) | `/auth/complete-profile` | Scholar self-service profile creation after sign-up |
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

## Scholar onboarding (complete profile)

After email confirmation, users without a `profiles` row are redirected from `/dashboard` to `/auth/complete-profile`. The form calls `POST /api/auth/profile`, which creates a row with `program_role: "scholar"` and `app_role: null`.

**Sign-up constraints:** only `@umd.edu` and `@terpmail.umd.edu` emails (validated client-side and on profile create).

### Supabase RLS (profiles INSERT)

Allow authenticated users to insert their own profile row:

```sql
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

Without this policy, `POST /api/auth/profile` fails at the database layer.

Agent overview (provisional): [`docs/agents/general-sign-up-flow.md`](../../../../agents/general-sign-up-flow.md)

---

## Standards

- **No auth guards here** — these routes are deliberately public (except complete-profile requires auth session).
- **Use form components from `components/`** — `LoginForm`, `SignUpForm`, `CompleteProfileForm`, `ForgotPasswordForm`, `UpdatePasswordForm` live in `frontend/components/`.
- **Redirect to `/dashboard` on success** — confirm and login redirect there; dashboard layout sends users without a profile to complete-profile.
- **`confirm/route.ts` is a route handler, not a page** — it handles the Supabase email confirmation callback (`token_hash` + `type`) and redirects.
- **Invite links** — handled by `components/auth/invite-from-hash-redirect.tsx` which reads the hash fragment from the email magic link.
