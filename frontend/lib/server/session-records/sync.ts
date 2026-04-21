import "server-only";
import { backendPost } from "../api-client";

export async function syncFrontDeskRecordsForWeek(weekNum: number, uid?: number): Promise<{ upserted: number }> {
  return backendPost<{ upserted: number }>("/api/session-records/front-desk/sync", { weekNum, uid });
}

export async function syncFrontDeskRecordsForWeekAllUids(weekNum: number): Promise<{ upserted: number }> {
  return backendPost<{ upserted: number }>("/api/session-records/front-desk/sync-all", { weekNum });
}

export async function syncStudySessionRecordsForWeek(weekNum: number, uid?: number): Promise<{ upserted: number }> {
  return backendPost<{ upserted: number }>("/api/session-records/study/sync", { weekNum, uid });
}

export async function syncStudySessionRecordsForWeekAllUids(weekNum: number): Promise<{ upserted: number }> {
  return backendPost<{ upserted: number }>("/api/session-records/study/sync-all", { weekNum });
}
