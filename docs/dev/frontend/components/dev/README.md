# components/dev

**Location:** [`frontend/components/dev/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dev/)  
**Docs:** `docs/dev/frontend/components/dev/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › dev

---

## Purpose

Developer-only UI for test-profile acting. Shown when a developer is impersonating a curated test persona. Not used in production scholar/team-leader flows.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `dev-acting-banner.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dev/dev-acting-banner.tsx) | Banner while viewing as a test profile; switch back to My profile |
| `profile-switcher.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/dev/profile-switcher.tsx) | Dropdown to select/clear active dev test profile |

---

## Standards

- **Developer-only** — mount only when `app_role === developer` (or equivalent guard).
- **Mutations via server actions** — profile switches go through `lib/server/dev-profile-actions`, not direct cookie writes in the client beyond the action.
