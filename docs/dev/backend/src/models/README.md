# models/

**Location:** [`backend/src/models/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models)  
**Docs:** `docs/dev/backend/src/models/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › models

---

## Purpose

TypeScript type definitions and constants that describe the shape of domain data. Models have **zero runtime logic** — they exist only to give the compiler and developers a shared vocabulary for data structures returned from Supabase or passed between layers.

---

## Modules

One `*.model.ts` per domain (user, session-log, session-record, form-log, traffic, time, daily-scholar-activity, mentee, tutor-report-log). Source: [`backend/src/models/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models). Symbol docs: [API Reference](../../../../reference/README.md).

---

## Standards

- **Types only** — no functions, no class methods, no runtime logic.
- **No Supabase imports** — models must not import from `@supabase/supabase-js`.
- **Mirror Supabase column names** — row type fields should match the actual database column names unless a transformation is intentional and documented.
- **Constants here if type-adjacent** — `APP_ROLE_ORDER` is re-exported from `shared/auth.ts` (canonical source); `user.model.ts` keeps the re-export for backward compatibility.
- **Naming** — row types end in `Row` (e.g., `ProfilesRow`). Computed/aggregated shapes use descriptive names (e.g., `MemoUserRow`, `TeamLeaderRow`).
- **One model file per domain** — align with the corresponding service and controller files.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures. Module indexes below; full catalog: [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `daily-scholar-activity.model` | [API](../../../../reference/api/backend/src/models/daily-scholar-activity.model/README.md) |
| `form-log.model` | [API](../../../../reference/api/backend/src/models/form-log.model/README.md) |
| `mentee.model` | [API](../../../../reference/api/backend/src/models/mentee.model/README.md) |
| `session-log.model` | [API](../../../../reference/api/backend/src/models/session-log.model/README.md) |
| `session-record.model` | [API](../../../../reference/api/backend/src/models/session-record.model/README.md) |
| `time.model` | [API](../../../../reference/api/backend/src/models/time.model/README.md) |
| `traffic.model` | [API](../../../../reference/api/backend/src/models/traffic.model/README.md) |
| `tutor-report-log.model` | [API](../../../../reference/api/backend/src/models/tutor-report-log.model/README.md) |
| `user.model` | [API](../../../../reference/api/backend/src/models/user.model/README.md) |

<!-- AUTO-API-REFERENCE:END -->
