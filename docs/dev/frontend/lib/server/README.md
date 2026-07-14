# lib/server

**Location:** [`frontend/lib/server/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server)  
**Docs:** `docs/dev/frontend/lib/server/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › server

---

## Purpose

Server-only modules for the frontend. All files here include `import "server-only"` and will throw at build time if accidentally imported from a client component. This directory is the primary data access layer for Next.js Server Components.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `api-client.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server/api-client.ts) | Backend HTTP client — reads JWT from auth cookies, calls backend `/api/*` endpoints, unwraps `{ data }` responses. Exports: `backendFetch`, `backendGet`, `backendPost`, `backendPatch` |
| `data.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server/data.ts) | Typed wrapper functions for every backend endpoint — the preferred way for pages to fetch data |
| `actions.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server/actions.ts) | Next.js Server Actions for form submissions and mutations |
| `queries.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server/queries.ts) | Query parameter builders / URL helpers for backend endpoints |
| `dev-profile-actions.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/server/dev-profile-actions.ts) | Server Action `setActiveTestProfile()` — sets/clears dev test profile cookie (developer only) |

---

## How `api-client.ts` Works

1. Reads the Supabase auth cookie from the request using `next/headers`.
2. Decodes the base64-encoded session JSON to extract `access_token`.
3. Attaches the token as `Authorization: Bearer <token>` on the fetch request.
4. Forwards the dev test-profile cookie as `x-dev-active-profile` when set (developer acting as a test persona).
5. Calls the backend URL (from `BACKEND_URL` env var or auto-detected from `VERCEL_URL`).
6. Unwraps `{ data: ... }` from the response automatically.

---

## Preferred Import Pattern for Pages

```typescript
// In a Server Component page:
import { getSessionRecords, getMemoPageData } from "@/lib/server/data";

export default async function Page() {
  const records = await getSessionRecords(weekNum, uid);
  return <MyComponent data={records} />;
}
```

Do not call `backendGet` / `backendFetch` directly in pages — add a typed wrapper to `data.ts` instead.

---

## Standards

- **`import "server-only"` is required** in every file in this directory — verify it's the first import.
- **Add new endpoints to `data.ts`** — when a new backend endpoint is created, add a corresponding typed function in `data.ts` rather than calling `backendGet` directly from pages.
- **No React imports** — this is plain TypeScript, not a component module.
- **Server Actions go in `actions.ts`** — do not add `"use server"` functions to other files.
- **Error handling** — `backendFetch` throws on non-OK responses. Pages and actions should handle errors with try/catch or error boundaries.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `actions` | [API](../../../../reference/api/frontend/lib/server/actions/README.md) |
| `api-client` | [API](../../../../reference/api/frontend/lib/server/api-client/README.md) |
| `data` | [API](../../../../reference/api/frontend/lib/server/data/README.md) |
| `dev-profile-actions` | [API](../../../../reference/api/frontend/lib/server/dev-profile-actions/README.md) |
| `queries` | [API](../../../../reference/api/frontend/lib/server/queries/README.md) |

<details>
<summary>All exports (74)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `backendFetch` | functions | [docs](../../../../reference/api/frontend/lib/server/api-client/functions/backendFetch.md) |
| `backendGet` | functions | [docs](../../../../reference/api/frontend/lib/server/api-client/functions/backendGet.md) |
| `backendPatch` | functions | [docs](../../../../reference/api/frontend/lib/server/api-client/functions/backendPatch.md) |
| `backendPost` | functions | [docs](../../../../reference/api/frontend/lib/server/api-client/functions/backendPost.md) |
| `createScholarProfile` | functions | [docs](../../../../reference/api/frontend/lib/server/actions/functions/createScholarProfile.md) |
| `CurrentUserResponse` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/queries/type-aliases/CurrentUserResponse.md) |
| `DevTestProfileListItem` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/queries/type-aliases/DevTestProfileListItem.md) |
| `fetchAllUsersForMemo` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchAllUsersForMemo.md) |
| `fetchAllUserUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchAllUserUids.md) |
| `fetchEligibleScholarUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchEligibleScholarUids.md) |
| `fetchFrontDeskLogs` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchFrontDeskLogs.md) |
| `fetchRequiredHoursByUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchRequiredHoursByUids.md) |
| `fetchScholarNamesByUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchScholarNamesByUids.md) |
| `fetchScholarUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchScholarUids.md) |
| `fetchStudySessionLogs` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchStudySessionLogs.md) |
| `fetchTeamLeaders` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/fetchTeamLeaders.md) |
| `FrontDeskRecordWithName` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/FrontDeskRecordWithName.md) |
| `getActiveSemester` | variables | [docs](../../../../reference/api/frontend/lib/server/queries/variables/getActiveSemester.md) |
| `getCurrentProfile` | variables | [docs](../../../../reference/api/frontend/lib/server/queries/variables/getCurrentProfile.md) |
| `getCurrentUser` | variables | [docs](../../../../reference/api/frontend/lib/server/queries/variables/getCurrentUser.md) |
| `getFrontDeskCleanedAndErrored` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskCleanedAndErrored.md) |
| `getFrontDeskCompletedSessions` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskCompletedSessions.md) |
| `getFrontDeskRecord` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecord.md) |
| `getFrontDeskRecordsByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsByUid.md) |
| `getFrontDeskRecordsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsForWeek.md) |
| `getFrontDeskRecordsForWeekAll` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskRecordsForWeekAll.md) |
| `getFrontDeskScholarsInRoom` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getFrontDeskScholarsInRoom.md) |
| `getMcfFormLogsByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUid.md) |
| `getMcfFormLogsByUidAndWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidAndWeek.md) |
| `getMcfFormLogsByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidAndWeekWithLate.md) |
| `getMcfFormLogsByUidWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsByUidWithLate.md) |
| `getMcfFormLogsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsForWeek.md) |
| `getMcfFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getMcfFormLogsForWeekWithLate.md) |
| `getMyMentees` | variables | [docs](../../../../reference/api/frontend/lib/server/queries/variables/getMyMentees.md) |
| `getRecentFormSubmissions` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getRecentFormSubmissions.md) |
| `getStudySessionCleanedAndErrored` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionCleanedAndErrored.md) |
| `getStudySessionCompletedSessions` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionCompletedSessions.md) |
| `getStudySessionRecord` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecord.md) |
| `getStudySessionRecordsByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsByUid.md) |
| `getStudySessionRecordsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsForWeek.md) |
| `getStudySessionRecordsForWeekAll` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionRecordsForWeekAll.md) |
| `getStudySessionScholarsInRoom` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getStudySessionScholarsInRoom.md) |
| `getTeamLeaderFormStatsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getTeamLeaderFormStatsForWeek.md) |
| `getTotalMinutesForMenteeWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getTotalMinutesForMenteeWeek.md) |
| `getTrafficEntryCountForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getTrafficEntryCountForWeek.md) |
| `getTrafficEntryCountsForWeeks` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getTrafficEntryCountsForWeeks.md) |
| `getTrafficSessionsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getTrafficSessionsForWeek.md) |
| `getUserByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getUserByUid.md) |
| `getWhafFormLogsByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsByUid.md) |
| `getWhafFormLogsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsForWeek.md) |
| `getWhafFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWhafFormLogsForWeekWithLate.md) |
| `getWplFormLogsByUid` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUid.md) |
| `getWplFormLogsByUidAndWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidAndWeek.md) |
| `getWplFormLogsByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidAndWeekWithLate.md) |
| `getWplFormLogsByUidWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsByUidWithLate.md) |
| `getWplFormLogsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsForWeek.md) |
| `getWplFormLogsForWeekWithLate` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/getWplFormLogsForWeekWithLate.md) |
| `McfFormLogRowWithLate` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/McfFormLogRowWithLate.md) |
| `MemoUserRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/MemoUserRow.md) |
| `RecordKind` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/RecordKind.md) |
| `scholarIdFromProfile` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/scholarIdFromProfile.md) |
| `scholarUidFromProfile` | variables | [docs](../../../../reference/api/frontend/lib/server/data/variables/scholarUidFromProfile.md) |
| `setActiveTestProfile` | functions | [docs](../../../../reference/api/frontend/lib/server/dev-profile-actions/functions/setActiveTestProfile.md) |
| `StudySessionRecordWithName` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/StudySessionRecordWithName.md) |
| `syncFrontDeskRecordsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/syncFrontDeskRecordsForWeek.md) |
| `syncFrontDeskRecordsForWeekAllUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/syncFrontDeskRecordsForWeekAllUids.md) |
| `syncStudySessionRecordsForWeek` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/syncStudySessionRecordsForWeek.md) |
| `syncStudySessionRecordsForWeekAllUids` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/syncStudySessionRecordsForWeekAllUids.md) |
| `TeamLeaderRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/TeamLeaderRow.md) |
| `updateBasicInfo` | functions | [docs](../../../../reference/api/frontend/lib/server/actions/functions/updateBasicInfo.md) |
| `UpdateExcusePayload` | interfaces | [docs](../../../../reference/api/frontend/lib/server/data/interfaces/UpdateExcusePayload.md) |
| `updateRecordExcuse` | functions | [docs](../../../../reference/api/frontend/lib/server/data/functions/updateRecordExcuse.md) |
| `WahfFormLogRowWithLate` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/WahfFormLogRowWithLate.md) |
| `WplFormLogRowWithLate` | type-aliases | [docs](../../../../reference/api/frontend/lib/server/data/type-aliases/WplFormLogRowWithLate.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
