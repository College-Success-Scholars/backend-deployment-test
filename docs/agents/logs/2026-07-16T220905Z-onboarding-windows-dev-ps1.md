# onboarding-windows-dev-ps1

**Date:** 2026-07-16T220905Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
please make sure that onboarding includes the new windows set up
```

---

## Purpose

Make onboarding Day 0 and index explicitly cover Windows PowerShell setup via scripts/dev.ps1

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Restructured day-0-setup.md with first-class macOS/Linux vs Windows PowerShell paths (prerequisites, install/start commands, execution-policy and bash-on-Windows failure rows, success criteria). Updated onboarding README first-week + guide table and auth-rls-runbook to cite scripts/dev.ps1 alongside scripts/dev.sh.

---

## Code Changes

- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/auth-rls-runbook.md`
- `docs/dev/onboarding/day-0-setup.md`
