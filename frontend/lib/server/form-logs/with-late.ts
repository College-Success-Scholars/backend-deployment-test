import "server-only";
import { backendGet } from "../api-client";
import type { FormLogRowWithLate } from "@/lib/form-logs";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";

export type WhafFormLogRowWithLate = FormLogRowWithLate<WhafFormLogRow>;
export type McfFormLogRowWithLate = FormLogRowWithLate<McfFormLogRow>;
export type WplFormLogRowWithLate = FormLogRowWithLate<WplFormLogRow>;

export async function getWhafFormLogsForWeekWithLate(weekNum: number): Promise<WhafFormLogRowWithLate[]> {
  return backendGet<WhafFormLogRowWithLate[]>(`/api/form-logs/whaf/week/${weekNum}/with-late`);
}
export async function getMcfFormLogsForWeekWithLate(weekNum: number): Promise<McfFormLogRowWithLate[]> {
  return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/week/${weekNum}/with-late`);
}
export async function getMcfFormLogsByUidWithLate(uid: string): Promise<McfFormLogRowWithLate[]> {
  return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/with-late`);
}
export async function getMcfFormLogsByUidAndWeekWithLate(uid: string, weekNum: number): Promise<McfFormLogRowWithLate[]> {
  return backendGet<McfFormLogRowWithLate[]>(`/api/form-logs/mcf/uid/${encodeURIComponent(uid)}/week/${weekNum}/with-late`);
}
export async function getWplFormLogsForWeekWithLate(weekNum: number): Promise<WplFormLogRowWithLate[]> {
  return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/week/${weekNum}/with-late`);
}
export async function getWplFormLogsByUidWithLate(uid: string): Promise<WplFormLogRowWithLate[]> {
  return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/with-late`);
}
export async function getWplFormLogsByUidAndWeekWithLate(uid: string, weekNum: number): Promise<WplFormLogRowWithLate[]> {
  return backendGet<WplFormLogRowWithLate[]>(`/api/form-logs/wpl/uid/${encodeURIComponent(uid)}/week/${weekNum}/with-late`);
}
