# CSS Atlas Backend API Documentation

Base URL: `/api`

All endpoints require a valid Supabase JWT in the `Authorization: Bearer <token>` header unless otherwise noted. Auth levels:

- **requireAuth** -- Any authenticated user.
- **requireTeamLeaderOrAbove** -- User must have `app_role` of `team_leader` or higher in the role hierarchy.
- **requireDeveloper** -- User must have `app_role` of `developer`.

All error responses follow the shape `{ error: string }`.

---

## Auth

All routes under `/api/auth` require **requireAuth**.

### `GET /api/auth/me`

**Auth:** requireAuth
**Description:** Returns the authenticated user's identity and full profile (merged with user_roster data).
**Request:** None
**Response:**
```json
{
  "user": { "id": "uuid", "email": "string" },
  "profile": { /* profiles row with merged roster fields */ }
}
```

---

### `GET /api/auth/profile`

**Auth:** requireAuth
**Description:** Returns the raw profile row for the authenticated user from the `profiles` table.
**Request:** None
**Response:**
```json
{ "data": { /* profiles row */ } }
```

---

### `GET /api/auth/mentees`

**Auth:** requireAuth
**Description:** Calls the `get_my_mentees` RPC to return the current user's assigned mentees.
**Request:** None
**Response:**
```json
{ "data": [ /* mentee rows */ ] }
```

---

### `GET /api/auth/semester`

**Auth:** requireAuth
**Description:** Returns the currently active semester. Alias: `/api/auth/active-semester`.
**Request:** None
**Response:**
```json
{ "data": { "id": 1, "iso_week_offset": 0, "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD" } }
```

---

### `GET /api/auth/active-semester`

**Auth:** requireAuth
**Description:** Same as `GET /api/auth/semester`.

---

## Users

All routes under `/api/users` require **requireAuth**.

### `POST /api/users/scholar-names`

**Auth:** requireAuth
**Description:** Given an array of UIDs, returns a map of UID to scholar display name.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": { "uid1": "Name One", "uid2": "Name Two" } }
```

---

### `POST /api/users/required-hours`

**Auth:** requireAuth
**Description:** Given an array of UIDs, returns a map of UID to required hours.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": { "uid1": 10, "uid2": 8 } }
```

---

### `POST /api/users/eligible-scholars`

**Auth:** requireAuth
**Description:** Filters the given UIDs to only those who are eligible scholars.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": ["uid1"] }
```

---

### `GET /api/users/all-uids`

**Auth:** requireAuth
**Description:** Returns all user UIDs in the system.
**Request:** None
**Response:**
```json
{ "data": ["uid1", "uid2", "..."] }
```

---

### `GET /api/users/memo-users`

**Auth:** requireAuth
**Description:** Returns all users relevant for memo generation.
**Request:** None
**Response:**
```json
{ "data": [ /* user objects */ ] }
```

---

### `GET /api/users/team-leaders`

**Auth:** requireAuth
**Description:** Returns all users with a team leader role.
**Request:** None
**Response:**
```json
{ "data": [ /* team leader objects */ ] }
```

---

### `GET /api/users/scholar-uids`

**Auth:** requireAuth
**Description:** Returns UIDs for all scholars.
**Request:** None
**Response:**
```json
{ "data": ["uid1", "uid2", "..."] }
```

---

### `GET /api/users/:uid`

**Auth:** requireAuth
**Description:** Returns the user profile for a specific UID.
**Request Params:** `uid` (string) -- The user's UID.
**Response:**
```json
{ "data": { /* user object */ } }
```
Returns `404` if user not found.

---

## Session Logs

All routes under `/api/session-logs` require **requireAuth**. All endpoints use POST with an optional filter body.

### `POST /api/session-logs/front-desk`

**Auth:** requireAuth
**Description:** Fetches raw front desk session logs with optional date range and scholar UID filters.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"] // optional
}
```
**Response:**
```json
{ "data": [ /* front desk log rows */ ] }
```

---

### `POST /api/session-logs/front-desk/cleaned`

**Auth:** requireAuth
**Description:** Returns front desk logs cleaned and separated into valid vs errored entries, grouped by scholar UID.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)",
  "treatUnclosedEntryAsError": true // optional, boolean
}
```
**Response:**
```json
{
  "data": {
    "byScholarUid": { "uid1": [ /* cleaned entries */ ] },
    "allCleaned": [ /* all valid entries */ ],
    "allErrored": [ /* all errored entries */ ]
  }
}
```

---

### `POST /api/session-logs/front-desk/in-room`

**Auth:** requireAuth
**Description:** Returns scholars currently checked into front desk (open sessions without checkout).
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)"
}
```
**Response:**
```json
{ "data": [ /* scholars currently in room */ ] }
```

