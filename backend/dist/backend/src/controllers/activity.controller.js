import { getTotalMinutesForMenteeWeek } from "../services/daily-scholar-activity.service.js";
// GET /api/daily-activity/minutes?menteeUid=X&weekNum=Y&logSource=Z
export async function minutes(req, res) {
    try {
        const menteeUid = req.query.menteeUid;
        const weekNumStr = req.query.weekNum;
        const logSource = req.query.logSource;
        if (!menteeUid || !weekNumStr || !logSource) {
            res.status(400).json({ error: "Missing required query parameters: menteeUid, weekNum, logSource" });
            return;
        }
        const weekNum = parseInt(weekNumStr, 10);
        if (Number.isNaN(weekNum) || weekNum < 1) {
            res.status(400).json({ error: "Invalid weekNum" });
            return;
        }
        const data = await getTotalMinutesForMenteeWeek({ menteeUid, weekNum, logSource });
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch activity minutes" });
    }
}
//# sourceMappingURL=activity.controller.js.map