type ApiLogScope = "server" | "client";

function scopeLabel(scope: ApiLogScope): string {
  return scope === "server" ? "API server→backend" : "API client→backend";
}

/** Log an outgoing backend API request. */
export function logApiRequest(
  scope: ApiLogScope,
  method: string,
  path: string
): void {
  console.log(`[${scopeLabel(scope)}] ${method.toUpperCase()} ${path}`);
}

/** Log a completed backend API response. */
export function logApiResponse(
  scope: ApiLogScope,
  method: string,
  path: string,
  status: number,
  durationMs: number
): void {
  console.log(
    `[${scopeLabel(scope)}] ${method.toUpperCase()} ${path} — ${status} (${durationMs}ms)`
  );
}

/** Log a failed backend API response. */
export function logApiError(
  scope: ApiLogScope,
  method: string,
  path: string,
  status: number,
  message: string,
  durationMs: number
): void {
  console.error(
    `[${scopeLabel(scope)}] ${method.toUpperCase()} ${path} — ${status} (${durationMs}ms): ${message}`
  );
}
