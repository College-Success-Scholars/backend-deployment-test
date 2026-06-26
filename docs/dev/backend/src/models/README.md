# models/

**Location:** [`backend/src/models/`](../../../../../backend/src/models/)  
**Docs:** `docs/dev/backend/src/models/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › models

---

## Purpose

TypeScript type definitions and constants that describe the shape of domain data. Models have **zero runtime logic** — they exist only to give the compiler and developers a shared vocabulary for data structures returned from Supabase or passed between layers.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `user.model.ts` | [source](../../../../../backend/src/models/user.model.ts) | `ProfilesRow` (merged profiles + user_roster), `MemoUserRow`, `TeamLeaderRow`, `APP_ROLE_ORDER` constant |
| `session-log.model.ts` | [source](../../../../../backend/src/models/session-log.model.ts) | Raw session check-in/out log row types |
| `session-record.model.ts` | [source](../../../../../backend/src/models/session-record.model.ts) | Weekly aggregated session record row types |
| `form-log.model.ts` | [source](../../../../../backend/src/models/form-log.model.ts) | MCF/WHAF/WPL form log row types |
| `traffic.model.ts` | [source](../../../../../backend/src/models/traffic.model.ts) | Traffic entry row and count types |
| `time.model.ts` | [source](../../../../../backend/src/models/time.model.ts) | Time-related types (week ranges, date parts) used in the backend |
| `daily-scholar-activity.model.ts` | [source](../../../../../backend/src/models/daily-scholar-activity.model.ts) | Daily activity minute row types |
| `mentee.model.ts` | [source](../../../../../backend/src/models/mentee.model.ts) | Mentee relationship types |
| `tutor-report-log.model.ts` | [source](../../../../../backend/src/models/tutor-report-log.model.ts) | Tutor session report log row types |

---

## Standards

- **Types only** — no functions, no class methods, no runtime logic.
- **No Supabase imports** — models must not import from `@supabase/supabase-js`.
- **Mirror Supabase column names** — row type fields should match the actual database column names unless a transformation is intentional and documented.
- **Constants here if type-adjacent** — `APP_ROLE_ORDER` lives in `user.model.ts` because it directly describes the role type hierarchy.
- **Naming** — row types end in `Row` (e.g., `ProfilesRow`). Computed/aggregated shapes use descriptive names (e.g., `MemoUserRow`, `TeamLeaderRow`).
- **One model file per domain** — align with the corresponding service and controller files.
