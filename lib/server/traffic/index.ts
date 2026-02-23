/**
 * Traffic server module. For client-safe types and pure utilities, use @/lib/traffic.
 */

import { campusWeekToDateRange } from "@/lib/time";
import {
  getTrafficSessions,
  getEntryCountByWeek,
  type TrafficSession,
} from "@/lib/traffic";
import { fetchTrafficLogs } from "./fetch";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export { fetchTrafficLogs, requireTrafficFetchLimit } from "./fetch";

export async function getTrafficSessionsForWeek(
  weekNumber: number
): Promise<TrafficSession[]> {
  const range = campusWeekToDateRange(weekNumber);
  if (!range) return [];
  const endDate = new Date(
    range.endDate.getTime() + ONE_DAY_MS - 1
  );
  const rows = await fetchTrafficLogs({
    startDate: range.startDate,
    endDate,
  });
  return getTrafficSessions(rows);
}

export async function getTrafficEntryCountForWeek(
  weekNumber: number
): Promise<number> {
  const range = campusWeekToDateRange(weekNumber);
  if (!range) return 0;
  const endDate = new Date(
    range.endDate.getTime() + ONE_DAY_MS - 1
  );
  const rows = await fetchTrafficLogs({
    startDate: range.startDate,
    endDate,
  });
  return getEntryCountByWeek(rows, weekNumber);
}
