# frontend/legacy

**Location:** [`frontend/legacy/`](../../../../frontend/legacy/)  
**Docs:** `docs/dev/frontend/legacy/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › legacy

---

## Purpose

Deprecated code preserved for reference. These were the original Next.js API routes and utility modules before the architecture was refactored to use the dedicated Express backend. **Do not add new code here.** Do not import from `legacy/` in new code.

---

## Structure

```
legacy/
  api/
    dev/        ← Old dev API route handlers (form-logs, session-records, me, test)
    memo/       ← Old memo API routes (sync, traffic-count)
  lib/
    form-logs/       ← Old form log utilities
    session-logs/    ← Old session log utilities
    session-records/ ← Old session record utilities
    time/            ← Old time utilities (now in shared/)
    traffic/         ← Old traffic utilities
```

---

## Standards

- **Read only** — legacy code exists for historical reference. Do not edit it.
- **Do not import from `legacy/`** — all active code uses the Express backend and `lib/server/`.
- **Deletion candidate** — this directory can be removed once the team confirms no active dependencies remain. Check for any remaining imports with: `grep -r "from.*legacy" frontend/app frontend/components frontend/lib`
- **New features** — implement in the Express backend (`backend/src/`) and call via `lib/server/api-client.ts`.
