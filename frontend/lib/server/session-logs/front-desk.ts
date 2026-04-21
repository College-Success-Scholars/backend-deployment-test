import "server-only";
import { backendPost } from "../api-client";
import type { CleanedAndErroredOptions } from "@/lib/session-logs/session-ticket-utils";
import type { ScholarsInRoomOptions } from "@/lib/session-logs/session-ticket-utils";
import type { CleanedAndErroredResult, ScholarInRoom, ScholarWithCompletedSession, SessionType } from "@/lib/session-logs/types";

export async function getFrontDeskCleanedAndErrored(
  options?: {
    startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string;
  } & CleanedAndErroredOptions
) {
  const raw = await backendPost<{ byScholarUid: Record<string, { cleaned: any[]; errored: any[]; scholarName: string | null }>; allCleaned: any[]; allErrored: any[] }>("/api/session-logs/front-desk/cleaned", {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
  });
  // Convert plain object back to Map
  const byScholarUid = new Map(Object.entries(raw.byScholarUid));
  return { byScholarUid, allCleaned: raw.allCleaned, allErrored: raw.allErrored } as CleanedAndErroredResult;
}

export async function getFrontDeskScholarsInRoom(
  options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }
): Promise<ScholarInRoom[]> {
  return backendPost<ScholarInRoom[]>("/api/session-logs/front-desk/in-room", {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
    asOf: options?.asOf?.toISOString(),
  });
}

export async function getFrontDeskCompletedSessions(options?: {
  startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: SessionType | string;
}): Promise<ScholarWithCompletedSession[]> {
  return backendPost<ScholarWithCompletedSession[]>("/api/session-logs/front-desk/completed", {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
  });
}
