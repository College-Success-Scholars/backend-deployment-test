# exclude-graduates-tl-performance

**Date:** 2026-09-03T185304Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
what is the logic to display a team_leader in team_leader preformance

---

dont consider graduates as a part of that logic
```

---

## Purpose

Stop graduated roster rows from appearing on Memo team leader performance.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added isTeamLeaderForPerformance (program_role !== scholar and status !== graduated) and used it in fetchTeamLeaders and memo page TL MCF rows so graduates no longer appear on team leader performance. Tests cover the predicate; memo README and API.md describe the filter.

---

## Code Changes

- `backend/API.md`
- `backend/src/services/memo-page.service.ts`
- `backend/src/services/user.service.ts`
- `backend/src/tests/user.service.test.ts`
- `docs/dev/frontend/app/dashboard/memo/README.md`
