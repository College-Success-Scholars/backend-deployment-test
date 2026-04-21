/**
 * Traffic module - client-safe types and pure session/entry utilities.
 * For server-side data fetching (Supabase), use lib/server/traffic.
 */

export type { TrafficRow, TrafficSession } from "./types";
export {
  getTrafficSessions,
  getEntryCountByWeek,
} from "./traffic-session-utils";
