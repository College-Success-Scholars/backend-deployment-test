# dead-memo-artifacts-and-parallel-implementations

**Date:** 2026-07-11T073926Z
**Severity:** error
**Category:** integrity

---

## Description

Three parallel memo implementations coexist: (1) current /dashboard/memo with _lib/weekly-memo-assembler.ts, (2) /dashboard/memo-legacy still live and server-assembled via /api/memo/page-data, (3) frontend/legacy/app/memo/memo-content.tsx (1158 lines, excluded from tsconfig). Additionally, frontend/app/dashboard/memo/mock-data.ts (437 lines) appears orphaned with no imports. This creates confusion about which assembler is canonical and leaves dead code in the tree.

---

## Affected Files

- `frontend/app/dashboard/memo/mock-data.ts`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/legacy/app/memo/memo-content.tsx`
- `frontend/app/dashboard/memo/_lib/weekly-memo-assembler.ts`
- `docs/dev/frontend/legacy/README.md`

---

## Recommendation

Remove orphaned memo/mock-data.ts. Set a sunset date for /dashboard/memo-legacy and delete frontend/legacy/ once confirmed unused. Document weekly-memo-assembler.ts as the single canonical memo assembly path.
