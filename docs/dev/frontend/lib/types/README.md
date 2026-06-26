# lib/types

**Location:** [`frontend/lib/types/`](../../../../../frontend/lib/types/)  
**Docs:** `docs/dev/frontend/lib/types/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › types

---

## Purpose

TypeScript type definitions for domain data shapes used on the frontend. These mirror the backend model types but are defined independently for the frontend's consumption. Safe to import from both server and client components.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `form-log.ts` | [source](../../../../../frontend/lib/types/form-log.ts) | Types for MCF/WHAF/WPL form log objects |
| `session-log.ts` | [source](../../../../../frontend/lib/types/session-log.ts) | Types for raw session check-in/out log rows |
| `session-record.ts` | [source](../../../../../frontend/lib/types/session-record.ts) | Types for weekly aggregated session record rows |
| `supabase.ts` | [source](../../../../../frontend/lib/types/supabase.ts) | Supabase-generated or manually maintained database row types |
| `time.ts` | [source](../../../../../frontend/lib/types/time.ts) | Time-related types (campus week ranges, date parts) |
| `traffic.ts` | [source](../../../../../frontend/lib/types/traffic.ts) | Types for traffic entry data |
| `tutor-report-log.ts` | [source](../../../../../frontend/lib/types/tutor-report-log.ts) | Types for tutor session report log rows |

---

## Standards

- **Types only** — no functions, no runtime logic, no imports from Supabase or Node.
- **One file per domain** — mirrors the backend `models/` structure.
- **Match backend model names where possible** — `SessionLogRow` in frontend should match `SessionLogRow` in backend to reduce cognitive overhead.
- **Update when the backend API response shape changes** — if an endpoint returns new fields, update the corresponding type here.
- **Do not generate from Supabase schema automatically** unless you control the generation and review the output — auto-generated types can expose internal tables.
