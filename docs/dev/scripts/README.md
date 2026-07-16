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

---

## Standards

- **Smoke tests only** — integration and unit tests live in `backend/src/tests/` and `frontend/` respectively.
- **Use `BASE_URL` env var** — scripts must be configurable for different environments (local, staging, production).
- **Exit codes matter** — scripts must exit with `0` on success and `1` on failure so CI can detect them.
- **No secrets in scripts** — never hardcode credentials or tokens.

---

## Usage

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
```
