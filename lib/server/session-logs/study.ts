import "server-only";
import { fetchScholarNamesByUids } from "@/lib/server/users";
import {
  getCleanedAndErroredTickets,
  getScholarsCurrentlyInRoom,
  getScholarsWithValidEntryExit,
  type CleanedAndErroredOptions,
  type ScholarsInRoomOptions,
} from "@/lib/session-logs/session-ticket-utils";
import {
  enrichCleanedAndErroredWithNames,
  enrichWithScholarNames,
} from "@/lib/session-logs/utils";
import { fetchStudySessionLogs } from "./fetch";

export async function getStudySessionCleanedAndErrored(
  options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: string;
  } & CleanedAndErroredOptions
) {
  const rows = await fetchStudySessionLogs(options);
  const result = getCleanedAndErroredTickets(rows, undefined, {
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
    sessionType: options?.sessionType,
  });
  const uids = Array.from(result.byScholarUid.keys());
  const nameMap = await fetchScholarNamesByUids(uids);
  return enrichCleanedAndErroredWithNames(result, nameMap);
}

export async function getStudySessionScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
) {
  const rows = await fetchStudySessionLogs(options);
  const result = getScholarsCurrentlyInRoom(rows, undefined, options ?? {});
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}

export async function getStudySessionCompletedSessions(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: string;
}) {
  const rows = await fetchStudySessionLogs(options);
  const result = getScholarsWithValidEntryExit(rows, undefined, options ?? {});
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}
