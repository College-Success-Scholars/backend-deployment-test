import type { ScholarWithCompletedSession } from "@/lib/session-logs";
import { EASTERN_TIMEZONE } from "@/lib/session-logs";

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

/** Get Eastern day of week: 0=Sun, 1=Mon, ..., 6=Sat */
function getEasternDayOfWeek(d: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    weekday: "short",
  });
  const day = formatter.format(d);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? 0;
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
 * Aggregate completed sessions into minutes per weekday (Mon–Fri) per scholar.
 * Sessions are attributed to the day of the entry (Eastern). Weekend sessions
 * are not counted in mon_min..fri_min (no sat/sun columns in records tables).
 *
 * Reusable for front_desk_records and study_session_records.
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
