# fix-smoke-test-cors-teardown

**Date:** 2026-07-14T003542Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
fleshing some things out before the push, PASS  GET / health check (HTTP 200)
  PASS  GET /api/auth/me is auth-gated (HTTP 401)
  FAIL  GET /api/memo is auth-gated (expected HTTP 401, got HTTP 404)
  PASS  GET /api/memo/page-data is auth-gated (HTTP 401)
  PASS  GET /api/users is auth-gated (HTTP 401)
  PASS  GET /api/session-logs is auth-gated (HTTP 401)
  PASS  GET /api/session-records is auth-gated (HTTP 401)
  PASS  GET /api/traffic is auth-gated (HTTP 401)
  PASS  GET /api/form-logs is auth-gated (HTTP 401)
  PASS  GET /api/daily-activity is auth-gated (HTTP 401)
  PASS  GET /api/tutor-reports is auth-gated (HTTP 401)
  PASS  GET /api/dev/test-profiles is auth-gated (HTTP 401)
  FAIL  CORS header missing on GET /

smoke test returns this, and get rid of tear down, we will assume it works
```

---

## Purpose

Fix smoke test false failures and drop CI tear-down before push

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Updated smoke-test.sh: probe /api/memo/weekly instead of nonexistent /api/memo; CORS Origin via SMOKE_ORIGIN (default localhost:3000 to match Docker Compose). Removed docker compose tear-down from CI smoke-test job. Documented SMOKE_ORIGIN usage in scripts README.

---

## Code Changes

- `.github/workflows/ci.yml`
- `docs/dev/pr_template/TEMPLATE.md`
- `docs/dev/scripts/README.md`
- `scripts/smoke-test.sh`
