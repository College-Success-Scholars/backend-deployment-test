# fix-signup-email-confirm-token-hash

**Date:** 2026-07-09T150127Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
https://cssatlas.org/auth/error?error=No%20token%20hash%20or%20type — This shows when following the sign up, from the confirm email link. It makes a row in supabase, but throws an error when visiting the link. Please diagnose the issue before fixing. Follow-up: do the recommended fix; discuss senior-dev minimal-refactor approach; document how to apply the Supabase change.
```

---

## Purpose

Diagnose and fix sign-up email confirmation failing with 'No token hash or type' on cssatlas.org

---

## Agent Response Summary

Diagnosed mismatch: /auth/confirm expects token_hash+type (verifyOtp SSR pattern) but default Supabase Confirm signup template uses {{ .ConfirmationURL }}, which redirects with PKCE code or hash tokens the route never reads. Sign-up itself works (user row created); failure is on email link click. Implemented recommended fix with minimal code churn: version-controlled email template (docs/dev/frontend/app/auth/email-templates/confirm-signup.html), Management API script (scripts/configure-supabase-confirm-email-template.sh), auth/scripts README updates, and clearer error in confirm/route.ts. Advised senior approach: one Supabase template edit beats dual-path code refactor; code-only exchangeCodeForSession fallback is tactical debt due to cross-device PKCE limits. Provided dashboard and scripted steps to patch Confirm signup template and verify Site URL/Redirect URLs.

---

## Code Changes

- `docs/dev/frontend/app/auth/README.md`
- `docs/dev/scripts/README.md`
- `frontend/app/auth/confirm/route.ts`
