# mfa-enroll-friendly-name-collision

**Date:** 2026-07-14T050550Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
what is the expected behavior after returnign to the dashboard after leaving?

---

how would i test a completely new users flow from supabases end?

---

could i delete my rows in auth and profiles to achieve the same?

---

Scan the QR code with an authenticator app, then enter the 6-digit code to finish securing your account.
A factor with the friendly name "Authenticator" for this user already exists

---

log it

---

mb, log it
```

---

## Purpose

Document MFA enroll failure when friendly name Authenticator already exists

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Explained returning-user AAL2 vs verify-on-login behavior; gave Supabase Dashboard steps to test a brand-new user and confirmed deleting auth.users plus profiles resets full onboarding. Diagnosed enroll error as Supabase rejecting duplicate friendlyName Authenticator from hard-coded enroll plus leftover factors or Strict Mode remount; workaround is delete all TOTP factors in Dashboard, sign out, and re-open enroll once.

---

## Code Changes

- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/activity.routes.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/routes/session-log.routes.ts`
- `backend/src/routes/session-record.routes.ts`
- `backend/src/routes/traffic.routes.ts`
- `backend/src/routes/user.routes.ts`
- `docs/agents/general-sign-up-flow.md`
- `docs/dev/frontend/app/auth/README.md`
- `docs/dev/frontend/components/settings/README.md`
- `docs/dev/frontend/lib/supabase/README.md`
- `docs/dev/supabase/README.md`
- `frontend/app/auth/complete-profile/page.tsx`
- `frontend/app/auth/confirm/route.ts`
- `frontend/app/dashboard/layout.tsx`
- `frontend/components/auth/complete-profile-form.tsx`
- `frontend/components/auth/login-form.tsx`
- `frontend/components/auth/update-password-form.tsx`
- `frontend/components/settings/settings-client.tsx`
