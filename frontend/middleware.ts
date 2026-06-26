/**
 * @file middleware.ts
 * @module frontend
 *
 * Next.js Edge Middleware entry point.
 * Re-exports the Supabase session update middleware from lib/supabase/middleware.ts.
 * This runs on every request to refresh the user's Supabase auth session,
 * ensuring Server Components receive an up-to-date JWT.
 *
 * ## What belongs here
 * - The middleware export (Next.js requires this exact file name at the app root)
 * - Matcher config if custom path matching is needed
 *
 * ## What does NOT belong here
 * - Business logic (keep this file as a thin re-export)
 * - Auth guards (those go in individual pages via lib/supabase/server.ts)
 */
export { updateSession as middleware } from "@/lib/supabase/middleware";
