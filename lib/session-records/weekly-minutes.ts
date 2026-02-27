import type { ScholarWithCompletedSession } from "@/lib/session-logs/types";
import { getEasternDayOfWeek } from "@/lib/time";

/**
 * Day-of-week minutes for a single scholar (Monday–Friday).
 * Reusable for front_desk_records and future study_session_records.
 */
export interface WeeklyMinutesByDay {
  mon_min: number;
  tues_min: number;
  wed_min: number;
  thurs_min: number;
  fri_min: number;
}

/**
 * Date range for a campus week (start/end inclusive).
 * Matches CampusWeekDateRange from lib/time for reuse.
 */
export interface WeekDateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Aggregate completed sessions into minutes per weekday (Mon–Fri) per scholar. Use with
 * completed sessions from getScholarsWithValidEntryExit and a week range from
 * campusWeekToDateRange. Sessions are attributed to the day of entry (Eastern);
 * weekend sessions are not counted (no sat/sun in records tables).
 */
export function computeWeeklyMinutesByUid(
  sessions: ScholarWithCompletedSession[],
  weekRange: WeekDateRange
): Map<string, WeeklyMinutesByDay> {
  const { startDate, endDate } = weekRange;
  const startMs = startDate.getTime();
  const endMs = endDate.getTime() + 24 * 60 * 60 * 1000; // end of endDate day

  const byUid = new Map<string, WeeklyMinutesByDay>();

  function empty(): WeeklyMinutesByDay {
    return {
      mon_min: 0,
      tues_min: 0,
      wed_min: 0,
      thurs_min: 0,
      fri_min: 0,
    };
  }

  for (const s of sessions) {
    const entryMs = new Date(s.entryAt).getTime();
    if (entryMs < startMs || entryMs >= endMs) continue;

    const uid = s.scholarUid ?? "";
    if (!uid) continue;

    if (!byUid.has(uid)) {
      byUid.set(uid, empty());
    }
    const row = byUid.get(uid)!;
    const dayOfWeek = getEasternDayOfWeek(new Date(s.entryAt));
    const durationMin = Math.round(s.durationMs / 60_000);

    switch (dayOfWeek) {
      case 1:
        row.mon_min += durationMin;
        break;
      case 2:
        row.tues_min += durationMin;
        break;
      case 3:
        row.wed_min += durationMin;
        break;
      case 4:
        row.thurs_min += durationMin;
        break;
      case 5:
        row.fri_min += durationMin;
        break;
      default:
        break;
    }
  }

  return byUid;
}
