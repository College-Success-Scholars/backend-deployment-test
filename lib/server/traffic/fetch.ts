import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TrafficRow } from "@/lib/traffic/types";

const TRAFFIC_FETCH_REQUIRED_OPTIONS_MSG =
  "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.";

export function requireTrafficFetchLimit(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
}): void {
  const hasDateRange =
    options?.startDate != null || options?.endDate != null;
  const hasUids = (options?.scholarUids?.length ?? 0) > 0;
  if (!hasDateRange && !hasUids) {
    throw new Error(TRAFFIC_FETCH_REQUIRED_OPTIONS_MSG);
  }
}

export async function fetchTrafficLogs(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
}): Promise<TrafficRow[]> {
  requireTrafficFetchLimit(options);
  const supabase = await createClient();
  let query = supabase
    .from("traffic")
    .select("id, created_at, uid, traffic_type")
    .order("created_at", { ascending: true });
  if (options?.startDate) {
    query = query.gte("created_at", options.startDate.toISOString());
  }
  if (options?.endDate) {
    query = query.lte("created_at", options.endDate.toISOString());
  }
  if (options?.scholarUids?.length) {
    query = query.in("uid", options.scholarUids);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TrafficRow[];
}
