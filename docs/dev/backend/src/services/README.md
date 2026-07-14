# services/

**Location:** [`backend/src/services/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services)  
**Docs:** `docs/dev/backend/src/services/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › services

---

## Purpose

The only layer that touches Supabase. Services contain all database queries, data transformation, and business logic. They are called by controllers and return typed domain objects. They never import `express` or touch `req`/`res`.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `supabase.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/supabase.service.ts) | Supabase client factory using `AsyncLocalStorage` for per-request JWT binding; exports `getSupabaseClient()`, `getSupabaseAuthClient()`, `runWithToken()` |
| `dev-profile.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/dev-profile.service.ts) | Developer test profile lookup and effective identity resolution: `listTestProfiles()`, `getTestProfileById()`, `resolveEffectiveProfile()` |
| `user.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/user.service.ts) | User/profile queries: scholar names, required hours, eligible scholars, all UIDs, memo users, team leaders, scholar UIDs, single user lookup |
| `session-log.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/session-log.service.ts) | Raw session log queries: fetch, cleaned/errored pairs, in-room open sessions, completed sessions — for both front-desk and study session types |
| `session-record.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/session-record.service.ts) | Weekly aggregated record queries and sync operations: get by UID/week, sync for week (single or all UIDs), update excuse |
| `form-log.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/form-log.service.ts) | MCF/WHAF/WPL form log queries: individual lookups, batch by UIDs, team leader stat aggregation, recent submissions |
| `memo.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/memo.service.ts) | Memo sync operations: `syncMemo(weekNum, mode)` with "light" and "heavy" modes |
| `memo-page.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/memo-page.service.ts) | Memo page data assembly: `getMemoPageData(weekNum)` returns all data needed to render the weekly memo |
| `traffic.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/traffic.service.ts) | Traffic entry counting: sessions for week, entry count for week, batch counts for multiple weeks |
| `time.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/time.service.ts) | Campus week utilities re-exported from shared: `dateToCampusWeek`, `campusWeekToDateRange` |
| `mentee.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/mentee.service.ts) | Mentee relationship queries: `getMyMentees(userId)` via Supabase RPC |
| `daily-scholar-activity.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/daily-scholar-activity.service.ts) | Daily activity queries: `getTotalMinutesForMenteeWeek({ menteeUid, weekNum, logSource })` |
| `tutor-report-log.service.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/services/tutor-report-log.service.ts) | Tutor report log queries: by week, by UID, by UID+week, attendance check |

---

## The Supabase Client Pattern

Every service that queries Supabase calls `getSupabaseClient()` at query time (not at module load). This creates a per-request client with the user's JWT set as the `Authorization` header, so **Supabase RLS is automatically applied**.

```typescript
// Correct — client is created per-call, JWT from AsyncLocalStorage
const supabase = getSupabaseClient();
const { data } = await supabase.from("profiles").select("*");

