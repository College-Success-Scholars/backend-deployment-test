# github-issues-alerts-workflow-wt

**Date:** 2026-07-15T010457Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
great, log the working tree
```

---

## Purpose

Log full working-tree changes for GitHub issue templates, GitHub-only architectural alerts, migration, and scan skill

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented GitHub-only ticket workflow: Issue Forms (bug/feature/chore/architecture-alert), issue-triage Action, ensure-issue-labels.sh (force upsert), retargeted alert.sh/resolve-alert.sh to gh Issues (close-if-open), migrate-alerts-to-issues.sh. Migrated 7 legacy alert markdown files to Issues #19–#25 and left docs/agents/alerts/README.md. Updated AGENTS.md, issue-tracker, triage-labels, scripts/onboarding docs. Added scan-architecture-alerts skill under .cursor/skills/ (gitignored via .cursor); linked from AGENTS.md. Ran scan alerts: 6 STILL_RELEVANT keep, #24 PARTIALLY_FIXED (update body recommended). No product commits.

---

## Code Changes

- `AGENTS.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/feature.yml`
- `.github/ISSUE_TEMPLATE/chore.yml`
- `.github/ISSUE_TEMPLATE/architecture-alert.yml`
- `.github/workflows/issue-triage.yml`
- `docs/agents/alerts/README.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/triage-labels.md`
- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
- `docs/dev/scripts/README.md`
- `scripts/alert.sh`
- `scripts/resolve-alert.sh`
- `scripts/ensure-issue-labels.sh`
- `scripts/migrate-alerts-to-issues.sh`
- `docs/agents/alerts/2026-07-11T061357Z-dual-week-calendar-personal-mentee.md`
- `docs/agents/alerts/2026-07-11T073920Z-memo-colocation-pattern-not-adopted.md`
- `docs/agents/alerts/2026-07-11T073926Z-dead-memo-artifacts-and-parallel-implementations.md`
- `docs/agents/alerts/2026-07-11T073929Z-component-level-data-fetching-violations.md`
- `docs/agents/alerts/2026-07-11T073931Z-backend-tests-missing-heavy-domains.md`
- `docs/agents/alerts/2026-07-11T073934Z-unwired-role-dashboards-dead-code.md`
- `docs/agents/alerts/2026-07-14T054210Z-supabase-schema-codebase-drift.md`
- `.cursor/skills/scan-architecture-alerts/SKILL.md`
