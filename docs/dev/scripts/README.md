# Scripts

**Location:** [`scripts/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts)  
**Docs:** `docs/dev/scripts/README.md`

## Navigation

[← Root](../README.md) › Scripts

---

## Purpose

Shell scripts for deployment validation and operational tasks. These run outside of Node — they use `curl` and standard Unix tools to smoke-test a live deployment. Hosted topology and CI wiring: [Deployment](../deployment/README.md).

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `dev.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/dev.sh) | Start local full-stack development (shared watch + backend + frontend) |
| `dev.ps1` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/dev.ps1) | Windows PowerShell mirror of `dev.sh` |
| `smoke-test.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/smoke-test.sh) | Deployment health-check: tests health endpoint, auth gating, and CORS headers |
| `alert.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/alert.sh) | Opens an architectural alert as a GitHub Issue (`architecture-alert`). Requires `gh` auth — no markdown fallback |
| `resolve-alert.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/resolve-alert.sh) | Resolves an alert by issue number: logs session via `log-agent-session.sh`, then closes the issue (or comments if already closed) |
| `ensure-issue-labels.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/ensure-issue-labels.sh) | Idempotently creates triage / type / `architecture-alert` labels (`gh` required) |
| `migrate-alerts-to-issues.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/migrate-alerts-to-issues.sh) | One-shot: migrate legacy `docs/agents/alerts/*.md` files to GitHub Issues, then delete those files |
| `log-agent-session.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/log-agent-session.sh) | Records an agent/AI session to `docs/agents/logs/`: who ran it, raw user prompt, stated purpose, agent response summary, and changed files |
| `configure-supabase-confirm-email-template.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/configure-supabase-confirm-email-template.sh) | Patches Supabase **Confirm signup** email template so links use `token_hash` + `type` for `/auth/confirm` |
| `ingest-user-roster.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/ingest-user-roster.sh) | Ops: stream a roster CSV into `public.user_roster` (service role prompted interactively; no PII dumps to disk) |
| `backfill-user-roster-defaults.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/backfill-user-roster-defaults.sh) | Ops: fill blank `cohort` / `fd_required` / `ss_required` on `public.user_roster` with program defaults |
| `supabase-env.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/supabase-env.sh) | Sourced helper: resolves `SUPABASE_URL` and prompts for the service role key. Not executable on its own |

---

## Standards

- **Smoke tests only** — integration and unit tests live in `backend/src/tests/` and `frontend/` respectively.
- **Use `BASE_URL` env var** — scripts must be configurable for different environments (local, staging, production).
- **Exit codes matter** — scripts must exit with `0` on success and `1` on failure so CI can detect them.
- **No secrets in scripts** — never hardcode credentials or tokens.

---

## Usage

### `dev.sh` / `dev.ps1`

Starts the local full-stack loop: builds `shared/`, optionally watches it, then runs backend (`:3001`) and frontend (`:3000`) in one process group (Ctrl+C stops all).

**Before you run it**, create env files from the examples — the script exits with an error if they are missing:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# then edit both with real Supabase URL/key values
```

Day 0 walkthrough (order matters): [Onboarding — Day 0 setup](../onboarding/day-0-setup.md).

```bash
# Start local full-stack dev (frontend :3000, backend :3001)
./scripts/dev.sh
./scripts/dev.sh --install     # npm install in shared, backend, frontend first
./scripts/dev.sh --no-watch    # build shared once; skip tsc --watch

# Windows PowerShell (same behavior)
.\scripts\dev.ps1
.\scripts\dev.ps1 -Install
.\scripts\dev.ps1 -NoWatch

# Run against local backend (Docker Compose CORS — Origin :3000)
BASE_URL=http://localhost:3001 bash scripts/smoke-test.sh

# Bare backend with app.ts default CORS (:3002)
SMOKE_ORIGIN=http://localhost:3002 BASE_URL=http://localhost:3001 bash scripts/smoke-test.sh

# Run against production
BASE_URL=https://your-backend.railway.app SMOKE_ORIGIN=https://your-frontend.example bash scripts/smoke-test.sh

# Log an agent session (interactive — prompts for all fields)
bash scripts/log-agent-session.sh

# Log an agent session (fully scripted)
bash scripts/log-agent-session.sh \
  --title "fix-role-check" \
  --user "dev@example.com" \
  --purpose "Fix hasRoleAtLeast stub that allowed all authenticated users through team_leader routes" \
  --prompt-text "Fix the role check in server.ts" \
  --summary-text "Implemented ROLE_ORDER map; role hierarchy now enforced correctly" \
  --changes "frontend/lib/supabase/server.ts"

# Ensure issue labels exist (once per repo)
./scripts/ensure-issue-labels.sh

# Open an architectural alert as a GitHub Issue (requires gh auth)
./scripts/alert.sh \
  --title "auth-role-hierarchy-duplication" \
  --severity warning \
  --category auth \
  --description "ROLE_ORDER duplicated between frontend and backend." \
  --recommendation "Extract role hierarchy into a shared source of truth."

# List open architectural alerts
gh issue list --label architecture-alert --state open

# Resolve an alert (logs session; closes issue if still open)
./scripts/resolve-alert.sh \
  --issue 42 \
  --summary-text "Extracted APP_ROLE_ORDER, hasRoleAtLeast, and mergeProfileWithRoster into shared/auth.ts" \
  --changes "shared/auth.ts,frontend/lib/supabase/server.ts,backend/src/controllers/auth.controller.ts,backend/src/models/user.model.ts"

# Migrate any remaining legacy alert markdown files to Issues
./scripts/migrate-alerts-to-issues.sh

# Patch Supabase confirm-signup email template (requires personal access token)
SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... ./scripts/configure-supabase-confirm-email-template.sh

# Roster CSV → user_roster (parse + reports only; no network, no service-role prompt)
./scripts/ingest-user-roster.sh --dry-run /path/to/roster.csv

# Roster CSV → user_roster (prompts for service role key; streams to Supabase)
# URL from SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL or backend/.env (URL only)
./scripts/ingest-user-roster.sh /path/to/roster.csv

# Backfill blank roster requirements (plan only — reads the roster, writes nothing)
./scripts/backfill-user-roster-defaults.sh --dry-run

# Backfill for real: cohort 2026, FD 180 min/week, SS 300 min/week, Scholar rows only
./scripts/backfill-user-roster-defaults.sh
```

### `ingest-user-roster.sh`

Ops script for bulk-loading a sheet export into `public.user_roster`. Companion parser: [`scripts/ingest-user-roster.py`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/ingest-user-roster.py).

**Sensitivity**

- Treat the CSV as PII. The script reads it from the path you pass and POSTs mapped rows to Supabase; it does **not** write transformed CSV/JSON/report files.
- Secure or delete the source CSV yourself after the run.
- Insert-only (re-runs can duplicate on email). Non-9-digit UIDs are stored as `NULL`.

**Credentials**

| Credential | Source |
|------------|--------|
| Supabase URL | `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` in the current shell, or URL-only from `backend/.env` |
| Service role | Interactive hidden prompt (or `SUPABASE_SERVICE_ROLE_KEY` already exported in **this** shell). Never loaded from project `.env` / `.env.local`, and not documented in `.env.example` |

`--dry-run` skips the prompt and does not POST. Stdout includes TSV reports for bad university emails (with contact fields) and null UIDs.

Credential resolution is shared with `backfill-user-roster-defaults.sh` via [`scripts/supabase-env.sh`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/supabase-env.sh) (`require_supabase_url`, `require_supabase_service_role`). Source that helper in any new Supabase ops script instead of re-implementing the `.env` walk or the hidden prompt.

### `backfill-user-roster-defaults.sh`

Ops script that fills the program defaults onto roster rows the CSV ingest leaves blank. Companion helper: [`scripts/backfill-user-roster-defaults.py`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/backfill-user-roster-defaults.py).

**Defaults**

| Column | Value | Blank means |
|--------|-------|-------------|
| `cohort` | `2026` | `NULL` or `0` (year 0 is never a real cohort) |
| `fd_required` | `180` | `NULL` (add `--include-zero` to also treat `0` as blank) |
| `ss_required` | `300` | `NULL` (add `--include-zero` to also treat `0` as blank) |

Only rows with `program_role` = `Scholar` are touched (case-insensitive); pass `--program-role any` to include team leaders and staff. Rows with a blank `program_role` never match a role filter, so the run reports how many exist.

**Behavior**

- **Fills blanks only.** A column that already holds a value is left alone unless you pass `--overwrite`. Rows already matching the defaults are skipped entirely, so re-running converges to a no-op.
- **Plan first.** Stdout lists every row and the exact `column: blank -> value` transitions, then per-column counts, before anything is written.
- Rows sharing an identical patch are collapsed into one `PATCH … ?id=in.(…)` request, so a full roster costs a handful of calls rather than one per scholar.
- `--dry-run` prints the plan and writes nothing, but **still needs credentials** because it reads the roster first.

**Credentials** — same sources as `ingest-user-roster.sh` above (URL from the shell or `backend/.env`; service role via hidden prompt only).

```bash
# Preview, then apply
./scripts/backfill-user-roster-defaults.sh --dry-run
./scripts/backfill-user-roster-defaults.sh

# Next year's cohort, everyone on the roster
./scripts/backfill-user-roster-defaults.sh --cohort 2027 --program-role any

# Reset requirements that were seeded as 0
./scripts/backfill-user-roster-defaults.sh --include-zero
```
