# personal-mcf-per-mentee

**Date:** 2026-09-04T182200Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
for the personal and weekly memo page, what the logic to show completion?

---

are they based on mentee amount?

---

make the mcf on the personal page refelc tthe same logi, and for a given week allow users to flip through the different mcfs based on mentee. use a drop down to differenetiate them
```

---

## Purpose

Align personal-page MCF completion with mentee count and add a per-mentee dropdown.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Explained personal vs weekly memo completion, then implemented personal MCF as one form per mentee (roster mentee_count, distinct mentee logs). Personal page now fetches assigned mentees. This-week/history cards show N of M mentees. The MCF detail dialog uses a mentee dropdown to page through that week's check-ins, including missing mentees. Frontend tests 118 passed; frontend build passed.

---

## Code Changes

- `docs/dev/frontend/app/dashboard/README.md`
- `frontend/app/dashboard/personal/page.tsx`
- `frontend/components/personal/personal-client.tsx`
- `frontend/components/personal/utils.test.ts`
- `frontend/components/personal/utils.ts`
- `frontend/lib/types/supabase.ts`
