# app/auth

**Location:** [`frontend/app/auth/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth)  
**Docs:** `docs/dev/frontend/app/auth/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [app](../README.md) › auth

---

## Purpose

Authentication UI routes. Pages handle login, registration, password management, email confirmation, scholar onboarding, and **TOTP MFA** enroll/verify. These routes are public to the session (MFA pages require a logged-in AAL1 session). Protected app surfaces require **AAL2**.

---

## Files

| File | Source Link | URL | Description |
|------|-------------|-----|-------------|
| `login/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/login/page.tsx) | `/auth/login` | Login form with university image background |
| `sign-up/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/sign-up/page.tsx) | `/auth/sign-up` | New user registration |
| `sign-up-success/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/sign-up-success/page.tsx) | `/auth/sign-up-success` | Post-signup confirmation message |
| `forgot-password/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/forgot-password/page.tsx) | `/auth/forgot-password` | Send password reset email |
| `set-password/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/set-password/page.tsx) | `/auth/set-password` | Set initial password (new account from invite) |
| `update-password/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/update-password/page.tsx) | `/auth/update-password` | Change existing password |
| `confirm/route.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/confirm/route.ts) | `/auth/confirm` | Email confirmation callback handler (GET with token) |
| `complete-profile/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/complete-profile/page.tsx) | `/auth/complete-profile` | Scholar self-service profile creation after sign-up |
| `mfa/enroll/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/mfa/enroll/page.tsx) | `/auth/mfa/enroll` | TOTP enrollment (QR + first code) |
| `mfa/verify/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/mfa/verify/page.tsx) | `/auth/mfa/verify` | TOTP challenge after password login |
| `error/page.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/app/auth/error/page.tsx) | `/auth/error` | Auth error display page |

---

## MFA (TOTP)

MFA is **required for all users**. Flow:

1. Sign up → confirm email → **`/auth/complete-profile`** (phone optional)
2. Success → **`/auth/mfa/enroll`**
3. → `/dashboard` at AAL2

Returning users: password → `/auth/mfa/verify` (if enrolled) or enroll / complete-profile as needed.

Ops:

- Enable TOTP: [`docs/dev/supabase/mfa.md`](../../../supabase/mfa.md)
- Reset a lost authenticator (Dashboard only): [`docs/dev/supabase/mfa-reset.md`](../../../supabase/mfa-reset.md)

Helpers: `frontend/lib/supabase/mfa.ts` (`getPostAuthRedirectPath`, `nextTotpFriendlyName`, `unenrollUnverifiedFactors`).

**Enroll naming:** always use `nextTotpFriendlyName()` — a fixed friendly name like `"Authenticator"` conflicts on re-entry and causes Supabase errors.

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

After email confirmation, users without a `profiles` row are redirected to `/auth/complete-profile`. The form calls `POST /api/auth/profile` (allowed at **AAL1**), which creates a full `profiles` row via `buildScholarProfileInsertRow()`. On success the client routes to **`/auth/mfa/enroll`** (not the dashboard).

**Sign-up constraints:** only `@umd.edu` and `@terpmail.umd.edu` emails (validated client-side and on profile create).

### Profile columns

See [`docs/agents/general-sign-up-flow.md`](../../../../agents/general-sign-up-flow.md) for the full column matrix and instructions for fields **not** collected at onboarding (`status`, `fd_required`, `ss_required`, `majors`, `minors`, `teams`, `mentee_uids`, `mentee_count`, role promotions).

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

- **`/auth/*` may run at AAL1** — MFA and complete-profile must be reachable before AAL2.
- **Dashboard / API (except `GET /api/auth/me` and `POST /api/auth/profile`) require AAL2.**
- **Use form components from `components/`** — including `MfaEnrollForm` / `MfaVerifyForm`.
- **Post-auth routing** — use `getPostAuthRedirectPath` / `resolvePostAuthPath`; do not hard-code `/dashboard` after password alone.
- **`confirm/route.ts` is a route handler, not a page** — it handles the Supabase email confirmation callback (`token_hash` + `type`) and redirects via MFA/profile gates.
- **Invite links** — handled by `components/auth/invite-from-hash-redirect.tsx` which reads the hash fragment from the email magic link.
- **MFA reset** — Dashboard walkthrough only ([`mfa-reset.md`](../../../supabase/mfa-reset.md)); no service-role in-app reset.
