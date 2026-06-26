# Scripts

**Location:** [`scripts/`](../../../scripts/)  
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
| `smoke-test.sh` | [source](../../../scripts/smoke-test.sh) | Deployment health-check: tests health endpoint, auth gating, and CORS headers |

---

## Standards

- **Smoke tests only** — integration and unit tests live in `backend/src/tests/` and `frontend/` respectively.
- **Use `BASE_URL` env var** — scripts must be configurable for different environments (local, staging, production).
- **Exit codes matter** — scripts must exit with `0` on success and `1` on failure so CI can detect them.
- **No secrets in scripts** — never hardcode credentials or tokens.

---

## Usage

```bash
# Run against local backend
BASE_URL=http://localhost:3001 bash scripts/smoke-test.sh

# Run against production
BASE_URL=https://your-backend.railway.app bash scripts/smoke-test.sh
```
