# lib

Shared utilities, types, and the server-side data layer for the app. Code here is organized by **client-safe** (runs anywhere) vs **server-only** (Supabase, cookies, etc.).

## Directory overview

| Path | Purpose |
|------|--------|
| **`utils.ts`** | Root helpers: `cn()` (class names), `hasEnvVars` |
| **`time/`** | Campus week numbering and date formatting (Eastern time). See [time/README.md](./time/README.md). |
| **`session-logs/`** | Client-safe types and pure logic for session logs (tickets, cleaned/errored, in-room, double entries). |
| **`session-records/`** | Client-safe types and pure logic for weekly session records (minutes by day, week ranges). |
| **`supabase/`** | Supabase client (browser + server), auth helpers, and auth middleware. |
| **`server/`** | Server-only modules: user fetches, session-logs data layer, session-records data layer. |

**Rule of thumb:** Use **`lib/session-logs`** and **`lib/session-records`** for types and pure functions (no DB). Use **`lib/server/session-logs`** and **`lib/server/session-records`** when you need to fetch or persist data (API routes, Server Components).

---

## Root

### `utils.ts`

- **`cn(...inputs)`** — Merge Tailwind/class names (clsx + tailwind-merge). Use for conditional `className`.
- **`hasEnvVars`** — True when Supabase env vars are set; used by middleware to skip auth when not configured.

---

## time/

Campus week semantics (Monday–Sunday, Eastern), date ranges per week, and formatting. **Update the academic calendar once per year in `config.ts`** only.

| File | Description |
|------|-------------|
| **`index.ts`** | Re-exports public API: `campusWeekToDateRange`, `dateToCampusWeek`, `getStartOfDayEastern`, `formatDate`, `formatDuration`, `formatEntryDate`, `formatMinutesToHoursAndMinutes`, `getDurationMs`, `CAMPUS_WEEK`, config constants, type `CampusWeekDateRange`. |
| **`campus-week.ts`** | Week boundaries and campus week number logic (fall, winter break as one week, spring). |
| **`config.ts`** | **Only file to edit each year:** `FALL_SEMESTER_FIRST_DAY`, `WINTER_BREAK_FIRST_DAY`, `WINTER_BREAK_LAST_DAY`. |
| **`utils.ts`** | Formatting: `formatEntryDate`, `formatDuration`, `formatDate`, `getDurationMs`, `formatMinutesToHoursAndMinutes`. |
| **`README.md`** | Full docs and examples for `lib/time`. |

---

## session-logs/

**Client-safe.** Types and pure functions for entry/exit tickets and session categorization. No Supabase; works on in-memory arrays. Use from client or server.

| File | Description |
|------|-------------|
| **`index.ts`** | Re-exports the public API (see below). |
| **`types.ts`** | `SessionLogRow`, `SessionLogConfig`, `SESSION_TYPE_*`, `ProcessedTicket`, `CleanedAndErroredResult`, `ScholarInRoom`, `ScholarWithCompletedSession`, `TicketErrorType`, row types for front desk / study logs. |
| **`session-ticket-utils.ts`** | `getCleanedAndErroredTickets`, `getScholarsCurrentlyInRoom`, `getScholarsWithValidEntryExit` — categorize tickets by scholar (cleaned vs errored, in-room, completed pairs). |
| **`utils.ts`** | `enrichCleanedAndErroredWithNames`, `enrichWithScholarNames` — attach scholar names from a `Map<uid, name>`. |
| **`double-entry.ts`** | `getDoubleEntries` — find scholars with overlapping study + front-desk sessions; types `DoubleEntry`, `DoubleEntryOptions`. |

**Typical flow:** Fetch rows via `lib/server/session-logs`, then call `getCleanedAndErroredTickets` or `getScholarsWithValidEntryExit` / `getScholarsCurrentlyInRoom`. Enrich with the utils using a name map from `fetchScholarNamesByUids`. Use `getDoubleEntries` for overlap detection.

---

## session-records/

**Client-safe.** Types and pure helpers for weekly session records (minutes per weekday). No Supabase.

