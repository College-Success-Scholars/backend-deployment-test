# components/personal

**Location:** [`frontend/components/personal/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/personal)  
**Docs:** `docs/dev/frontend/components/personal/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › personal

---

## Purpose

Client components and utilities for the personal dashboard page (`/dashboard/personal`), which shows a scholar's own activity log, hours, and form submissions.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `personal-client.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/personal/personal-client.tsx) | Main client component for the personal page — week selector, activity display |
| `utils.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/personal/utils.ts) | Data formatting utilities specific to the personal page |

---

## Standards

- **Personal page only** — these components are not reused elsewhere. If a component becomes shared, move it to the parent `components/` directory.
- **`utils.ts` for transformations** — data calculations (e.g., total hours from session records) go in `utils.ts`, not in the component.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). Module index: [browse folder](../../../../reference/api/frontend/components/personal/utils/README.md).

### Functions

| Symbol | Detail |
|--------|--------|
| `computeWeekOptions` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/computeWeekOptions.md) |
| `findSubmissionForIsoWeek` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/findSubmissionForIsoWeek.md) |
| `formatIsoWeekRangeWithYear` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/formatIsoWeekRangeWithYear.md) |
| `formatSubmittedDateTime` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/formatSubmittedDateTime.md) |
| `formatSubmittedDay` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/formatSubmittedDay.md) |
| `formatWeekDateRange` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/formatWeekDateRange.md) |
| `getFormStatusForWeek` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/getFormStatusForWeek.md) |
| `getGreeting` | [docs](../../../../reference/api/frontend/components/personal/utils/functions/getGreeting.md) |

### Type aliases

| Symbol | Detail |
|--------|--------|
| `FormStatus` | [docs](../../../../reference/api/frontend/components/personal/utils/type-aliases/FormStatus.md) |
| `FormStatusResult` | [docs](../../../../reference/api/frontend/components/personal/utils/type-aliases/FormStatusResult.md) |
| `FormType` | [docs](../../../../reference/api/frontend/components/personal/utils/type-aliases/FormType.md) |
| `WeekOption` | [docs](../../../../reference/api/frontend/components/personal/utils/type-aliases/WeekOption.md) |

<!-- AUTO-API-REFERENCE:END -->
