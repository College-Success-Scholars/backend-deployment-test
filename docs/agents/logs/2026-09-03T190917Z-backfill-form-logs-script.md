# backfill-form-logs-script

**Date:** 2026-09-03T190917Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
write a script to back fill the form data in tmp
```

---

## Purpose

Add an ops script to insert Google Form CSV dumps from tmp into WPL and MCF form log tables.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added scripts/backfill-form-logs.sh plus a Python helper that reads headerless (or headered) WPL/MCF Google Form CSVs from tmp/back fill form data, maps them onto wpl_form_logs and mcf_form_logs, interprets timestamps as America/New_York, splits WPL project strings into jsonb name/hours objects, and POSTs via PostgREST using the shared supabase-env credential helper. Matching created_at+uid rows are skipped so re-runs are a no-op unless --force is passed. --dry-run parsed the live tmp dumps (8 WPL, 15 MCF) with no network. Documented in docs/dev/scripts/README.md and cross-linked from the Supabase yearly-rollover notes.

---

## Code Changes

- `backend/API.md`
- `backend/src/services/memo-page.service.ts`
- `backend/src/services/user.service.ts`
- `backend/src/tests/user.service.test.ts`
- `docs/dev/frontend/app/dashboard/memo/README.md`
- `docs/dev/scripts/README.md`
- `docs/dev/supabase/README.md`
