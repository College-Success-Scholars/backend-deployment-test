import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { FrontDeskRecordRow, StudySessionRecordRow } from "@/lib/session-records/types";
import { getFrontDeskRecord, getStudySessionRecord, type RecordKind } from "./records";

/** Payload for updating excuse on a record. */
export interface UpdateExcusePayload {
  excuse: string | null;
  excuse_min: number | null;
}

/**
 * Update excuse and excuse_min for an existing front_desk or study_session record.
 * The record must already exist (e.g. from sync). Returns the updated record or null if not found.
 */
export async function updateRecordExcuse(
  uid: number,
  weekNum: number,
  kind: RecordKind,
  payload: UpdateExcusePayload
): Promise<FrontDeskRecordRow | StudySessionRecordRow | null> {
  const table =
    kind === "front_desk" ? "front_desk_records" : "study_session_records";
  const existing =
    kind === "front_desk"
      ? await getFrontDeskRecord(uid, weekNum)
      : await getStudySessionRecord(uid, weekNum);
  if (!existing) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .update({
      excuse: payload.excuse ?? null,
      excuse_min: payload.excuse_min ?? null,
    })
    .eq("id", existing.id)
    .select()
    .single();
  if (error) throw error;
  return data as FrontDeskRecordRow | StudySessionRecordRow;
}
