type ApiLogScope = "server" | "client";

function scopeLabel(scope: ApiLogScope): string {
  return scope === "server" ? "API server→backend" : "API client→backend";
}

/** Join backend base URL and API path into a full request URL. */
export function buildBackendRequestUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, base).href;
}

/** Log an outgoing backend API request. */
export function logApiRequest(
  scope: ApiLogScope,
  method: string,
  url: string
): void {
  console.log(`[${scopeLabel(scope)}] ${method.toUpperCase()} ${url}`);
}

/** Log a completed backend API response. */
export function logApiResponse(
  scope: ApiLogScope,
  method: string,
  url: string,
  status: number,
  durationMs: number
): void {
  console.log(
    `[${scopeLabel(scope)}] ${method.toUpperCase()} ${url} — ${status} (${durationMs}ms)`
  );
}

/** Log a failed backend API response. */
export function logApiError(
  scope: ApiLogScope,
  method: string,
  url: string,
  status: number,
  message: string,
  durationMs: number
): void {
  console.error(
    `[${scopeLabel(scope)}] ${method.toUpperCase()} ${url} — ${status} (${durationMs}ms): ${message}`
  );
}
