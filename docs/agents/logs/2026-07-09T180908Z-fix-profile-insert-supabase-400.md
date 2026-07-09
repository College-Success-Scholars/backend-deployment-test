# fix-profile-insert-supabase-400

**Date:** 2026-07-09T180908Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
Reading 400 from Supabase and 500 from backend on complete-profile POST /api/auth/profile insert. Is lines 214-218 the issue? Follow-up: im reading a 400 from supabase, and a 500 from the backend
```

---

## Purpose

Fix Supabase 400 on profiles insert during complete-profile (student_id type + error passthrough)

---

## Agent Response Summary

Diagnosed chain: Supabase PostgREST 400 on profiles.insert(row) bubbled up as backend 500. Root cause likely student_id sent as string while DB column is numeric. Fixed parseCreateProfileBody to coerce student_id to number; CreateScholarProfileInput/buildScholarProfileInsertRow now use numeric student_id. Added formatSupabaseError() and supabaseErrorStatus() so API returns Supabase message/details/hint/code and maps schema/type errors to 400 instead of always 500. Updated user.service.test.ts. Backend build and 28 tests pass.

---

## Code Changes

- `backend/src/controllers/auth.controller.ts`
- `backend/src/services/user.service.ts`
- `backend/src/tests/user.service.test.ts`
