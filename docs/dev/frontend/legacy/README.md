# frontend/legacy

**Location:** [`frontend/legacy/`](../../../../frontend/legacy/)  
**Docs:** `docs/dev/frontend/legacy/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › legacy

---

## Purpose

Deprecated code preserved for reference. These were the original Next.js API routes, utility modules, and standalone pages before the architecture was refactored to use the dedicated Express backend and `app/dashboard/memo`. **Do not add new code here.** Do not import from `legacy/` in active code.

The `legacy/` directory is excluded from TypeScript compilation (`tsconfig.json` → `"exclude": ["legacy"]`).

---

## Structure

```
legacy/
  api/
    dev/        ← Old dev API route handlers
    memo/       ← Old memo API routes (sync, traffic-count)
  app/
    memo/       ← Retired standalone /memo page (superseded by /dashboard/memo)
  lib/
    form-logs/       ← Old form log utilities
    session-logs/    ← Old session log utilities
    session-records/ ← Old session record utilities
    time/            ← Old time utilities (now in shared/)
    traffic/         ← Old traffic utilities
```

The active `/memo` URL redirects to `/dashboard/memo` via `app/memo/page.tsx`.

---

## Standards

- **Read only** — legacy code exists for historical reference. Do not edit except to fix broken references during migrations.
- **Do not import from `legacy/`** — all active code uses the Express backend and `lib/server/`.
- **Deletion candidate** — remove once the team confirms no dependencies remain.
- **New features** — implement in the Express backend (`backend/src/`) and call via `lib/server/api-client.ts`. UI goes in `app/dashboard/` and `components/`.