---

### `POST /api/session-logs/front-desk/completed`

**Auth:** requireAuth
**Description:** Returns completed front desk sessions (checked in and checked out).
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)"
}
```
**Response:**
```json
{ "data": [ /* completed session entries */ ] }
```

---

### `POST /api/session-logs/study`

**Auth:** requireAuth
**Description:** Fetches raw study session logs with optional filters.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)"
}
```
**Response:**
```json
{ "data": [ /* study session log rows */ ] }
```

---

### `POST /api/session-logs/study/cleaned`

**Auth:** requireAuth
**Description:** Returns study session logs cleaned and separated into valid vs errored entries, grouped by scholar UID.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)",
  "treatUnclosedEntryAsError": true // optional, boolean
}
```
**Response:**
```json
{
  "data": {
    "byScholarUid": { "uid1": [ /* cleaned entries */ ] },
    "allCleaned": [ /* all valid entries */ ],
    "allErrored": [ /* all errored entries */ ]
  }
}
```

---

### `POST /api/session-logs/study/in-room`

**Auth:** requireAuth
**Description:** Returns scholars currently checked into study sessions.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)"
}
```
**Response:**
```json
{ "data": [ /* scholars currently in room */ ] }
```

---

### `POST /api/session-logs/study/completed`

**Auth:** requireAuth
**Description:** Returns completed study sessions.
**Request Body:**
```json
{
  "startDate": "ISO date string (optional)",
  "endDate": "ISO date string (optional)",
  "scholarUids": ["uid1"], // optional
  "sessionType": "string (optional)"
}
```
**Response:**
```json
{ "data": [ /* completed session entries */ ] }
```

---

## Session Records

All routes under `/api/session-records` require **requireAuth**.

### `GET /api/session-records/front-desk/by-uid/:uid`

**Auth:** requireAuth
**Description:** Returns all front desk records for a given scholar UID.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* front desk record rows */ ] }
```

---

### `GET /api/session-records/front-desk/week/:weekNum/all`

**Auth:** requireAuth
**Description:** Returns front desk records for all scholars for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* front desk record rows */ ] }
```

---

### `GET /api/session-records/front-desk/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns front desk records for the authenticated user's scholars for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* front desk record rows */ ] }
```

---

### `GET /api/session-records/front-desk/:uid/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns a single front desk record for a specific scholar UID and week number.
**Request Params:** `uid` (integer), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": { /* single front desk record */ } }
```

---

### `POST /api/session-records/front-desk/sync`

**Auth:** requireAuth
**Description:** Syncs (recalculates) front desk records for a given week, optionally for a single UID.
**Request Body:**
```json
{
  "weekNum": 1,       // required, integer >= 1
  "uid": 12345        // optional, integer
}
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `POST /api/session-records/front-desk/sync-all`

**Auth:** requireAuth
**Description:** Syncs front desk records for all UIDs for a given week.
**Request Body:**
```json
{ "weekNum": 1 }  // required, integer >= 1
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `PATCH /api/session-records/front-desk/excuse`

**Auth:** requireAuth
**Description:** Updates the excuse text and/or excused minutes on a front desk record.
**Request Body:**
```json
{
  "uid": 12345,                  // required, integer
  "weekNum": 1,                  // required, integer >= 1
  "excuse": "string or null",    // optional
  "excuse_min": 60               // optional, integer or null
}
```
**Response:**
```json
{ "data": { /* updated record */ } }
```
Returns `404` if no record exists for the UID/week combination.

---

### `GET /api/session-records/study/by-uid/:uid`

**Auth:** requireAuth
**Description:** Returns all study session records for a given scholar UID.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* study session record rows */ ] }
```

---

### `GET /api/session-records/study/week/:weekNum/all`

**Auth:** requireAuth
**Description:** Returns study session records for all scholars for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* study session record rows */ ] }
```

---

### `GET /api/session-records/study/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns study session records for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* study session record rows */ ] }
```

---

### `GET /api/session-records/study/:uid/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns a single study session record for a specific scholar UID and week.
**Request Params:** `uid` (integer), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": { /* single study session record */ } }
```

---

### `POST /api/session-records/study/sync`

**Auth:** requireAuth
**Description:** Syncs (recalculates) study session records for a given week, optionally for a single UID.
**Request Body:**
```json
{
  "weekNum": 1,       // required, integer >= 1
  "uid": 12345        // optional, integer
}
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `POST /api/session-records/study/sync-all`

