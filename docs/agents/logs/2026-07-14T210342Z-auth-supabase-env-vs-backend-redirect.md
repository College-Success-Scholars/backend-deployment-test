# auth-supabase-env-vs-backend-redirect

**Date:** 2026-07-14T210342Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by a line containing only `---`._

```
is there ever a case where controllers use supabase directly?

---

if supabase url or key was incorrect, wouldnt devs be unable to login anyway? Therefore, if they are past the login page, supabase must be wired correctly?

---

log it

---

log it
```

---

## Purpose

Clarify Day 0 auth troubleshooting: login proves frontend Supabase; post-login bounce is usually backend down or mismatched backend Supabase env

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Confirmed auth.controller.ts is the exception that queries Supabase directly (profile load, getProfile, getActiveSemester) via getSupabaseClient; other controllers go through services. Answered that successful login implies frontend NEXT_PUBLIC_SUPABASE_* are wired, but not backend SUPABASE_* or BACKEND_URL — dashboard redirect after login is more often backend down or project key mismatch than bad frontend Supabase env.

---

## Code Changes

_None (Q&A only)._
