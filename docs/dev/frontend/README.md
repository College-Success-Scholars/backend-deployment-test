# Frontend

**Location:** [`frontend/`](../../../frontend/)  
**Docs:** `docs/dev/frontend/README.md`

## Navigation

[← Root](../README.md) › Frontend

Children: [app/](app/README.md) · [components/](components/README.md) · [lib/](lib/README.md) · [hooks/](hooks/README.md) · [legacy/](legacy/README.md)

---

## Purpose

The Next.js App Router web application. Provides the UI for scholars, team leaders, and developers. Authenticates users via Supabase, reads domain data by calling the Express backend, and never queries Supabase directly for domain data (only for auth session management).

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `package.json` | [source](../../../frontend/package.json) | Dependencies, scripts, workspace config |
| `tsconfig.json` | [source](../../../frontend/tsconfig.json) | TypeScript config with path aliases (`@/`) |
| `next.config.ts` | [source](../../../frontend/next.config.ts) | Next.js config (externalDir, turbopack root for shared) |
| `middleware.ts` | [source](../../../frontend/middleware.ts) | Thin re-export of `updateSession` from `lib/supabase/middleware.ts` |
| `eslint.config.mjs` | [source](../../../frontend/eslint.config.mjs) | ESLint configuration |
| `vitest.config.ts` | [source](../../../frontend/vitest.config.ts) | Vitest test runner (TZ=America/New_York required) |
| `postcss.config.mjs` | [source](../../../frontend/postcss.config.mjs) | PostCSS config for Tailwind CSS |
| `components.json` | [source](../../../frontend/components.json) | shadcn/ui component configuration |
| `d3.d.ts` | [source](../../../frontend/d3.d.ts) | Type declarations for D3 |
| `recharts.d.ts` | [source](../../../frontend/recharts.d.ts) | Type declarations for Recharts |
| `railway.toml` | [source](../../../frontend/railway.toml) | Railway deployment configuration |
| `README.md` | [source](../../../frontend/README.md) | Original frontend documentation |

---

## Subdirectories

| Directory | Docs | Description |
|-----------|------|-------------|
| `app/` | [app/README.md](app/README.md) | Next.js App Router pages, layouts, and route handlers |
| `components/` | [components/README.md](components/README.md) | Reusable React components |
| `lib/` | [lib/README.md](lib/README.md) | Utility modules, API clients, Supabase helpers, type definitions |
| `hooks/` | [hooks/README.md](hooks/README.md) | Custom React hooks |
| `public/` | _(no docs)_ | Static assets served at `/` |
| `scripts/` | _(no docs)_ | Standalone Node scripts for testing/ops |
| `legacy/` | [legacy/README.md](legacy/README.md) | Deprecated API routes and utilities (do not add to) |

---

## Scripts

```bash
npm run dev        # Next.js dev server with Turbopack (port 3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run test       # Vitest (TZ=America/New_York)
npm run test:watch # Vitest watch mode
```

---

## Path Alias

All imports use the `@/` alias which resolves to `frontend/` root:

```typescript
import { backendGet } from "@/lib/server/api-client";
import { Button } from "@/components/ui/button";
```

---

## Data Access Pattern

```
Server Component
  └─ lib/server/data.ts      ← typed backend API wrappers (use these)
       └─ lib/server/api-client.ts  ← low-level fetch with JWT

Client Component
  └─ fetch() to Next.js route handler  OR
     lib/client/api-client.ts  ← browser-side fetch wrapper

lib/supabase/server.ts  ← auth helpers (getCurrentUser, requireUser, etc.)
  Only for auth state. Never for domain data queries.
```

---

## Standards

- **Server Components by default** — only add `"use client"` when you need browser APIs, event handlers, or React state.
- **Domain data comes from the backend** — use `lib/server/api-client.ts` (server) or `lib/client/api-client.ts` (client). Do not query Supabase tables directly for domain data.
- **Auth via `lib/supabase/server.ts`** — use `requireUser()`, `requireTeamLeaderOrAbove()`, `requireDeveloper()` in page components that need auth guards.
- **`server-only`** — add `import "server-only"` to any module that must not be bundled for the client.
- **No business logic in pages** — pages orchestrate data fetching and render components. Logic belongs in `lib/` or components.
- **shadcn/ui for UI primitives** — add new primitives via `npx shadcn@latest add <component>`, they land in `components/ui/`.
- **Tailwind CSS only** — no inline styles, no CSS modules unless absolutely necessary.
- **Fonts and global styles** — configured once in `app/layout.tsx` and `app/globals.css`.
- **Tests run with `TZ=America/New_York`** — required because campus weeks are Eastern-time based.
