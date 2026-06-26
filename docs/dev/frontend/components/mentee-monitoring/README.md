# components/mentee-monitoring

**Location:** [`frontend/components/mentee-monitoring/`](../../../../../frontend/components/mentee-monitoring/)  
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
| `mentee-monitoring-client.tsx` | [source](../../../../../frontend/components/mentee-monitoring/mentee-monitoring-client.tsx) | Main client component — mentee selector and card layout |
| `hours-card.tsx` | [source](../../../../../frontend/components/mentee-monitoring/hours-card.tsx) | Front desk and study session hours summary |
| `seminars-card.tsx` | [source](../../../../../frontend/components/mentee-monitoring/seminars-card.tsx) | Seminar attendance status card |
| `tutoring-card.tsx` | [source](../../../../../frontend/components/mentee-monitoring/tutoring-card.tsx) | Tutoring hours card |
| `wahf-card.tsx` | [source](../../../../../frontend/components/mentee-monitoring/wahf-card.tsx) | Weekly Activity Hours Form completion card |
| `utils.ts` | [source](../../../../../frontend/components/mentee-monitoring/utils.ts) | Utility functions for mentee monitoring data formatting |
| `utils.test.ts` | [source](../../../../../frontend/components/mentee-monitoring/utils.test.ts) | Unit tests for utils |

---

## Standards

- **One card per tracking category** — if a new type of mentee data needs to be tracked, add a new `<category>-card.tsx`.
- **Cards are client components** — they receive data as props and handle their own loading/empty states.
- **`utils.ts` for data formatting** — any calculation or formatting specific to mentee monitoring goes in `utils.ts`, not in the card components.
- **Test `utils.ts`** — utility functions must have corresponding tests in `utils.test.ts`.
- **Data flows from `mentee-monitoring-client.tsx`** — the main client fetches data and distributes it to cards via props.
