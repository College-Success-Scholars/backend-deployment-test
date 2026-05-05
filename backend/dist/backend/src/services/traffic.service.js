import { getSupabaseClient } from "./supabase.service.js";
import { campusWeekToDateRange, dateToCampusWeek, getWeekFetchEnd } from "./time.service.js";
// ---------------------------------------------------------------------------
// Query limit guard
// ---------------------------------------------------------------------------
function requireDateOrUidLimit(options) {
    const hasDateRange = options?.startDate != null || options?.endDate != null;
    const hasUids = (options?.scholarUids?.length ?? 0) > 0;
    if (!hasDateRange && !hasUids) {
        throw new Error("At least one of startDate, endDate, or scholarUids (non-empty) is required.");
    }
}
// ---------------------------------------------------------------------------
// Supabase fetch
// ---------------------------------------------------------------------------
export async function fetchTrafficLogs(options) {
    requireDateOrUidLimit(options);
    const supabase = getSupabaseClient();
    let query = supabase
        .from("traffic")
        .select("id, created_at, uid, traffic_type")
        .order("created_at", { ascending: true });
    if (options?.startDate)
        query = query.gte("created_at", options.startDate.toISOString());
    if (options?.endDate)
        query = query.lte("created_at", options.endDate.toISOString());
    if (options?.scholarUids?.length)
        query = query.in("uid", options.scholarUids);
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []);
}
// ---------------------------------------------------------------------------
// Pure traffic session logic
// ---------------------------------------------------------------------------
const ONE_HOUR_MS = 60 * 60 * 1000;
function isTrafficEntry(row) {
    return (row.traffic_type ?? "").trim().toLowerCase() === "entry";
}
function isTrafficExit(row) {
    return (row.traffic_type ?? "").trim().toLowerCase() === "exit";
}
export function getTrafficSessions(rows) {
    const byUid = new Map();
    for (const row of rows) {
        const uid = row.uid ?? "";
        if (!uid)
            continue;
        if (!byUid.has(uid))
            byUid.set(uid, []);
        byUid.get(uid).push(row);
    }
    const result = [];
    for (const [, tickets] of byUid) {
        const sorted = [...tickets].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        let i = 0;
        while (i < sorted.length) {
            const row = sorted[i];
            if (isTrafficEntry(row)) {
                const entryAt = row.created_at;
                const entryMs = new Date(entryAt).getTime();
                if (i + 1 < sorted.length && isTrafficExit(sorted[i + 1])) {
                    const exitRow = sorted[i + 1];
                    const exitAt = exitRow.created_at;
                    const exitMs = new Date(exitAt).getTime();
                    result.push({ uid: row.uid, entryAt, exitAt, durationMs: exitMs - entryMs, assumedExit: false });
                    i += 2;
                    continue;
                }
                const exitAt = new Date(entryMs + ONE_HOUR_MS).toISOString();
                result.push({ uid: row.uid, entryAt, exitAt, durationMs: ONE_HOUR_MS, assumedExit: true });
                i += 1;
            }
            else {
                i += 1;
            }
        }
    }
    return result;
}
export function getEntryCountByWeek(rows, weekNumber) {
    return rows.filter((row) => {
        if (!isTrafficEntry(row))
            return false;
        const week = dateToCampusWeek(new Date(row.created_at));
        return week === weekNumber;
    }).length;
}
// ---------------------------------------------------------------------------
// Week-level orchestration
// ---------------------------------------------------------------------------
export async function getTrafficSessionsForWeek(weekNumber) {
    const range = campusWeekToDateRange(weekNumber);
    if (!range)
        return [];
    const endDate = getWeekFetchEnd(range);
    const rows = await fetchTrafficLogs({ startDate: range.startDate, endDate });
    return getTrafficSessions(rows);
}
export async function getTrafficEntryCountForWeek(weekNumber) {
    const range = campusWeekToDateRange(weekNumber);
    if (!range)
        return 0;
    const endDate = getWeekFetchEnd(range);
    const rows = await fetchTrafficLogs({ startDate: range.startDate, endDate });
    return getEntryCountByWeek(rows, weekNumber);
}
export async function getTrafficEntryCountsForWeeks(weekNumbers) {
    if (weekNumbers.length === 0)
        return [];
    const counts = await Promise.all(weekNumbers.map((weekNumber) => getTrafficEntryCountForWeek(weekNumber)));
    return weekNumbers.map((weekNumber, i) => ({ weekNumber, entryCount: counts[i] }));
}
//# sourceMappingURL=traffic.service.js.map