**Auth:** requireAuth
**Description:** Syncs study session records for all UIDs for a given week.
**Request Body:**
```json
{ "weekNum": 1 }  // required, integer >= 1
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `PATCH /api/session-records/study/excuse`

**Auth:** requireAuth
**Description:** Updates the excuse text and/or excused minutes on a study session record.
**Request Body:**
```json
{
  "uid": 12345,                  // required, integer
  "weekNum": 1,                  // required, integer >= 1
  "excuse": "string or null",    // optional
  "excuse_min": 60               // optional, integer or null
}
```
**Response:**
```json
{ "data": { /* updated record */ } }
```
Returns `404` if no record exists for the UID/week combination.

---

## Traffic

All routes under `/api/traffic` require **requireAuth**.

### `GET /api/traffic/sessions/:weekNum`

**Auth:** requireAuth
**Description:** Returns all traffic session entries (check-in/check-out pairs) for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* traffic session rows */ ] }
```

---

### `GET /api/traffic/entry-count/:weekNum`

**Auth:** requireAuth
**Description:** Returns the total number of entry events for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": 42 }
```

---

### `POST /api/traffic/entry-counts`

**Auth:** requireAuth
**Description:** Returns entry counts for multiple weeks in a single request.
**Request Body:**
```json
{ "weekNumbers": [1, 2, 3] }
```
**Response:**
```json
{ "data": { /* week-to-count mapping or array */ } }
```

---

## Form Logs

All routes under `/api/form-logs` require **requireAuth**.

### MCF (Mentee Check-in Form)

### `GET /api/form-logs/mcf/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns all MCF form log entries for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* MCF form log rows */ ] }
```

---

### `GET /api/form-logs/mcf/uid/:uid`

**Auth:** requireAuth
**Description:** Returns all MCF form logs for a specific scholar/mentor UID.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* MCF form log rows */ ] }
```

---

### `GET /api/form-logs/mcf/uid/:uid/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns MCF form logs for a specific UID and week.
**Request Params:** `uid` (string), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* MCF form log rows */ ] }
```

---

### `GET /api/form-logs/mcf/week/:weekNum/with-late`

**Auth:** requireAuth
**Description:** Returns MCF form logs for a week, including late submissions.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* MCF form log rows including late */ ] }
```

---

### `GET /api/form-logs/mcf/uid/:uid/with-late`

**Auth:** requireAuth
**Description:** Returns all MCF form logs for a UID, including late submissions.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* MCF form log rows including late */ ] }
```

---

### `GET /api/form-logs/mcf/uid/:uid/week/:weekNum/with-late`

**Auth:** requireAuth
**Description:** Returns MCF form logs for a specific UID and week, including late submissions.
**Request Params:** `uid` (string), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* MCF form log rows including late */ ] }
```

---

### WHAF (Weekly Hours Activity Form)

### `GET /api/form-logs/whaf/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns all WHAF form log entries for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WHAF form log rows */ ] }
```

---

### `GET /api/form-logs/whaf/uid/:uid`

**Auth:** requireAuth
**Description:** Returns all WHAF form logs for a specific scholar UID.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* WHAF form log rows */ ] }
```

---

### `GET /api/form-logs/whaf/week/:weekNum/with-late`

**Auth:** requireAuth
**Description:** Returns WHAF form logs for a week, including late submissions.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WHAF form log rows including late */ ] }
```

---

### WPL (Weekly Performance Log)

### `GET /api/form-logs/wpl/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns all WPL form log entries for a specific week.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WPL form log rows */ ] }
```

---

### `GET /api/form-logs/wpl/uid/:uid`

**Auth:** requireAuth
**Description:** Returns all WPL form logs for a specific scholar UID.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* WPL form log rows */ ] }
```

---

### `GET /api/form-logs/wpl/uid/:uid/week/:weekNum`

