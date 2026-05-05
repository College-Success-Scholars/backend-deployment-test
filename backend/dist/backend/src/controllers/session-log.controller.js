import { fetchFrontDeskLogs, fetchStudySessionLogs, getFrontDeskCleanedAndErrored, getFrontDeskScholarsInRoom, getFrontDeskCompletedSessions, getStudySessionCleanedAndErrored, getStudySessionScholarsInRoom, getStudySessionCompletedSessions, } from "../services/session-log.service.js";
function parseDateOrUndefined(val) {
    if (val == null || val === "")
        return undefined;
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d;
}
// POST /api/session-logs/front-desk
export async function fetchFrontDesk(req, res) {
    try {
        const { startDate, endDate, scholarUids } = req.body;
        const data = await fetchFrontDeskLogs({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch front desk logs" });
    }
}
// POST /api/session-logs/study
export async function fetchStudy(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType } = req.body;
        const data = await fetchStudySessionLogs({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch study session logs" });
    }
}
// POST /api/session-logs/front-desk/cleaned
export async function frontDeskCleaned(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType, treatUnclosedEntryAsError } = req.body;
        const result = await getFrontDeskCleanedAndErrored({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
            treatUnclosedEntryAsError,
        });
        res.json({
            data: {
                byScholarUid: Object.fromEntries(result.byScholarUid),
                allCleaned: result.allCleaned,
                allErrored: result.allErrored,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch cleaned front desk logs" });
    }
}
// POST /api/session-logs/front-desk/in-room
export async function frontDeskInRoom(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType } = req.body;
        const data = await getFrontDeskScholarsInRoom({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch scholars in room" });
    }
}
// POST /api/session-logs/front-desk/completed
export async function frontDeskCompleted(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType } = req.body;
        const data = await getFrontDeskCompletedSessions({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch completed sessions" });
    }
}
// POST /api/session-logs/study/cleaned
export async function studyCleaned(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType, treatUnclosedEntryAsError } = req.body;
        const result = await getStudySessionCleanedAndErrored({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
            treatUnclosedEntryAsError,
        });
        res.json({
            data: {
                byScholarUid: Object.fromEntries(result.byScholarUid),
                allCleaned: result.allCleaned,
                allErrored: result.allErrored,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch cleaned study logs" });
    }
}
// POST /api/session-logs/study/in-room
export async function studyInRoom(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType } = req.body;
        const data = await getStudySessionScholarsInRoom({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch scholars in room" });
    }
}
// POST /api/session-logs/study/completed
export async function studyCompleted(req, res) {
    try {
        const { startDate, endDate, scholarUids, sessionType } = req.body;
        const data = await getStudySessionCompletedSessions({
            startDate: parseDateOrUndefined(startDate),
            endDate: parseDateOrUndefined(endDate),
            scholarUids,
            sessionType,
        });
        res.json({ data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch completed study sessions" });
    }
}
//# sourceMappingURL=session-log.controller.js.map