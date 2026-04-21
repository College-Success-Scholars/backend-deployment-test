import { backendGet, backendPost } from "../api-client";
import type { TrafficSession } from "@/lib/traffic";

export { requireTrafficFetchLimit } from "./fetch";

export async function getTrafficSessionsForWeek(weekNumber: number): Promise<TrafficSession[]> {
  return backendGet<TrafficSession[]>(`/api/traffic/sessions/${weekNumber}`);
}

export async function getTrafficEntryCountForWeek(weekNumber: number): Promise<number> {
  return backendGet<number>(`/api/traffic/entry-count/${weekNumber}`);
}

export type WeekEntryCount = { weekNumber: number; entryCount: number };

export async function getTrafficEntryCountsForWeeks(weekNumbers: number[]): Promise<WeekEntryCount[]> {
  if (weekNumbers.length === 0) return [];
  return backendPost<WeekEntryCount[]>("/api/traffic/entry-counts", { weekNumbers });
}
