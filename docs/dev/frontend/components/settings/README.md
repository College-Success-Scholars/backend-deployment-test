# components/settings

**Location:** [`frontend/components/settings/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/settings)  
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
| `settings-client.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/settings/settings-client.tsx) | Profile tabs plus **Security** (list MFA factors, rotate authenticator) |

---

## Standards

- **Rendered by `app/dashboard/settings/page.tsx`** — the page fetches current settings and passes them as props.
- **Profile fields are read-only** in this UI; MFA rotation uses the browser Supabase MFA APIs.
- **MFA cannot be disabled** here — lost-phone recovery is via the Supabase Dashboard ([`mfa-reset.md`](../../../supabase/mfa-reset.md)).
