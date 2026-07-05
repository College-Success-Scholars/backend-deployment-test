# weekly-memo-week-navigation-polish

**Date:** 2026-07-02T005434Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

```
give the week naviagation on the weekly memo more polishing.

When rendering the page, there should be a skeleton to show that data is loading, and the week selector should have a dropdown to select what week they would like to view
```

Follow-up:

```
make sure that only data pertinent to that week is a skeleton, so that the most visuals are shown to the user while data is being fetched
```

---

## Purpose

Polish `/dashboard/memo` week navigation with a sparse week dropdown and chevrons, while keeping the memo page shell visible during fetches and skeletonizing only week-specific data via a Suspense boundary (not a full-page `loading.tsx`).

---

## Agent Response Summary

Split the weekly memo page into a persistent header shell plus Suspense-wrapped async content keyed by `?week=`. Added `WeeklyMemoWeekNav` (chevrons + shadcn Select on sparse available weeks), client nav context to sync date labels and navigation metadata after fetch, and `WeeklyMemoDataSkeleton` that preserves KPI/section titles and accordion chrome while skeletonizing values, badges, and table bodies. Extracted `computeWeekNavigation` helper shared with memo-legacy. Extended vitest to run app-level tests with `@vitejs/plugin-react`.

---

## Code Changes

- `frontend/app/dashboard/memo/page.tsx`
- `frontend/app/dashboard/memo/page.test.tsx`
- `frontend/app/dashboard/memo/_lib/week-navigation.ts`
- `frontend/app/dashboard/memo/_lib/week-navigation.test.ts`
- `frontend/app/dashboard/memo/_lib/memo-kpi-titles.ts`
- `frontend/app/dashboard/memo/_components/weekly-memo-week-nav.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-nav-context.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-header-shell.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-header.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-async-content.test.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.tsx`
- `frontend/app/dashboard/memo/_components/weekly-memo-data-skeleton.test.tsx`
- `frontend/app/dashboard/memo/_components/memo-accordion-section.tsx`
- `frontend/app/dashboard/memo-legacy/page.tsx`
- `frontend/vitest.config.ts`
- `frontend/package.json`
- `frontend/package-lock.json`
