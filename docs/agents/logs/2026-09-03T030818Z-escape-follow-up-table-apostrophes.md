# escape-follow-up-table-apostrophes

**Date:** 2026-09-03T030818Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
does the current dev branch pass tests?

---

well the front end failed on the ci pipeline, frontend-test: frontend/app/dashboard/memo/_components/scholar-follow-up-table.tsx#L57
`'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
```

---

## Purpose

Fix CI frontend-test lint failure from unescaped apostrophes in scholar follow-up table headers.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Confirmed develop tests pass locally (frontend 95, backend 61). Escaped apostrophes in scholar-follow-up-table.tsx table headers with &apos; to satisfy react/no-unescaped-entities, matching existing frontend JSX convention. Frontend lint, tests, theme-safety, and production build all passed.

---

## Code Changes

- `frontend/app/dashboard/memo/_components/scholar-follow-up-table.tsx`
