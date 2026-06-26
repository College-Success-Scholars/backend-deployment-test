# components/personal

**Location:** [`frontend/components/personal/`](../../../../../frontend/components/personal/)  
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
| `personal-client.tsx` | [source](../../../../../frontend/components/personal/personal-client.tsx) | Main client component for the personal page — week selector, activity display |
| `utils.ts` | [source](../../../../../frontend/components/personal/utils.ts) | Data formatting utilities specific to the personal page |

---

## Standards

- **Personal page only** — these components are not reused elsewhere. If a component becomes shared, move it to the parent `components/` directory.
- **`utils.ts` for transformations** — data calculations (e.g., total hours from session records) go in `utils.ts`, not in the component.
