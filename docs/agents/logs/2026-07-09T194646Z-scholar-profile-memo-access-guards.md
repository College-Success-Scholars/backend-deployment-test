# scholar-profile-memo-access-guards

**Date:** 2026-07-09T194646Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
cannot insert a non-DEFAULT value into column full_name for complete profile; reminder that weekly memo should require app_role of at least team leader with sidebar link blank and traffic redirected to dashboard; log it
```

---

## Purpose

Fix complete-profile insert for generated full_name column and enforce team_leader+ gates for weekly memo sidebar and traffic routes

---

## Agent Response Summary

Fixed Supabase 428C9 on scholar profile create by omitting generated full_name from buildScholarProfileInsertRow insert payload. Aligned student_id to string in auth.controller parseCreateProfileBody. Added canAccessWeeklyMemo() in frontend/lib/auth.ts; sidebar Memo link only when app_role is team_leader+; requireTeamLeaderOrAbove on /dashboard/memo and /memo layouts; logged-in scholars hitting /traffic redirect to /dashboard (kiosk stays public when logged out); dashboard home routes scholars to ScholarDashboard and unknown roles to DefaultDashboard. Backend tests (28), frontend tests (34), and builds pass.

---

## Code Changes

- `backend/src/services/user.service.ts`
- `frontend/app/dashboard/page.tsx`
- `frontend/app/memo/layout.tsx`
- `frontend/app/traffic/layout.tsx`
- `frontend/components/app-sidebar.tsx`
- `frontend/lib/auth.test.ts`
- `frontend/lib/auth.ts`
