# github-issue-workflow-alerts

**Date:** 2026-07-15T001941Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
build, then conssider the above
```

---

## Purpose

Implement GitHub-only ticket workflow with issue templates and architectural alerts on Issues

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added Bug/Feature/Chore/Architecture-alert Issue Forms, ensure-issue-labels.sh, issue-triage Action (auto needs-triage), retargeted alert.sh/resolve-alert.sh to gh Issues (close-if-open), migrate-alerts-to-issues.sh + alerts README. Updated AGENTS.md, issue-tracker, triage-labels, scripts/onboarding docs. Migration of 7 legacy alert files blocked on gh auth — dry-run OK; run ensure-issue-labels + migrate after gh auth login.

---

## Code Changes

- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/feature.yml`
- `.github/ISSUE_TEMPLATE/chore.yml`
- `.github/ISSUE_TEMPLATE/architecture-alert.yml`
- `.github/workflows/issue-triage.yml`
- `scripts/alert.sh`
- `scripts/resolve-alert.sh`
- `scripts/ensure-issue-labels.sh`
- `scripts/migrate-alerts-to-issues.sh`
- `docs/agents/alerts/README.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/triage-labels.md`
- `AGENTS.md`
- `docs/dev/scripts/README.md`
- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
