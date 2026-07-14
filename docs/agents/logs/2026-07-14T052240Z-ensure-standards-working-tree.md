# ensure-standards-working-tree

**Date:** 2026-07-14T052240Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
ensure standards

---

theres 35 files changed, wdym?

---

ohhh, in that case, edit the skill to be working-tree changes instead

---

ensure standards
```

---

## Purpose

Edit ensure-standards skill to use working-tree scope, then run standards check on MFA/auth changes

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Updated ensure-standards skill from staged-only to working-tree scope. Ran standards check on MFA/auth working-tree changes: frontend/auth/supabase areas already aligned; fixed backend and API docs for requireAal2, added jwt-aal.test.ts to tests README, documented dashboard AAL2 gate, synced API.md mirror, adjusted layout header comment and codebase-notes.

---

## Code Changes

- `backend/API.md`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/activity.routes.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/routes/session-log.routes.ts`
- `backend/src/routes/session-record.routes.ts`
- `backend/src/routes/traffic.routes.ts`
- `backend/src/routes/user.routes.ts`
- `docs/agents/codebase-notes.md`
- `docs/agents/general-sign-up-flow.md`
- `docs/dev/backend/src/controllers/README.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/backend/src/tests/README.md`
- `docs/dev/frontend/app/auth/README.md`
- `docs/dev/frontend/app/dashboard/README.md`
- `docs/dev/frontend/components/auth/README.md`
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
