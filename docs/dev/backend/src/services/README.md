# services/

**Location:** [`backend/src/services/`](../../../../../backend/src/services/)  
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
| `supabase.service.ts` | [source](../../../../../backend/src/services/supabase.service.ts) | Supabase client factory using `AsyncLocalStorage` for per-request JWT binding; exports `getSupabaseClient()`, `getSupabaseAuthClient()`, `runWithToken()` |
| `user.service.ts` | [source](../../../../../backend/src/services/user.service.ts) | User/profile queries: scholar names, required hours, eligible scholars, all UIDs, memo users, team leaders, scholar UIDs, single user lookup |
| `session-log.service.ts` | [source](../../../../../backend/src/services/session-log.service.ts) | Raw session log queries: fetch, cleaned/errored pairs, in-room open sessions, completed sessions — for both front-desk and study session types |
| `session-record.service.ts` | [source](../../../../../backend/src/services/session-record.service.ts) | Weekly aggregated record queries and sync operations: get by UID/week, sync for week (single or all UIDs), update excuse |
| `form-log.service.ts` | [source](../../../../../backend/src/services/form-log.service.ts) | MCF/WHAF/WPL form log queries: individual lookups, batch by UIDs, team leader stat aggregation, recent submissions |
| `memo.service.ts` | [source](../../../../../backend/src/services/memo.service.ts) | Memo sync operations: `syncMemo(weekNum, mode)` with "light" and "heavy" modes |
| `memo-page.service.ts` | [source](../../../../../backend/src/services/memo-page.service.ts) | Memo page data assembly: `getMemoPageData(weekNum)` returns all data needed to render the weekly memo |
| `traffic.service.ts` | [source](../../../../../backend/src/services/traffic.service.ts) | Traffic entry counting: sessions for week, entry count for week, batch counts for multiple weeks |
| `time.service.ts` | [source](../../../../../backend/src/services/time.service.ts) | Campus week utilities re-exported from shared: `dateToCampusWeek`, `campusWeekToDateRange` |
| `mentee.service.ts` | [source](../../../../../backend/src/services/mentee.service.ts) | Mentee relationship queries: `getMyMentees(userId)` via Supabase RPC |
| `daily-scholar-activity.service.ts` | [source](../../../../../backend/src/services/daily-scholar-activity.service.ts) | Daily activity queries: `getTotalMinutesForMenteeWeek({ menteeUid, weekNum, logSource })` |
| `tutor-report-log.service.ts` | [source](../../../../../backend/src/services/tutor-report-log.service.ts) | Tutor report log queries: by week, by UID, by UID+week, attendance check |

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
