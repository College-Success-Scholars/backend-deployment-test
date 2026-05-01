import { getFrontDeskRecordsByUid, getStudySessionRecordsByUid, getFrontDeskRecordsForWeek, getFrontDeskRecordsForWeekAll, getStudySessionRecordsForWeek, getStudySessionRecordsForWeekAll, getFrontDeskRecord, getStudySessionRecord, syncFrontDeskRecordsForWeek, syncFrontDeskRecordsForWeekAllUids, syncStudySessionRecordsForWeek, syncStudySessionRecordsForWeekAllUids, updateRecordExcuse, } from "../services/session-record.service.js";
function paramStr(val) {
    return Array.isArray(val) ? val[0] : val;
}
function parseWeekNum(val) {
    const s = paramStr(val);
    if (!s)
        return null;
    const n = parseInt(s, 10);
    return Number.isNaN(n) || n < 1 ? null : n;
}
// GET /api/session-records/front-desk/by-uid/:uid
export async function getFrontDeskByUid(req, res) {
    try {
        const uid = paramStr(req.params.uid);
        if (!uid) {
            res.status(400).json({ error: "Missing uid parameter" });
            return;
        }
        const data = await getFrontDeskRecordsByUid(uid);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/study/by-uid/:uid
export async function getStudyByUid(req, res) {
    try {
        const uid = paramStr(req.params.uid);
        if (!uid) {
            res.status(400).json({ error: "Missing uid parameter" });
            return;
        }
        const data = await getStudySessionRecordsByUid(uid);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/front-desk/week/:weekNum
export async function getFrontDeskForWeek(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getFrontDeskRecordsForWeek(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/front-desk/week-all/:weekNum
export async function getFrontDeskForWeekAll(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getFrontDeskRecordsForWeekAll(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/study/week/:weekNum
export async function getStudyForWeek(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getStudySessionRecordsForWeek(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/study/week-all/:weekNum
export async function getStudyForWeekAll(req, res) {
    try {
        const weekNum = parseWeekNum(req.params.weekNum);
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getStudySessionRecordsForWeekAll(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch records" });
    }
}
// GET /api/session-records/front-desk/single/:uid/:weekNum
export async function getFrontDeskSingle(req, res) {
    try {
        const uidStr = paramStr(req.params.uid);
        const uidNum = parseInt(uidStr ?? "", 10);
        const weekNum = parseWeekNum(req.params.weekNum);
        if (Number.isNaN(uidNum)) {
            res.status(400).json({ error: "Invalid uid parameter" });
            return;
        }
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getFrontDeskRecord(uidNum, weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch record" });
    }
}
// GET /api/session-records/study/single/:uid/:weekNum
export async function getStudySingle(req, res) {
    try {
        const uidStr = paramStr(req.params.uid);
        const uidNum = parseInt(uidStr ?? "", 10);
        const weekNum = parseWeekNum(req.params.weekNum);
        if (Number.isNaN(uidNum)) {
            res.status(400).json({ error: "Invalid uid parameter" });
            return;
        }
        if (!weekNum) {
            res.status(400).json({ error: "Invalid weekNum parameter" });
            return;
        }
        const data = await getStudySessionRecord(uidNum, weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch record" });
    }
}
// POST /api/session-records/front-desk/sync
export async function syncFrontDesk(req, res) {
    const { weekNum, uid } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    if (uid !== undefined && (typeof uid !== "number" || Number.isNaN(uid))) {
        res.status(400).json({ error: "uid must be a number if provided" });
        return;
    }
    try {
        const data = await syncFrontDeskRecordsForWeek(weekNum, uid);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// POST /api/session-records/front-desk/sync-all
export async function syncFrontDeskAll(req, res) {
    const { weekNum } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    try {
        const data = await syncFrontDeskRecordsForWeekAllUids(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// POST /api/session-records/study/sync
export async function syncStudy(req, res) {
    const { weekNum, uid } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    if (uid !== undefined && (typeof uid !== "number" || Number.isNaN(uid))) {
        res.status(400).json({ error: "uid must be a number if provided" });
        return;
    }
    try {
        const data = await syncStudySessionRecordsForWeek(weekNum, uid);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// POST /api/session-records/study/sync-all
export async function syncStudyAll(req, res) {
    const { weekNum } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    try {
        const data = await syncStudySessionRecordsForWeekAllUids(weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// PATCH /api/session-records/front-desk/excuse
export async function excuseFrontDesk(req, res) {
    const { uid, weekNum, excuse, excuse_min } = req.body;
    if (uid == null || typeof uid !== "number" || weekNum == null || typeof weekNum !== "number") {
        res.status(400).json({ error: "Body must include uid and weekNum (numbers)" });
        return;
    }
    if (weekNum < 1) {
        res.status(400).json({ error: "Invalid weekNum" });
        return;
    }
    try {
        const data = await updateRecordExcuse(uid, weekNum, "front_desk", {
            excuse: excuse ?? null, excuse_min: excuse_min ?? null,
        });
        if (!data) {
            res.status(404).json({ error: "Record not found for this uid and week" });
            return;
        }
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to update excuse" });
    }
}
// PATCH /api/session-records/study/excuse
export async function excuseStudy(req, res) {
    const { uid, weekNum, excuse, excuse_min } = req.body;
    if (uid == null || typeof uid !== "number" || weekNum == null || typeof weekNum !== "number") {
        res.status(400).json({ error: "Body must include uid and weekNum (numbers)" });
        return;
    }
    if (weekNum < 1) {
        res.status(400).json({ error: "Invalid weekNum" });
        return;
    }
    try {
        const data = await updateRecordExcuse(uid, weekNum, "study_session", {
            excuse: excuse ?? null, excuse_min: excuse_min ?? null,
        });
        if (!data) {
            res.status(404).json({ error: "Record not found for this uid and week" });
            return;
        }
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to update excuse" });
    }
}
//# sourceMappingURL=session-record.controller.js.map