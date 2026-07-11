# controllers/

**Location:** [`backend/src/controllers/`](../../../../../backend/src/controllers/)  
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
| `auth.controller.ts` | [source](../../../../../backend/src/controllers/auth.controller.ts) | Auth middleware (`requireAuth`, `requireTeamLeaderOrAbove`, `requireDeveloper`, `requireSelfOrTeamLeader`) and auth endpoint handlers (`getMe`, `getProfile`, `getMentees`, `getActiveSemester`) |
| `user.controller.ts` | [source](../../../../../backend/src/controllers/user.controller.ts) | User data handlers: scholar names, required hours, eligible scholars, all UIDs, memo users, team leaders, scholar UIDs, get by UID |
| `session-log.controller.ts` | [source](../../../../../backend/src/controllers/session-log.controller.ts) | Raw check-in/out log handlers for front-desk and study sessions (fetch, cleaned, in-room, completed variants) |
| `session-record.controller.ts` | [source](../../../../../backend/src/controllers/session-record.controller.ts) | Weekly aggregated session record handlers: get, sync, excuse update |
| `form-log.controller.ts` | [source](../../../../../backend/src/controllers/form-log.controller.ts) | MCF/WHAF/WPL form submission handlers (30+ endpoints for individual, batch, and team leader stats) |
| `memo.controller.ts` | [source](../../../../../backend/src/controllers/memo.controller.ts) | Memo aggregation handlers: sync, weeklyMemo, refreshStats, pageData, trafficCount |
| `traffic.controller.ts` | [source](../../../../../backend/src/controllers/traffic.controller.ts) | Traffic entry counting handlers: sessions for week, entry count, batch entry counts |
| `activity.controller.ts` | [source](../../../../../backend/src/controllers/activity.controller.ts) | Daily scholar activity handler: total minutes by menteeUid, weekNum, logSource |
| `dev.controller.ts` | [source](../../../../../backend/src/controllers/dev.controller.ts) | Developer-only diagnostic handlers: test, me, front-desk ops, study ops, form log lookups; test-profile endpoints `getTestProfiles`, `getTestProfile`, `setActiveProfile` |
| `tutor-report-log.controller.ts` | [source](../../../../../backend/src/controllers/tutor-report-log.controller.ts) | Tutoring report handlers: by week, by UID, by UID+week, attendance check |

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
