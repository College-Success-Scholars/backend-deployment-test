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
import { SESSION_TYPE_FRONT_DESK } from "@/lib/session-logs/types";
import type { SessionType } from "@/lib/session-logs/types";
import { fetchFrontDeskLogs } from "./fetch";

export async function getFrontDeskCleanedAndErrored(
  options?: {
    startDate?: Date;
    endDate?: Date;
    scholarUids?: string[];
    sessionType?: SessionType | string;
  } & CleanedAndErroredOptions
) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getCleanedAndErroredTickets(rows, undefined, {
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const uids = Array.from(result.byScholarUid.keys());
  const nameMap = await fetchScholarNamesByUids(uids);
  return enrichCleanedAndErroredWithNames(result, nameMap);
}

export async function getFrontDeskScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getScholarsCurrentlyInRoom(rows, undefined, {
    ...options,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}

export async function getFrontDeskCompletedSessions(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}) {
  const rows = await fetchFrontDeskLogs(options);
  const result = getScholarsWithValidEntryExit(rows, undefined, {
    ...options,
    sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
  });
  const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
  return enrichWithScholarNames(result, nameMap);
}
