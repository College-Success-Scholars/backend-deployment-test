# docs-no-supabase-edge-functions

**Date:** 2026-07-15T053011Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
note, for this stack, we will only use function calls from the backend quierying supabase, and not calling any edge functions from supabase itself. Add this to documentation.
```

---

## Purpose

Document that domain access is backend→Postgres only; no Supabase Edge Functions

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added Access pattern (backend services → tables/RPCs only; no Edge Functions) to docs/dev/supabase/README.md, mirrored in supabase/README.md, backend services standards, deployment topology, and onboarding ask-and-dont-touch.

---

## Code Changes

- `docs/dev/backend/src/services/README.md`
- `docs/dev/deployment/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
- `docs/dev/supabase/README.md`
