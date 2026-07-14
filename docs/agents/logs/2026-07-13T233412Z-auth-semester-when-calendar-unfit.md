# auth-semester-when-calendar-unfit

**Date:** 2026-07-13T233412Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
grep /api/auth/semester and /api/auth/semester. Mark in the documentation that this should be used sparingly, in favor of the server owned time frame.

---

also add in that this should be used when the server owned time frame doesnt make sense (i.e. Looking at historical data, or that this collection year hasnt started)
```

---

## Purpose

Clarify legitimate uses of auth semester when campus calendar does not apply

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Expanded auth semester sparingly guidance across API.md, docs/dev/README, controller/queries JSDoc, and TypeDoc pages to explicitly allow use when the server-owned campus calendar does not make sense (historical data, or collection year not started yet).

---

## Code Changes

- `.gitignore`
- `backend/API.md`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/auth.routes.ts`
- `docs/dev/README.md`
- `docs/dev/agents/README.md`
- `docs/dev/backend/README.md`
- `docs/dev/backend/src/README.md`
- `docs/dev/backend/src/controllers/README.md`
- `docs/dev/backend/src/middleware/README.md`
- `docs/dev/backend/src/models/README.md`
- `docs/dev/backend/src/routes/README.md`
- `docs/dev/backend/src/services/README.md`
- `docs/dev/backend/src/tests/README.md`
- `docs/dev/frontend/README.md`
- `docs/dev/frontend/app/README.md`
- `docs/dev/frontend/app/auth/README.md`
- `docs/dev/frontend/app/dashboard/README.md`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `docs/dev/frontend/app/dev/README.md`
- `docs/dev/frontend/components/README.md`
- `docs/dev/frontend/components/auth/README.md`
- `docs/dev/frontend/components/charts/README.md`
- `docs/dev/frontend/components/dashboard/README.md`
- `docs/dev/frontend/components/dashboard/roles/README.md`
- `docs/dev/frontend/components/dashboard/widgets/README.md`
- `docs/dev/frontend/components/data-display/README.md`
- `docs/dev/frontend/components/layout/README.md`
- `docs/dev/frontend/components/marketing/README.md`
- `docs/dev/frontend/components/mentee-monitoring/README.md`
- `docs/dev/frontend/components/personal/README.md`
- `docs/dev/frontend/components/settings/README.md`
- `docs/dev/frontend/components/ui/README.md`
- `docs/dev/frontend/hooks/README.md`
- `docs/dev/frontend/legacy/README.md`
- `docs/dev/frontend/lib/README.md`
- `docs/dev/frontend/lib/auth/README.md`
- `docs/dev/frontend/lib/client/README.md`
- `docs/dev/frontend/lib/format/README.md`
- `docs/dev/frontend/lib/server/README.md`
- `docs/dev/frontend/lib/supabase/README.md`
- `docs/dev/frontend/lib/types/README.md`
- `docs/dev/scripts/README.md`
- `docs/dev/shared/README.md`
- `docs/dev/shared/src/README.md`
- `frontend/lib/server/queries.ts`
- `package.json`