| File | Description |
|------|-------------|
| **`index.ts`** | Re-exports types and utilities. |
| **`types.ts`** | `FrontDeskRecordRow`, `StudySessionRecordRow` — row shapes for the records tables. |
| **`utils.ts`** | `getWeekFetchEnd(range)` — end of last day of a week range for inclusive fetches; `EMPTY_WEEKLY_MINUTES` — zero minutes per weekday. |
| **`weekly-minutes.ts`** | `computeWeeklyMinutesByUid(sessions, weekRange)` — aggregate completed sessions into `mon_min`..`fri_min` per scholar; types `WeeklyMinutesByDay`, `WeekDateRange`. |

Use with `campusWeekToDateRange` from `lib/time` for week bounds; feed completed sessions from `getScholarsWithValidEntryExit` into `computeWeeklyMinutesByUid`.

---

## supabase/

Supabase client creation, auth helpers, and auth middleware. **Server modules use `server-only` and must run on the server.**

| File | Description |
|------|-------------|
| **`client.ts`** | `createClient()` — browser Supabase client (for Client Components, auth forms). |
| **`server.ts`** | `createClient()` (async), `getCurrentUser`, `getCurrentUserWithProfile`, `requireUser`, `requireUserWithProfile`, `getDeveloperUser`, `requireDeveloper` — server client and auth helpers. |
| **`middleware.ts`** | `updateSession(request)` — refresh session and redirect unauthenticated users to login. Uses `hasEnvVars` from `lib/utils`. |
| **`types.ts`** | `UserProfile` and related types for `public.user_roster`. |

---

## server/

**Server-only.** Fetches from Supabase and orchestrates the pure `lib/session-logs` and `lib/session-records` logic. Import only from API routes, Server Components, or other server code.

### `users.ts`

Shared user data from `public.user_roster`:

- **`fetchScholarNamesByUids(uids)`** — Map of uid → display name.
- **`fetchRequiredHoursByUids(uids)`** — Map of uid → `{ fd_required, ss_required }`.
- **`fetchEligibleScholarUids(uids)`** — Set of UIDs who are scholars with required hours set.
- **`fetchAllUserUids()`** — All user UIDs (used when syncing records for all users).

### `session-logs/`

Fetches log rows from Supabase and returns cleaned/errored, in-room, or completed sessions (with names when applicable).

| File | Description |
|------|-------------|
| **`index.ts`** | Re-exports `fetchScholarNamesByUids` (from `users.ts`), fetch helpers, and all get* functions. |
| **`fetch.ts`** | `requireLogFetchLimit`, `fetchFrontDeskLogs`, `fetchStudySessionLogs` — raw row fetches from `front_desk_logs` and `study_session_logs`. |
| **`front-desk.ts`** | `getFrontDeskCleanedAndErrored`, `getFrontDeskScholarsInRoom`, `getFrontDeskCompletedSessions` — fetch + pure logic + name enrichment for front desk. |
| **`study.ts`** | `getStudySessionCleanedAndErrored`, `getStudySessionScholarsInRoom`, `getStudySessionCompletedSessions` — same for study session logs. |

### `session-records/`

Reads/writes `front_desk_records` and `study_session_records`, syncs weekly minutes from tickets, and updates excuses.

| File | Description |
|------|-------------|
| **`index.ts`** | Re-exports all public functions and types. |
| **`records.ts`** | `getFrontDeskRecord`, `getStudySessionRecord`, `getFrontDeskRecordsForWeek`, `getStudySessionRecordsForWeek` (with names and required hours); types `RecordKind`, `*WithName`. |
| **`sync.ts`** | `syncFrontDeskRecordsForWeek`, `syncFrontDeskRecordsForWeekAllUids`, `syncStudySessionRecordsForWeek`, `syncStudySessionRecordsForWeekAllUids` — compute minutes from tickets and upsert (or zero out when syncing all UIDs). |
| **`excuse.ts`** | `updateRecordExcuse(uid, weekNum, kind, payload)` and type `UpdateExcusePayload` — set excuse and excuse_min on a record. |

---

## Import paths

- **Client-safe (use anywhere):** `@/lib/utils`, `@/lib/time`, `@/lib/session-logs`, `@/lib/session-records`
- **Server-only:** `@/lib/supabase/server`, `@/lib/supabase/client`, `@/lib/supabase/middleware`, `@/lib/server/users`, `@/lib/server/session-logs`, `@/lib/server/session-records`

The workspace rule **“Check lib/ before adding functions”** applies: prefer adding or extending shared logic here instead of duplicating it in components or pages.
