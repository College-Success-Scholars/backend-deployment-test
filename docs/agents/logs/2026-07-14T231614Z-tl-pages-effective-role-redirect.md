# tl-pages-effective-role-redirect

**Date:** 2026-07-14T231614Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
the memo pages and other tl only pages gate fine, please implement redirecting
```

---

## Purpose

Redirect scholars and non-TL personas away from team-leader-only pages using the effective auth profile.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Aligned TL-only page redirects with sidebar gating by using the effective /api/auth/me profile (canAccessWeeklyMemo + getCurrentProfile). Memo layout, memo-legacy, personal, traffic (logged-in), and requireTeamLeaderOrAbove/getTeamLeaderOrAboveUser now redirect to /dashboard for scholars and acting-as scholar personas. Frontend tests (61) and build passed.

---

## Code Changes

- `docs/agents/general-sign-up-flow.md`
- `docs/dev/frontend/lib/supabase/README.md`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/app/dashboard/memo/layout.tsx`
- `frontend/app/dashboard/memo/page.test.tsx`
- `frontend/app/dashboard/memo/page.tsx`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/app/traffic/layout.tsx`
- `frontend/legacy/app/memo/layout.tsx`
- `frontend/lib/supabase/server.ts`
