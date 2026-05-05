import { getSupabaseClient } from "./supabase.service.js";
const MINUTES_COLUMN = "duration_minutes";
export async function getTotalMinutesForMenteeWeek(params) {
    const { menteeUid, weekNum, logSource } = params;
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from("daily_scholar_activity")
        .select(MINUTES_COLUMN)
        .eq("mentee_uid", menteeUid)
        .eq("week_num", weekNum)
        .eq("log_source", logSource);
    if (error)
        throw error;
    const rows = (data ?? []);
    return rows.reduce((sum, row) => sum + (row.duration_minutes ?? 0), 0);
}
//# sourceMappingURL=daily-scholar-activity.service.js.map