# components/marketing

**Location:** [`frontend/components/marketing/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/marketing)  
**Docs:** `docs/dev/frontend/components/marketing/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › marketing

---

## Purpose

Landing page (public-facing) components. Used by `app/page.tsx` to render the hero and feature showcase shown to unauthenticated visitors.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `landing-hero.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/marketing/landing-hero.tsx) | Main hero section with headline, CTA, and background image |
| `landing-header.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/marketing/landing-header.tsx) | Landing page navigation header |
| `landing-feature-cards.tsx` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/frontend/components/marketing/landing-feature-cards.tsx) | Feature showcase cards describing app capabilities |

---

## Standards

- **No auth checks** — these components are rendered for unauthenticated users.
- **No Supabase or API calls** — these are purely presentational static components.
- **Landing page assets** — images used here live in `frontend/public/`.
