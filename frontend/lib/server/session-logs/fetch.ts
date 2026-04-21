import "server-only";
import { backendPost } from "../api-client";
import type { SessionLogRow, SessionType } from "@/lib/session-logs/types";

export async function fetchFrontDeskLogs(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  return backendPost<SessionLogRow[]>("/api/session-logs/front-desk", {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
  });
}

export async function fetchStudySessionLogs(options?: {
  startDate?: Date;
  endDate?: Date;
  scholarUids?: string[];
  sessionType?: SessionType | string;
}): Promise<SessionLogRow[]> {
  return backendPost<SessionLogRow[]>("/api/session-logs/study", {
    startDate: options?.startDate?.toISOString(),
    endDate: options?.endDate?.toISOString(),
    scholarUids: options?.scholarUids,
    sessionType: options?.sessionType,
  });
}

// Remove requireLogFetchLimit - validation now happens on backend
export function requireLogFetchLimit(_options: unknown): void {}
