# models/

**Location:** [`backend/src/models/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models)  
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
| `user.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/user.model.ts) | `ProfilesRow` (merged profiles + user_roster), `MemoUserRow`, `TeamLeaderRow`; re-exports `APP_ROLE_ORDER` from shared |
| `session-log.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/session-log.model.ts) | Raw session check-in/out log row types |
| `session-record.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/session-record.model.ts) | Weekly aggregated session record row types |
| `form-log.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/form-log.model.ts) | MCF/WHAF/WPL form log row types |
| `traffic.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/traffic.model.ts) | Traffic entry row and count types |
| `time.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/time.model.ts) | Time-related types (week ranges, date parts) used in the backend |
| `daily-scholar-activity.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/daily-scholar-activity.model.ts) | Daily activity minute row types |
| `mentee.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/mentee.model.ts) | Mentee relationship types |
| `tutor-report-log.model.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/models/tutor-report-log.model.ts) | Tutor session report log row types |

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

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

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

<details>
<summary>All exports (43)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `ActivityFormType` | type-aliases | [docs](../../../../reference/api/backend/src/models/form-log.model/type-aliases/ActivityFormType.md) |
| `APP_ROLE_ORDER` | variables | [docs](../../../../reference/api/backend/src/models/user.model/variables/APP_ROLE_ORDER.md) |
| `AppRole` | type-aliases | [docs](../../../../reference/api/backend/src/models/user.model/type-aliases/AppRole.md) |
| `CleanedAndErroredResult` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/CleanedAndErroredResult.md) |
| `DailyScholarActivityMinutesRow` | interfaces | [docs](../../../../reference/api/backend/src/models/daily-scholar-activity.model/interfaces/DailyScholarActivityMinutesRow.md) |
| `DailyScholarLogSource` | type-aliases | [docs](../../../../reference/api/backend/src/models/daily-scholar-activity.model/type-aliases/DailyScholarLogSource.md) |
| `DEFAULT_SESSION_CONFIG` | variables | [docs](../../../../reference/api/backend/src/models/session-log.model/variables/DEFAULT_SESSION_CONFIG.md) |
| `DoubleEntry` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/DoubleEntry.md) |
| `EMPTY_WEEKLY_MINUTES` | variables | [docs](../../../../reference/api/backend/src/models/session-record.model/variables/EMPTY_WEEKLY_MINUTES.md) |
| `FormLogRowWithLate` | type-aliases | [docs](../../../../reference/api/backend/src/models/form-log.model/type-aliases/FormLogRowWithLate.md) |
| `FrontDeskLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/FrontDeskLogRow.md) |
| `FrontDeskRecordRow` | interfaces | [docs](../../../../reference/api/backend/src/models/session-record.model/interfaces/FrontDeskRecordRow.md) |
| `FrontDeskRecordWithName` | type-aliases | [docs](../../../../reference/api/backend/src/models/session-record.model/type-aliases/FrontDeskRecordWithName.md) |
| `McfFormLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/form-log.model/interfaces/McfFormLogRow.md) |
| `MemoUserRow` | type-aliases | [docs](../../../../reference/api/backend/src/models/user.model/type-aliases/MemoUserRow.md) |
| `MenteeRow` | interfaces | [docs](../../../../reference/api/backend/src/models/mentee.model/interfaces/MenteeRow.md) |
| `ProcessedTicket` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/ProcessedTicket.md) |
| `ProfilesRow` | type-aliases | [docs](../../../../reference/api/backend/src/models/user.model/type-aliases/ProfilesRow.md) |
| `RecentFormSubmission` | type-aliases | [docs](../../../../reference/api/backend/src/models/form-log.model/type-aliases/RecentFormSubmission.md) |
| `RecordKind` | type-aliases | [docs](../../../../reference/api/backend/src/models/session-record.model/type-aliases/RecordKind.md) |
| `ScholarInRoom` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/ScholarInRoom.md) |
| `ScholarWithCompletedSession` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/ScholarWithCompletedSession.md) |
| `SESSION_TYPE_FRONT_DESK` | variables | [docs](../../../../reference/api/backend/src/models/session-log.model/variables/SESSION_TYPE_FRONT_DESK.md) |
| `SESSION_TYPE_STUDY` | variables | [docs](../../../../reference/api/backend/src/models/session-log.model/variables/SESSION_TYPE_STUDY.md) |
| `SESSION_TYPES` | variables | [docs](../../../../reference/api/backend/src/models/session-log.model/variables/SESSION_TYPES.md) |
| `SessionLogConfig` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/SessionLogConfig.md) |
| `SessionLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/SessionLogRow.md) |
| `SessionType` | type-aliases | [docs](../../../../reference/api/backend/src/models/session-log.model/type-aliases/SessionType.md) |
| `StudySessionLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/session-log.model/interfaces/StudySessionLogRow.md) |
| `StudySessionRecordRow` | interfaces | [docs](../../../../reference/api/backend/src/models/session-record.model/interfaces/StudySessionRecordRow.md) |
| `StudySessionRecordWithName` | type-aliases | [docs](../../../../reference/api/backend/src/models/session-record.model/type-aliases/StudySessionRecordWithName.md) |
| `TeamLeaderFormStatsRow` | type-aliases | [docs](../../../../reference/api/backend/src/models/form-log.model/type-aliases/TeamLeaderFormStatsRow.md) |
| `TeamLeaderNameRecord` | type-aliases | [docs](../../../../reference/api/backend/src/models/form-log.model/type-aliases/TeamLeaderNameRecord.md) |
| `TeamLeaderRow` | type-aliases | [docs](../../../../reference/api/backend/src/models/user.model/type-aliases/TeamLeaderRow.md) |
| `TicketErrorType` | type-aliases | [docs](../../../../reference/api/backend/src/models/session-log.model/type-aliases/TicketErrorType.md) |
| `TrafficRow` | interfaces | [docs](../../../../reference/api/backend/src/models/traffic.model/interfaces/TrafficRow.md) |
| `TrafficSession` | interfaces | [docs](../../../../reference/api/backend/src/models/traffic.model/interfaces/TrafficSession.md) |
| `TutorReportLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/tutor-report-log.model/interfaces/TutorReportLogRow.md) |
| `UpdateExcusePayload` | interfaces | [docs](../../../../reference/api/backend/src/models/session-record.model/interfaces/UpdateExcusePayload.md) |
| `WahfFormLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/form-log.model/interfaces/WahfFormLogRow.md) |
| `WeekEntryCount` | type-aliases | [docs](../../../../reference/api/backend/src/models/traffic.model/type-aliases/WeekEntryCount.md) |
| `WeeklyMinutesByDay` | interfaces | [docs](../../../../reference/api/backend/src/models/session-record.model/interfaces/WeeklyMinutesByDay.md) |
| `WplFormLogRow` | interfaces | [docs](../../../../reference/api/backend/src/models/form-log.model/interfaces/WplFormLogRow.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
