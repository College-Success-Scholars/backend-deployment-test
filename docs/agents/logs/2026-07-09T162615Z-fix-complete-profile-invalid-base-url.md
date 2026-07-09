# fix-complete-profile-invalid-base-url

**Date:** 2026-07-09T162615Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
Uncaught (in promise) TypeError: Failed to construct 'URL': Invalid base URL — this happens when on the complete profile page, please fix
```

---

## Purpose

Fix complete-profile form crash from invalid client backend URL on production

---

## Agent Response Summary

Diagnosed complete-profile submit failure: CompleteProfileForm used client backendPost which requires NEXT_PUBLIC_BACKEND_URL; on production (cssatlas.org) that env is unset/invalid so buildBackendRequestUrl threw Invalid base URL. Fixed by moving profile creation to createScholarProfile server action in lib/server/actions.ts (uses server backendPost with BACKEND_URL/Vercel fallback). Updated CompleteProfileForm to call the server action instead of lib/client/api-client. Frontend tests (32) and build pass.

---

## Code Changes

- `frontend/components/complete-profile-form.tsx`
- `frontend/lib/server/actions.ts`
