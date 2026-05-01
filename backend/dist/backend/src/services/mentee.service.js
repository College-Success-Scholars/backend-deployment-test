import { getSupabaseClient } from "./supabase.service.js";
export async function getMyMentees(mentorId) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from("mentor_mentee")
        .select("mentee_uid, user_roster(first_name, last_name, fd_required, ss_required)")
        .eq("mentor_id", mentorId);
    if (error)
        throw error;
    if (!data)
        return [];
    return data.map((row) => {
        const roster = row.user_roster;
        return {
            scholar_uid: row.mentee_uid,
            first_name: roster?.first_name ?? null,
            last_name: roster?.last_name ?? null,
            fd_required: roster?.fd_required != null ? Number(roster.fd_required) : null,
            ss_required: roster?.ss_required != null ? Number(roster.ss_required) : null,
        };
    });
}
//# sourceMappingURL=mentee.service.js.map