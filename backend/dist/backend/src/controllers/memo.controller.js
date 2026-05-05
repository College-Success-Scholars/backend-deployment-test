import { syncMemo } from "../services/memo.service.js";
import { getTrafficEntryCountForWeek } from "../services/traffic.service.js";
import { getSupabaseClient } from "../services/supabase.service.js";
import { getMemoPageData } from "../services/memo-page.service.js";
// POST /api/memo/sync
export async function sync(req, res) {
    const { weekNum, mode } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    if (mode !== "light" && mode !== "heavy") {
        res.status(400).json({ error: "mode must be 'light' or 'heavy'" });
        return;
    }
    try {
        const data = await syncMemo(weekNum, mode);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// GET /api/memo/weekly?semesterId=X&weekNum=Y
export async function weeklyMemo(req, res) {
    const semesterId = parseInt(req.query.semesterId, 10);
    const weekNum = parseInt(req.query.weekNum, 10);
    if (Number.isNaN(semesterId) || Number.isNaN(weekNum) || weekNum < 1) {
        res.status(400).json({ error: "semesterId and weekNum are required" });
        return;
    }
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.rpc("get_weekly_memo", {
            p_semester_id: semesterId,
            p_week_num: weekNum,
        });
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch weekly memo" });
    }
}
// POST /api/memo/refresh-stats
export async function refreshStats(req, res) {
    const { week_num, semester_id } = req.body;
    if (!week_num || !semester_id) {
        res.status(400).json({ error: "week_num and semester_id are required" });
        return;
    }
    try {
        // Fire-and-forget to the Supabase edge function
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        fetch(`${supabaseUrl}/functions/v1/refresh_weekly_stats`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${publishableKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ week_num, semester_id }),
        }).catch(() => { });
        res.json({ data: { ok: true } });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to trigger refresh" });
    }
}
// GET /api/memo/page-data?weekNum=X  (weekNum optional — defaults to current campus week)
export async function pageData(req, res) {
    const weekParam = req.query.weekNum;
    let weekNum;
    if (weekParam != null && weekParam !== "") {
        weekNum = parseInt(weekParam, 10);
        if (Number.isNaN(weekNum) || weekNum < 1) {
            res.status(400).json({ error: "weekNum must be a number >= 1" });
            return;
        }
    }
    else {
        const { dateToCampusWeek } = await import("../services/time.service.js");
        const current = dateToCampusWeek(new Date());
        weekNum = current ?? 1;
    }
    try {
        const data = await getMemoPageData(weekNum);
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to build memo page data" });
    }
}
// GET /api/memo/traffic-count?weekNum=X
export async function trafficCount(req, res) {
    const weekParam = req.query.weekNum;
    const weekNum = weekParam != null ? parseInt(weekParam, 10) : NaN;
    if (Number.isNaN(weekNum) || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    const entryCount = await getTrafficEntryCountForWeek(weekNum);
    res.set("Cache-Control", "no-store, max-age=0");
    res.json({ weekNumber: weekNum, entryCount });
}
//# sourceMappingURL=memo.controller.js.map