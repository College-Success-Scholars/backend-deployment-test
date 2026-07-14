# frontend/hooks

**Location:** [`frontend/hooks/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/hooks)  
**Docs:** `docs/dev/frontend/hooks/README.md`

## Navigation

[← Root](../../README.md) › [Frontend](../README.md) › hooks

---

## Purpose

Custom React hooks for the frontend. Hooks are client-side only — they use browser APIs or React state/effects. Each hook encapsulates a single reusable behavior.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `use-idle-reset.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/hooks/use-idle-reset.ts) | Detects user inactivity (keyboard, mouse, touch) and calls a callback after a configurable timeout. Used by `IdleResetProvider` to sign the user out after prolonged inactivity. |
| `use-mobile.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/hooks/use-mobile.ts) | Returns `true` when the viewport width is below the mobile breakpoint. Used to adapt layout for small screens. |

---

## Standards

- **Client-side only** — all hooks use browser APIs or React hooks; they cannot run in Server Components.
- **Single responsibility** — each hook does one thing. Do not combine multiple behaviors into one hook.
- **Naming** — `use-<behavior>.ts` (kebab-case, `use` prefix).
- **No data fetching hooks** — data fetching happens in server components or via `lib/server/data.ts`. Client-side data fetching is rare; if needed, build a purpose-specific hook.
- **No business logic** — hooks encapsulate browser behaviors (idle detection, viewport size). Domain logic belongs in `lib/`.
