import "server-only";
import { backendPost } from "../api-client";
import type { CleanedAndErroredOptions, ScholarsInRoomOptions } from "@/lib/session-logs/session-ticket-utils";
import type { CleanedAndErroredResult, ScholarInRoom, ScholarWithCompletedSession } from "@/lib/session-logs/types";

export async function getStudySessionCleanedAndErrored(options?: { startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: string; } & CleanedAndErroredOptions) {
  const raw = await backendPost<{ byScholarUid: Record<string, any>; allCleaned: any[]; allErrored: any[] }>("/api/session-logs/study/cleaned", {
    startDate: options?.startDate?.toISOString(), endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids, sessionType: options?.sessionType,
    treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
  });
  return { byScholarUid: new Map(Object.entries(raw.byScholarUid)), allCleaned: raw.allCleaned, allErrored: raw.allErrored } as CleanedAndErroredResult;
}

export async function getStudySessionScholarsInRoom(options?: ScholarsInRoomOptions & { startDate?: Date; endDate?: Date; scholarUids?: string[] }): Promise<ScholarInRoom[]> {
  return backendPost<ScholarInRoom[]>("/api/session-logs/study/in-room", {
    startDate: options?.startDate?.toISOString(), endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids, sessionType: options?.sessionType, asOf: options?.asOf?.toISOString(),
  });
}

export async function getStudySessionCompletedSessions(options?: { startDate?: Date; endDate?: Date; scholarUids?: string[]; sessionType?: string; }): Promise<ScholarWithCompletedSession[]> {
  return backendPost<ScholarWithCompletedSession[]>("/api/session-logs/study/completed", {
    startDate: options?.startDate?.toISOString(), endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids, sessionType: options?.sessionType,
  });
}
