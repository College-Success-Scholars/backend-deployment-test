# General sign-up flow (provisional)

> **Provisional agent reference** — candidate for removal when this self-service onboarding path is replaced (e.g. roster pre-provisioning). Canonical dev docs: [`docs/dev/frontend/app/auth/README.md`](../dev/frontend/app/auth/README.md).

## Overview

Self-service scholars sign up with a UMD email, confirm via email link, complete a profile form, then access the dashboard. Users without a `profiles` row are redirected to complete-profile instead of erroring.

## End-to-end sequence

1. **Sign up** (`/auth/sign-up`) — UMD email only (`@umd.edu`, `@terpmail.umd.edu`); creates `auth.users` row
2. **Email confirm** (`/auth/confirm`) — `verifyOtp` with `token_hash` + `type=email`; redirects to `/dashboard`
3. **Dashboard gate** (`/dashboard/layout`) — `GET /api/auth/me`; if `profile` is null → `/auth/complete-profile`
4. **Complete profile** (`/auth/complete-profile`) — form submits `POST /api/auth/profile`
5. **Profile created** — `program_role: "scholar"`, `app_role: null`; redirect to `/dashboard`

## Onboarding fields

| Field | Required | Notes |
|-------|----------|-------|
| first_name | yes | |
| last_name | yes | |
| student_id | yes | Scholar UID |
| phone_number | no | |
| cohort | yes | e.g. 2025 |

Server sets: `program_role: "scholar"`, `app_role: null`, `emails: [auth email]`, `full_name`.

## Role and memo access

- **UI role** — `resolveUserRole()` in `frontend/lib/auth.ts` maps `program_role: "scholar"` + `app_role: null` → scholar nav (no Memo link)
- **Memo API** — `GET /api/memo/page-data`, `/weekly`, `POST /refresh-stats` require `requireTeamLeaderOrAbove`
- **Memo pages** — `/dashboard/memo`, `/dashboard/memo-legacy` call `requireTeamLeaderOrAbove()` server-side

## Supabase dependencies

| Item | Requirement |
|------|-------------|
| Confirm signup email template | Link to `/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard` (not `{{ .ConfirmationURL }}`) |
| Site URL | Production origin (e.g. `https://cssatlas.org`) |
| Redirect URLs | `https://cssatlas.org/auth/confirm**` |
| RLS on `profiles` | `INSERT` policy: `auth.uid() = id` for authenticated users |

Template script: `scripts/configure-supabase-confirm-email-template.sh`

## Key code touchpoints

| Area | Path |
|------|------|
| UMD email helper | `shared/auth.ts` → `isUmdEmail()` |
| Sign-up form | `frontend/components/sign-up-form.tsx` |
| Confirm route | `frontend/app/auth/confirm/route.ts` |
| Complete profile | `frontend/app/auth/complete-profile/page.tsx`, `frontend/components/complete-profile-form.tsx` |
| Dashboard gate | `frontend/app/dashboard/layout.tsx` |
| Create profile API | `POST /api/auth/profile` — `backend/src/controllers/auth.controller.ts` |
| UI role resolution | `frontend/lib/auth.ts` → `resolveUserRole()` |
| Sidebar nav | `frontend/components/app-sidebar.tsx` |

## Alternate flows

- **Invite** — `type=invite` in confirm route → `/auth/set-password`; hash invites via `InviteFromHashRedirect`
- **Pre-provisioned users** — team leaders / roster rows may already have `profiles`; skip complete-profile

## Removal checklist

If retiring self-service sign-up:

- [ ] Delete `frontend/app/auth/complete-profile/`, `frontend/components/complete-profile-form.tsx`
- [ ] Remove `POST /api/auth/profile` handler and `createScholarProfile` service
- [ ] Revert dashboard layout profile gate (or replace with roster-based provisioning)
- [ ] Remove `isUmdEmail` usage from sign-up if domain restriction no longer needed
- [ ] Drop Supabase `profiles` INSERT RLS policy if profiles are admin-only again
- [ ] Revert confirm email template if using a different auth model
- [ ] Delete this file
