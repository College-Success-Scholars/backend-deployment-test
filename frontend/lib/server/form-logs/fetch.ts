import "server-only";
import { backendGet } from "../api-client";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";

export async function getMcfFormLogsForWeek(weekNum: number): Promise<McfFormLogRow[]> {
  return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/week/${weekNum}`);
}
export async function getMcfFormLogsByUid(uid: string): Promise<McfFormLogRow[]> {
  return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}`);
}
export async function getMcfFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<McfFormLogRow[]> {
  return backendGet<McfFormLogRow[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/week/${weekNum}`);
}
export async function getWhafFormLogsForWeek(weekNum: number): Promise<WhafFormLogRow[]> {
  return backendGet<WhafFormLogRow[]>(`/api/form-logs/whaf/week/${weekNum}`);
}
export async function getWhafFormLogsByUid(uid: string): Promise<WhafFormLogRow[]> {
  return backendGet<WhafFormLogRow[]>(`/api/form-logs/whaf/uid/${encodeURIComponent(uid)}`);
}
export async function getWplFormLogsForWeek(weekNum: number): Promise<WplFormLogRow[]> {
  return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/week/${weekNum}`);
}
export async function getWplFormLogsByUid(uid: string): Promise<WplFormLogRow[]> {
  return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}`);
}
export async function getWplFormLogsByUidAndWeek(uid: string, weekNum: number): Promise<WplFormLogRow[]> {
  return backendGet<WplFormLogRow[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/week/${weekNum}`);
}
