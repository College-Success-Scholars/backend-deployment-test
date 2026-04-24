import { getSupabaseClient } from "./supabase.service.js";
import type { MenteeRow } from "../models/mentee.model.js";

export async function getMyMentees(mentorId: string): Promise<MenteeRow[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("mentor_mentee")
    .select("mentee_uid, user_roster(first_name, last_name, fd_required, ss_required)")
    .eq("mentor_id", mentorId);

  if (error) throw error;
  if (!data) return [];

  return data.map((row: Record<string, unknown>) => {
    const roster = row.user_roster as Record<string, unknown> | null;
    return {
      scholar_uid: row.mentee_uid as string | null,
      first_name: (roster?.first_name as string) ?? null,
      last_name: (roster?.last_name as string) ?? null,
      fd_required: roster?.fd_required != null ? Number(roster.fd_required) : null,
      ss_required: roster?.ss_required != null ? Number(roster.ss_required) : null,
    };
  });
}
