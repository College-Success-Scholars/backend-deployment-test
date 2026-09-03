# backfill-user-roster-defaults

**Date:** 2026-09-03T145546Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
make a script that auto fills the supabase roster table, where if a scholars cohort is blank, default to 2026, and set their front desk to 180 mins, and ss to 300
```

---

## Purpose

Add an ops script that fills blank cohort / front-desk / study-session requirements on public.user_roster with program defaults

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added scripts/backfill-user-roster-defaults.sh plus its Python helper. The helper reads public.user_roster over PostgREST, fills blank cohort (2026), fd_required (180 min/week) and ss_required (300 min/week) on Scholar rows, and PATCHes rows grouped by identical patch so a full roster costs a handful of requests instead of one per scholar. Blanks-only by default, with --overwrite, --include-zero, --cohort/--fd-required/--ss-required, --program-role any and --batch-size to widen scope; rows already at the defaults are skipped so re-runs are a no-op. --dry-run prints a per-row plan of 'column: blank -> value' transitions plus per-column counts and writes nothing (it still needs credentials because it reads the roster first). Extracted the duplicated Supabase credential handling (URL from the shell, NEXT_PUBLIC_SUPABASE_URL or backend/.env; hidden service-role prompt never read from project env files) into sourced scripts/supabase-env.sh and repointed ingest-user-roster.sh at it, cutting that wrapper from 150 to 101 lines. Documented both scripts in docs/dev/scripts/README.md. Also fixed a latent bug in log-agent-session.sh: the session file was written with an interpolating heredoc, so backticks in the template (and in any prompt containing code) were executed by the shell rather than logged verbatim; it now builds the file with printf. Validated with bash -n on all four shell scripts, py_compile on the helper, a logic harness covering blanks-only / include-zero / overwrite / program-role=any and idempotency, and an ingest --dry-run smoke test confirming the credential refactor preserved prior behavior.

---

## Code Changes

- `scripts/backfill-user-roster-defaults.sh`
- `scripts/backfill-user-roster-defaults.py`
- `scripts/supabase-env.sh`
- `scripts/ingest-user-roster.sh`
- `scripts/log-agent-session.sh`
- `docs/dev/scripts/README.md`
