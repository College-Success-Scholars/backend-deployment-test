# Golden path — first PR

**Docs:** `docs/dev/onboarding/golden-path-first-pr.md`

## Navigation

[← Onboarding](README.md) › Golden path (first PR)

**Also read:** [PR template](../pr/TEMPLATE.md) · [Day 0 setup](day-0-setup.md)

---

## Purpose

Ship one narrow vertical slice so you hit every seam that usually bites: `shared` build order, Express route → controller → service, `{ data }` / `{ error }` responses, JWT + RLS, Next.js server data access, Vitest, and the **repo PR template**.

Pick a **tiny, reviewable** change (prefer a supervised ticket). Examples of good first scope:

- Add a field already returned by an existing service to a dashboard display
- Fix a copy / formatting bug with a test
- Extend an existing read endpoint with a well-scoped query param (team-approved)

Avoid first PRs that change auth middleware, RLS, migrations, or `shared/time-config.ts` — see [Ask / don’t touch](ask-and-dont-touch.md).

---

## Mental model (before coding)

Request flow:

```text
Browser / RSC
  → frontend lib/server (JWT from cookies)
  → backend /api/*
       → requireAuth (or stronger)
       → controller
       → service → getSupabaseClient() (RLS via AsyncLocalStorage)
  → { data } | { error }
```

Details: [codebase notes](../../agents/codebase-notes.md), [handbook overview](../README.md).

---

## Walkthrough checklist

### 1. Trace the existing path

1. Open the UI page you’ll touch (e.g. Memo or a dashboard widget).
2. Find the route under `frontend/app/…`.
3. Find the data call (`frontend/lib/server/…` or client API helper).
4. Map to `backend/src/routes/*.routes.ts` → controller → service.
5. Confirm response shape is `{ data: … }`.

### 2. Implement the smallest change

Follow package standards:

- Services own Supabase access — not controllers ([backend services](../backend/src/services/README.md))
- Routes only wire middleware → controller ([routes](../backend/src/routes/README.md))
- Shared types/helpers go in `shared/`, then rebuild shared
- Backend imports use `.js` extensions in `.ts` sources
- Frontend server-only modules stay behind `server-only` where required

### 3. Test what you touched

```bash
# If shared changed:
npm run build --prefix shared

# Backend
cd backend && npm test && npm run build

# Frontend
cd frontend && npm test && npm run build
```

Skip packages you did not change; never skip the package you did. Docker only if containers / shared packaging are involved: `docker compose build` from repo root.

### 4. Open the PR with the canonical template

Copy **[`docs/dev/pr/TEMPLATE.md`](../pr/TEMPLATE.md)** into the PR body (GitHub does not auto-apply it yet).

Fill at least:

- **Summary** — what / why + bold-lead bullets
- **Changelog** — commits + themed Backend / Frontend / Shared / Docs notes
- **Test plan** — checkboxes for the exact scripts you ran (same commands as above)

Example Test plan lines:

```markdown
- [ ] Manual: signed in, opened <page>, saw <expected>
- [ ] `cd backend && npm test`
- [ ] `cd frontend && npm test`
- [ ] `cd frontend && npm run build`   # if frontend changed
```

### 5. Request review

Ping a writer who knows the area — [Miguel](mailto:miguelventura1123@gmail.com), [Ben](mailto:bsaenz454@gmail.com), or [Moosay](mailto:97802676+m0osay@users.noreply.github.com) — and link the issue (`Fixes #…`) when there is one.

---

## Success criteria

- [ ] Change merged or in review with template-complete description
- [ ] Tests / builds for touched packages green
- [ ] No drive-by refactors outside the ticket
