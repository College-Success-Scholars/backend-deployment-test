import "server-only";
import { backendPatch } from "../api-client";
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types";
import type { RecordKind } from "./records";

export interface UpdateExcusePayload { excuse: string | null; excuse_min: number | null; }

export async function updateRecordExcuse(
  uid: number, weekNum: number, kind: RecordKind, payload: UpdateExcusePayload
): Promise<FrontDeskRecordRow | StudySessionRecordRow | null> {
  const route = kind === "front_desk" ? "front-desk" : "study";
  return backendPatch<FrontDeskRecordRow | StudySessionRecordRow | null>(
    `/api/session-records/${route}/excuse`,
    { uid, weekNum, ...payload }
  );
}
