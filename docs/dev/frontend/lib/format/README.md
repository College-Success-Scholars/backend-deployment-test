# lib/format

**Location:** [`frontend/lib/format/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/format)  
**Docs:** `docs/dev/frontend/lib/format/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › format

---

## Purpose

Display formatting utilities — pure functions that transform raw data values into human-readable strings for the UI. Safe to import from both server and client components.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `form-deadlines.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/format/form-deadlines.ts) | Formats form submission deadlines for display (e.g., "Due Friday at 11:59 PM") |
| `form-view-helpers.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/format/form-view-helpers.ts) | Helper functions for rendering form log data (label lookups, status formatting) |
| `time.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/format/time.ts) | Time/date display formatting — wraps and augments the shared library's format functions for UI-specific needs |

---

## Standards

- **Pure functions only** — no side effects, no API calls, no Supabase.
- **No React** — these are plain TypeScript utility functions.
- **Formatting ≠ logic** — functions here format values for display. They do not compute business values (totals, status, risk levels). Business logic belongs in services or assemblers.
- **Import shared utilities** — time formatting should build on `shared/dist/time.js` rather than re-implementing.
- **Safe in both environments** — no `import "server-only"`, no `window` usage.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `form-deadlines` | [API](../../../../reference/api/frontend/lib/format/form-deadlines/README.md) |
| `form-view-helpers` | [API](../../../../reference/api/frontend/lib/format/form-view-helpers/README.md) |
| `time` | [API](../../../../reference/api/frontend/lib/format/time/README.md) |

<details>
<summary>All exports (18)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `formatMeetingTime12Hour` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatMeetingTime12Hour.md) |
| `formatProjectItem` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatProjectItem.md) |
| `formatValue` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/formatValue.md) |
| `getMcfWplDeadlineForWeek` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/getMcfWplDeadlineForWeek.md) |
| `getObjectValueByKeyPattern` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/getObjectValueByKeyPattern.md) |
| `getWhafDeadlineForWeek` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/getWhafDeadlineForWeek.md) |
| `gradeScoreClass` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/gradeScoreClass.md) |
| `isEmptyValue` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/isEmptyValue.md) |
| `isMcfLate` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isMcfLate.md) |
| `isMcfLateForWeek` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isMcfLateForWeek.md) |
| `isWhafLate` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isWhafLate.md) |
| `isWhafLateForWeek` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isWhafLateForWeek.md) |
| `isWplLate` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isWplLate.md) |
| `isWplLateForWeek` | functions | [docs](../../../../reference/api/frontend/lib/format/form-deadlines/functions/isWplLateForWeek.md) |
| `missedFieldDisplay` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/missedFieldDisplay.md) |
| `parseNumericGrade` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/parseNumericGrade.md) |
| `parseWplProjectRows` | functions | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/functions/parseWplProjectRows.md) |
| `WplProjectRow` | type-aliases | [docs](../../../../reference/api/frontend/lib/format/form-view-helpers/type-aliases/WplProjectRow.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
