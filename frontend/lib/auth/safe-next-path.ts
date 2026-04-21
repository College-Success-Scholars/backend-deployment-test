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
