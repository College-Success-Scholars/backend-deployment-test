# scholar-onboarding-umd-email

**Date:** 2026-07-09T155444Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
Implement the Scholar onboarding and UMD email validation plan: UMD-only sign-up, post-confirmation complete-profile that creates profiles row, dashboard redirect when no profile, default role scholar, block scholars from weekly memo, docs/agents/general-sign-up-flow.md
```

---

## Purpose

Implement self-service scholar sign-up onboarding with UMD email validation, complete-profile flow, dashboard gating, and memo access restrictions

---

## Agent Response Summary

Implemented full scholar onboarding flow. Added isUmdEmail() in shared/auth.ts with tests. Backend: POST /api/auth/profile creates scholar profile (program_role scholar, app_role null), GET /api/auth/profile returns 404 when missing, memo read routes require team leader+. Frontend: /auth/complete-profile page and CompleteProfileForm, dashboard layout gates on /api/auth/me profile and redirects to complete-profile, sign-up validates UMD domains, resolveUserRole() fixes sidebar so scholars get scholar nav (no Memo), dashboard renders ScholarDashboard for scholars, memo pages guarded server-side. Docs: docs/agents/general-sign-up-flow.md, auth README RLS policy, API.md updates. All frontend (32) and backend (27) tests pass; builds succeed. Manual Supabase step: profiles INSERT RLS policy.

---

## Code Changes

- `backend/API.md`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/memo.routes.ts`
- `backend/src/services/user.service.ts`
- `backend/src/tests/auth.test.ts`
- `docs/dev/frontend/app/auth/README.md`
- `frontend/app/dashboard/layout.tsx`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/app/dashboard/memo/page.test.tsx`
- `frontend/app/dashboard/memo/page.tsx`
- `frontend/app/dashboard/page.tsx`
- `frontend/components/app-sidebar.tsx`
- `frontend/components/sign-up-form.tsx`
- `frontend/lib/auth.ts`
- `shared/auth.test.ts`
- `shared/auth.ts`
