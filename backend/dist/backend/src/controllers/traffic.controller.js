import { getTrafficSessionsForWeek, getTrafficEntryCountForWeek, getTrafficEntryCountsForWeeks, } from "../services/traffic.service.js";
function parseWeekNum(val) {
    const s = Array.isArray(val) ? val[0] : val;
    if (!s)
        return null;
    const n = parseInt(s, 10);
    return Number.isNaN(n) || n < 1 ? null : n;
}
// GET /api/traffic/sessions/:weekNum
export async function sessionsForWeek(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getTrafficSessionsForWeek(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch traffic sessions" });
    }
}
// GET /api/traffic/entry-count/:weekNum
export async function entryCount(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getTrafficEntryCountForWeek(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch entry count" });
    }
}
// POST /api/traffic/entry-counts
export async function entryCounts(req, res) {
    try {
        const { weekNumbers } = req.body;
        if (!Array.isArray(weekNumbers)) {
            res.status(400).json({ error: "weekNumbers must be an array" });
            return;
        }
        const data = await getTrafficEntryCountsForWeeks(weekNumbers);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch entry counts" });
    }
}
//# sourceMappingURL=traffic.controller.js.map