# dev-test-profiles-pipeline

**Date:** 2026-07-11T030712Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
Implement Developer Test Profiles + Containerized CI Pipeline plan; fix dashboard 403 on recent-submissions when acting via denylist approach.
```

---

## Purpose

Implement developer test-profile switching, containerized CI, and read-only acting with POST mutation denylist.

---

## Agent Response Summary

Added cloud Supabase SQL docs (dev_test_profiles, RLS, seed), backend profile overlay (realProfile/effective profile, dev routes, rejectWritesWhenActing mutation denylist), frontend profile switcher with My profile reset and acting banner, shared auth helpers, GitHub Actions CI, and docs. Fixed acting-mode dashboard crash by allowing read-via-POST endpoints while blocking true mutations (sync, profile create, memo refresh).

---

## Code Changes

- `backend/src/controllers/auth.controller.ts`
- `backend/src/controllers/dev.controller.ts`
- `backend/src/routes/dev.routes.ts`
- `backend/src/services/mentee.service.ts`
- `backend/src/tests/auth.test.ts`
- `backend/src/tests/user.service.test.ts`
- `docs/agents/general-sign-up-flow.md`
- `docs/dev/README.md`
- `docs/dev/backend/src/middleware/README.md`
- `frontend/app/dashboard/directory/page.tsx`
- `frontend/app/dashboard/layout.tsx`
- `frontend/app/dev/README.md`
- `frontend/app/dev/layout.tsx`
- `frontend/components/app-sidebar.tsx`
- `frontend/lib/auth.ts`
- `frontend/lib/server/api-client.ts`
- `frontend/lib/server/data.ts`
- `frontend/lib/server/queries.ts`
- `scripts/smoke-test.sh`
- `shared/auth.test.ts`
- `shared/auth.ts`
