/**
 * Traffic server module. For client-safe types and pure utilities, use @/lib/traffic.
 */

import { campusWeekToDateRange, dateToCampusWeek } from "@/lib/time";
import {
  getTrafficSessions,
  getEntryCountByWeek,
  type TrafficSession,
} from "@/lib/traffic";
import { getWeekFetchEnd } from "@/lib/session-records";
import { fetchTrafficLogs } from "./fetch";

export { fetchTrafficLogs, requireTrafficFetchLimit } from "./fetch";

export async function getTrafficSessionsForWeek(
  weekNumber: number
): Promise<TrafficSession[]> {
  const range = campusWeekToDateRange(weekNumber);
  if (!range) return [];
  const endDate = getWeekFetchEnd(range);
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
  const endDate = getWeekFetchEnd(range);
  const rows = await fetchTrafficLogs({
    startDate: range.startDate,
    endDate,
  });
  return getEntryCountByWeek(rows, weekNumber);
}

export type WeekEntryCount = { weekNumber: number; entryCount: number };

/**
 * Entry counts per week for the given week numbers. Fetches traffic once for the
 * combined date range, then aggregates by week (for use in line chart etc.).
 */
export async function getTrafficEntryCountsForWeeks(
  weekNumbers: number[]
): Promise<WeekEntryCount[]> {
  if (weekNumbers.length === 0) return [];
  const ranges = weekNumbers
    .map((w) => campusWeekToDateRange(w))
    .filter((r): r is NonNullable<typeof r> => r != null);
  if (ranges.length === 0) return [];
  const startDate = ranges.reduce(
    (min, r) => (r.startDate.getTime() < min.getTime() ? r.startDate : min),
    ranges[0].startDate
  );
  const endDate = ranges.reduce(
    (max, r) => {
      const end = getWeekFetchEnd(r);
      return end.getTime() > max.getTime() ? end : max;
    },
    getWeekFetchEnd(ranges[0])
  );
  const rows = await fetchTrafficLogs({ startDate, endDate });
  const currentCampusWeek = dateToCampusWeek(new Date());
  const result: WeekEntryCount[] = weekNumbers.map((weekNumber) => ({
    weekNumber,
    entryCount: getEntryCountByWeek(rows, weekNumber),
  }));
  // Use a fresh fetch for the current week so the line chart matches "Entry tickets this week" (no stale batch/cache).
  if (
    currentCampusWeek != null &&
    weekNumbers.includes(currentCampusWeek)
  ) {
    const freshCount = await getTrafficEntryCountForWeek(currentCampusWeek);
    const idx = result.findIndex((r) => r.weekNumber === currentCampusWeek);
    if (idx >= 0) result[idx] = { weekNumber: currentCampusWeek, entryCount: freshCount };
  }
  return result;
}
