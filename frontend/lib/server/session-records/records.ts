import "server-only";
import { backendGet } from "../api-client";
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types";

export type RecordKind = "front_desk" | "study_session";

export async function getFrontDeskRecord(uid: number, weekNum: number): Promise<FrontDeskRecordRow | null> {
  return backendGet<FrontDeskRecordRow | null>(`/api/session-records/front-desk/${uid}/week/${weekNum}`);
}

export async function getStudySessionRecord(uid: number, weekNum: number): Promise<StudySessionRecordRow | null> {
  return backendGet<StudySessionRecordRow | null>(`/api/session-records/study/${uid}/week/${weekNum}`);
}

export async function getFrontDeskRecordsByUid(uid: string): Promise<FrontDeskRecordRow[]> {
  return backendGet<FrontDeskRecordRow[]>(`/api/session-records/front-desk/by-uid/${encodeURIComponent(uid)}`);
}

export async function getStudySessionRecordsByUid(uid: string): Promise<StudySessionRecordRow[]> {
  return backendGet<StudySessionRecordRow[]>(`/api/session-records/study/by-uid/${encodeURIComponent(uid)}`);
}

/** Study session record with optional scholar display name and required hours (from public.user_roster). */
export type StudySessionRecordWithName = StudySessionRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

/** Front desk record with optional scholar display name and required hours (from public.user_roster). */
export type FrontDeskRecordWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

export async function getStudySessionRecordsForWeek(weekNum: number): Promise<StudySessionRecordWithName[]> {
  return backendGet<StudySessionRecordWithName[]>(`/api/session-records/study/week/${weekNum}`);
}

export async function getStudySessionRecordsForWeekAll(weekNum: number): Promise<StudySessionRecordWithName[]> {
  return backendGet<StudySessionRecordWithName[]>(`/api/session-records/study/week/${weekNum}/all`);
}

export async function getFrontDeskRecordsForWeek(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  return backendGet<FrontDeskRecordWithName[]>(`/api/session-records/front-desk/week/${weekNum}`);
}

export async function getFrontDeskRecordsForWeekAll(weekNum: number): Promise<FrontDeskRecordWithName[]> {
  return backendGet<FrontDeskRecordWithName[]>(`/api/session-records/front-desk/week/${weekNum}/all`);
}
