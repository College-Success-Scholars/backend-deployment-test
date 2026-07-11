# backend-tests-missing-heavy-domains

**Date:** 2026-07-11T073931Z
**Severity:** warning
**Category:** integrity

---

## Description

Backend test coverage does not mirror all domains. Only 7 test files exist (auth, health, memo, session-log, user, user.service, reject-writes-when-acting). The heaviest services have no dedicated tests: form-log.service.ts (559 lines), session-record.service.ts (373 lines), traffic.service.ts, tutor-report-log.service.ts, activity, and memo-page.service.ts. These drive memo assembly and scholar attendance records — the highest-risk logic paths.

---

## Affected Files

- `backend/src/services/form-log.service.ts`
- `backend/src/services/session-record.service.ts`
- `backend/src/services/traffic.service.ts`
- `backend/src/services/tutor-report-log.service.ts`
- `backend/src/services/memo-page.service.ts`
- `backend/src/tests/`

---

## Recommendation

Add Vitest coverage for form-log.service.ts and session-record.service.ts first, since they feed memo assembly and attendance records.
