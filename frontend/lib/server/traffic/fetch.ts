import "server-only";
import type { TrafficRow } from "@/lib/traffic/types";

// Traffic fetch is now done through the traffic index module (which calls backend).
// Keep this file for backwards compat but the actual fetch is done by the backend.
export function requireTrafficFetchLimit(_options?: unknown): void {}

export async function fetchTrafficLogs(_options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[];
}): Promise<TrafficRow[]> {
  // Traffic logs are now fetched by the backend within the week-level functions.
  // This function should not be called directly anymore.
  throw new Error("fetchTrafficLogs is deprecated - use getTrafficSessionsForWeek or getTrafficEntryCountForWeek instead");
}
