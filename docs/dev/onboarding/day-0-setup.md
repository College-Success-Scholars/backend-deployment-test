# Day 0 setup

**Docs:** `docs/dev/onboarding/day-0-setup.md`

## Navigation

[← Onboarding](README.md) › Day 0 setup

**Next:** [Roles & personas](roles-and-personas.md) or [Golden path](golden-path-first-pr.md)

---

## Purpose

Copy-paste checklist from a fresh clone to a running stack. Done when frontend (`:3000`) and backend (`:3001`) are up and you can complete one authenticated API call.

---

## Prerequisites

- Node.js 22+
- Access to the team’s Supabase project (URL + publishable/anon key)
- A developer (or test-capable) login for the app — ask [Miguel](mailto:miguelventura1123@gmail.com) / [Ben](mailto:bsaenz454@gmail.com) if you do not have one yet

---

## Checklist

### 1. Clone and install

```bash
git clone <repo-url>
cd <repo>
./scripts/dev.sh --install
```

`--install` runs `npm install` in `shared/`, `backend/`, and `frontend/`. Prefer this over ad-hoc installs.

To start without reinstalling later:

```bash
./scripts/dev.sh
```

Or, without shared watch:

```bash
./scripts/dev.sh --no-watch
```

Manual equivalent (if you need separate terminals):

```bash
npm install --prefix shared && npm install --prefix backend && npm install --prefix frontend
npm run build --prefix shared   # required before backend/frontend
npm run dev --prefix backend    # :3001
npm run dev --prefix frontend   # :3000
```

### 2. Environment files

Create **`backend/.env`**:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

`CORS_ORIGIN` **must match** the frontend origin. Docker Compose defaults to `:3000`; bare `app.ts` default is `:3002` — local Next is usually `:3000`.

Create **`frontend/.env.local`**:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Full variable table: [Handbook — Environment Variables](../README.md#environment-variables).

### 3. Verify “working”

| Check | Expect |
|-------|--------|
| Frontend | [http://localhost:3000](http://localhost:3000) loads |
| Backend | `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` prints `200` (root health) |
| Auth | Log in via `/auth/login` |
| API | An authenticated dashboard page loads data (or DevTools shows `/api/*` with `200` + `{ data: ... }`) |

Optional smoke (backend only; adjust origin):

```bash
BASE_URL=http://localhost:3001 SMOKE_ORIGIN=http://localhost:3000 bash scripts/smoke-test.sh
```

Details: [Scripts](../scripts/README.md).

---

## Common Day 0 failures

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Frontend can’t reach API / CORS errors | `CORS_ORIGIN` ≠ browser origin | Set `CORS_ORIGIN=http://localhost:3000` in `backend/.env`, restart backend |
| Module / shared import errors | `shared/` not built | `npm run build --prefix shared` then restart |
| Port already in use | Leftover Node process | Free `:3000` / `:3001` or change ports deliberately |
| Sent to `/auth/login` (or bounce off dashboard) even though you just signed in | **Backend not running** on `:3001` (or wrong `BACKEND_URL`) — dashboard calls `GET /api/auth/me`; on failure it treats you as logged out and redirects | Confirm backend is up (`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` → `200`); use `./scripts/dev.sh` so both processes stay alive; check `BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL` |
| Auth redirect loop / empty session (backend is up) | Bad Supabase URL/key in `.env.local` | Double-check `NEXT_PUBLIC_SUPABASE_*` |
| Empty lists but data exists in Supabase | RLS / JWT not attached — see [Auth & RLS runbook](auth-rls-runbook.md) | Confirm cookie session + `Authorization` on API calls |

---

## Success criteria

- [ ] `./scripts/dev.sh` (or equivalent) keeps both apps up
- [ ] You are signed in
- [ ] You can explain in one sentence: backend Supabase queries are RLS-scoped via the JWT bound in `AsyncLocalStorage` ([codebase notes](../../agents/codebase-notes.md))
