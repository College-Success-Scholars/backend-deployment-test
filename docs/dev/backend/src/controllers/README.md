# controllers/

**Location:** [`backend/src/controllers/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers)  
**Docs:** `docs/dev/backend/src/controllers/README.md`

## Navigation

[← Root](../../../README.md) › [Backend](../../README.md) › [src](../README.md) › controllers

---

## Purpose

Express request handlers. A controller receives a validated `AuthenticatedRequest`, reads route/query params, calls one or more services, and returns a JSON response. Controllers contain no Supabase queries and no business logic beyond input validation and response shaping.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `auth.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/auth.controller.ts) | Auth middleware (`requireAuth`, `requireAal2`, `requireTeamLeaderOrAbove`, `requireDeveloper`, `requireSelfOrTeamLeader`), JWT AAL helper (`getJwtAal`), and auth endpoint handlers (`getMe`, `getProfile`, `createProfile`, `getMentees`, `getActiveSemester`) |
| `user.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/user.controller.ts) | User data handlers: scholar names, required hours, eligible scholars, all UIDs, memo users, team leaders, scholar UIDs, get by UID |
| `session-log.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/session-log.controller.ts) | Raw check-in/out log handlers for front-desk and study sessions (fetch, cleaned, in-room, completed variants) |
| `session-record.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/session-record.controller.ts) | Weekly aggregated session record handlers: get, sync, excuse update |
| `form-log.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/form-log.controller.ts) | MCF/WHAF/WPL form submission handlers (30+ endpoints for individual, batch, and team leader stats) |
| `memo.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/memo.controller.ts) | Memo aggregation handlers: sync, weeklyMemo, refreshStats, pageData, trafficCount |
| `traffic.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/traffic.controller.ts) | Traffic entry counting handlers: sessions for week, entry count, batch entry counts |
| `activity.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/activity.controller.ts) | Daily scholar activity handler: total minutes by menteeUid, weekNum, logSource |
| `dev.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/dev.controller.ts) | Developer-only diagnostic handlers: test, me, front-desk ops, study ops, form log lookups; test-profile endpoints `getTestProfiles`, `getTestProfile`, `setActiveProfile` |
| `tutor-report-log.controller.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/src/controllers/tutor-report-log.controller.ts) | Tutoring report handlers: by week, by UID, by UID+week, attendance check |

---

## Standards

- **One controller per domain** — matches the corresponding service and route files.
- **Controllers do not import from `@supabase/supabase-js`** — all DB access goes through services.
- **Input validation at the top** — check params/query before any service call; return 400 immediately on bad input.
- **Response shape** — success: `res.json({ data: ... })` · error: `res.status(4xx|5xx).json({ error: "message" })`.
- **Use `AuthenticatedRequest`** from `auth.controller.ts` instead of plain `Request` so TypeScript knows about `authUser`, `profile`, and `accessToken`.
- **Auth middleware goes in the route file**, not the controller. Controllers assume auth has already been verified.
- **No `next()` calls** — controllers are terminal handlers; they always send a response.
- **Naming** — export functions as camelCase verbs: `getScholarNames`, `syncFrontDesk`, `updateExcuse`.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `activity.controller` | [API](../../../../reference/api/backend/src/controllers/activity.controller/README.md) |
| `auth.controller` | [API](../../../../reference/api/backend/src/controllers/auth.controller/README.md) |
| `dev.controller` | [API](../../../../reference/api/backend/src/controllers/dev.controller/README.md) |
| `form-log.controller` | [API](../../../../reference/api/backend/src/controllers/form-log.controller/README.md) |
| `memo.controller` | [API](../../../../reference/api/backend/src/controllers/memo.controller/README.md) |
| `session-log.controller` | [API](../../../../reference/api/backend/src/controllers/session-log.controller/README.md) |
| `session-record.controller` | [API](../../../../reference/api/backend/src/controllers/session-record.controller/README.md) |
| `traffic.controller` | [API](../../../../reference/api/backend/src/controllers/traffic.controller/README.md) |
| `tutor-report-log.controller` | [API](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/README.md) |
| `user.controller` | [API](../../../../reference/api/backend/src/controllers/user.controller/README.md) |

<details>
<summary>All exports (90)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `allUids` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/allUids.md) |
| `attended` | functions | [docs](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/functions/attended.md) |
| `AuthenticatedRequest` | interfaces | [docs](../../../../reference/api/backend/src/controllers/auth.controller/interfaces/AuthenticatedRequest.md) |
| `byUid` | functions | [docs](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/functions/byUid.md) |
| `byUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/functions/byUidAndWeek.md) |
| `createProfile` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/createProfile.md) |
| `dailyActivityByUids` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/dailyActivityByUids.md) |
| `eligibleScholars` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/eligibleScholars.md) |
| `entryCount` | functions | [docs](../../../../reference/api/backend/src/controllers/traffic.controller/functions/entryCount.md) |
| `entryCounts` | functions | [docs](../../../../reference/api/backend/src/controllers/traffic.controller/functions/entryCounts.md) |
| `excuseFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/excuseFrontDesk.md) |
| `excuseFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/excuseFrontDesk.md) |
| `excuseStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/excuseStudy.md) |
| `excuseStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/excuseStudy.md) |
| `fetchFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/fetchFrontDesk.md) |
| `fetchStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/fetchStudy.md) |
| `forWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/tutor-report-log.controller/functions/forWeek.md) |
| `frontDeskCleaned` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/frontDeskCleaned.md) |
| `frontDeskCompleted` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/frontDeskCompleted.md) |
| `frontDeskInRoom` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/frontDeskInRoom.md) |
| `getActiveSemester` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/getActiveSemester.md) |
| `getByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/getByUid.md) |
| `getFormLog` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/getFormLog.md) |
| `getFormLog` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/getFormLog.md) |
| `getFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/getFrontDesk.md) |
| `getFrontDeskByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getFrontDeskByUid.md) |
| `getFrontDeskForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getFrontDeskForWeek.md) |
| `getFrontDeskForWeekAll` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getFrontDeskForWeekAll.md) |
| `getFrontDeskSingle` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getFrontDeskSingle.md) |
| `getMe` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/getMe.md) |
| `getMentees` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/getMentees.md) |
| `getProfile` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/getProfile.md) |
| `getStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/getStudy.md) |
| `getStudyByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getStudyByUid.md) |
| `getStudyForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getStudyForWeek.md) |
| `getStudyForWeekAll` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getStudyForWeekAll.md) |
| `getStudySingle` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/getStudySingle.md) |
| `getTestProfile` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/getTestProfile.md) |
| `getTestProfiles` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/getTestProfiles.md) |
| `mcfByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfByUid.md) |
| `mcfByUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfByUidAndWeek.md) |
| `mcfByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfByUidAndWeekWithLate.md) |
| `mcfByUids` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfByUids.md) |
| `mcfByUidWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfByUidWithLate.md) |
| `mcfForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfForWeek.md) |
| `mcfForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/mcfForWeekWithLate.md) |
| `me` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/me.md) |
| `memoUsers` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/memoUsers.md) |
| `minutes` | functions | [docs](../../../../reference/api/backend/src/controllers/activity.controller/functions/minutes.md) |
| `pageData` | functions | [docs](../../../../reference/api/backend/src/controllers/memo.controller/functions/pageData.md) |
| `recentSubmissions` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/recentSubmissions.md) |
| `refreshStats` | functions | [docs](../../../../reference/api/backend/src/controllers/memo.controller/functions/refreshStats.md) |
| `requireAuth` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/requireAuth.md) |
| `requireDeveloper` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/requireDeveloper.md) |
| `requiredHours` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/requiredHours.md) |
| `requireSelfOrTeamLeader` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/requireSelfOrTeamLeader.md) |
| `requireTeamLeaderOrAbove` | functions | [docs](../../../../reference/api/backend/src/controllers/auth.controller/functions/requireTeamLeaderOrAbove.md) |
| `scholarNames` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/scholarNames.md) |
| `scholarUids` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/scholarUids.md) |
| `sessionsForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/traffic.controller/functions/sessionsForWeek.md) |
| `setActiveProfile` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/setActiveProfile.md) |
| `studyCleaned` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/studyCleaned.md) |
| `studyCompleted` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/studyCompleted.md) |
| `studyInRoom` | functions | [docs](../../../../reference/api/backend/src/controllers/session-log.controller/functions/studyInRoom.md) |
| `sync` | functions | [docs](../../../../reference/api/backend/src/controllers/memo.controller/functions/sync.md) |
| `syncFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/syncFrontDesk.md) |
| `syncFrontDesk` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/syncFrontDesk.md) |
| `syncFrontDeskAll` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/syncFrontDeskAll.md) |
| `syncFrontDeskAll` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/syncFrontDeskAll.md) |
| `syncStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/syncStudy.md) |
| `syncStudy` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/syncStudy.md) |
| `syncStudyAll` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/syncStudyAll.md) |
| `syncStudyAll` | functions | [docs](../../../../reference/api/backend/src/controllers/session-record.controller/functions/syncStudyAll.md) |
| `teamLeaders` | functions | [docs](../../../../reference/api/backend/src/controllers/user.controller/functions/teamLeaders.md) |
| `teamLeaderStats` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/teamLeaderStats.md) |
| `test` | functions | [docs](../../../../reference/api/backend/src/controllers/dev.controller/functions/test.md) |
| `trafficCount` | functions | [docs](../../../../reference/api/backend/src/controllers/memo.controller/functions/trafficCount.md) |
| `tutorReportsByUids` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/tutorReportsByUids.md) |
| `weeklyMemo` | functions | [docs](../../../../reference/api/backend/src/controllers/memo.controller/functions/weeklyMemo.md) |
| `whafByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/whafByUid.md) |
| `whafByUids` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/whafByUids.md) |
| `whafForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/whafForWeek.md) |
| `whafForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/whafForWeekWithLate.md) |
| `wplByUid` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplByUid.md) |
| `wplByUidAndWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplByUidAndWeek.md) |
| `wplByUidAndWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplByUidAndWeekWithLate.md) |
| `wplByUids` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplByUids.md) |
| `wplByUidWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplByUidWithLate.md) |
| `wplForWeek` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplForWeek.md) |
| `wplForWeekWithLate` | functions | [docs](../../../../reference/api/backend/src/controllers/form-log.controller/functions/wplForWeekWithLate.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
