import { getSupabaseClient } from "../services/supabase.service.js";
import { getFrontDeskRecord, getFrontDeskRecordsForWeek, getStudySessionRecord, getStudySessionRecordsForWeek, syncFrontDeskRecordsForWeek, syncFrontDeskRecordsForWeekAllUids, syncStudySessionRecordsForWeek, syncStudySessionRecordsForWeekAllUids, updateRecordExcuse, } from "../services/session-record.service.js";
// GET /api/dev/test
export function test(req, res) {
    res.json({
        ok: true,
        message: "Developer API test successful",
        user: req.authUser?.email,
        timestamp: new Date().toISOString(),
    });
}
// GET /api/dev/me
export function me(req, res) {
    res.json({
        user: {
            id: req.authUser?.id ?? null,
            email: req.authUser?.email ?? null,
        },
        profile: req.profile
            ? { app_role: req.profile.app_role, email: req.profile.emails?.[0] ?? null }
            : null,
    });
}
// ---------------------------------------------------------------------------
// Front desk records
// ---------------------------------------------------------------------------
// GET /api/dev/session-records/front-desk?week=X&uid=Y
export async function getFrontDesk(req, res) {
    const week = req.query.week;
    const uid = req.query.uid;
    if (!week) {
        res.status(400).json({ error: "Missing week query parameter" });
        return;
    }
    const weekNum = parseInt(week, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
        res.status(400).json({ error: "Invalid week" });
        return;
    }
    try {
        if (!uid || uid.trim() === "") {
            const data = await getFrontDeskRecordsForWeek(weekNum);
            res.json({ data });
            return;
        }
        const uidNum = parseInt(uid, 10);
        if (Number.isNaN(uidNum)) {
            res.status(400).json({ error: "Invalid uid" });
            return;
        }
        const data = await getFrontDeskRecord(uidNum, weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch record" });
    }
}
// POST /api/dev/session-records/front-desk/sync
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
        const result = await syncFrontDeskRecordsForWeek(weekNum, uid);
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// POST /api/dev/session-records/front-desk/sync-all
export async function syncFrontDeskAll(req, res) {
    const { weekNum } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    try {
        const result = await syncFrontDeskRecordsForWeekAllUids(weekNum);
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// PATCH /api/dev/session-records/front-desk/excuse
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
        console.error("[PATCH front-desk/excuse]", e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to update excuse" });
    }
}
// ---------------------------------------------------------------------------
// Study session records
// ---------------------------------------------------------------------------
// GET /api/dev/session-records/study?week=X&uid=Y
export async function getStudy(req, res) {
    const week = req.query.week;
    const uid = req.query.uid;
    if (!week) {
        res.status(400).json({ error: "Missing week query parameter" });
        return;
    }
    const weekNum = parseInt(week, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
        res.status(400).json({ error: "Invalid week" });
        return;
    }
    try {
        if (!uid || uid.trim() === "") {
            const data = await getStudySessionRecordsForWeek(weekNum);
            res.json({ data });
            return;
        }
        const uidNum = parseInt(uid, 10);
        if (Number.isNaN(uidNum)) {
            res.status(400).json({ error: "Invalid uid" });
            return;
        }
        const data = await getStudySessionRecord(uidNum, weekNum);
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to fetch record" });
    }
}
// POST /api/dev/session-records/study/sync
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
        const result = await syncStudySessionRecordsForWeek(weekNum, uid);
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// POST /api/dev/session-records/study/sync-all
export async function syncStudyAll(req, res) {
    const { weekNum } = req.body;
    if (typeof weekNum !== "number" || weekNum < 1) {
        res.status(400).json({ error: "weekNum must be a number >= 1" });
        return;
    }
    try {
        const result = await syncStudySessionRecordsForWeekAllUids(weekNum);
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Sync failed" });
    }
}
// PATCH /api/dev/session-records/study/excuse
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
        console.error("[PATCH study/excuse]", e);
        res.status(500).json({ error: e instanceof Error ? e.message : "Failed to update excuse" });
    }
}
// ---------------------------------------------------------------------------
// Form logs
// ---------------------------------------------------------------------------
// GET /api/dev/form-logs/:formType/:formId
export async function getFormLog(req, res) {
    const { formType, formId } = req.params;
    const supabase = getSupabaseClient();
    if (formType === "mcf") {
        const { data, error } = await supabase
            .from("mcf_form_logs").select("*").eq("id", formId).maybeSingle();
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: "MCF submission not found." });
            return;
        }
        res.json({ data });
        return;
    }
    if (formType === "wpl") {
        const numericId = Number(formId);
        if (Number.isNaN(numericId)) {
            res.status(400).json({ error: "Invalid WPL ID." });
            return;
        }
        const { data, error } = await supabase
            .from("wpl_form_logs").select("*").eq("id", numericId).maybeSingle();
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: "WPL submission not found." });
            return;
        }
        res.json({ data });
        return;
    }
    res.status(400).json({ error: "Unsupported form type." });
}
//# sourceMappingURL=dev.controller.js.map