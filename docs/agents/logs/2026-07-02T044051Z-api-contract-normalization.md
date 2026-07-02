# api-contract-normalization

**Date:** 2026-07-02T044051Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
given these examples, make aplan to find all of them, and address them systematically and wholly
```

Plan iteration:

```
0b could probably be done in a temp file.
before you excute on phase 1, let me see that file before you change anything.
scrap anything that builds out new arcitecture, just change it in file.
```

Execution:

```
Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
```

---

## Purpose

Normalize unintuitive frontend/backend data-shape mismatches at the **API wire boundary** for active paths (dashboard, dev tools, `lib/server`, backend controllers/services). Inline fixes only — no new mapper modules or `shared/api-dto` package. DB schema and `frontend/legacy/` / `app/memo/` left out of scope.

Target conventions (from `docs/agents/ubiquitous_language.md`):

- `scholarId: string` on wire
- `weekNumber` in JSON bodies/query (legacy `weekNum` / `week_num` accepted during transition)
- camelCase response fields
- `{ data: T }` envelope (except documented auth/dev exceptions)
- WAHF spelling in types/fields; `/wahf/` route aliases alongside `/whaf/`

---

## Agent Response Summary

Ran a temp audit checklist, then fixed backend and frontend inline. Memo page payload (`memo-page.service`) now returns camelCase (`scholarName`, `fdPct`, `wahfDonut`, `selectedWeekNumber`, etc.). `trafficCount` wrapped in `{ data }`. Session-log in-room endpoints honor `asOf`. Form logs accept `scholarId` and return camelCase team-leader stats (`wahfCompleted`, …). Session completed/in-room DTOs use `scholarId` instead of `scholarUid`. Weekly memo assembler joins attendance rows by `scholarId`, not display name. Removed decoy `buildTeamLeaderFormStatsForWeek` from `data.ts`. Updated tests and `backend/API.md`. All 26 frontend vitest tests pass; lint clean; backend build passes.

---

## Code Changes

**Backend**

- `backend/API.md`
- `backend/src/controllers/form-log.controller.ts`
- `backend/src/controllers/memo.controller.ts`
- `backend/src/controllers/session-log.controller.ts`
- `backend/src/models/form-log.model.ts`
- `backend/src/models/session-log.model.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/services/form-log.service.ts`
- `backend/src/services/memo-page.service.ts`
- `backend/src/services/session-log.service.ts`
- `backend/src/services/session-record.service.ts`

**Frontend**

- `frontend/app/dashboard/memo/types.ts`
- `frontend/app/dashboard/memo/_lib/memo-source.ts`
- `frontend/app/dashboard/memo/_lib/memo-source.test.ts`
- `frontend/app/dashboard/memo/_lib/week-navigation.ts`
- `frontend/app/dashboard/memo/_lib/week-navigation.test.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.test.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.ts`
- `frontend/app/dashboard/memo/_lib/risk-classifier.test.ts`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/app/dev/form-logs/page.tsx`
- `frontend/app/dev/form-logs/team-leaders-table.tsx`
- `frontend/app/dev/session-logs/page.tsx`
- `frontend/components/form-completion-overview-card.tsx`
- `frontend/lib/server/data.ts`
- `frontend/lib/server/api-client.ts`
- `frontend/lib/client/api-client.ts`
- `frontend/lib/types/form-log.ts`
- `frontend/lib/types/session-log.ts`
- `frontend/lib/types/tutor-report-log.ts`

---

## Intentionally unchanged

- Supabase/DB column names (`whaf_form_logs`, `week_num`, raw `SessionLogRow` snake_case from DB)
- `frontend/legacy/`, `frontend/app/memo/`
- URL path params still `:weekNum`; request filter param still `scholarUids` (plural list)
- Map/Set conversions in `data.ts` for scholar-names / eligible-scholars endpoints

---

## Follow-up

- Migrate legacy memo paths to new wire shapes or delete
- Remove legacy body/query aliases (`week_num`, `weekNum`, `studentId`) once all callers updated
- Optional: camelCase map for raw session log rows on fetch endpoints
