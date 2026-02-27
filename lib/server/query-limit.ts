import "server-only";

const DEFAULT_MESSAGE =
  "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.";

/**
 * Require at least one of startDate, endDate, or non-empty scholarUids.
 * Use before building Supabase queries that filter by date range and/or UIDs.
 *
 * @param options - Query limit options (all optional).
 * @param message - Optional custom error message.
 */
export function requireDateOrUidLimit(
  options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
  },
  message = DEFAULT_MESSAGE
): void {
  const hasDateRange = options?.startDate != null || options?.endDate != null;
  const hasUids = (options?.scholarUids?.length ?? 0) > 0;
  if (!hasDateRange && !hasUids) {
    throw new Error(message);
  }
}
