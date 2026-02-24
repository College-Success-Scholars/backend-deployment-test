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
      const end = new Date(r.endDate.getTime() + ONE_DAY_MS - 1);
      return end.getTime() > max.getTime() ? end : max;
    },
    new Date(ranges[0].endDate.getTime() + ONE_DAY_MS - 1)
  );
  const rows = await fetchTrafficLogs({ startDate, endDate });
  return weekNumbers.map((weekNumber) => ({
    weekNumber,
    entryCount: getEntryCountByWeek(rows, weekNumber),
  }));
}
