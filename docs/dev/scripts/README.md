# Scripts

**Location:** [`scripts/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts)  
**Docs:** `docs/dev/scripts/README.md`

## Navigation

[← Root](../README.md) › Scripts

---

## Purpose

Shell scripts for deployment validation and operational tasks. These run outside of Node — they use `curl` and standard Unix tools to smoke-test a live deployment.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `dev.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/dev.sh) | Start local full-stack development (shared watch + backend + frontend) |
| `smoke-test.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/smoke-test.sh) | Deployment health-check: tests health endpoint, auth gating, and CORS headers |
| `alert.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/alert.sh) | Records an architectural alert to `docs/agents/alerts/` |
| `resolve-alert.sh` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/scripts/resolve-alert.sh) | Resolves an alert: logs the fix session via `log-agent-session.sh`, then deletes the alert file |
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

# Resolve an alert (logs session + deletes alert file)
bash scripts/resolve-alert.sh \
  --alert docs/agents/alerts/2026-06-26T055650Z-auth-role-hierarchy-duplication.md \
  --summary-text "Extracted APP_ROLE_ORDER, hasRoleAtLeast, and mergeProfileWithRoster into shared/auth.ts" \
  --changes "shared/auth.ts,frontend/lib/supabase/server.ts,backend/src/controllers/auth.controller.ts,backend/src/models/user.model.ts"

# Patch Supabase confirm-signup email template (requires personal access token)
SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... ./scripts/configure-supabase-confirm-email-template.sh
```
