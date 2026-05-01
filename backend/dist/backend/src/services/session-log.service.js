import { getSupabaseClient } from "./supabase.service.js";
import { getStartOfDayEastern } from "./time.service.js";
import { fetchScholarNamesByUids } from "./user.service.js";
import { DEFAULT_SESSION_CONFIG, SESSION_TYPE_FRONT_DESK, } from "../models/session-log.model.js";
// ---------------------------------------------------------------------------
// Query limit guard
// ---------------------------------------------------------------------------
function requireDateOrUidLimit(options) {
    const hasDateRange = options?.startDate != null || options?.endDate != null;
    const hasUids = (options?.scholarUids?.length ?? 0) > 0;
    if (!hasDateRange && !hasUids) {
        throw new Error("At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.");
    }
}
// ---------------------------------------------------------------------------
// Row converters
// ---------------------------------------------------------------------------
function toSessionLogRowFrontDesk(row) {
    return {
        id: row.id,
        created_at: row.created_at,
        scholar_uid: row.scholar_uid,
        action_type: row.action_type,
        rep_name: row.rep_name ?? null,
        session_type: row.session_type ?? SESSION_TYPE_FRONT_DESK,
        submitted_by_email: row.submitted_by_email ?? null,
    };
}
function toSessionLogRowStudy(row) {
    return {
        id: row.id,
        created_at: row.created_at,
        scholar_uid: row.scholar_uid,
        action_type: row.action_type,
        rep_name: row.rep_name,
        session_type: row.session_type,
        submitted_by_email: row.submitted_by_email,
    };
}
// ---------------------------------------------------------------------------
// Supabase fetch
// ---------------------------------------------------------------------------
export async function fetchFrontDeskLogs(options) {
    requireDateOrUidLimit(options);
    const supabase = getSupabaseClient();
    let query = supabase
        .from("front_desk_logs")
        .select("id, created_at, scholar_uid, action_type")
        .order("created_at", { ascending: true });
    if (options?.startDate)
        query = query.gte("created_at", options.startDate.toISOString());
    if (options?.endDate)
        query = query.lte("created_at", options.endDate.toISOString());
    if (options?.scholarUids?.length)
        query = query.in("scholar_uid", options.scholarUids);
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []).map((row) => toSessionLogRowFrontDesk(row));
}
export async function fetchStudySessionLogs(options) {
    requireDateOrUidLimit(options);
    const supabase = getSupabaseClient();
    let query = supabase
        .from("study_session_logs")
        .select("id, created_at, rep_name, scholar_uid, action_type, session_type, submitted_by_email")
        .order("created_at", { ascending: true });
    if (options?.startDate)
        query = query.gte("created_at", options.startDate.toISOString());
    if (options?.endDate)
        query = query.lte("created_at", options.endDate.toISOString());
    if (options?.scholarUids?.length)
        query = query.in("scholar_uid", options.scholarUids);
    if (options?.sessionType)
        query = query.eq("session_type", options.sessionType);
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []).map((row) => toSessionLogRowStudy(row));
}
// ---------------------------------------------------------------------------
// Pure ticket processing
// ---------------------------------------------------------------------------
function isEntry(row, config) {
    return (row.action_type ?? "").trim() === config.entryAction;
}
function isExit(row, config) {
    return (row.action_type ?? "").trim() === config.exitAction;
}
function getEasternDayKey(createdAt) {
    return getStartOfDayEastern(new Date(createdAt)).getTime();
}
function moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored) {
    const lastEntryTicket = tickets.find((t) => t.created_at === lastEntryAt && isEntry(t, config));
    if (!lastEntryTicket)
        return;
    const idx = cleaned.findIndex((p) => p.ticket.id === lastEntryTicket.id);
    if (idx >= 0) {
        cleaned.splice(idx, 1);
        errored.push({ ticket: lastEntryTicket, error: "ENTRY_WITHOUT_SAME_DAY_EXIT" });
    }
}
function filterBySessionType(rows, sessionType) {
    if (sessionType == null || sessionType === "")
        return rows;
    return rows.filter((r) => (r.session_type ?? "").trim() === sessionType);
}
function processScholarTickets(tickets, config, treatUnclosedEntryAsError) {
    const cleaned = [];
    const errored = [];
    let inRoom = false;
    let lastEntryAt = null;
    let lastActionWasExit = false;
    for (const ticket of tickets) {
        const isEntryTicket = isEntry(ticket, config);
        const isExitTicket = isExit(ticket, config);
        if (!isEntryTicket && !isExitTicket) {
            cleaned.push({ ticket });
            lastActionWasExit = false;
            continue;
        }
        if (isEntryTicket) {
            lastActionWasExit = false;
            if (inRoom && lastEntryAt) {
                const lastEntryDay = getEasternDayKey(lastEntryAt);
                const newEntryDay = getEasternDayKey(ticket.created_at);
                if (newEntryDay !== lastEntryDay) {
                    moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
                    inRoom = true;
                    lastEntryAt = ticket.created_at;
                    cleaned.push({ ticket });
                }
                else {
                    errored.push({ ticket, error: "DOUBLE_ENTER" });
                }
            }
            else if (inRoom) {
                errored.push({ ticket, error: "DOUBLE_ENTER" });
            }
            else {
                inRoom = true;
                lastEntryAt = ticket.created_at;
                cleaned.push({ ticket });
            }
            continue;
        }
        // isExitTicket
        if (!inRoom) {
            const errorType = lastActionWasExit ? "DOUBLE_EXIT" : "EXIT_BEFORE_ENTER";
            errored.push({ ticket, error: errorType, pairedEntryAt: lastEntryAt ?? undefined });
            lastActionWasExit = true;
        }
        else {
            const sameDay = getEasternDayKey(lastEntryAt) === getEasternDayKey(ticket.created_at);
            if (!sameDay) {
                moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
                errored.push({ ticket, error: "EXIT_WITHOUT_ENTER", pairedEntryAt: lastEntryAt ?? undefined });
            }
            else {
                cleaned.push({ ticket, pairedEntryAt: lastEntryAt ?? undefined });
            }
            lastActionWasExit = true;
            inRoom = false;
            lastEntryAt = null;
        }
    }
    if (treatUnclosedEntryAsError && inRoom && lastEntryAt) {
        moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
    }
    return { cleaned, errored };
}
export function getCleanedAndErroredTickets(rows, config = DEFAULT_SESSION_CONFIG, options = {}) {
    const { treatUnclosedEntryAsError = false, sessionType } = options;
    const filtered = filterBySessionType(rows, sessionType);
    const byScholarUid = new Map();
    const allCleaned = [];
    const allErrored = [];
    const byUid = new Map();
    for (const row of filtered) {
        const uid = row.scholar_uid ?? "";
        if (!uid)
            continue;
        if (!byUid.has(uid))
            byUid.set(uid, []);
        byUid.get(uid).push(row);
    }
    for (const [uid, tickets] of byUid) {
        const sorted = [...tickets].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const scholarName = sorted[0]?.scholar_name ?? null;
        const { cleaned, errored } = processScholarTickets(sorted, config, treatUnclosedEntryAsError);
        byScholarUid.set(uid, { cleaned, errored, scholarName });
        allCleaned.push(...cleaned);
        allErrored.push(...errored);
    }
    return { byScholarUid, allCleaned, allErrored };
}
export function getScholarsCurrentlyInRoom(rows, config = DEFAULT_SESSION_CONFIG, options = {}) {
    const { sessionType, asOf = new Date() } = options;
    const startOfTodayEastern = getStartOfDayEastern(asOf).getTime();
    const rowsFromToday = rows.filter((r) => new Date(r.created_at).getTime() >= startOfTodayEastern);
    const { byScholarUid } = getCleanedAndErroredTickets(rowsFromToday, config, { sessionType });
    const result = [];
    for (const [uid, { cleaned, scholarName }] of byScholarUid) {
        const entryTickets = cleaned.filter((p) => (p.ticket.action_type ?? "").trim() === config.entryAction);
        const exitTickets = cleaned.filter((p) => (p.ticket.action_type ?? "").trim() === config.exitAction);
        if (entryTickets.length === 0)
            continue;
        const entries = [...entryTickets].sort((a, b) => new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        const exits = [...exitTickets].sort((a, b) => new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        let exitIdx = 0;
        let lastUnmatchedEntry = null;
        for (const entry of entries) {
            const entryTime = new Date(entry.ticket.created_at).getTime();
            while (exitIdx < exits.length && new Date(exits[exitIdx].ticket.created_at).getTime() <= entryTime) {
                exitIdx++;
            }
            if (exitIdx < exits.length) {
                exitIdx++;
                lastUnmatchedEntry = null;
            }
            else {
                lastUnmatchedEntry = entry;
            }
        }
        if (lastUnmatchedEntry) {
            const entryAt = lastUnmatchedEntry.ticket.created_at;
            const timeInRoomMs = asOf.getTime() - new Date(entryAt).getTime();
            result.push({
                scholarUid: uid,
                scholarName,
                entryTicket: lastUnmatchedEntry.ticket,
                entryAt,
                timeInRoomMs: Math.max(0, timeInRoomMs),
                sessionType: lastUnmatchedEntry.ticket.session_type ?? undefined,
            });
        }
    }
    return result;
}
// ---------------------------------------------------------------------------
// Valid entry-exit pairs
// ---------------------------------------------------------------------------
export function getScholarsWithValidEntryExit(rows, config = DEFAULT_SESSION_CONFIG, options = {}) {
    const { sessionType } = options;
    const { byScholarUid } = getCleanedAndErroredTickets(rows, config, { sessionType });
    const result = [];
    for (const [uid, { cleaned, scholarName }] of byScholarUid) {
        const entryTickets = cleaned
            .filter((p) => (p.ticket.action_type ?? "").trim() === config.entryAction)
            .sort((a, b) => new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        const exitTickets = cleaned
            .filter((p) => (p.ticket.action_type ?? "").trim() === config.exitAction)
            .sort((a, b) => new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        for (const exit of exitTickets) {
            const pairedEntryAt = exit.pairedEntryAt;
            if (!pairedEntryAt)
                continue;
            const entry = entryTickets.find((e) => e.ticket.created_at === pairedEntryAt);
            if (!entry)
                continue;
            const entryTime = new Date(pairedEntryAt).getTime();
            const exitTime = new Date(exit.ticket.created_at).getTime();
            result.push({
                scholarUid: uid,
                scholarName,
                entryTicket: entry.ticket,
                exitTicket: exit.ticket,
                entryAt: pairedEntryAt,
                exitAt: exit.ticket.created_at,
                durationMs: exitTime - entryTime,
                sessionType: entry.ticket.session_type ?? undefined,
            });
        }
    }
    return result;
}
// ---------------------------------------------------------------------------
// Enrichment helpers
// ---------------------------------------------------------------------------
export function enrichCleanedAndErroredWithNames(result, nameMap) {
    const enrichedByScholarUid = new Map(result.byScholarUid);
    for (const [uid, data] of enrichedByScholarUid) {
        enrichedByScholarUid.set(uid, { ...data, scholarName: nameMap.get(uid) ?? null });
    }
    return { ...result, byScholarUid: enrichedByScholarUid };
}
export function enrichWithScholarNames(items, nameMap) {
    if (items.length === 0)
        return items;
    return items.map((r) => ({ ...r, scholarName: nameMap.get(r.scholarUid) ?? null }));
}
// ---------------------------------------------------------------------------
// Double entry detection
// ---------------------------------------------------------------------------
const MS_PER_MINUTE = 60 * 1000;
function computeOverlapMs(start1, end1, start2, end2) {
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    return { overlapMs: Math.max(0, overlapEnd - overlapStart), overlapStart, overlapEnd };
}
export function getDoubleEntries(completedStudy, completedFrontDesk, options = {}) {
    const toleranceMs = (options.toleranceMinutes ?? 5) * MS_PER_MINUTE;
    const studyByUid = new Map();
    for (const s of completedStudy) {
        const list = studyByUid.get(s.scholarUid) ?? [];
        list.push(s);
        studyByUid.set(s.scholarUid, list);
    }
    const fdByUid = new Map();
    for (const f of completedFrontDesk) {
        const list = fdByUid.get(f.scholarUid) ?? [];
        list.push(f);
        fdByUid.set(f.scholarUid, list);
    }
    const result = [];
    const scholarUids = new Set([...studyByUid.keys(), ...fdByUid.keys()]);
    for (const uid of scholarUids) {
        const studySessions = studyByUid.get(uid) ?? [];
        const fdSessions = fdByUid.get(uid) ?? [];
        if (studySessions.length === 0 || fdSessions.length === 0)
            continue;
        const scholarName = studySessions[0]?.scholarName ?? fdSessions[0]?.scholarName ?? null;
        for (const study of studySessions) {
            const studyStart = new Date(study.entryAt).getTime();
            const studyEnd = new Date(study.exitAt).getTime();
            for (const fd of fdSessions) {
                const fdStart = new Date(fd.entryAt).getTime();
                const fdEnd = new Date(fd.exitAt).getTime();
                const { overlapMs: duration, overlapStart, overlapEnd } = computeOverlapMs(studyStart, studyEnd, fdStart, fdEnd);
                if (duration >= toleranceMs) {
                    result.push({
                        scholarUid: uid,
                        scholarName,
                        studySession: study,
                        frontDeskSession: fd,
                        overlapMs: duration,
                        overlapStart: new Date(overlapStart).toISOString(),
                        overlapEnd: new Date(overlapEnd).toISOString(),
                    });
                }
            }
        }
    }
    return result;
}
// ---------------------------------------------------------------------------
// Orchestrated fetch + process (front desk)
// ---------------------------------------------------------------------------
export async function getFrontDeskCleanedAndErrored(options) {
    const rows = await fetchFrontDeskLogs(options);
    const result = getCleanedAndErroredTickets(rows, undefined, {
        treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
        sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
    });
    const uids = Array.from(result.byScholarUid.keys());
    const nameMap = await fetchScholarNamesByUids(uids);
    return enrichCleanedAndErroredWithNames(result, nameMap);
}
export async function getFrontDeskScholarsInRoom(options) {
    const rows = await fetchFrontDeskLogs(options);
    const result = getScholarsCurrentlyInRoom(rows, undefined, {
        ...options,
        sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
    });
    const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
    return enrichWithScholarNames(result, nameMap);
}
export async function getFrontDeskCompletedSessions(options) {
    const rows = await fetchFrontDeskLogs(options);
    const result = getScholarsWithValidEntryExit(rows, undefined, {
        sessionType: options?.sessionType ?? SESSION_TYPE_FRONT_DESK,
    });
    const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
    return enrichWithScholarNames(result, nameMap);
}
// ---------------------------------------------------------------------------
// Orchestrated fetch + process (study session)
// ---------------------------------------------------------------------------
export async function getStudySessionCleanedAndErrored(options) {
    const rows = await fetchStudySessionLogs(options);
    const result = getCleanedAndErroredTickets(rows, undefined, {
        treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
        sessionType: options?.sessionType,
    });
    const uids = Array.from(result.byScholarUid.keys());
    const nameMap = await fetchScholarNamesByUids(uids);
    return enrichCleanedAndErroredWithNames(result, nameMap);
}
export async function getStudySessionScholarsInRoom(options) {
    const rows = await fetchStudySessionLogs(options);
    const result = getScholarsCurrentlyInRoom(rows, undefined, options ?? {});
    const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
    return enrichWithScholarNames(result, nameMap);
}
export async function getStudySessionCompletedSessions(options) {
    const rows = await fetchStudySessionLogs(options);
    const result = getScholarsWithValidEntryExit(rows, undefined, options ?? {});
    const nameMap = await fetchScholarNamesByUids(result.map((r) => r.scholarUid));
    return enrichWithScholarNames(result, nameMap);
}
//# sourceMappingURL=session-log.service.js.map