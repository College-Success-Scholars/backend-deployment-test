# unwired-role-dashboards-dead-code

**Date:** 2026-07-11T073934Z
**Severity:** warning
**Category:** integrity

---

## Description

admin-dashboard.tsx and exec-dashboard.tsx exist in components/dashboard/roles/ but are not wired in app/dashboard/page.tsx, which only routes scholar, team-leader/developer, and default variants. These dashboards are static placeholder UI that imply roles exist in the product but are unreachable. New contributors may assume admin/exec dashboards are live.

---

## Affected Files

- `frontend/components/dashboard/roles/admin-dashboard.tsx`
- `frontend/components/dashboard/roles/exec-dashboard.tsx`
- `frontend/app/dashboard/page.tsx`
- `docs/dev/frontend/components/dashboard/roles/README.md`

---

## Recommendation

Either wire admin-dashboard and exec-dashboard to real app_role values in dashboard/page.tsx, or move them to a draft location and update docs to note they are not production routes.
