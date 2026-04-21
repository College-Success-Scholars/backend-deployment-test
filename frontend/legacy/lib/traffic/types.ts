/**
 * Traffic log types - matches public.traffic in Supabase.
 */

/** Row shape from traffic table */
export interface TrafficRow {
  id: number;
  created_at: string;
  uid: string | null;
  traffic_type: string | null;
}

/** A single traffic session (entry paired with exit, or entry with assumed exit) */
export interface TrafficSession {
  uid: string;
  entryAt: string;
  exitAt: string;
  durationMs: number;
  /** True when exit was assumed (no exit record; assumed 1 hour from entry) */
  assumedExit?: boolean;
}
