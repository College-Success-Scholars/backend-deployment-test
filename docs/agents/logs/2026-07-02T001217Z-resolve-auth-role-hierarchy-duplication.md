# resolve-auth-role-hierarchy-duplication

**Date:** 2026-07-02T001217Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
Fix auth-role-hierarchy-duplication alert
```

---

## Purpose

The role hierarchy is defined independently in two places with different implementations:

---

## Agent Response Summary

Extracted APP_ROLE_ORDER, hasRoleAtLeast, and mergeProfileWithRoster into shared/auth.ts. Updated frontend/lib/supabase/server.ts and backend auth.controller.ts to use shared helpers. Re-exported APP_ROLE_ORDER from backend user.model.ts. Added resolve-alert.sh script.

---

## Code Changes

- `shared/auth.ts`
- `shared/auth.test.ts`
- `frontend/lib/supabase/server.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/models/user.model.ts`
- `scripts/resolve-alert.sh`
- `docs/dev/scripts/README.md`
- `docs/dev/shared/src/README.md`
- `docs/dev/backend/src/models/README.md`
