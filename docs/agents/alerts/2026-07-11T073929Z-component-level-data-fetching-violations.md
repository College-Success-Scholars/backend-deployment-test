# component-level-data-fetching-violations

**Date:** 2026-07-11T073929Z
**Severity:** warning
**Category:** integrity

---

## Description

Several shared components fetch domain data directly, violating the documented rule that pages fetch from lib/server/data.ts or api-client.ts and pass results as props (see docs/dev/frontend/components/README.md). activity-log.tsx and personal-activity-log.tsx call getRecentFormSubmissions inside the component. scholar-dashboard.tsx calls backendGet(/api/auth/me) directly. This couples reusable components to server data access and makes testing and reuse harder.

---

## Affected Files

- `frontend/components/dashboard/widgets/activity-log.tsx`
- `frontend/components/dashboard/widgets/personal-activity-log.tsx`
- `frontend/components/dashboard/roles/scholar-dashboard.tsx`
- `docs/dev/frontend/components/README.md`

---

## Recommendation

Move data fetching to parent pages (or layouts) and pass entries/profile as props to activity-log, personal-activity-log, and scholar-dashboard.
