import { getSupabaseClient } from "./supabase.service.js";
import { campusWeekToDateRange, getWeekFetchEnd } from "./time.service.js";
export async function getTutorReportLogsForWeek(weekNum) {
    const range = campusWeekToDateRange(weekNum);
    if (!range)
        return [];
    const supabase = getSupabaseClient();
    const endDate = getWeekFetchEnd(range);
    const { data, error } = await supabase
        .from("tutor_report_logs")
        .select("*")
        .gte("created_at", range.startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });
    if (error)
        throw error;
    return (data ?? []);
}
export async function getTutorReportLogsByUid(uid) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from("tutor_report_logs")
        .select("*")
        .eq("scholar_uid", uid)
        .order("created_at", { ascending: true });
    if (error)
        throw error;
    return (data ?? []);
}
export async function getTutorReportLogsByUidAndWeek(uid, weekNum) {
    const range = campusWeekToDateRange(weekNum);
    if (!range)
        return [];
    const supabase = getSupabaseClient();
    const endDate = getWeekFetchEnd(range);
    const { data, error } = await supabase
        .from("tutor_report_logs")
        .select("*")
        .eq("scholar_uid", uid)
        .gte("created_at", range.startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });
    if (error)
        throw error;
    return (data ?? []);
}
export async function didScholarAttendTutoring(uid, weekNum) {
    if (!uid || uid.toLowerCase() === "n/a")
        return false;
    const range = campusWeekToDateRange(weekNum);
    if (!range)
        return false;
    const supabase = getSupabaseClient();
    const endDate = getWeekFetchEnd(range);
    const { count, error } = await supabase
        .from("tutor_report_logs")
        .select("id", { count: "exact", head: true })
        .eq("scholar_uid", uid)
        .gte("created_at", range.startDate.toISOString())
        .lte("created_at", endDate.toISOString());
    if (error)
        throw error;
    return (count ?? 0) > 0;
}
//# sourceMappingURL=tutor-report-log.service.js.map