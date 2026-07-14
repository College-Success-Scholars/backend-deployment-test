# frontend/lib

**Location:** [`frontend/lib/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib)  
**Docs:** `docs/dev/frontend/lib/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › lib

Children: [server/](server/README.md) · [client/](client/README.md) · [supabase/](supabase/README.md) · [auth/](auth/README.md) · [types/](types/README.md) · [format/](format/README.md) · [dev/](dev/README.md) · [dashboard/](dashboard/README.md)

---

## Purpose

All non-component TypeScript utilities for the frontend. Organized by execution environment (server vs client) and concern (API access, Supabase auth, types, formatting). The golden rule: **server-only modules are never bundled for the client**.

---

## Files (root-level)

| File | Source Link | Description |
|------|-------------|-------------|
| `api-log.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/api-log.ts) | Logging helpers for API requests/responses (`logApiRequest`, `logApiResponse`, `logApiError`, `buildBackendRequestUrl`) |
| `auth.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/auth.ts) | UI role helpers: `resolveUserRole`, `isDeveloperProfile`, `hasAssignedMentees`, `canAccessMenteeMonitoring`, `canAccessWeeklyMemo`, `formatUserRoleLabel` |
| `dashboard-breadcrumb.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/dashboard-breadcrumb.ts) | `resolveDashboardBreadcrumb()` — breadcrumb trail for dashboard routes |
| `nav-active.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/nav-active.ts) | Navigation state helpers — determines which nav item is active based on the current path |
| `utils.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/utils.ts) | General-purpose utilities: `cn()` Tailwind class merger |

---

## Subdirectories

| Directory | Docs | Environment | Description |
|-----------|------|-------------|-------------|
| `auth/` | [auth/README.md](auth/README.md) | Both | Auth redirect safety utilities (open-redirect prevention) |
| `server/` | [server/README.md](server/README.md) | Server only | Backend API client, server actions, data functions, query builders |
| `client/` | [client/README.md](client/README.md) | Client only | Browser-side backend API fetch wrapper |
| `supabase/` | [supabase/README.md](supabase/README.md) | Server + Client | Supabase client factories and auth helpers |
| `types/` | [types/README.md](types/README.md) | Both | Shared TypeScript type definitions |
| `format/` | [format/README.md](format/README.md) | Both | Display formatting utilities |
| `dev/` | [dev/README.md](dev/README.md) | Both | Developer helpers (`effective-uid.ts`) |
| `dashboard/` | [dashboard/README.md](dashboard/README.md) | Both | Dashboard activity-log presentation helpers |

---

## Environment Rules

| Module | `"use client"` OK? | Notes |
|--------|-------------------|-------|
| `lib/server/*` | No | Contains `import "server-only"` — will throw at runtime if imported on client |
| `lib/client/*` | Yes | Browser-only; uses `window`, `fetch` from browser context |
| `lib/supabase/server.ts` | No | `import "server-only"` |
| `lib/supabase/client.ts` | Yes | Uses `createBrowserClient` |
| `lib/types/*` | Yes | Pure types, safe everywhere |
| `lib/format/*` | Yes | Pure functions, safe everywhere |
| `lib/utils.ts` | Yes | Pure utilities |
| `lib/api-log.ts` | Yes (carefully) | Pure functions; server usage logs to console, client usage is a no-op |

---

## Standards

- **`import "server-only"` in server modules** — any module in `lib/server/` and `lib/supabase/server.ts` must have this as its first import.
- **No Supabase domain queries outside `lib/server/`** — Supabase client from `lib/supabase/` is for auth only (session, user identity). Domain data comes from the backend via `lib/server/api-client.ts`.
- **`lib/utils.ts` is for generic utilities only** — `cn()`, type guards, etc. Domain logic goes in subdirectories.
- **Types in `lib/types/`** — do not scatter `.d.ts` or interface declarations across lib files.
- **Formatting in `lib/format/`** — display formatting (dates, labels) belongs there, not in components.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `api-log` | [API](../../../reference/api/frontend/lib/api-log/README.md) |
| `auth` | [API](../../../reference/api/frontend/lib/auth/README.md) |
| `dashboard-breadcrumb` | [API](../../../reference/api/frontend/lib/dashboard-breadcrumb/README.md) |
| `nav-active` | [API](../../../reference/api/frontend/lib/nav-active/README.md) |
| `utils` | [API](../../../reference/api/frontend/lib/utils/README.md) |

<details>
<summary>All exports (177)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `ActivityFormType` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/ActivityFormType.md) |
| `ActivityRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/ActivityRow.md) |
| `backendFetch` | functions | [docs](../../../reference/api/frontend/lib/client/api-client/functions/backendFetch.md) |
| `backendFetch` | functions | [docs](../../../reference/api/frontend/lib/server/api-client/functions/backendFetch.md) |
| `backendGet` | functions | [docs](../../../reference/api/frontend/lib/client/api-client/functions/backendGet.md) |
| `backendGet` | functions | [docs](../../../reference/api/frontend/lib/server/api-client/functions/backendGet.md) |
| `backendPatch` | functions | [docs](../../../reference/api/frontend/lib/client/api-client/functions/backendPatch.md) |
| `backendPatch` | functions | [docs](../../../reference/api/frontend/lib/server/api-client/functions/backendPatch.md) |
| `backendPost` | functions | [docs](../../../reference/api/frontend/lib/client/api-client/functions/backendPost.md) |
| `backendPost` | functions | [docs](../../../reference/api/frontend/lib/server/api-client/functions/backendPost.md) |
| `buildActivitySummary` | functions | [docs](../../../reference/api/frontend/lib/dashboard/activity-log-dictionary/functions/buildActivitySummary.md) |
| `buildBackendRequestUrl` | functions | [docs](../../../reference/api/frontend/lib/api-log/functions/buildBackendRequestUrl.md) |
| `canAccessMenteeMonitoring` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/canAccessMenteeMonitoring.md) |
| `canAccessWeeklyMemo` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/canAccessWeeklyMemo.md) |
| `CleanedAndErroredOptions` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/CleanedAndErroredOptions.md) |
| `CleanedAndErroredResult` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/CleanedAndErroredResult.md) |
| `cn` | functions | [docs](../../../reference/api/frontend/lib/utils/functions/cn.md) |
| `createClient` | functions | [docs](../../../reference/api/frontend/lib/supabase/client/functions/createClient.md) |
| `createClient` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/createClient.md) |
| `createScholarProfile` | functions | [docs](../../../reference/api/frontend/lib/server/actions/functions/createScholarProfile.md) |
| `CurrentUserResponse` | type-aliases | [docs](../../../reference/api/frontend/lib/server/queries/type-aliases/CurrentUserResponse.md) |
| `DashboardBreadcrumbItem` | type-aliases | [docs](../../../reference/api/frontend/lib/dashboard-breadcrumb/type-aliases/DashboardBreadcrumbItem.md) |
| `DevTestProfileListItem` | type-aliases | [docs](../../../reference/api/frontend/lib/server/queries/type-aliases/DevTestProfileListItem.md) |
| `DoubleEntry` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/DoubleEntry.md) |
| `effectiveScholarId` | variables | [docs](../../../reference/api/frontend/lib/dev/effective-uid/variables/effectiveScholarId.md) |
| `fetchAllUsersForMemo` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchAllUsersForMemo.md) |
| `fetchAllUserUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchAllUserUids.md) |
| `fetchEligibleScholarUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchEligibleScholarUids.md) |
| `fetchFrontDeskLogs` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchFrontDeskLogs.md) |
| `fetchRequiredHoursByUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchRequiredHoursByUids.md) |
| `fetchScholarNamesByUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchScholarNamesByUids.md) |
| `fetchScholarUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchScholarUids.md) |
| `fetchStudySessionLogs` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchStudySessionLogs.md) |
| `fetchTeamLeaders` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/fetchTeamLeaders.md) |
| `formatMeetingTime12Hour` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatMeetingTime12Hour.md) |
| `formatProjectItem` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatProjectItem.md) |
| `formatUserRoleLabel` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/formatUserRoleLabel.md) |
| `formatValue` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatValue.md) |
| `FormLogRowWithLate` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/FormLogRowWithLate.md) |
| `formTone` | variables | [docs](../../../reference/api/frontend/lib/dashboard/activity-log-dictionary/variables/formTone.md) |
| `FrontDeskRecordRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-record/interfaces/FrontDeskRecordRow.md) |
| `FrontDeskRecordWithName` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/FrontDeskRecordWithName.md) |
| `getActiveSemester` | variables | [docs](../../../reference/api/frontend/lib/server/queries/variables/getActiveSemester.md) |
| `getActiveSubUrl` | functions | [docs](../../../reference/api/frontend/lib/nav-active/functions/getActiveSubUrl.md) |
| `getCurrentProfile` | variables | [docs](../../../reference/api/frontend/lib/server/queries/variables/getCurrentProfile.md) |
| `getCurrentUser` | variables | [docs](../../../reference/api/frontend/lib/server/queries/variables/getCurrentUser.md) |
| `getCurrentUser` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/getCurrentUser.md) |
| `getCurrentUserWithProfile` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/getCurrentUserWithProfile.md) |
| `getDeveloperUser` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/getDeveloperUser.md) |
| `getDoubleEntries` | functions | [docs](../../../reference/api/frontend/lib/types/session-log/functions/getDoubleEntries.md) |
| `getEffectiveScholarId` | functions | [docs](../../../reference/api/frontend/lib/dev/effective-uid/functions/getEffectiveScholarId.md) |
| `getFrontDeskCleanedAndErrored` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskCleanedAndErrored.md) |
| `getFrontDeskCompletedSessions` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskCompletedSessions.md) |
| `getFrontDeskRecord` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecord.md) |
| `getFrontDeskRecordsByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsByUid.md) |
| `getFrontDeskRecordsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsForWeek.md) |
| `getFrontDeskRecordsForWeekAll` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsForWeekAll.md) |
| `getFrontDeskScholarsInRoom` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getFrontDeskScholarsInRoom.md) |
| `getMcfFormLogsByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUid.md) |
| `getMcfFormLogsByUidAndWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidAndWeek.md) |
| `getMcfFormLogsByUidAndWeekWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidAndWeekWithLate.md) |
| `getMcfFormLogsByUidWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidWithLate.md) |
| `getMcfFormLogsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsForWeek.md) |
| `getMcfFormLogsForWeekWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsForWeekWithLate.md) |
| `getMcfWplDeadlineForWeek` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/getMcfWplDeadlineForWeek.md) |
| `getMyMentees` | variables | [docs](../../../reference/api/frontend/lib/server/queries/variables/getMyMentees.md) |
| `getObjectValueByKeyPattern` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/getObjectValueByKeyPattern.md) |
| `getRecentFormSubmissions` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getRecentFormSubmissions.md) |
| `getSafeInternalPath` | functions | [docs](../../../reference/api/frontend/lib/auth/safe-next-path/functions/getSafeInternalPath.md) |
| `getStudySessionCleanedAndErrored` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionCleanedAndErrored.md) |
| `getStudySessionCompletedSessions` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionCompletedSessions.md) |
| `getStudySessionRecord` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecord.md) |
| `getStudySessionRecordsByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsByUid.md) |
| `getStudySessionRecordsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsForWeek.md) |
| `getStudySessionRecordsForWeekAll` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsForWeekAll.md) |
| `getStudySessionScholarsInRoom` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getStudySessionScholarsInRoom.md) |
| `getSupabasePublicKey` | functions | [docs](../../../reference/api/frontend/lib/supabase/public-key/functions/getSupabasePublicKey.md) |
| `getTeamLeaderFormStatsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getTeamLeaderFormStatsForWeek.md) |
| `getTeamLeaderOrAboveUser` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/getTeamLeaderOrAboveUser.md) |
| `getTotalMinutesForMenteeWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getTotalMinutesForMenteeWeek.md) |
| `getTrafficEntryCountForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getTrafficEntryCountForWeek.md) |
| `getTrafficEntryCountsForWeeks` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getTrafficEntryCountsForWeeks.md) |
| `getTrafficSessionsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getTrafficSessionsForWeek.md) |
| `getUserByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getUserByUid.md) |
| `getWhafDeadlineForWeek` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/getWhafDeadlineForWeek.md) |
| `getWhafFormLogsByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsByUid.md) |
| `getWhafFormLogsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsForWeek.md) |
| `getWhafFormLogsForWeekWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsForWeekWithLate.md) |
| `getWplFormLogsByUid` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUid.md) |
| `getWplFormLogsByUidAndWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidAndWeek.md) |
| `getWplFormLogsByUidAndWeekWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidAndWeekWithLate.md) |
| `getWplFormLogsByUidWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidWithLate.md) |
| `getWplFormLogsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsForWeek.md) |
| `getWplFormLogsForWeekWithLate` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsForWeekWithLate.md) |
| `GradeBreakdown` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/GradeBreakdown.md) |
| `GradeEntry` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/GradeEntry.md) |
| `gradeScoreClass` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/gradeScoreClass.md) |
| `hasAssignedMentees` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/hasAssignedMentees.md) |
| `isDeveloperProfile` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/isDeveloperProfile.md) |
| `isEmptyValue` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/isEmptyValue.md) |
| `isLinkActive` | functions | [docs](../../../reference/api/frontend/lib/nav-active/functions/isLinkActive.md) |
| `isMcfLate` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isMcfLate.md) |
| `isMcfLateForWeek` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isMcfLateForWeek.md) |
| `isNavItemActive` | functions | [docs](../../../reference/api/frontend/lib/nav-active/functions/isNavItemActive.md) |
| `isNavSubItemActive` | functions | [docs](../../../reference/api/frontend/lib/nav-active/functions/isNavSubItemActive.md) |
| `isWhafLate` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isWhafLate.md) |
| `isWhafLateForWeek` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isWhafLateForWeek.md) |
| `isWplLate` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isWplLate.md) |
| `isWplLateForWeek` | functions | [docs](../../../reference/api/frontend/lib/format/form-deadlines/functions/isWplLateForWeek.md) |
| `logApiError` | functions | [docs](../../../reference/api/frontend/lib/api-log/functions/logApiError.md) |
| `logApiRequest` | functions | [docs](../../../reference/api/frontend/lib/api-log/functions/logApiRequest.md) |
| `logApiResponse` | functions | [docs](../../../reference/api/frontend/lib/api-log/functions/logApiResponse.md) |
| `McfFormLogRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/form-log/interfaces/McfFormLogRow.md) |
| `McfFormLogRowWithLate` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/McfFormLogRowWithLate.md) |
| `McfRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/McfRow.md) |
| `MemoTutorReportRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/tutor-report-log/interfaces/MemoTutorReportRow.md) |
| `MemoUserRow` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/MemoUserRow.md) |
| `MenteeActivityRpcRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/MenteeActivityRpcRow.md) |
| `MenteeMonitoringClientProps` | interfaces | [docs](../../../reference/api/frontend/lib/types/supabase/interfaces/MenteeMonitoringClientProps.md) |
| `MenteeRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/MenteeRow.md) |
| `missedFieldDisplay` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/missedFieldDisplay.md) |
| `normalizePath` | functions | [docs](../../../reference/api/frontend/lib/nav-active/functions/normalizePath.md) |
| `parseNumericGrade` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/parseNumericGrade.md) |
| `parseWplProjectRows` | functions | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/functions/parseWplProjectRows.md) |
| `PersonalClientProps` | interfaces | [docs](../../../reference/api/frontend/lib/types/supabase/interfaces/PersonalClientProps.md) |
| `ProcessedTicket` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/ProcessedTicket.md) |
| `ProfileRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/ProfileRow.md) |
| `ProfilesRow` | type-aliases | [docs](../../../reference/api/frontend/lib/supabase/server/type-aliases/ProfilesRow.md) |
| `RecentFormSubmission` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/RecentFormSubmission.md) |
| `RecordKind` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/RecordKind.md) |
| `requireDeveloper` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/requireDeveloper.md) |
| `requireTeamLeaderOrAbove` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/requireTeamLeaderOrAbove.md) |
| `requireUser` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/requireUser.md) |
| `requireUserWithProfile` | functions | [docs](../../../reference/api/frontend/lib/supabase/server/functions/requireUserWithProfile.md) |
| `resolveDashboardBreadcrumb` | functions | [docs](../../../reference/api/frontend/lib/dashboard-breadcrumb/functions/resolveDashboardBreadcrumb.md) |
| `resolveUserRole` | functions | [docs](../../../reference/api/frontend/lib/auth/functions/resolveUserRole.md) |
| `scholarIdFromProfile` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/scholarIdFromProfile.md) |
| `ScholarInRoom` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarInRoom.md) |
| `ScholarsInRoomOptions` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarsInRoomOptions.md) |
| `scholarUidFromProfile` | variables | [docs](../../../reference/api/frontend/lib/server/data/variables/scholarUidFromProfile.md) |
| `ScholarWithCompletedSession` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/ScholarWithCompletedSession.md) |
| `SemesterRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/SemesterRow.md) |
| `SESSION_TYPE_FRONT_DESK` | variables | [docs](../../../reference/api/frontend/lib/types/session-log/variables/SESSION_TYPE_FRONT_DESK.md) |
| `SESSION_TYPE_STUDY` | variables | [docs](../../../reference/api/frontend/lib/types/session-log/variables/SESSION_TYPE_STUDY.md) |
| `SessionLogConfig` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/SessionLogConfig.md) |
| `SessionLogRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-log/interfaces/SessionLogRow.md) |
| `SessionType` | type-aliases | [docs](../../../reference/api/frontend/lib/types/session-log/type-aliases/SessionType.md) |
| `setActiveTestProfile` | functions | [docs](../../../reference/api/frontend/lib/server/dev-profile-actions/functions/setActiveTestProfile.md) |
| `StudySessionRecordRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-record/interfaces/StudySessionRecordRow.md) |
| `StudySessionRecordWithName` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/StudySessionRecordWithName.md) |
| `syncFrontDeskRecordsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/syncFrontDeskRecordsForWeek.md) |
| `syncFrontDeskRecordsForWeekAllUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/syncFrontDeskRecordsForWeekAllUids.md) |
| `syncStudySessionRecordsForWeek` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/syncStudySessionRecordsForWeek.md) |
| `syncStudySessionRecordsForWeekAllUids` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/syncStudySessionRecordsForWeekAllUids.md) |
| `TeamLeaderFormStatsRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/form-log/type-aliases/TeamLeaderFormStatsRow.md) |
| `TeamLeaderRow` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/TeamLeaderRow.md) |
| `TicketErrorType` | type-aliases | [docs](../../../reference/api/frontend/lib/types/session-log/type-aliases/TicketErrorType.md) |
| `TrafficRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/TrafficRow.md) |
| `TrafficRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/traffic/interfaces/TrafficRow.md) |
| `TrafficSession` | interfaces | [docs](../../../reference/api/frontend/lib/types/traffic/interfaces/TrafficSession.md) |
| `TutoringRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/TutoringRow.md) |
| `TutorReportLogRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/tutor-report-log/interfaces/TutorReportLogRow.md) |
| `updateBasicInfo` | functions | [docs](../../../reference/api/frontend/lib/server/actions/functions/updateBasicInfo.md) |
| `UpdateExcusePayload` | interfaces | [docs](../../../reference/api/frontend/lib/server/data/interfaces/UpdateExcusePayload.md) |
| `updateRecordExcuse` | functions | [docs](../../../reference/api/frontend/lib/server/data/functions/updateRecordExcuse.md) |
| `updateSession` | functions | [docs](../../../reference/api/frontend/lib/supabase/middleware/functions/updateSession.md) |
| `UserRole` | type-aliases | [docs](../../../reference/api/frontend/lib/auth/type-aliases/UserRole.md) |
| `WahfFormLogRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/form-log/interfaces/WahfFormLogRow.md) |
| `WahfFormLogRowWithLate` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/WahfFormLogRowWithLate.md) |
| `WahfRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/WahfRow.md) |
| `WeekBreakRpcRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/WeekBreakRpcRow.md) |
| `WeekEntryCount` | type-aliases | [docs](../../../reference/api/frontend/lib/types/traffic/type-aliases/WeekEntryCount.md) |
| `WeeklyMinutesByDay` | interfaces | [docs](../../../reference/api/frontend/lib/types/session-record/interfaces/WeeklyMinutesByDay.md) |
| `WplFormLogRow` | interfaces | [docs](../../../reference/api/frontend/lib/types/form-log/interfaces/WplFormLogRow.md) |
| `WplFormLogRowWithLate` | type-aliases | [docs](../../../reference/api/frontend/lib/server/data/type-aliases/WplFormLogRowWithLate.md) |
| `WplProjectRow` | type-aliases | [docs](../../../reference/api/frontend/lib/format/form-view-helpers/type-aliases/WplProjectRow.md) |
| `WplRow` | type-aliases | [docs](../../../reference/api/frontend/lib/types/supabase/type-aliases/WplRow.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
