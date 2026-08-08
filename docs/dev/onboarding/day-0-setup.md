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
- **macOS / Linux:** a normal shell (`bash` / `zsh`) so you can run `./scripts/dev.sh`
- **Windows:** [PowerShell](https://learn.microsoft.com/powershell/) 5.1+ (Windows PowerShell or PowerShell 7). Use `.\scripts\dev.ps1` — do not expect `./scripts/dev.sh` to run in CMD. If scripts are blocked, unblock once for the session: `Set-ExecutionPolicy -Scope Process Bypass`

---

## Checklist

Do these in order. **Environment files come before `dev.sh`** — the script checks for them and exits immediately if they are missing.

### 1. Clone

Pick the script for your OS. `--install` / `-Install` runs `npm install` in `shared/`, `backend/`, and `frontend/`. Prefer this over ad-hoc installs.

**macOS / Linux**

```bash
git clone <repo-url>
cd <repo>
```

### 2. Environment files (required before starting the stack)

**What these are:** local secret/config files that tell each app how to reach Supabase and each other. They are **not** committed to git (see `.gitignore`). Without them, the backend cannot talk to the database and the frontend cannot authenticate or call the API.

Copy the examples, then fill in real values from the team Supabase project (ask [Miguel](mailto:miguelventura1123@gmail.com) / [Ben](mailto:bsaenz454@gmail.com) if you do not have them yet):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit **`backend/.env`** so it looks like:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

`CORS_ORIGIN` **must match** the frontend origin. Docker Compose defaults to `:3000`; bare `app.ts` default is `:3002` — local Next is usually `:3000`.

Edit **`frontend/.env.local`** so it looks like:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Full variable table: [Handbook — Environment Variables](../README.md#environment-variables).

### 3. Install and start with `dev.sh`

**What this script does:** one command that (optionally) installs dependencies, builds `shared/`, then starts the backend (`:3001`) and frontend (`:3000`) together — plus a watcher that rebuilds `shared/` when it changes. Ctrl+C stops everything. It is the preferred Day 0 path over opening multiple terminals by hand.

**Prerequisite:** `backend/.env` and `frontend/.env.local` must already exist (step 2). If either is missing, `dev.sh` prints an error and exits — it will not create the files for you.

First time (install + start):

```bash
./scripts/dev.sh --install
```

`--install` runs `npm install` in `shared/`, `backend/`, and `frontend/`. Prefer this over ad-hoc installs.

**Windows (PowerShell):** use `.\scripts\dev.ps1` instead of `./scripts/dev.sh` (same flags: `-Install`, `-NoWatch`, or `--install` / `--no-watch`).

Later sessions (deps already installed):

```bash
./scripts/dev.sh
# or skip shared watch:
./scripts/dev.sh --no-watch
```

**Windows (PowerShell)**

```powershell
git clone <repo-url>
cd <repo>
.\scripts\dev.ps1 -Install
```

Later starts (no reinstall):

```powershell
.\scripts\dev.ps1
# or skip shared watch:
.\scripts\dev.ps1 -NoWatch
```

Same flags also accept bash-style forms: `--install`, `--no-watch`, `-Help`. Details: [Scripts](../scripts/README.md).

Manual equivalent (any OS, if you need separate terminals):

```bash
npm install --prefix shared && npm install --prefix backend && npm install --prefix frontend
npm run build --prefix shared   # required before backend/frontend
npm run dev --prefix backend    # :3001
npm run dev --prefix frontend   # :3000
```

### 4. Verify “working”

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
| `dev.sh` exits: `Missing backend/.env` (or frontend `.env.local`) | Env files not created yet | Copy the `.env.example` files (step 2), fill in Supabase values, **then** re-run `./scripts/dev.sh` |
| Frontend can’t reach API / CORS errors | `CORS_ORIGIN` ≠ browser origin | Set `CORS_ORIGIN=http://localhost:3000` in `backend/.env`, restart backend |
| Module / shared import errors | `shared/` not built | `npm run build --prefix shared` then restart |
| Port already in use | Leftover Node process | Free `:3000` / `:3001` or change ports deliberately |
| Sent to `/auth/login` (or bounce off dashboard) even though you just signed in | **Backend not running** on `:3001` (or wrong `BACKEND_URL`) — dashboard calls `GET /api/auth/me`; on failure it treats you as logged out and redirects | Confirm backend is up (`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` → `200`); use `./scripts/dev.sh` or `.\scripts\dev.ps1` so both processes stay alive; check `BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL` |
| `.\scripts\dev.ps1` is blocked / “running scripts is disabled” | PowerShell execution policy | `Set-ExecutionPolicy -Scope Process Bypass`, then re-run the script from the repo root |
| `./scripts/dev.sh` fails on Windows | Bash script not meant for CMD/PowerShell | Use `.\scripts\dev.ps1` instead ([Scripts](../scripts/README.md)) |
| Auth redirect loop / empty session (backend is up) | Bad Supabase URL/key in `.env.local` | Double-check `NEXT_PUBLIC_SUPABASE_*` |
| Empty lists but data exists in Supabase | RLS / JWT not attached — see [Auth & RLS runbook](auth-rls-runbook.md) | Confirm cookie session + `Authorization` on API calls |

---

## Success criteria

- [ ] `./scripts/dev.sh` or `.\scripts\dev.ps1` keeps both apps up
- [ ] You are signed in
- [ ] You can explain in one sentence: backend Supabase queries are RLS-scoped via the JWT bound in `AsyncLocalStorage` ([codebase notes](../../agents/codebase-notes.md))
