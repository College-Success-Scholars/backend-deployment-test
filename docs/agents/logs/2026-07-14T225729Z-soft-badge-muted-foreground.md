# soft-badge-muted-foreground

**Date:** 2026-07-14T225729Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
DOM Path: div... Badge "3 hrs left" badges like thes look off with darkmode, what would you suggest for future proofing?

---

apply this
```

---

## Purpose

Fix soft status badges for dark mode with muted-foreground tokens and Badge variants.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added success/warning/info muted-foreground tokens; Badge variants success|warning|info for soft chips; migrated HoursCard/charts/memo/personal/activity chips; extended theme-safety antipattern + CI scan roots; docs note the pairing rule. 61 tests + check:theme-safety passed.

---

## Code Changes

- `.github/workflows/ci.yml`
- `docs/agents/codebase-notes.md`
- `docs/dev/frontend/README.md`
- `docs/dev/frontend/app/README.md`
- `docs/dev/frontend/components/README.md`
- `docs/dev/frontend/lib/README.md`
- `frontend/app/dashboard/memo/_components/form-submissions-section.tsx`
- `frontend/app/dashboard/memo/_components/recognition-board-section.tsx`
- `frontend/app/dashboard/memo/_components/team-leader-performance-table.tsx`
- `frontend/app/dashboard/memo/_components/tutoring-log-section.tsx`
- `frontend/app/dashboard/room/page.tsx`
- `frontend/app/dev/form-logs/team-leaders-table.tsx`
- `frontend/app/dev/session-logs/page.tsx`
- `frontend/app/dev/session-logs/session-heat-map.tsx`
- `frontend/app/dev/session-records/page.tsx`
- `frontend/app/dev/traffic/traffic-heat-map.tsx`
- `frontend/app/dev/traffic/traffic-weekly-line-chart.tsx`
- `frontend/app/globals.css`
- `frontend/app/layout.tsx`
- `frontend/app/traffic/page.tsx`
- `frontend/components/auth/complete-profile-form.tsx`
- `frontend/components/auth/forgot-password-form.tsx`
- `frontend/components/auth/sign-up-form.tsx`
- `frontend/components/auth/update-password-form.tsx`
- `frontend/components/charts/front-desk-chart.tsx`
- `frontend/components/charts/study-session-chart.tsx`
- `frontend/components/dashboard/roles/exec-dashboard.tsx`
- `frontend/components/dashboard/widgets/submission-details-modal.tsx`
- `frontend/components/data-display/double-entry-checker.tsx`
- `frontend/components/data-display/form-completion-overview-card.tsx`
- `frontend/components/data-display/progress-cell.tsx`
- `frontend/components/dev/dev-acting-banner.tsx`
- `frontend/components/layout/dashboard-header.tsx`
- `frontend/components/marketing/landing-hero.tsx`
- `frontend/components/mentee-monitoring/hours-card.tsx`
- `frontend/components/personal/personal-client.tsx`
- `frontend/components/ui/badge.tsx`
- `frontend/components/ui/sidebar.tsx`
- `frontend/lib/dashboard/activity-log-dictionary.ts`
- `frontend/package.json`
