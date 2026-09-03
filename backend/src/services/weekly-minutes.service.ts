/**
 * @file weekly-minutes.service.ts
 * @module backend/services
 *
 * Pure campus-week minute rollup from cleaned session tickets.
 * No Supabase access — callers pass already-paired sessions.
 *
 * ## Responsibilities
 * - Bucket completed sessions into Mon–Fri minutes by scholar UID
 *
 * ## What belongs here
 * - computeWeeklyMinutesByUid
 *
 * ## What does NOT belong here
 * - Ticket fetching / pairing (session-log.service)
 * - Excuse storage (attendance-week.service)
 */
import { getEasternDayOfWeek } from "./time.service.js";
import { EMPTY_WEEKLY_MINUTES } from "../models/weekly-minutes.model.js";
import type { WeeklyMinutesByDay } from "../models/weekly-minutes.model.js";
import type { ScholarWithCompletedSession } from "../models/session-log.model.js";
import type { WeekDateRange } from "../models/time.model.js";

export function computeWeeklyMinutesByUid(
  sessions: ScholarWithCompletedSession[],
  weekRange: WeekDateRange
): Map<string, WeeklyMinutesByDay> {
  const { startDate, endDate } = weekRange;
  const startMs = startDate.getTime();
  const endMs = endDate.getTime() + 24 * 60 * 60 * 1000;

  const byUid = new Map<string, WeeklyMinutesByDay>();

  function empty(): WeeklyMinutesByDay {
    return { ...EMPTY_WEEKLY_MINUTES };
  }

  for (const s of sessions) {
    const entryMs = new Date(s.entryAt).getTime();
    if (entryMs < startMs || entryMs >= endMs) continue;
    const uid = s.scholarId ?? "";
    if (!uid) continue;
    if (!byUid.has(uid)) byUid.set(uid, empty());
    const row = byUid.get(uid)!;
    const dayOfWeek = getEasternDayOfWeek(new Date(s.entryAt));
    const durationMin = Math.round(s.durationMs / 60_000);

    switch (dayOfWeek) {
      case 1: row.mon_min += durationMin; break;
      case 2: row.tues_min += durationMin; break;
      case 3: row.wed_min += durationMin; break;
      case 4: row.thurs_min += durationMin; break;
      case 5: row.fri_min += durationMin; break;
      default: break;
    }
  }

  return byUid;
}
