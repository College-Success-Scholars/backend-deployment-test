# scholar-profile-full-row-defaults

**Date:** 2026-07-09T163954Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
make sure to add full_name into the profile, and all non-default rows as well. Please list out the non default rows outside of the ones we handle for instruction on how to handle them
```

---

## Purpose

Set full_name and explicit defaults for all profiles columns on scholar self-signup create

---

## Agent Response Summary

Added buildScholarProfileInsertRow() in user.service.ts to set every profiles column on POST /api/auth/profile: form fields plus full_name, program_role scholar, app_role null, emails, and explicit defaults (status null, fd_required/ss_required null, mentee_count 0, empty arrays for majors/minors/mentee_uids/teams). Documented full column matrix and how to handle columns not on the onboarding form (status, hour requirements, academic/team fields, mentee fields, role promotions) in docs/agents/general-sign-up-flow.md with link from auth README. Updated API.md. Added backend/src/tests/user.service.test.ts. Backend build and 28 tests pass.

---

## Code Changes

- `backend/API.md`
- `backend/src/services/user.service.ts`
- `docs/agents/general-sign-up-flow.md`
- `docs/dev/frontend/app/auth/README.md`
