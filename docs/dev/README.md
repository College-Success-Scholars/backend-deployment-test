# CSS Atlas — Developer Documentation

**Location:** `/` (repo root)  
**Docs:** `docs/dev/README.md`

## Navigation

| Area | Source | Docs |
|------|--------|------|
| [Backend](backend/README.md) | [`backend/`](../../backend/) | Express + TypeScript API |
| [Shared](shared/README.md) | [`shared/`](../../shared/) | Shared TypeScript utilities |
| [Frontend](frontend/README.md) | [`frontend/`](../../frontend/) | Next.js 15 web app |
| [Scripts](scripts/README.md) | [`scripts/`](../../scripts/) | Dev/ops shell scripts |
| [Agent Docs](agents/README.md) | [`docs/agents/`](../agents/) | AI agent knowledge base |

---

## Project Overview

**CSS Atlas** is a full-stack scholar-management platform for a university program. It tracks scholar attendance, mentorship activity, form submissions, and weekly performance data.

### Architecture

```
repo root
├── backend/       Express + TypeScript REST API (port 3001)
├── frontend/      Next.js 15 web application (port 3000)
├── shared/        TypeScript library shared by both
├── docs/          Documentation (agents/ + dev/)
├── scripts/       Shell scripts for deployment/testing
├── Dockerfile.backend
├── Dockerfile.frontend
└── vercel.json
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend runtime | Node.js 22, Express 5, TypeScript |
| Frontend | Next.js 15 (App Router), React, Tailwind CSS |
| Shared utilities | TypeScript compiled library |
| Database + Auth | Supabase (PostgreSQL + JWT) |
| Component library | Radix UI / shadcn-ui |
| Charts | Recharts, D3 |
| Testing | Vitest |
| Deployment | Railway, Vercel, Docker |

---

## Core Request Flow

```
Browser
  └─ Frontend (Next.js Server Component or Client fetch)
       ├─ lib/server/api-client.ts  →  extracts JWT from cookies
       └─ fetch() to backend /api/*
            └─ Backend (Express)
                 ├─ requireAuth middleware  →  validates JWT via Supabase
                 ├─ runWithToken()          →  binds JWT to AsyncLocalStorage
                 ├─ Controller             →  validates inputs, calls services
                 └─ Service               →  queries Supabase (RLS applied)
```

---

## Authentication Model

- Users authenticate via Supabase in the frontend.
- The JWT is stored in cookies by `@supabase/ssr`.
- For backend calls, `frontend/lib/server/api-client.ts` reads the JWT from cookies and attaches it as `Authorization: Bearer <token>`.
- Backend middleware (`requireAuth`, `requireTeamLeaderOrAbove`, `requireDeveloper`) verifies the JWT and loads the user profile.
- Services call `getSupabaseClient()` which reads the JWT from `AsyncLocalStorage` — this means **all Supabase queries in the backend are automatically RLS-scoped to the authenticated user**.

---

## Role Hierarchy

```
null (basic user / scholar)
  └─ team_leader
       └─ developer
```

Roles are stored in `profiles.app_role` (or `user_roster.app_role`).

---

## Environment Variables

### Backend (`.env` in `backend/`)
| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `PORT` | No | Server port (default: `3001`) |
| `CORS_ORIGIN` | No | Comma-separated allowed origins (default: `http://localhost:3002`) |

### Frontend (`.env.local` in `frontend/`)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `BACKEND_URL` | No | Backend URL (default: auto-detected from Vercel env or `http://localhost:3001`) |

---

## Local Development

```bash
# Install dependencies
npm install --prefix backend
npm install --prefix frontend
npm install --prefix shared

# Build shared library (must come first)
npm run build --prefix shared

# Start backend
npm run dev --prefix backend    # port 3001

# Start frontend
npm run dev --prefix frontend   # port 3000
```

---

## Campus Week System

The app uses a **campus week** numbering system (not ISO weeks), defined in `shared/src/time-config.ts`. Week 1 starts on a configurable `FALL_SEMESTER_FIRST_DAY`. Most data queries take a `weekNum` parameter (integer).

---

## Domain Vocabulary

See [`docs/agents/ubiquitous_language.md`](../agents/ubiquitous_language.md) for the full glossary. Key terms:

| Term | Meaning |
|------|---------|
| **Scholar** | A student participant in the program |
| **Team Leader** | A scholar with supervisory responsibilities |
| **Front Desk session** | A general check-in/check-out at the front desk |
| **Study Session** | A dedicated study-room check-in/check-out |
| **MCF** | Mentee Check-in Form |
| **WHAF** | Weekly Hours Activity Form |
| **WPL** | Weekly Performance Log |
| **Memo** | Weekly summary report aggregating all activity data |

---

## Standards Across the Whole Codebase

1. **TypeScript everywhere** — no plain `.js` source files in `backend/src/`, `shared/src/`, or `frontend/` (except compiled output in `dist/`).
2. **Imports use `.js` extension** in backend source — required for Node ESM compatibility even though files are `.ts`.
3. **Shared code lives in `shared/`** — anything used by both backend and frontend must go there, never duplicated.
4. **No Supabase in `shared/`** — shared utilities must be pure TypeScript with no server-side dependencies.
5. **Services own all Supabase access** — controllers must not import from `@supabase/supabase-js` directly.
6. **API responses wrap data** — all backend routes return `{ data: ... }` or `{ error: "..." }`.
7. **No logic in routes** — routes only wire middleware → controller. All business logic is in services.
8. **`server-only` guard** in any frontend module that must not run on the client.

---

## Developer test profiles

Developers (`app_role === developer`) can switch to curated **test personas** stored in `public.dev_test_profiles` (cloud Supabase). This emulates another user's roles and `roster_uid` for read-only debugging without their credentials.

- **My profile** — default; full write access as the developer.
- **Acting as test profile** — true API mutations blocked via a **denylist** in `rejectWritesWhenActing` (not all POSTs); `/api/dev/*` stays writable. See [`docs/dev/backend/src/middleware/README.md`](backend/src/middleware/README.md).
- **Security** — clients send only `dev_test_profiles.id` (cookie → `X-Dev-Active-Profile` header); server resolves `roster_uid` from DB.

Setup: [`docs/dev/supabase/README.md`](supabase/README.md). CI: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
