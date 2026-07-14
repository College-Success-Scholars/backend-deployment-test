# day0-backend-down-auth-redirect

**Date:** 2026-07-14T203340Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
for common day 0 failures, add in an issue for wuth redirect, where if the backend is not up and running, it triggers the redirect as well.
```

---

## Purpose

Document Day 0 auth redirect when backend is not running

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added Day 0 failure row for login/dashboard redirects caused by a down or misconfigured backend (/api/auth/me failure). Mirrored the same symptom in the auth/RLS runbook with a link back to Day 0.

---

## Code Changes

- `docs/dev/onboarding/day-0-setup.md`
- `docs/dev/onboarding/auth-rls-runbook.md`
