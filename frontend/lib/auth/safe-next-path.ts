/**
 * @file safe-next-path.ts
 * @module frontend/lib/auth
 *
 * Utility for validating redirect paths in post-auth flows.
 * Prevents open-redirect vulnerabilities by rejecting external and
 * protocol-relative URLs before they are passed to next/navigation's redirect().
 *
 * ## Responsibilities
 * - Validate that a redirect path is a safe in-app path
 *
 * ## What belongs here
 * - Auth redirect safety utilities
 *
 * ## What does NOT belong here
 * - Supabase auth calls (use lib/supabase/server.ts)
 * - Role checks or access guards
 */

/**
 * Returns a safe in-app path for post-auth redirects. Rejects protocol-relative
 * and external URLs to avoid open redirects.
 */
export function getSafeInternalPath(
  path: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (path == null || typeof path !== "string") return fallback;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  return trimmed;
}
