# lib/dashboard

**Location:** [`frontend/lib/dashboard/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/dashboard/)  
**Docs:** `docs/dev/frontend/lib/dashboard/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [lib](../README.md) › dashboard

---

## Purpose

Dashboard-specific presentation helpers (activity log copy, form tone, field summaries). Pure display logic — not data fetching.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `activity-log-dictionary.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/lib/dashboard/activity-log-dictionary.ts) | Tone classes and human-readable summaries for recent form submissions |

---

## Standards

- **No server I/O** — keep this folder free of `backendGet` / Supabase calls.
- **Types from `lib/types`** — do not redefine form-log shapes here.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `activity-log-dictionary` | [API](../../../../reference/api/frontend/lib/dashboard/activity-log-dictionary/README.md) |

<details>
<summary>All exports (2)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `buildActivitySummary` | functions | [docs](../../../../reference/api/frontend/lib/dashboard/activity-log-dictionary/functions/buildActivitySummary.md) |
| `formTone` | variables | [docs](../../../../reference/api/frontend/lib/dashboard/activity-log-dictionary/variables/formTone.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
