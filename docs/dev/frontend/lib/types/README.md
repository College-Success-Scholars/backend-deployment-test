# lib/types

**Location:** [`frontend/lib/types/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types)  
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
| `form-log.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/form-log.ts) | Types for MCF/WHAF/WPL form log objects |
| `session-log.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/session-log.ts) | Types for raw session check-in/out log rows |
| `session-record.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/session-record.ts) | Types for weekly aggregated session record rows |
| `supabase.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/supabase.ts) | Supabase-generated or manually maintained database row types |
| `time.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/time.ts) | Time-related types (campus week ranges, date parts) |
| `traffic.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/traffic.ts) | Types for traffic entry data |
| `tutor-report-log.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/types/tutor-report-log.ts) | Types for tutor session report log rows |

---

## Standards

- **Types only** — no functions, no runtime logic, no imports from Supabase or Node.
- **One file per domain** — mirrors the backend `models/` structure.
- **Match backend model names where possible** — `SessionLogRow` in frontend should match `SessionLogRow` in backend to reduce cognitive overhead.
- **Update when the backend API response shape changes** — if an endpoint returns new fields, update the corresponding type here.
- **Do not generate from Supabase schema automatically** unless you control the generation and review the output — auto-generated types can expose internal tables.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `form-log` | [API](../../../../reference/api/frontend/lib/types/form-log/README.md) |
| `session-log` | [API](../../../../reference/api/frontend/lib/types/session-log/README.md) |
| `session-record` | [API](../../../../reference/api/frontend/lib/types/session-record/README.md) |
| `supabase` | [API](../../../../reference/api/frontend/lib/types/supabase/README.md) |
| `time` | [API](../../../../reference/api/frontend/lib/types/time/README.md) |
| `traffic` | [API](../../../../reference/api/frontend/lib/types/traffic/README.md) |
| `tutor-report-log` | [API](../../../../reference/api/frontend/lib/types/tutor-report-log/README.md) |

<details>
<summary>All exports (44)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `ActivityFormType` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/ActivityFormType.md) |
| `ActivityRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/ActivityRow.md) |
| `CleanedAndErroredOptions` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/CleanedAndErroredOptions.md) |
| `CleanedAndErroredResult` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/CleanedAndErroredResult.md) |
| `DoubleEntry` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/DoubleEntry.md) |
| `FormLogRowWithLate` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/FormLogRowWithLate.md) |
| `FrontDeskRecordRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-record/interfaces/FrontDeskRecordRow.md) |
| `getDoubleEntries` | functions | [docs](../../../../reference/api/frontend/lib/types/session-log/functions/getDoubleEntries.md) |
| `GradeBreakdown` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/GradeBreakdown.md) |
| `GradeEntry` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/GradeEntry.md) |
| `McfFormLogRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/form-log/interfaces/McfFormLogRow.md) |
| `McfRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/McfRow.md) |
| `MemoTutorReportRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/tutor-report-log/interfaces/MemoTutorReportRow.md) |
| `MenteeActivityRpcRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/MenteeActivityRpcRow.md) |
| `MenteeMonitoringClientProps` | interfaces | [docs](../../../../reference/api/frontend/lib/types/supabase/interfaces/MenteeMonitoringClientProps.md) |
| `MenteeRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/MenteeRow.md) |
| `PersonalClientProps` | interfaces | [docs](../../../../reference/api/frontend/lib/types/supabase/interfaces/PersonalClientProps.md) |
| `ProcessedTicket` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/ProcessedTicket.md) |
| `ProfileRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/ProfileRow.md) |
| `RecentFormSubmission` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/RecentFormSubmission.md) |
| `ScholarInRoom` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarInRoom.md) |
| `ScholarsInRoomOptions` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarsInRoomOptions.md) |
| `ScholarWithCompletedSession` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarWithCompletedSession.md) |
| `SemesterRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/SemesterRow.md) |
| `SESSION_TYPE_FRONT_DESK` | variables | [docs](../../../../reference/api/frontend/lib/types/session-log/variables/SESSION_TYPE_FRONT_DESK.md) |
| `SESSION_TYPE_STUDY` | variables | [docs](../../../../reference/api/frontend/lib/types/session-log/variables/SESSION_TYPE_STUDY.md) |
| `SessionLogConfig` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/SessionLogConfig.md) |
| `SessionLogRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-log/interfaces/SessionLogRow.md) |
| `SessionType` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/session-log/type-aliases/SessionType.md) |
| `StudySessionRecordRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-record/interfaces/StudySessionRecordRow.md) |
| `TeamLeaderFormStatsRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/form-log/type-aliases/TeamLeaderFormStatsRow.md) |
| `TicketErrorType` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/session-log/type-aliases/TicketErrorType.md) |
| `TrafficRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/TrafficRow.md) |
| `TrafficRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/traffic/interfaces/TrafficRow.md) |
| `TrafficSession` | interfaces | [docs](../../../../reference/api/frontend/lib/types/traffic/interfaces/TrafficSession.md) |
| `TutoringRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/TutoringRow.md) |
| `TutorReportLogRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/tutor-report-log/interfaces/TutorReportLogRow.md) |
| `WahfFormLogRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/form-log/interfaces/WahfFormLogRow.md) |
| `WahfRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/WahfRow.md) |
| `WeekBreakRpcRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/WeekBreakRpcRow.md) |
| `WeekEntryCount` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/traffic/type-aliases/WeekEntryCount.md) |
| `WeeklyMinutesByDay` | interfaces | [docs](../../../../reference/api/frontend/lib/types/session-record/interfaces/WeeklyMinutesByDay.md) |
| `WplFormLogRow` | interfaces | [docs](../../../../reference/api/frontend/lib/types/form-log/interfaces/WplFormLogRow.md) |
| `WplRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/types/supabase/type-aliases/WplRow.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
