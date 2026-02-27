import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireDateOrUidLimit } from "@/lib/server/query-limit";
import type { TrafficRow } from "@/lib/traffic/types";

export function requireTrafficFetchLimit(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
}): void {
  requireDateOrUidLimit(
    options,
    "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search."
  );
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
