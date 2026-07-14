# components/dashboard/widgets

**Location:** [`frontend/components/dashboard/widgets/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dashboard/widgets)  
**Docs:** `docs/dev/frontend/components/dashboard/widgets/README.md`

## Navigation

[← Root](../../../../README.md) › [Frontend](../../../README.md) › [components](../../README.md) › [dashboard](../README.md) › widgets

---

## Files

| File | Description |
|------|-------------|
| `activity-log.tsx` | Server wrapper — fetches activity data |
| `activity-log-client.tsx` | Client activity log with filters |
| `personal-activity-log.tsx` | Server wrapper for personal activity |
| `personal-activity-log-client.tsx` | Client personal activity log |
| `submission-details-modal.tsx` | Form submission detail modal |
| `daily-activity-minutes-note.tsx` | Explainer for daily activity minutes |
| `directory-dashboard.tsx` | Scholar directory view |
| `tutoring-hours.tsx` | Tutoring hours display card |

Related utility: `lib/dashboard/activity-log-dictionary.ts` (type-code labels).

---

## Standards

- Use the server/client pair pattern for any widget that fetches or filters data.
- WA HF status cards live in `mentee-monitoring/wahf-card.tsx` (single canonical component).
