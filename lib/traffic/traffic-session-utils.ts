import { getStartOfDayEastern, dateToCampusWeek } from "@/lib/time";
import type { TrafficRow, TrafficSession } from "./types";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

function isEntry(row: TrafficRow): boolean {
  return (row.traffic_type ?? "").trim().toLowerCase() === "entry";
}

function isExit(row: TrafficRow): boolean {
  return (row.traffic_type ?? "").trim().toLowerCase() === "exit";
}

/**
 * For an entry with no exit: assume exit = end of that day (midnight ET = start of next day).
 * Uses lib/time for Eastern calendar day.
 */
function getAssumedExitAt(entryAt: string): string {
  const entryDate = new Date(entryAt);
  const startOfEntryDayEastern = getStartOfDayEastern(entryDate);
  const endOfEntryDayEastern = new Date(
    startOfEntryDayEastern.getTime() + ONE_HOUR_MS
  );
  return endOfEntryDayEastern.toISOString();
}

/**
 * Build traffic sessions from raw rows. Pairs entry with next exit per uid.
 * Unpaired entries are assumed to stay until end of that day (midnight ET).
 */
export function getTrafficSessions(rows: TrafficRow[]): TrafficSession[] {
  const byUid = new Map<string, TrafficRow[]>();
  for (const row of rows) {
    const uid = row.uid ?? "";
    if (!uid) continue;
    if (!byUid.has(uid)) byUid.set(uid, []);
    byUid.get(uid)!.push(row);
  }

  const result: TrafficSession[] = [];

  for (const [, tickets] of byUid) {
    const sorted = [...tickets].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let i = 0;
    while (i < sorted.length) {
      const row = sorted[i];
      if (isEntry(row)) {
        const entryAt = row.created_at;
        const entryMs = new Date(entryAt).getTime();

        if (i + 1 < sorted.length && isExit(sorted[i + 1])) {
          const exitRow = sorted[i + 1];
          const exitAt = exitRow.created_at;
          const exitMs = new Date(exitAt).getTime();
          result.push({
            uid: row.uid!,
            entryAt,
            exitAt,
            durationMs: exitMs - entryMs,
            assumedExit: false,
          });
          i += 2;
          continue;
        }

        const exitAt = getAssumedExitAt(entryAt);
        const exitMs = new Date(exitAt).getTime();
        result.push({
          uid: row.uid!,
          entryAt,
          exitAt,
          durationMs: exitMs - entryMs,
          assumedExit: true,
        });
        i += 1;
      } else {
        i += 1;
      }
    }
  }

  return result;
}

/**
 * Count entry tickets in the given campus week. Uses dateToCampusWeek from lib/time.
 */
export function getEntryCountByWeek(
  rows: TrafficRow[],
  weekNumber: number
): number {
  return rows.filter((row) => {
    if (!isEntry(row)) return false;
    const week = dateToCampusWeek(new Date(row.created_at));
    return week === weekNumber;
  }).length;
}
