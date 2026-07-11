# frontend-component-reorganization

**Date:** 2026-07-11T072147Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
scan the front end, and with the role of a 20+ year senior full stack developer, what would you say about the file structre of our components and files?

---

we can antiqute app/memo, we'll use dashboard/memo going forward. dev branch was more about testing backend features and didnt need to be kept up to date with the codebase, update doumentation to reflect that. consolidate the auth files, merge the wahfs, and delete the orphaned starter template files. after that, draw up the new folders for the component layout, along with documentation in docs for rules aobut this structure going forward

---

log it, this one is more intensive, so make the agent description more detailed this time around
```

---

## Purpose

Antiquate standalone /memo, reorganize components into domain folders, consolidate auth, and document structure rules

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Performed a senior-level frontend structure review (Ask mode), then executed a large-scale reorganization and documentation pass (Agent mode).

**Route / legacy**
- Moved the retired standalone memo implementation from `frontend/app/memo/` to `frontend/legacy/app/memo/` (excluded from `tsconfig` via existing `legacy` exclude).
- Replaced the active `/memo` route with a thin redirect page (`app/memo/page.tsx` → `/dashboard/memo`).
- Updated `frontend/legacy/api/memo/sync/route.ts` `revalidatePath` targets from `/memo` to `/dashboard/memo`.

**Component reorganization**
Introduced a domain-based `components/` layout and moved ~40 files with bulk import-path updates across `app/`, `components/`, and related modules:

```
components/
  ui/              (unchanged — shadcn)
  layout/          sidebar, nav-*, dashboard header/breadcrumb, idle-reset, env-var-warning
  auth/            all auth forms + auth-button + logout-button
  data-display/    data-table, scholar-data-table, campus-week-card, form-completion, meters, progress-cell
  charts/          radial charts, front-desk-chart, study-session-chart
  dashboard/
    roles/         scholar, team-leader, admin, exec, default dashboards
    widgets/       activity log, personal activity log, directory, tutoring, submission modal, etc.
  mentee-monitoring/, personal/, settings/, marketing/, dev/  (unchanged locations)