**Auth:** requireAuth
**Description:** Returns WPL form logs for a specific UID and week.
**Request Params:** `uid` (string), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WPL form log rows */ ] }
```

---

### `GET /api/form-logs/wpl/week/:weekNum/with-late`

**Auth:** requireAuth
**Description:** Returns WPL form logs for a week, including late submissions.
**Request Params:** `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WPL form log rows including late */ ] }
```

---

### `GET /api/form-logs/wpl/uid/:uid/with-late`

**Auth:** requireAuth
**Description:** Returns all WPL form logs for a UID, including late submissions.
**Request Params:** `uid` (string)
**Response:**
```json
{ "data": [ /* WPL form log rows including late */ ] }
```

---

### `GET /api/form-logs/wpl/uid/:uid/week/:weekNum/with-late`

**Auth:** requireAuth
**Description:** Returns WPL form logs for a specific UID and week, including late submissions.
**Request Params:** `uid` (string), `weekNum` (integer, >= 1)
**Response:**
```json
{ "data": [ /* WPL form log rows including late */ ] }
```

---

### Batch by UIDs

### `POST /api/form-logs/whaf/by-uids`

**Auth:** requireAuth
**Description:** Returns all WHAF form logs matching the given scholar UIDs.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": [ /* WHAF form log rows */ ] }
```

---

### `POST /api/form-logs/mcf/by-uids`

**Auth:** requireAuth
**Description:** Returns all MCF form logs matching the given UIDs. Optionally filter by `mentor_uid` or `mentee_uid`.
**Request Body:**
```json
{
  "uids": ["uid1", "uid2"],
  "field": "mentee_uid"  // optional, "mentee_uid" or "mentor_uid" (default: "mentor_uid")
}
```
**Response:**
```json
{ "data": [ /* MCF form log rows */ ] }
```

---

### `POST /api/form-logs/wpl/by-uids`

**Auth:** requireAuth
**Description:** Returns all WPL form logs matching the given scholar UIDs.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": [ /* WPL form log rows */ ] }
```

---

### `POST /api/form-logs/tutor-reports/by-uids`

**Auth:** requireAuth
**Description:** Returns all tutor report logs matching the given scholar UIDs.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": [ /* tutor report log rows */ ] }
```

---

### `POST /api/form-logs/daily-activity/by-uids`

**Auth:** requireAuth
**Description:** Returns all daily scholar activity entries matching the given scholar UIDs.
**Request Body:**
```json
{ "uids": ["uid1", "uid2"] }
```
**Response:**
```json
{ "data": [ /* daily scholar activity rows */ ] }
```

---

### Recent Submissions and Stats

### `POST /api/form-logs/recent-submissions`

**Auth:** requireAuth
**Description:** Returns the most recent form submissions for a given student.
**Request Body:**
```json
{ "studentId": 12345 }  // optional integer; if omitted, uses current user
```
**Response:**
```json
{ "data": { /* recent submission summary */ } }
```

---

### `POST /api/form-logs/team-leader-stats`

**Auth:** requireAuth
**Description:** Aggregates MCF, WHAF, and WPL form submission stats per team leader for a given week (includes late submissions).
**Request Body:**
```json
{ "weekNum": 1 }  // required, integer >= 1
```
**Response:**
```json
{ "data": [ /* per-team-leader stats */ ] }
```

---

### Generic Form Log Lookup

### `GET /api/form-logs/:formType/:formId`

**Auth:** requireAuth
**Description:** Retrieves a single form log entry by type and ID. Supported types: `mcf`, `wpl`.
**Request Params:** `formType` (`"mcf"` | `"wpl"`), `formId` (string for MCF UUID, integer for WPL)
**Response:**
```json
{ "data": { /* single form log row */ } }
```
Returns `404` if not found, `400` for unsupported form type.

---

## Daily Activity

All routes under `/api/daily-activity` require **requireAuth**.

### `GET /api/daily-activity/minutes`

**Auth:** requireAuth
**Description:** Returns total activity minutes for a mentee for a specific week and log source.
**Query Params:**
- `menteeUid` (string, required) -- The mentee's UID
- `weekNum` (integer >= 1, required) -- The week number
- `logSource` (string, required) -- The log source type

**Response:**
```json
{ "data": { /* total minutes result */ } }
```

---

## Dev

All routes under `/api/dev` require **requireDeveloper**.

### `GET /api/dev/test`

**Auth:** requireDeveloper
**Description:** Simple health check / connectivity test for developer API.
**Request:** None
**Response:**
```json
{ "ok": true, "message": "Developer API test successful", "user": "email@example.com", "timestamp": "ISO string" }
```

---

### `GET /api/dev/me`

**Auth:** requireDeveloper
**Description:** Returns the authenticated developer's identity and role.
**Request:** None
**Response:**
```json
{
  "user": { "id": "uuid", "email": "string" },
  "profile": { "app_role": "developer", "email": "string" }
}
```

---

### `GET /api/dev/session-records/front-desk`

**Auth:** requireDeveloper
**Description:** Returns front desk records for a given week. Optionally filter by UID.
**Query Params:**
- `week` (integer >= 1, required) -- Week number
- `uid` (integer, optional) -- Scholar UID; if omitted returns all records for the week

