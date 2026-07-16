# trim-handbook-docs

**Date:** 2026-07-14T212028Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by a line containing only `---`._

```
as a senior developer with 20+ years of experience, what do you think about the documenation of our codebase? Specifically, is there too much or dis organized?

---

what would be the course of action to trim down?

---

make a plan for all of this

---

so to be clear, references are made by CI to accurately refelect inline comments from the code, whereas the dev is more a handbook?

---

Trim developer handbook docs

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.
```

---

## Purpose

Collapse leaf handbook READMEs into standards hubs and update docs tooling

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added Docs depth policy on handbook home and human pointer on codebase-notes. Updated ensure-standards and scan-codebase for hub-only leaf docs. Salvaged unique Standards into frontend/lib, components, dashboard, and frontend hubs; deleted 19 frontend leaf READMEs plus hooks and empty dirs. Folded backend tests README into src hub; trimmed controllers/services/models Files to module pointers; fixed middleware Standards heading. Collapsed mkdocs Frontend/Backend nav to KEEP set. Slimmed docs-append-api-indexes MAP and hub AUTO indexes to module tables (recursive nesting). Retargeted agents README; docs:prepare and docs:coverage pass; no broken relative links in docs/dev.

---

## Code Changes

- `docs/agents/codebase-notes.md`
- `docs/dev/README.md`
- `docs/dev/agents/README.md`
- `docs/dev/backend/src/README.md`
- `docs/dev/backend/src/controllers/README.md`
- `docs/dev/backend/src/middleware/README.md`
- `docs/dev/backend/src/models/README.md`
- `docs/dev/backend/src/services/README.md`
- `docs/dev/backend/src/tests/README.md`
- `docs/dev/frontend/README.md`
- `docs/dev/frontend/components/README.md`
- `docs/dev/frontend/components/auth/README.md`
- `docs/dev/frontend/components/charts/README.md`
- `docs/dev/frontend/components/dashboard/README.md`
- `docs/dev/frontend/components/dashboard/roles/README.md`
- `docs/dev/frontend/components/dashboard/widgets/README.md`
- `docs/dev/frontend/components/data-display/README.md`
- `docs/dev/frontend/components/dev/README.md`
- `docs/dev/frontend/components/layout/README.md`
- `docs/dev/frontend/components/marketing/README.md`
- `docs/dev/frontend/components/mentee-monitoring/README.md`
- `docs/dev/frontend/components/personal/README.md`
- `docs/dev/frontend/components/settings/README.md`
- `docs/dev/frontend/components/ui/README.md`
- `docs/dev/frontend/hooks/README.md`
- `docs/dev/frontend/lib/README.md`
- `docs/dev/frontend/lib/auth/README.md`
- `docs/dev/frontend/lib/client/README.md`
- `docs/dev/frontend/lib/dashboard/README.md`
- `docs/dev/frontend/lib/dev/README.md`
- `docs/dev/frontend/lib/format/README.md`
- `docs/dev/frontend/lib/server/README.md`
- `docs/dev/frontend/lib/supabase/README.md`
- `docs/dev/frontend/lib/types/README.md`
- `docs/dev/shared/README.md`
- `docs/dev/shared/src/README.md`
- `mkdocs.yml`
- `scripts/docs-append-api-indexes.mjs`