```

- Extracted `ProgressCell` from legacy memo content into `components/data-display/progress-cell.tsx`; rewired `app/dev/form-logs/team-leaders-table.tsx` to import it (removing cross-route dependency on memo).
- Moved `activity-log-dictionary.ts` from `components/dashboard/` to `lib/dashboard/` (non-UI utility).
- Fixed broken relative imports after moves (e.g. `scholar-dashboard` chart/widget paths, `sign-up-form` shared import depth).

**Consolidation / cleanup**
- Consolidated all auth UI under `components/auth/`; updated six `app/auth/*/page.tsx` imports.
- Removed duplicate unused `mentee-wahf-card.tsx`; `mentee-monitoring/wahf-card.tsx` is the canonical WA HF card.
- Deleted orphaned Supabase/Next starter files: `hero.tsx`, `deploy-button.tsx`, `next-logo.tsx`, `supabase-logo.tsx`.

**Documentation**
- Rewrote `docs/dev/frontend/components/README.md` with directory layout, placement rules, and colocation standards (memo `_components/` as canonical pattern).
- Added new docs: `components/layout/`, `data-display/`, `charts/`, `dashboard/roles/`, `dashboard/widgets/`.
- Updated `components/auth/`, `components/dashboard/`, `components/mentee-monitoring/`, `app/dev/`, `app/`, `legacy/`, `codebase-notes.md`, and `frontend/lib/README.md`.
- Clarified `/dev` is a backend-integration scratchpad—not kept in sync with production UI and not a shared component library.

**Validation**
- `npm test` (52 tests), `npm run build`, and `npm run lint` all passed.

---

## Code Changes

- `docs/agents/codebase-notes.md`
- `docs/dev/frontend/README.md`
- `docs/dev/frontend/app/README.md`
- `docs/dev/frontend/app/dev/README.md`
- `docs/dev/frontend/components/README.md`
- `docs/dev/frontend/components/auth/README.md`
- `docs/dev/frontend/components/dashboard/README.md`
- `docs/dev/frontend/components/mentee-monitoring/README.md`
- `docs/dev/frontend/legacy/README.md`
- `frontend/app/auth/complete-profile/page.tsx`
- `frontend/app/auth/forgot-password/page.tsx`
- `frontend/app/auth/login/page.tsx`
- `frontend/app/auth/set-password/page.tsx`
- `frontend/app/auth/sign-up/page.tsx`
- `frontend/app/auth/update-password/page.tsx`
- `frontend/app/dashboard/directory/page.tsx`
- `frontend/app/dashboard/layout.tsx`
- `frontend/app/dashboard/memo/_components/full-attendance-detail-section.tsx`
- `frontend/app/dashboard/memo/_components/scholar-follow-up-table.tsx`
- `frontend/app/dashboard/memo/_components/team-leader-performance-table.tsx`
- `frontend/app/dashboard/memo/_components/tutoring-log-section.tsx`
- `frontend/app/dashboard/memo/types.ts`
- `frontend/app/dashboard/page.tsx`
- `frontend/app/dev/form-logs/page.tsx`
- `frontend/app/dev/form-logs/team-leaders-table.tsx`
- `frontend/app/dev/profiles/[uid]/page.tsx`
- `frontend/app/dev/profiles/profiles-user-table.tsx`
- `frontend/app/dev/session-logs/page.tsx`
- `frontend/app/dev/session-records/page.tsx`
- `frontend/app/dev/traffic/page.tsx`
- `frontend/app/memo/cohort-pie-chart.tsx`
- `frontend/app/memo/layout.tsx`
- `frontend/app/memo/loading.tsx`
- `frontend/app/memo/memo-content.tsx`
- `frontend/app/memo/page.tsx`
- `frontend/app/traffic/layout.tsx`
- `frontend/components/app-sidebar.tsx`
- `frontend/components/auth-button.tsx`
- `frontend/components/campus-week-card.tsx`
- `frontend/components/chart-radial-stacked.tsx`
- `frontend/components/chart-radial-text.tsx`
- `frontend/components/complete-profile-form.tsx`
- `frontend/components/completion-meter.tsx`
- `frontend/components/dashboard/activity-log-client.tsx`
- `frontend/components/dashboard/activity-log-dictionary.ts`
- `frontend/components/dashboard/activity-log.tsx`
- `frontend/components/dashboard/admin-dashboard.tsx`
- `frontend/components/dashboard/daily-activity-minutes-note.tsx`
- `frontend/components/dashboard/dashboard-breadcrumb.tsx`
- `frontend/components/dashboard/dashboard-header.tsx`
- `frontend/components/dashboard/default-dashboard.tsx`
- `frontend/components/dashboard/directory-dashboard.tsx`
- `frontend/components/dashboard/exec-dashboard.tsx`
- `frontend/components/dashboard/front-desk-chart.tsx`
- `frontend/components/dashboard/mentee-wahf-card.tsx`
- `frontend/components/dashboard/personal-activity-log-client.tsx`
- `frontend/components/dashboard/personal-activity-log.tsx`
- `frontend/components/dashboard/scholar-dashboard.tsx`
- `frontend/components/dashboard/study-session-chart.tsx`
- `frontend/components/dashboard/submission-details-modal.tsx`
- `frontend/components/dashboard/team-leader-dashboard.tsx`
- `frontend/components/dashboard/tutoring-hours.tsx`
- `frontend/components/data-table.tsx`
- `frontend/components/deploy-button.tsx`
- `frontend/components/double-entry-checker.tsx`
- `frontend/components/env-var-warning.tsx`
- `frontend/components/forgot-password-form.tsx`
- `frontend/components/form-completion-overview-card.tsx`
- `frontend/components/hero.tsx`
- `frontend/components/idle-reset-provider.tsx`
- `frontend/components/login-form.tsx`
- `frontend/components/logout-button.tsx`
- `frontend/components/nav-main.tsx`
- `frontend/components/nav-projects.tsx`
- `frontend/components/nav-secondary.tsx`
- `frontend/components/nav-sidebar-icon.tsx`
- `frontend/components/nav-user.tsx`
- `frontend/components/next-logo.tsx`
- `frontend/components/scholar-data-table.tsx`
- `frontend/components/sign-up-form.tsx`
- `frontend/components/supabase-logo.tsx`
- `frontend/components/update-password-form.tsx`
- `frontend/legacy/api/memo/sync/route.ts`
- `frontend/lib/README.md`
