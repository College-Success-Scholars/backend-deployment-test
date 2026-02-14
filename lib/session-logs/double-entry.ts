import type { ScholarWithCompletedSession } from "./types";

/**
 * Options for detecting double entries (same scholar in front desk and study session simultaneously).
 */
export interface DoubleEntryOptions {
  /**
   * Minimum overlap in minutes to count as a double entry.
   * Default: 5.
   */
  toleranceMinutes?: number;
}

/**
 * One detected double entry: a scholar had overlapping time in both front desk and study session
 * for at least the tolerance duration.
 */
export interface DoubleEntry {
  scholarUid: string;
  scholarName: string | null;
  /** Study session that overlapped */
  studySession: ScholarWithCompletedSession;
  /** Front desk session that overlapped */
  frontDeskSession: ScholarWithCompletedSession;
  /** Overlap duration in milliseconds */
  overlapMs: number;
  /** Start of overlap (ISO string) */
  overlapStart: string;
  /** End of overlap (ISO string) */
  overlapEnd: string;
}

const MS_PER_MINUTE = 60 * 1000;

/**
 * Compute overlap in ms between two intervals [start1, end1] and [start2, end2].
 */
function overlapMs(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): { overlapMs: number; overlapStart: number; overlapEnd: number } {
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const duration = Math.max(0, overlapEnd - overlapStart);
  return { overlapMs: duration, overlapStart, overlapEnd };
}

/**
 * Find scholars who were signed into both front desk and study session at the same time
 * for more than the given tolerance (default 5 minutes).
 *
 * Uses completed entry-exit sessions only; compares every study session with every
 * front desk session for the same scholar and reports each overlapping pair that
 * meets the minimum overlap.
 */
export function getDoubleEntries(
  completedStudy: ScholarWithCompletedSession[],
  completedFrontDesk: ScholarWithCompletedSession[],
  options: DoubleEntryOptions = {}
): DoubleEntry[] {
  const toleranceMinutes = options.toleranceMinutes ?? 5;
  const toleranceMs = toleranceMinutes * MS_PER_MINUTE;

  const studyByUid = new Map<string, ScholarWithCompletedSession[]>();
  for (const s of completedStudy) {
    const list = studyByUid.get(s.scholarUid) ?? [];
    list.push(s);
    studyByUid.set(s.scholarUid, list);
  }

  const fdByUid = new Map<string, ScholarWithCompletedSession[]>();
  for (const f of completedFrontDesk) {
    const list = fdByUid.get(f.scholarUid) ?? [];
    list.push(f);
    fdByUid.set(f.scholarUid, list);
  }

  const result: DoubleEntry[] = [];
  const scholarUids = new Set([
    ...studyByUid.keys(),
    ...fdByUid.keys(),
  ]);

  for (const uid of scholarUids) {
    const studySessions = studyByUid.get(uid) ?? [];
    const fdSessions = fdByUid.get(uid) ?? [];
    if (studySessions.length === 0 || fdSessions.length === 0) continue;

    const scholarName =
      studySessions[0]?.scholarName ?? fdSessions[0]?.scholarName ?? null;

    for (const study of studySessions) {
      const studyStart = new Date(study.entryAt).getTime();
      const studyEnd = new Date(study.exitAt).getTime();

      for (const fd of fdSessions) {
        const fdStart = new Date(fd.entryAt).getTime();
        const fdEnd = new Date(fd.exitAt).getTime();

        const { overlapMs: duration, overlapStart, overlapEnd } = overlapMs(
          studyStart,
          studyEnd,
          fdStart,
          fdEnd
        );

        if (duration >= toleranceMs) {
          result.push({
            scholarUid: uid,
            scholarName,
            studySession: study,
            frontDeskSession: fd,
            overlapMs: duration,
            overlapStart: new Date(overlapStart).toISOString(),
            overlapEnd: new Date(overlapEnd).toISOString(),
          });
        }
      }
    }
  }

  return result;
}