**Response:**
```json
{ "data": { /* single record or array of records */ } }
```

---

### `POST /api/dev/session-records/front-desk/sync`

**Auth:** requireDeveloper
**Description:** Syncs front desk records for a given week, optionally for a single UID.
**Request Body:**
```json
{ "weekNum": 1, "uid": 12345 }  // uid optional
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `POST /api/dev/session-records/front-desk/sync-all`

**Auth:** requireDeveloper
**Description:** Syncs front desk records for all UIDs for a given week.
**Request Body:**
```json
{ "weekNum": 1 }
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `PATCH /api/dev/session-records/front-desk/excuse`

**Auth:** requireDeveloper
**Description:** Updates excuse on a front desk record.
**Request Body:**
```json
{
  "uid": 12345,
  "weekNum": 1,
  "excuse": "string or null",
  "excuse_min": 60
}
```
**Response:**
```json
{ "data": { /* updated record */ } }
```

---

### `GET /api/dev/session-records/study`

**Auth:** requireDeveloper
**Description:** Returns study session records for a given week. Optionally filter by UID.
**Query Params:**
- `week` (integer >= 1, required) -- Week number
- `uid` (integer, optional) -- Scholar UID; if omitted returns all records for the week

**Response:**
```json
{ "data": { /* single record or array of records */ } }
```

---

### `POST /api/dev/session-records/study/sync`

**Auth:** requireDeveloper
**Description:** Syncs study session records for a given week, optionally for a single UID.
**Request Body:**
```json
{ "weekNum": 1, "uid": 12345 }  // uid optional
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `POST /api/dev/session-records/study/sync-all`

**Auth:** requireDeveloper
**Description:** Syncs study session records for all UIDs for a given week.
**Request Body:**
```json
{ "weekNum": 1 }
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `PATCH /api/dev/session-records/study/excuse`

**Auth:** requireDeveloper
**Description:** Updates excuse on a study session record.
**Request Body:**
```json
{
  "uid": 12345,
  "weekNum": 1,
  "excuse": "string or null",
  "excuse_min": 60
}
```
**Response:**
```json
{ "data": { /* updated record */ } }
```

---

### `GET /api/dev/form-logs/:formType/:formId`

**Auth:** requireDeveloper
**Description:** Retrieves a single form log entry by type and ID. Supported types: `mcf`, `wpl`.
**Request Params:** `formType` (`"mcf"` | `"wpl"`), `formId` (string for MCF UUID, integer for WPL)
**Response:**
```json
{ "data": { /* single form log row */ } }
```

---

## Memo

Routes under `/api/memo` have mixed auth requirements as noted per endpoint.

### `GET /api/memo/weekly`

**Auth:** requireAuth
**Description:** Returns the weekly memo data by calling the `get_weekly_memo` Supabase RPC.
**Query Params:**
- `semesterId` (integer, required) -- The semester ID
- `weekNum` (integer >= 1, required) -- The week number

**Response:**
```json
{ "data": { /* weekly memo result from RPC */ } }
```

---

### `POST /api/memo/refresh-stats`

**Auth:** requireAuth
**Description:** Triggers a fire-and-forget call to the `refresh_weekly_stats` Supabase Edge Function. Returns immediately.
**Request Body:**
```json
{
  "week_num": 1,       // required
  "semester_id": 1     // required
}
```
**Response:**
```json
{ "data": { "ok": true } }
```

---

### `GET /api/memo/page-data`

**Auth:** requireAuth
**Description:** Returns all processed data needed to render the memo page for a given week (aggregated in one call).
**Query Params:**
- `weekNum` (integer >= 1, required)

**Response:**
```json
{ "data": { /* full memo page data object */ } }
```

---

### `POST /api/memo/sync`

**Auth:** requireTeamLeaderOrAbove
**Description:** Triggers a memo sync for a given week. Mode controls depth of recalculation.
**Request Body:**
```json
{
  "weekNum": 1,          // required, integer >= 1
  "mode": "light"        // required, "light" or "heavy"
}
```
**Response:**
```json
{ "data": { /* sync result */ } }
```

---

### `GET /api/memo/traffic-count`

**Auth:** requireTeamLeaderOrAbove
**Description:** Returns the traffic entry count for a given week. Response has `Cache-Control: no-store`.
**Query Params:**
- `weekNum` (integer >= 1, required)

**Response:**
```json
{ "weekNumber": 1, "entryCount": 42 }
```
