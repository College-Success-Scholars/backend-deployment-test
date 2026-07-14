# supabase-schema-drift-alert

**Date:** 2026-07-14T054213Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
As a senior developer with 20+ years of experience, how would you reccomend rectifying the drift between supabase and the codebase

---

add this as an alert, and detail the plan phase steps
```

---

## Purpose

Record supabase-vs-codebase drift as an architectural alert with phased remediation plan

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Recommended a phased remediation (inventory/baseline → git migrations as source of truth → generated Database types on backend client → shared API DTOs to kill FE/BE triple mirror → CI drift detection). Logged as docs/agents/alerts/2026-07-14T054210Z-supabase-schema-codebase-drift.md via scripts/alert.sh with full phase steps in the Recommendation section.

---

## Code Changes

- `docs/agents/alerts/2026-07-14T054210Z-supabase-schema-codebase-drift.md`
