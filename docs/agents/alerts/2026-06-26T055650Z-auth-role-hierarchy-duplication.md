# auth-role-hierarchy-duplication

**Date:** 2026-06-26T055650Z
**Severity:** warning
**Category:** auth

---

## Description

The role hierarchy is defined independently in two places with different implementations:

Frontend (frontend/lib/supabase/server.ts:169): ROLE_ORDER is a Record<string, number> object ({ team_leader: 1, developer: 2 }) used for index-based comparison.

Backend (backend/src/models/user.model.ts:32 + backend/src/controllers/auth.controller.ts:81): APP_ROLE_ORDER is a string array ([null, 'team_leader', 'developer']) used with indexOf.

Additionally, the profile merge logic (falling back from profiles to user_roster) is duplicated between frontend/lib/supabase/server.ts:125-139 and backend/src/controllers/auth.controller.ts:67-74.

If a new role is added, both definitions must be updated manually. A mismatch would cause the frontend and backend to silently disagree on who has access.

---

## Affected Files

- `frontend/lib/supabase/server.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/models/user.model.ts`

---

## Recommendation

Extract the role hierarchy into a single shared source of truth, or at minimum add a cross-reference comment in both files so changes to one prompt an update to the other.
