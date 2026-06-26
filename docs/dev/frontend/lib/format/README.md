# lib/format

**Location:** [`frontend/lib/format/`](../../../../../frontend/lib/format/)  
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
| `form-deadlines.ts` | [source](../../../../../frontend/lib/format/form-deadlines.ts) | Formats form submission deadlines for display (e.g., "Due Friday at 11:59 PM") |
| `form-view-helpers.ts` | [source](../../../../../frontend/lib/format/form-view-helpers.ts) | Helper functions for rendering form log data (label lookups, status formatting) |
| `time.ts` | [source](../../../../../frontend/lib/format/time.ts) | Time/date display formatting — wraps and augments the shared library's format functions for UI-specific needs |

---

## Standards

- **Pure functions only** — no side effects, no API calls, no Supabase.
- **No React** — these are plain TypeScript utility functions.
- **Formatting ≠ logic** — functions here format values for display. They do not compute business values (totals, status, risk levels). Business logic belongs in services or assemblers.
- **Import shared utilities** — time formatting should build on `shared/dist/time.js` rather than re-implementing.
- **Safe in both environments** — no `import "server-only"`, no `window` usage.
