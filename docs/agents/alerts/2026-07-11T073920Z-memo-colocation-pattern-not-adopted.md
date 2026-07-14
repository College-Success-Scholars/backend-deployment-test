# memo-colocation-pattern-not-adopted

**Date:** 2026-07-11T073920Z
**Severity:** error
**Category:** integrity

---

## Description

Only app/dashboard/memo/ uses the documented _components/ and _lib/ colocation pattern (thin page.tsx, route-private UI, pure logic + tests). Other complex dashboard routes keep logic in oversized page.tsx files or single fat client components. personal-client.tsx is 869 lines; internship-board/page.tsx is 757 lines and is a full use client page. When directory, room, or internship-board are wired to real backend data, they risk becoming unmaintainable god files unless colocation is applied from the start.

---

## Affected Files

- `frontend/app/dashboard/memo/page.tsx`
- `frontend/app/dashboard/memo/_components/`
- `frontend/app/dashboard/memo/_lib/`
- `frontend/components/personal/personal-client.tsx`
- `frontend/app/dashboard/internship-board/page.tsx`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/app/dashboard/mentee/page.tsx`
- `docs/dev/frontend/components/README.md`

---

## Recommendation

Spread the memo colocation pattern to the next complex routes: extract _components/ and _lib/ when wiring directory, room, or internship-board to backend data. Start with personal-client.tsx as the nearest candidate.