// Wrong — never create the client at module level or cache it across requests
const supabase = getSupabaseClient(); // ← do not do this at module top-level
```

The JWT reaches `getSupabaseClient()` via:
1. `auth.controller.ts` calls `runWithToken(token, () => next())` after verifying auth.
2. `runWithToken` stores the token in `AsyncLocalStorage`.
3. `getSupabaseClient()` reads the token from `AsyncLocalStorage`.

---

## Standards

- **No `req`/`res`/`next`** — services are pure TypeScript functions; they know nothing about HTTP.
- **Always call `getSupabaseClient()` inside the function body**, never at module scope.
- **Return typed values** — use the model types from `models/`.
- **Throw on fatal errors** — services throw `Error` on unexpected failures; controllers catch and convert to HTTP responses.
- **One service file per domain** — aligns with controllers and models.
- **`supabase.service.ts` is not a domain service** — it is infrastructure. Do not add domain logic there.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `daily-scholar-activity.service` | [API](../../../../reference/api/backend/src/services/daily-scholar-activity.service/README.md) |
| `dev-profile.service` | [API](../../../../reference/api/backend/src/services/dev-profile.service/README.md) |
| `form-log.service` | [API](../../../../reference/api/backend/src/services/form-log.service/README.md) |
| `memo-page.service` | [API](../../../../reference/api/backend/src/services/memo-page.service/README.md) |
| `memo.service` | [API](../../../../reference/api/backend/src/services/memo.service/README.md) |
| `mentee.service` | [API](../../../../reference/api/backend/src/services/mentee.service/README.md) |
| `session-log.service` | [API](../../../../reference/api/backend/src/services/session-log.service/README.md) |
| `session-record.service` | [API](../../../../reference/api/backend/src/services/session-record.service/README.md) |
| `supabase.service` | [API](../../../../reference/api/backend/src/services/supabase.service/README.md) |
| `time.service` | [API](../../../../reference/api/backend/src/services/time.service/README.md) |
| `traffic.service` | [API](../../../../reference/api/backend/src/services/traffic.service/README.md) |
| `tutor-report-log.service` | [API](../../../../reference/api/backend/src/services/tutor-report-log.service/README.md) |
| `user.service` | [API](../../../../reference/api/backend/src/services/user.service/README.md) |

<details>
<summary>All exports (134)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `addEasternCalendarDays` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/addEasternCalendarDays.md) |
| `buildScholarProfileInsertRow` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/buildScholarProfileInsertRow.md) |
| `buildTeamLeaderFormStatsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/buildTeamLeaderFormStatsForWeek.md) |
| `CAMPUS_WEEK` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/CAMPUS_WEEK.md) |
| `CampusCalendar` | interfaces | [docs](../../../../reference/api/backend/src/services/time.service/interfaces/CampusCalendar.md) |
| `CampusDay` | type-aliases | [docs](../../../../reference/api/backend/src/services/time.service/type-aliases/CampusDay.md) |
| `CampusWeekDateRange` | type-aliases | [docs](../../../../reference/api/backend/src/services/time.service/type-aliases/CampusWeekDateRange.md) |
| `CampusWeekRange` | type-aliases | [docs](../../../../reference/api/backend/src/services/time.service/type-aliases/CampusWeekRange.md) |
| `campusWeekToDateRange` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/campusWeekToDateRange.md) |
| `CleanedAndErroredOptions` | interfaces | [docs](../../../../reference/api/backend/src/services/session-log.service/interfaces/CleanedAndErroredOptions.md) |
| `computeWeeklyMinutesByUid` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/computeWeeklyMinutesByUid.md) |
| `createCampusCalendar` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/createCampusCalendar.md) |
| `createScholarProfile` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/createScholarProfile.md) |
| `CreateScholarProfileInput` | type-aliases | [docs](../../../../reference/api/backend/src/services/user.service/type-aliases/CreateScholarProfileInput.md) |
| `dateToCampusWeek` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/dateToCampusWeek.md) |
| `didScholarAttendTutoring` | functions | [docs](../../../../reference/api/backend/src/services/tutor-report-log.service/functions/didScholarAttendTutoring.md) |
| `EASTERN_TIMEZONE` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/EASTERN_TIMEZONE.md) |
| `EffectiveProfileResult` | type-aliases | [docs](../../../../reference/api/backend/src/services/dev-profile.service/type-aliases/EffectiveProfileResult.md) |
| `enrichCleanedAndErroredWithNames` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/enrichCleanedAndErroredWithNames.md) |
| `enrichWithScholarNames` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/enrichWithScholarNames.md) |
| `FALL_SEMESTER_FIRST_DAY` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/FALL_SEMESTER_FIRST_DAY.md) |
| `fetchAllUsersForMemo` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchAllUsersForMemo.md) |
| `fetchAllUserUids` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchAllUserUids.md) |
| `fetchEligibleScholarUids` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchEligibleScholarUids.md) |
| `fetchFrontDeskLogs` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/fetchFrontDeskLogs.md) |
| `fetchRequiredHoursByUids` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchRequiredHoursByUids.md) |
| `fetchScholarNamesByUids` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchScholarNamesByUids.md) |
| `fetchScholarUids` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchScholarUids.md) |
| `fetchStudySessionLogs` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/fetchStudySessionLogs.md) |
| `fetchTeamLeaders` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/fetchTeamLeaders.md) |
| `fetchTrafficLogs` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/fetchTrafficLogs.md) |
| `findTeamLeaderUidByFuzzyName` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/findTeamLeaderUidByFuzzyName.md) |
| `formatDate` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/formatDate.md) |
| `formatDuration` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/formatDuration.md) |
| `formatEntryDate` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/formatEntryDate.md) |
| `formatMinutesToHoursAndMinutes` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/formatMinutesToHoursAndMinutes.md) |
| `getCampusWeekForIsoWeek` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getCampusWeekForIsoWeek.md) |
| `getCleanedAndErroredTickets` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getCleanedAndErroredTickets.md) |
| `getDailyActivityByUids` | functions | [docs](../../../../reference/api/backend/src/services/daily-scholar-activity.service/functions/getDailyActivityByUids.md) |
| `getDoubleEntries` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getDoubleEntries.md) |
| `getDurationMs` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getDurationMs.md) |
| `getEasternDateParts` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getEasternDateParts.md) |
| `getEasternDayOfWeek` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getEasternDayOfWeek.md) |
| `getEntryCountByWeek` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/getEntryCountByWeek.md) |
| `getFrontDeskCleanedAndErrored` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getFrontDeskCleanedAndErrored.md) |
| `getFrontDeskCompletedSessions` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getFrontDeskCompletedSessions.md) |
| `getFrontDeskRecord` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getFrontDeskRecord.md) |
| `getFrontDeskRecordsByUid` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getFrontDeskRecordsByUid.md) |
| `getFrontDeskRecordsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getFrontDeskRecordsForWeek.md) |
| `getFrontDeskRecordsForWeekAll` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getFrontDeskRecordsForWeekAll.md) |
| `getFrontDeskScholarsInRoom` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getFrontDeskScholarsInRoom.md) |
| `getMcfFormLogById` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogById.md) |
| `getMcfFormLogsByUid` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsByUid.md) |
| `getMcfFormLogsByUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsByUidAndWeek.md) |
| `getMcfFormLogsByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsByUidAndWeekWithLate.md) |
| `getMcfFormLogsByUids` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsByUids.md) |
| `getMcfFormLogsByUidWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsByUidWithLate.md) |
| `getMcfFormLogsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsForWeek.md) |
| `getMcfFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfFormLogsForWeekWithLate.md) |
| `getMcfWplDeadlineForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getMcfWplDeadlineForWeek.md) |
| `getMemoPageData` | functions | [docs](../../../../reference/api/backend/src/services/memo-page.service/functions/getMemoPageData.md) |
| `getMenteesByMentorKey` | functions | [docs](../../../../reference/api/backend/src/services/mentee.service/functions/getMenteesByMentorKey.md) |
| `getMyMentees` | functions | [docs](../../../../reference/api/backend/src/services/mentee.service/functions/getMyMentees.md) |
| `getRecentFormSubmissions` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getRecentFormSubmissions.md) |
| `getScholarsCurrentlyInRoom` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getScholarsCurrentlyInRoom.md) |
| `getScholarsWithValidEntryExit` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getScholarsWithValidEntryExit.md) |
| `getStartOfDayEastern` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getStartOfDayEastern.md) |
| `getStudySessionCleanedAndErrored` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getStudySessionCleanedAndErrored.md) |
| `getStudySessionCompletedSessions` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getStudySessionCompletedSessions.md) |
| `getStudySessionRecord` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getStudySessionRecord.md) |
| `getStudySessionRecordsByUid` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getStudySessionRecordsByUid.md) |
| `getStudySessionRecordsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getStudySessionRecordsForWeek.md) |
| `getStudySessionRecordsForWeekAll` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/getStudySessionRecordsForWeekAll.md) |
| `getStudySessionScholarsInRoom` | functions | [docs](../../../../reference/api/backend/src/services/session-log.service/functions/getStudySessionScholarsInRoom.md) |
| `getSupabaseAuthClient` | functions | [docs](../../../../reference/api/backend/src/services/supabase.service/functions/getSupabaseAuthClient.md) |
| `getSupabaseClient` | functions | [docs](../../../../reference/api/backend/src/services/supabase.service/functions/getSupabaseClient.md) |
| `getTestProfileById` | functions | [docs](../../../../reference/api/backend/src/services/dev-profile.service/functions/getTestProfileById.md) |
| `getTotalMinutesForMenteeWeek` | functions | [docs](../../../../reference/api/backend/src/services/daily-scholar-activity.service/functions/getTotalMinutesForMenteeWeek.md) |
| `getTrafficEntryCountForWeek` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/getTrafficEntryCountForWeek.md) |
| `getTrafficEntryCountsForWeeks` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/getTrafficEntryCountsForWeeks.md) |
| `getTrafficSessions` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/getTrafficSessions.md) |
| `getTrafficSessionsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/traffic.service/functions/getTrafficSessionsForWeek.md) |
| `getTutorReportLogsByUid` | functions | [docs](../../../../reference/api/backend/src/services/tutor-report-log.service/functions/getTutorReportLogsByUid.md) |
| `getTutorReportLogsByUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/services/tutor-report-log.service/functions/getTutorReportLogsByUidAndWeek.md) |
| `getTutorReportLogsByUids` | functions | [docs](../../../../reference/api/backend/src/services/tutor-report-log.service/functions/getTutorReportLogsByUids.md) |
| `getTutorReportLogsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/tutor-report-log.service/functions/getTutorReportLogsForWeek.md) |
| `getUserByUid` | functions | [docs](../../../../reference/api/backend/src/services/user.service/functions/getUserByUid.md) |
| `getWeekFetchEnd` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/getWeekFetchEnd.md) |
| `getWeeklyMemo` | functions | [docs](../../../../reference/api/backend/src/services/memo.service/functions/getWeeklyMemo.md) |
| `getWhafDeadlineForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWhafDeadlineForWeek.md) |
| `getWhafFormLogsByUid` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWhafFormLogsByUid.md) |
| `getWhafFormLogsByUids` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWhafFormLogsByUids.md) |
| `getWhafFormLogsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWhafFormLogsForWeek.md) |
| `getWhafFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWhafFormLogsForWeekWithLate.md) |
| `getWplFormLogById` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogById.md) |
| `getWplFormLogsByUid` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsByUid.md) |
| `getWplFormLogsByUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsByUidAndWeek.md) |
| `getWplFormLogsByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsByUidAndWeekWithLate.md) |
| `getWplFormLogsByUids` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsByUids.md) |
| `getWplFormLogsByUidWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsByUidWithLate.md) |
| `getWplFormLogsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsForWeek.md) |
| `getWplFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/getWplFormLogsForWeekWithLate.md) |
| `isMcfLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isMcfLate.md) |
| `isMcfLateForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isMcfLateForWeek.md) |
| `isWhafLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isWhafLate.md) |
| `isWhafLateForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isWhafLateForWeek.md) |
| `isWplLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isWplLate.md) |
| `isWplLateForWeek` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/isWplLateForWeek.md) |
| `listTestProfiles` | functions | [docs](../../../../reference/api/backend/src/services/dev-profile.service/functions/listTestProfiles.md) |
| `markMcfFormLogsLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/markMcfFormLogsLate.md) |
| `markWhafFormLogsLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/markWhafFormLogsLate.md) |
| `markWplFormLogsLate` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/markWplFormLogsLate.md) |
| `nameTokens` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/nameTokens.md) |
| `nameVariants` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/nameVariants.md) |
| `normalizeName` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/normalizeName.md) |
| `ONE_DAY_MS` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/ONE_DAY_MS.md) |
| `parseEasternDate` | functions | [docs](../../../../reference/api/backend/src/services/time.service/functions/parseEasternDate.md) |
| `resolveEffectiveProfile` | functions | [docs](../../../../reference/api/backend/src/services/dev-profile.service/functions/resolveEffectiveProfile.md) |
| `runWithToken` | functions | [docs](../../../../reference/api/backend/src/services/supabase.service/functions/runWithToken.md) |
| `ScholarsInRoomOptions` | interfaces | [docs](../../../../reference/api/backend/src/services/session-log.service/interfaces/ScholarsInRoomOptions.md) |
| `scholarUidFromProfile` | functions | [docs](../../../../reference/api/backend/src/services/form-log.service/functions/scholarUidFromProfile.md) |
| `syncFrontDeskRecordsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/syncFrontDeskRecordsForWeek.md) |
| `syncFrontDeskRecordsForWeekAllUids` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/syncFrontDeskRecordsForWeekAllUids.md) |
| `syncMemo` | functions | [docs](../../../../reference/api/backend/src/services/memo.service/functions/syncMemo.md) |
| `syncStudySessionRecordsForWeek` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/syncStudySessionRecordsForWeek.md) |
| `syncStudySessionRecordsForWeekAllUids` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/syncStudySessionRecordsForWeekAllUids.md) |
| `triggerRefreshStats` | functions | [docs](../../../../reference/api/backend/src/services/memo.service/functions/triggerRefreshStats.md) |
| `updateRecordExcuse` | functions | [docs](../../../../reference/api/backend/src/services/session-record.service/functions/updateRecordExcuse.md) |
| `WeekDateRange` | type-aliases | [docs](../../../../reference/api/backend/src/services/time.service/type-aliases/WeekDateRange.md) |
| `WEEKS_IGNORE_FORMS` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/WEEKS_IGNORE_FORMS.md) |
| `WEEKS_IGNORE_SESSIONS` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/WEEKS_IGNORE_SESSIONS.md) |
| `WINTER_BREAK_CAMPUS_WEEK_NUMBER` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/WINTER_BREAK_CAMPUS_WEEK_NUMBER.md) |
| `WINTER_BREAK_FIRST_DAY` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/WINTER_BREAK_FIRST_DAY.md) |
| `WINTER_BREAK_LAST_DAY` | variables | [docs](../../../../reference/api/backend/src/services/time.service/variables/WINTER_BREAK_LAST_DAY.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
