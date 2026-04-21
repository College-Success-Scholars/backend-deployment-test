import "server-only";
import { backendPost } from "../api-client";
import type { RecentFormSubmission } from "@/lib/form-logs/recent-submission-dto";
import type { ProfilesRow } from "@/lib/supabase/server";

export type { ActivityFormType, RecentFormSubmission } from "@/lib/form-logs/recent-submission-dto";

export function scholarUidFromProfile(profile: ProfilesRow | null): string | null {
  if (typeof profile?.student_id === "number" && Number.isFinite(profile.student_id)) {
    return String(profile.student_id);
  }
  return null;
}

export async function getRecentFormSubmissions(params: {
  profile: ProfilesRow | null;
}): Promise<RecentFormSubmission[]> {
  const uid = scholarUidFromProfile(params.profile);
  if (!uid) return [];
  return backendPost<RecentFormSubmission[]>("/api/form-logs/recent-submissions", { studentId: Number(uid) });
}
