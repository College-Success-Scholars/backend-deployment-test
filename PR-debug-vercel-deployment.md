# fix(vercel): Supabase middleware, env keys, and build hygiene for production

## Summary

This branch fixes broken Vercel previews and production behavior where **unauthenticated requests for Next.js static assets** were intercepted by Supabase auth middleware and **redirected to the login page** (HTML instead of CSS, JS, and fonts). It also **standardizes Supabase public key resolution** across several possible environment variable names so Vercel and the Supabase dashboard stay in sync. Supporting TypeScript and ambient declaration updates help the Vercel build pass cleanly; temporary debug logging added during investigation was removed.

## Branch scope

`debug-vercel-deployment` is **93 commits** ahead of `main` (merge-base `c91e3fc`). The **deployment-focused work** described below is concentrated in the commits at the tip of the branch (Mar 26–27, 2026). If you open one PR that merges this entire branch into `main`, the diff will include all prior work merged from `develop` as well as these fixes.

## What was wrong

- **Static assets hit auth redirects.** Middleware ran session logic for every path. For users without a session, requests to `/_next/static/*` and similar could receive a **302 to `/auth/login`** instead of the asset, so the deployed app looked unstyled or failed to load chunks.
- **Supabase public key env naming.** Dashboards and docs use different names (publishable vs anon). Hard-coding a single variable name can leave `hasEnvVars` false or clients without a key in some Vercel environments.
- **Build friction.** TypeScript needed explicit `.d.ts` coverage and small type fixes so `next build` succeeds on Vercel.

## What we changed

| Area | Change |
|------|--------|
| **Middleware static bypass** | In `lib/supabase/middleware.ts`, return early when `pathname` starts with `/_next` or `/favicon` so auth redirects never apply to Next.js static output or favicon requests. |
| **Supabase public key** | Added `lib/supabase/public-key.ts` with `getSupabasePublicKey()` resolving, in order: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| **Consumers** | Middleware, server client, browser client, and `lib/utils.ts` (`hasEnvVars`) use the same resolver so middleware and app code agree. |
| **TypeScript / build** | `tsconfig.json` includes `**/*.d.ts`; ambient modules `d3.d.ts`, `recharts.d.ts`; targeted type improvements in dashboard and traffic components. |
| **Cleanup** | Removed temporary logging from Supabase client creation in `lib/supabase/client.ts` and `lib/supabase/server.ts`. |

## Deployment-focused commits (chronological)

| Commit | Message |
|--------|---------|
| `3d07a9a` | Update TypeScript configuration and enhance component type safety |
| `987b0e7` | Refactor Supabase key handling to support multiple environment variables |
| `eb77eda` | Refactor Supabase key retrieval to improve environment variable handling |
| `19188fc` | Remove agent logging from Supabase client creation functions in both client.ts and server.ts for cleaner code and improved maintainability. |
| `d29615d` | Enhance middleware to bypass auth redirects for Next.js static assets |

## Vercel checklist

1. In the Vercel project, set **`NEXT_PUBLIC_SUPABASE_URL`** to your Supabase project URL.
2. Set **at least one** public Supabase key (anon/publishable) using one of:
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`, or
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, or
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy (or trigger a new preview) so env vars are applied to the build and runtime.
4. Smoke-test an **incognito** session: load `/` and confirm **static assets** under `/_next/` return **200** with correct `Content-Type` (not an HTML login redirect).

## Files touched (deployment fixes)

- `middleware.ts` (re-exports Supabase middleware)
- `lib/supabase/middleware.ts`, `lib/supabase/public-key.ts`, `lib/supabase/server.ts`, `lib/supabase/client.ts`
- `lib/utils.ts` (`hasEnvVars`)
- `tsconfig.json`, `d3.d.ts`, `recharts.d.ts`, plus component files from `3d07a9a` as listed in that commit
