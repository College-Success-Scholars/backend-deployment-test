import type { CleanedAndErroredResult } from "./types";

/**
 * Add scholar names to a cleaned-and-errored result using a pre-fetched name map (e.g. from
 * fetchScholarNamesByUids in lib/server/session-logs). Safe to call from client or server.
 */
export function enrichCleanedAndErroredWithNames(
  result: CleanedAndErroredResult,
  nameMap: Map<string, string>
): CleanedAndErroredResult {
  const enrichedByScholarUid = new Map(result.byScholarUid);
  for (const [uid, data] of enrichedByScholarUid) {
    enrichedByScholarUid.set(uid, {
      ...data,
      scholarName: nameMap.get(uid) ?? null,
    });
  }
  return { ...result, byScholarUid: enrichedByScholarUid };
}

/**
 * Add scholar names to items (e.g. ScholarInRoom[] or ScholarWithCompletedSession[]) using a
 * pre-fetched Map<uid, name>. Safe to call from client or server.
 */
export function enrichWithScholarNames<
  T extends { scholarUid: string; scholarName?: string | null },
>(items: T[], nameMap: Map<string, string>): T[] {
  if (items.length === 0) return items;
  return items.map((r) => ({
    ...r,
    scholarName: nameMap.get(r.scholarUid) ?? null,
  }));
}
