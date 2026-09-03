# fix-test-profile-mentee-roster-leak

**Date:** 2026-08-08T182629Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
is the mentee page hidden for TL profiles that dont have mentees?

---

does it work with the test profiles?

---

fix that, its causing unexpected issues when debugging. also note where else in the codebase where there is times it checks a developers accounrs, instead of the simiulated account
```

---

## Purpose

Stop developer user_roster mentee fields from leaking into acting-as personas; audit real vs effective identity uses

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Cleared nested user_roster in mapTestProfileToEffectiveRow so persona mentee gates cannot fall back to the developer roster. hasAssignedMentees now also reads top-level mentee_uids (test-profile shape). Gated TeamLeaderDashboard Mentees quick link with canAccessMenteeMonitoring. Documented effective vs real identity in roles-and-personas.md and clarified getDeveloperUser uses the real profile on purpose.

---

## Code Changes

- `docs/dev/onboarding/roles-and-personas.md`
- `frontend/app/dashboard/page.tsx`
- `frontend/components/dashboard/roles/team-leader-dashboard.tsx`
- `frontend/lib/auth.test.ts`
- `frontend/lib/auth.ts`
- `frontend/lib/supabase/server.ts`
- `shared/auth.test.ts`
- `shared/auth.ts`
