# components/mentee-monitoring

**Location:** [`frontend/components/mentee-monitoring/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring)  
**Docs:** `docs/dev/frontend/components/mentee-monitoring/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › mentee-monitoring

---

## Purpose

Components for the mentee monitoring page (`/dashboard/mentee`). Team leaders use this page to review each mentee's hours, seminar attendance, tutoring, and weekly activity form completion. Each card represents one category of tracking.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `mentee-monitoring-client.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/mentee-monitoring-client.tsx) | Main client component — mentee selector and card layout |
| `hours-card.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/hours-card.tsx) | Front desk and study session hours summary |
| `seminars-card.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/seminars-card.tsx) | Seminar attendance status card |
| `tutoring-card.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/tutoring-card.tsx) | Tutoring hours card |
| `wahf-card.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/wahf-card.tsx) | Canonical WA HF completion card (used across mentee monitoring) |
| `utils.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/utils.ts) | Utility functions for mentee monitoring data formatting |
| `utils.test.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/mentee-monitoring/utils.test.ts) | Unit tests for utils |

---

## Standards

- **One card per tracking category** — if a new type of mentee data needs to be tracked, add a new `<category>-card.tsx`.
- **One WA HF card** — use `wahf-card.tsx` only; do not duplicate WA HF UI elsewhere.
- **Cards are client components** — they receive data as props and handle their own loading/empty states.
- **`utils.ts` for data formatting** — any calculation or formatting specific to mentee monitoring goes in `utils.ts`, not in the card components.
- **Test `utils.ts`** — utility functions must have corresponding tests in `utils.test.ts`.
- **Data flows from `mentee-monitoring-client.tsx`** — the main client fetches data and distributes it to cards via props.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). Module index: [browse folder](../../../../reference/api/frontend/components/mentee-monitoring/utils/README.md).

### Functions

| Symbol | Detail |
|--------|--------|
| `computeDailyHours` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/computeDailyHours.md) |
| `computeTutoringSessions` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/computeTutoringSessions.md) |
| `computeWahfStatus` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/computeWahfStatus.md) |
| `computeWeekOptions` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/computeWeekOptions.md) |
| `filterActivityForMenteeWeek` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/filterActivityForMenteeWeek.md) |
| `getTodayDayLabel` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/getTodayDayLabel.md) |
| `menteeName` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/menteeName.md) |
| `sumMinutesToHours` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/functions/sumMinutesToHours.md) |

### Type aliases

| Symbol | Detail |
|--------|--------|
| `DailyHoursEntry` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/type-aliases/DailyHoursEntry.md) |
| `TutoringSessionDerived` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/type-aliases/TutoringSessionDerived.md) |
| `WahfStatus` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/type-aliases/WahfStatus.md) |
| `WeekOption` | [docs](../../../../reference/api/frontend/components/mentee-monitoring/utils/type-aliases/WeekOption.md) |

<!-- AUTO-API-REFERENCE:END -->
