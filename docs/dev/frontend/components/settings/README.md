# components/settings

**Location:** [`frontend/components/settings/`](../../../../../frontend/components/settings/)  
**Docs:** `docs/dev/frontend/components/settings/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › settings

---

## Purpose

Client component for the settings page. Handles user account settings interactions that require browser-side state.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `settings-client.tsx` | [source](../../../../../frontend/components/settings/settings-client.tsx) | Client component rendering the settings form and handling save/update interactions |

---

## Standards

- **Rendered by `app/dashboard/settings/page.tsx`** — the page fetches current settings and passes them as props.
- **Mutations go through Supabase client** — use the client-side Supabase client from `lib/supabase/client.ts` for profile updates.
