module.exports = [
"[project]/.next-internal/server/app/memo/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/memo/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/memo/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/memo/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/memo/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/time/config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Campus academic calendar configuration
 * ======================================
 *
 * This is the ONLY file you need to update when the academic calendar changes
 * (typically once per fall semester). All campus-week logic in lib/time uses
 * these values.
 *
 * WHAT TO CHANGE EACH YEAR
 * -----------------------
 * 1. FALL_SEMESTER_FIRST_DAY
 *    - The first day of the fall semester (first day of classes).
 *    - Format: "YYYY-MM-DD". Week 1 is the Monday–Sunday week that contains this date.
 *
 * 2. WINTER_BREAK_FIRST_DAY
 *    - The first calendar day of winter break (e.g. last day of fall classes + 1,
 *      or the Monday when break officially starts).
 *
 * 3. WINTER_BREAK_LAST_DAY
 *    - The last calendar day of winter break (e.g. day before spring classes resume).
 *    - All calendar days in [WINTER_BREAK_FIRST_DAY, WINTER_BREAK_LAST_DAY] are
 *      treated as a single "campus week" for data collection (winter break can
 *      be 4–5 real weeks but counts as one).
 *
 * 4. WEEKS_IGNORE_FORMS
 *    - Campus week numbers to exclude from form-related percentage calculations.
 *    - Use when developers are asked to disregard form data collection for certain
 *      weeks (e.g. impromptu exclusions). Leave empty [] if none.
 *
 * 5. WEEKS_IGNORE_SESSIONS
 *    - Campus week numbers to exclude from session-related percentage calculations.
 *    - Use when developers are asked to disregard session data collection for
 *      certain weeks (e.g. impromptu exclusions). Leave empty [] if none.
 *
 * RULES
 * -----
 * - Monday is the first day of the week. Each campus week runs Monday–Sunday (Eastern, America/New_York).
 * - Week 1 is the Monday–Sunday week that contains FALL_SEMESTER_FIRST_DAY.
 * - Fall weeks count 1, 2, 3, ... (each Monday–Sunday) up to the week before winter break.
 * - The entire winter break span is one campus week (one week number).
 * - Spring weeks resume on the first Monday on or after the day after WINTER_BREAK_LAST_DAY,
 *   and continue with consecutive Monday–Sunday weeks.
 * - For percentage calculations (e.g. compliance, completion rates): exclude any week
 *   whose number is in WEEKS_IGNORE_FORMS when computing form-based percentages, and
 *   exclude any week in WEEKS_IGNORE_SESSIONS when computing session-based percentages.
 *
 * Example (2024–25):
 *   Fall starts Aug 26 → weeks 1–16 (or so).
 *   Winter break Dec 16 – Jan 12 → that whole period = one campus week (e.g. 17).
 *   Spring Jan 13 onward → weeks 18, 19, ...
 */ __turbopack_context__.s([
    "FALL_SEMESTER_FIRST_DAY",
    ()=>FALL_SEMESTER_FIRST_DAY,
    "WEEKS_IGNORE_FORMS",
    ()=>WEEKS_IGNORE_FORMS,
    "WEEKS_IGNORE_SESSIONS",
    ()=>WEEKS_IGNORE_SESSIONS,
    "WINTER_BREAK_FIRST_DAY",
    ()=>WINTER_BREAK_FIRST_DAY,
    "WINTER_BREAK_LAST_DAY",
    ()=>WINTER_BREAK_LAST_DAY
]);
const FALL_SEMESTER_FIRST_DAY = "2025-09-01";
const WINTER_BREAK_FIRST_DAY = "2025-12-16";
const WINTER_BREAK_LAST_DAY = "2026-01-28";
const WEEKS_IGNORE_FORMS = [];
const WEEKS_IGNORE_SESSIONS = [];
}),
"[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAMPUS_WEEK",
    ()=>CAMPUS_WEEK,
    "EASTERN_TIMEZONE",
    ()=>EASTERN_TIMEZONE,
    "ONE_DAY_MS",
    ()=>ONE_DAY_MS,
    "WINTER_BREAK_CAMPUS_WEEK_NUMBER",
    ()=>WINTER_BREAK_CAMPUS_WEEK_NUMBER,
    "campusWeekToDateRange",
    ()=>campusWeekToDateRange,
    "dateToCampusWeek",
    ()=>dateToCampusWeek,
    "getEasternDayOfWeek",
    ()=>getEasternDayOfWeek,
    "getStartOfDayEastern",
    ()=>getStartOfDayEastern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/config.ts [app-rsc] (ecmascript)");
;
const EASTERN_TIMEZONE = "America/New_York";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
/**
 * Parse "YYYY-MM-DD" as midnight US Eastern (start of that calendar day in {@link EASTERN_TIMEZONE}).
 */ function parseEasternDate(s) {
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) throw new Error(`Invalid date string: ${s}`);
    const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        hour: "numeric",
        hour12: false,
        minute: "numeric",
        second: "numeric"
    });
    const parts = formatter.formatToParts(utcNoon);
    const hour = parseInt(parts.find((p)=>p.type === "hour")?.value ?? "0", 10);
    const minute = parseInt(parts.find((p)=>p.type === "minute")?.value ?? "0", 10);
    const second = parseInt(parts.find((p)=>p.type === "second")?.value ?? "0", 10);
    const easternMsSinceMidnight = (hour * 3600 + minute * 60 + second) * 1000;
    const d2 = new Date(utcNoon.getTime() - easternMsSinceMidnight);
    if (Number.isNaN(d2.getTime())) throw new Error(`Invalid date string: ${s}`);
    return d2;
}
/** Calendar year / month (0-based) / day in US Eastern for the instant `d`. */ function getEasternDateParts(d) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    const parts = formatter.formatToParts(d);
    const year = parseInt(parts.find((p)=>p.type === "year")?.value ?? "0", 10);
    const month = parseInt(parts.find((p)=>p.type === "month")?.value ?? "1", 10) - 1;
    const day = parseInt(parts.find((p)=>p.type === "day")?.value ?? "1", 10);
    return {
        year,
        month,
        day
    };
}
/**
 * Add signed whole calendar days in US Eastern (not fixed 24h steps), so DST transitions
 * do not shift week boundaries.
 */ function addEasternCalendarDays(d, deltaDays) {
    const { year, month, day } = getEasternDateParts(getStartOfDayEastern(d));
    const rolled = new Date(Date.UTC(year, month, day + deltaDays));
    return parseEasternDate(`${rolled.getUTCFullYear()}-${String(rolled.getUTCMonth() + 1).padStart(2, "0")}-${String(rolled.getUTCDate()).padStart(2, "0")}`);
}
/** Whole calendar days from earlier → later (Eastern start-of-day to Eastern start-of-day). */ function easternCalendarDaysBetween(earlier, later) {
    const a = getEasternDateParts(getStartOfDayEastern(earlier));
    const b = getEasternDateParts(getStartOfDayEastern(later));
    const aMs = Date.UTC(a.year, a.month, a.day);
    const bMs = Date.UTC(b.year, b.month, b.day);
    return Math.round((bMs - aMs) / ONE_DAY_MS);
}
const SEMESTER_START = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FALL_SEMESTER_FIRST_DAY"]);
const WINTER_START = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WINTER_BREAK_FIRST_DAY"]);
const WINTER_END = parseEasternDate(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WINTER_BREAK_LAST_DAY"]);
function getEasternDayOfWeek(d) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: EASTERN_TIMEZONE,
        weekday: "short"
    });
    const day = formatter.format(d);
    const map = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    };
    return map[day] ?? 0;
}
function getStartOfDayEastern(d) {
    const { year, month, day } = getEasternDateParts(d);
    return parseEasternDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
}
/** Internal alias for use in this file. */ function toEasternDay(d) {
    return getStartOfDayEastern(d);
}
/** Days back to reach Monday from a given Eastern day (Monday=1). */ function daysBackToMondayEastern(d) {
    return (getEasternDayOfWeek(d) + 6) % 7;
}
/** Monday midnight US Eastern of the week containing the given date. */ function getMondayOfWeekEastern(d) {
    const easternDay = toEasternDay(d);
    const back = daysBackToMondayEastern(easternDay);
    return addEasternCalendarDays(easternDay, -back);
}
/** Week 1 = Monday–Sunday week (Eastern) that contains FALL_SEMESTER_FIRST_DAY */ const WEEK_1_MONDAY = getMondayOfWeekEastern(SEMESTER_START);
/** First Monday on or after the day after winter break (US Eastern; start of first spring week) */ const FIRST_SPRING_MONDAY = (()=>{
    const dayAfterBreak = addEasternCalendarDays(WINTER_END, 1);
    const dayOfWeek = getEasternDayOfWeek(dayAfterBreak);
    const daysUntilMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
    return addEasternCalendarDays(dayAfterBreak, daysUntilMonday);
})();
const WINTER_BREAK_CAMPUS_WEEK_NUMBER = (()=>{
    const dayBeforeWinter = addEasternCalendarDays(WINTER_START, -1);
    const daysFromWeek1 = easternCalendarDaysBetween(WEEK_1_MONDAY, dayBeforeWinter);
    return Math.floor(daysFromWeek1 / 7) + 2;
})();
const CAMPUS_WEEK = {
    /** Monday of week 1 (week 1 = Monday–Sunday containing fall semester start) */ WEEK_1_MONDAY,
    /** First day of the fall semester */ SEMESTER_START_DATE: SEMESTER_START,
    /** First calendar day of winter break */ WINTER_BREAK_START_DATE: WINTER_START,
    /** Last calendar day of winter break */ WINTER_BREAK_END_DATE: WINTER_END,
    /** First Monday of spring (first Monday on or after day after winter break) */ FIRST_SPRING_MONDAY,
    /** The single campus week number that represents the entire winter break */ WINTER_BREAK_WEEK_NUMBER: WINTER_BREAK_CAMPUS_WEEK_NUMBER,
    /** Length of a normal campus week in days (winter break is variable but counts as one week) */ DAYS_PER_WEEK: 7
};
function campusWeekToDateRange(weekNumber) {
    if (weekNumber < 1) return null;
    if (weekNumber < WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
        const startDate = addEasternCalendarDays(WEEK_1_MONDAY, (weekNumber - 1) * 7);
        const endDate = addEasternCalendarDays(startDate, 6);
        return {
            weekNumber,
            startDate,
            endDate
        };
    }
    if (weekNumber === WINTER_BREAK_CAMPUS_WEEK_NUMBER) {
        return {
            weekNumber,
            startDate: new Date(WINTER_START.getTime()),
            endDate: new Date(WINTER_END.getTime())
        };
    }
    const weeksAfterBreak = weekNumber - WINTER_BREAK_CAMPUS_WEEK_NUMBER - 1;
    const startDate = addEasternCalendarDays(FIRST_SPRING_MONDAY, weeksAfterBreak * 7);
    const endDate = addEasternCalendarDays(startDate, 6);
    return {
        weekNumber,
        startDate,
        endDate
    };
}
function dateToCampusWeek(date) {
    const d = toEasternDay(date);
    const t = d.getTime();
    if (t < WEEK_1_MONDAY.getTime()) return null;
    if (t >= WINTER_START.getTime() && t <= WINTER_END.getTime()) {
        return WINTER_BREAK_CAMPUS_WEEK_NUMBER;
    }
    if (t < WINTER_START.getTime()) {
        const days = easternCalendarDaysBetween(WEEK_1_MONDAY, d);
        return Math.floor(days / 7) + 1;
    }
    if (t < FIRST_SPRING_MONDAY.getTime()) {
        return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1;
    }
    const daysFromSpringStart = easternCalendarDaysBetween(FIRST_SPRING_MONDAY, d);
    return WINTER_BREAK_CAMPUS_WEEK_NUMBER + 1 + Math.floor(daysFromSpringStart / 7);
}
}),
"[project]/lib/time/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDuration",
    ()=>formatDuration,
    "formatEntryDate",
    ()=>formatEntryDate,
    "formatMinutesToHoursAndMinutes",
    ()=>formatMinutesToHoursAndMinutes,
    "getDurationMs",
    ()=>getDurationMs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
;
function formatEntryDate(iso, showTime = false) {
    const d = new Date(iso);
    const todayET = new Date().toLocaleDateString("en-CA", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"]
    });
    const entryET = d.toLocaleDateString("en-CA", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"]
    });
    const timeOnly = d.toLocaleTimeString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).toLowerCase().replace(/\s/g, "");
    if (entryET === todayET) return timeOnly;
    const [y1, m1, d1] = todayET.split("-").map(Number);
    const [y2, m2, d2] = entryET.split("-").map(Number);
    const daysAgo = (y1 - y2) * 372 + (m1 - m2) * 31 + (d1 - d2);
    if (daysAgo >= 1 && daysAgo <= 6) {
        const weekday = d.toLocaleDateString("en-US", {
            timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
            weekday: "long"
        });
        return showTime ? `${weekday}, ${timeOnly}` : weekday;
    }
    const month = d.toLocaleDateString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        month: "long"
    });
    const dayNum = d2;
    const ord = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st" : dayNum === 2 || dayNum === 22 ? "nd" : dayNum === 3 || dayNum === 23 ? "rd" : "th";
    return `${month} ${dayNum}${ord}, ${timeOnly}`;
}
function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
}
function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
        timeZone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EASTERN_TIMEZONE"],
        dateStyle: "short",
        timeStyle: "short"
    });
}
function getDurationMs(item) {
    return item.durationMs ?? item.timeInRoomMs ?? 0;
}
function formatMinutesToHoursAndMinutes(totalMinutes) {
    const mins = Math.round(Number(totalMinutes)) || 0;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h\n${minutes}m`;
}
}),
"[project]/lib/time/iso-campus-week.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCampusWeekForIsoWeek",
    ()=>getCampusWeekForIsoWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfISOWeek$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfISOWeek.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
;
;
function getCampusWeekForIsoWeek(isoWeek, currentIsoWeek) {
    const now = new Date();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfISOWeek$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfISOWeek"])(now);
    const diff = isoWeek - currentIsoWeek;
    const targetDate = new Date(ref.getTime() + diff * 7 * 24 * 60 * 60 * 1000);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dateToCampusWeek"])(targetDate);
}
}),
"[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Campus time: week numbering from fall semester start, with winter break
 * counted as a single week. Use for data queries and reporting by campus week.
 *
 * To update the academic calendar each year, edit only: ./config.ts
 * See ./README.md for full documentation.
 *
 * @example
 * // Get date range for a campus week (e.g. for fetching logs)
 * import { campusWeekToDateRange } from "@/lib/time";
 * const range = campusWeekToDateRange(5);
 * if (range) {
 *   const logs = await fetchLogs({ startDate: range.startDate, endDate: range.endDate });
 * }
 *
 * @example
 * // Bucket a date by campus week
 * import { dateToCampusWeek } from "@/lib/time";
 * const week = dateToCampusWeek(new Date(row.created_at));
 * if (week !== null) { ... } // group by week for reports
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$iso$2d$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/iso-campus-week.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_WEEKLY_MINUTES",
    ()=>EMPTY_WEEKLY_MINUTES,
    "getWeekFetchEnd",
    ()=>getWeekFetchEnd
]);
function getWeekFetchEnd(range) {
    return new Date(range.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
}
const EMPTY_WEEKLY_MINUTES = {
    mon_min: 0,
    tues_min: 0,
    wed_min: 0,
    thurs_min: 0,
    fri_min: 0
};
}),
"[project]/lib/session-records/weekly-minutes.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeWeeklyMinutesByUid",
    ()=>computeWeeklyMinutesByUid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
;
function computeWeeklyMinutesByUid(sessions, weekRange) {
    const { startDate, endDate } = weekRange;
    const startMs = startDate.getTime();
    const endMs = endDate.getTime() + 24 * 60 * 60 * 1000; // end of endDate day
    const byUid = new Map();
    function empty() {
        return {
            mon_min: 0,
            tues_min: 0,
            wed_min: 0,
            thurs_min: 0,
            fri_min: 0
        };
    }
    for (const s of sessions){
        const entryMs = new Date(s.entryAt).getTime();
        if (entryMs < startMs || entryMs >= endMs) continue;
        const uid = s.scholarUid ?? "";
        if (!uid) continue;
        if (!byUid.has(uid)) {
            byUid.set(uid, empty());
        }
        const row = byUid.get(uid);
        const dayOfWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEasternDayOfWeek"])(new Date(s.entryAt));
        const durationMin = Math.round(s.durationMs / 60_000);
        switch(dayOfWeek){
            case 1:
                row.mon_min += durationMin;
                break;
            case 2:
                row.tues_min += durationMin;
                break;
            case 3:
                row.wed_min += durationMin;
                break;
            case 4:
                row.thurs_min += durationMin;
                break;
            case 5:
                row.fri_min += durationMin;
                break;
            default:
                break;
        }
    }
    return byUid;
}
}),
"[project]/lib/session-records/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Session records: client-safe types and pure utilities (weekly minutes, date helpers).
 * For server-side data and sync (Supabase), use lib/server/session-records or app/api routes.
 *
 * Use getWeekFetchEnd(range) with campusWeekToDateRange(weekNum) for inclusive week fetch bounds;
 * computeWeeklyMinutesByUid(sessions, weekRange) to aggregate completed sessions into mon_min..fri_min
 * per scholar; EMPTY_WEEKLY_MINUTES when a scholar has no sessions for the week.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$weekly$2d$minutes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/weekly-minutes.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/lib/supabase/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_ROLE_ORDER",
    ()=>APP_ROLE_ORDER
]);
const APP_ROLE_ORDER = [
    null,
    "team_leader",
    "developer"
];
}),
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getCurrentUserWithProfile",
    ()=>getCurrentUserWithProfile,
    "getDeveloperUser",
    ()=>getDeveloperUser,
    "getTeamLeaderOrAboveUser",
    ()=>getTeamLeaderOrAboveUser,
    "requireDeveloper",
    ()=>requireDeveloper,
    "requireTeamLeaderOrAbove",
    ()=>requireTeamLeaderOrAbove,
    "requireUser",
    ()=>requireUser,
    "requireUserWithProfile",
    ()=>requireUserWithProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/public-key.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const supabaseKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabasePublicKey"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        },
        auth: {
            flowType: "pkce"
        }
    });
}
async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
async function getCurrentUserWithProfile() {
    const user = await getCurrentUser();
    if (!user?.email) return {
        user,
        profile: null
    };
    const supabase = await createClient();
    const { data: profile } = await supabase.schema("public").from("profiles").select("*, user_roster(*)").eq("id", user.id).maybeSingle();
    // Here to populate the profile with the user_roster data, should be removed once the user_roster table is fully migrated to the profiles table
    if (!profile) {
        return {
            user,
            profile: null
        };
    }
    if (!profile.program_role) {
        profile.program_role = profile.user_roster?.program_role;
    }
    if (!profile.cohort) {
        profile.cohort = profile.user_roster?.cohort;
    }
    if (!profile.last_name) {
        profile.last_name = profile.user_roster?.last_name;
    }
    if (!profile.first_name) {
        profile.first_name = profile.user_roster?.first_name;
    }
    if (!profile.email) {
        profile.email = profile.user_roster?.email;
    }
    return {
        user,
        profile: profile
    };
}
async function requireUserWithProfile() {
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user) throw new Error("Unauthorized");
    return {
        user,
        profile
    };
}
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
function hasRoleAtLeast(role, minRole) {
    const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APP_ROLE_ORDER"].indexOf(role);
    const minIdx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APP_ROLE_ORDER"].indexOf(minRole);
    return idx >= 0 && idx >= minIdx;
}
async function getTeamLeaderOrAboveUser() {
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user) return null;
    return hasRoleAtLeast(profile?.app_role ?? null, "team_leader") ? user : null;
}
async function getDeveloperUser() {
    const { user, profile } = await getCurrentUserWithProfile();
    if (!user) return null;
    return profile?.app_role === "developer" ? user : null;
}
async function requireTeamLeaderOrAbove() {
    const user = await getTeamLeaderOrAboveUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
    }
    return user;
}
async function requireDeveloper() {
    const user = await getDeveloperUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
    }
    return user;
}
}),
"[project]/lib/server/users.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllUserUids",
    ()=>fetchAllUserUids,
    "fetchAllUsersForMemo",
    ()=>fetchAllUsersForMemo,
    "fetchEligibleScholarUids",
    ()=>fetchEligibleScholarUids,
    "fetchRequiredHoursByUids",
    ()=>fetchRequiredHoursByUids,
    "fetchScholarNamesByUids",
    ()=>fetchScholarNamesByUids,
    "fetchScholarUids",
    ()=>fetchScholarUids,
    "fetchTeamLeaders",
    ()=>fetchTeamLeaders,
    "getUserByUid",
    ()=>getUserByUid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
;
/**
 * Server-only helpers for reading user metadata from `public.user_roster`.
 *
 * These utilities are used by session logs, form logs, and memo overview pages
 * to hydrate UIDs with names, roles, requirements, and mentee counts.
 */ function uniqueNonEmptyStrings(values) {
    return [
        ...new Set(values)
    ].filter(Boolean);
}
async function fetchScholarNamesByUids(uids) {
    if (uids.length === 0) return new Map();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const uniqueUids = uniqueNonEmptyStrings(uids);
    const { data, error } = await supabase.from("user_roster").select("uid, first_name, last_name").in("uid", uniqueUids);
    if (error) throw error;
    const map = new Map();
    for (const row of data ?? []){
        const name = [
            row.first_name,
            row.last_name
        ].filter(Boolean).join(" ").trim();
        if (row.uid && name) map.set(row.uid, name);
    }
    return map;
}
async function fetchRequiredHoursByUids(uids) {
    if (uids.length === 0) return new Map();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const uniqueUids = uniqueNonEmptyStrings(uids);
    const { data, error } = await supabase.from("user_roster").select("uid, fd_required, ss_required").in("uid", uniqueUids);
    if (error) throw error;
    const map = new Map();
    for (const row of data ?? []){
        if (row.uid != null) {
            const fd = row.fd_required != null ? Number(row.fd_required) : null;
            const ss = row.ss_required != null ? Number(row.ss_required) : null;
            map.set(String(row.uid), {
                fd_required: fd,
                ss_required: ss
            });
        }
    }
    return map;
}
async function fetchEligibleScholarUids(uids) {
    if (uids.length === 0) return new Set();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const uniqueUids = uniqueNonEmptyStrings(uids);
    const { data, error } = await supabase.from("user_roster").select("uid, program_role, fd_required, ss_required").in("uid", uniqueUids);
    if (error) throw error;
    const eligible = new Set();
    for (const row of data ?? []){
        if (row.uid == null) continue;
        const role = (row.program_role ?? "").toString().toLowerCase();
        const fd = row.fd_required != null ? Number(row.fd_required) : 0;
        const ss = row.ss_required != null ? Number(row.ss_required) : 0;
        const hasRequired = fd > 0 || ss > 0;
        if (role === "scholar" && hasRequired) {
            eligible.add(String(row.uid));
        }
    }
    return eligible;
}
async function fetchAllUserUids() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("user_roster").select("uid").not("uid", "is", null);
    if (error) throw error;
    return uniqueNonEmptyStrings((data ?? []).map((r)=>String(r.uid)));
}
async function fetchAllUsersForMemo() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("user_roster").select("uid, first_name, last_name, cohort, program_role, app_role, fd_required, ss_required").not("uid", "is", null);
    if (error) throw error;
    return (data ?? []).map((r)=>({
            uid: String(r.uid),
            first_name: r.first_name ?? null,
            last_name: r.last_name ?? null,
            cohort: r.cohort != null ? Number(r.cohort) : null,
            program_role: r.program_role ?? null,
            app_role: r.app_role ?? null,
            fd_required: r.fd_required != null ? Number(r.fd_required) : null,
            ss_required: r.ss_required != null ? Number(r.ss_required) : null
        }));
}
async function getUserByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("user_roster").select("uid, first_name, last_name, cohort, program_role, app_role, fd_required, ss_required").eq("uid", uid).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
        uid: String(data.uid),
        first_name: data.first_name ?? null,
        last_name: data.last_name ?? null,
        cohort: data.cohort != null ? Number(data.cohort) : null,
        program_role: data.program_role ?? null,
        app_role: data.app_role ?? null,
        fd_required: data.fd_required != null ? Number(data.fd_required) : null,
        ss_required: data.ss_required != null ? Number(data.ss_required) : null
    };
}
async function fetchTeamLeaders() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("user_roster").select("uid, first_name, last_name, cohort, program_role, fd_required, ss_required, mentee_count").or("program_role.neq.scholar,program_role.is.null");
    if (error) throw error;
    const rows = (data ?? []).map((r)=>({
            uid: String(r.uid),
            first_name: r.first_name ?? null,
            last_name: r.last_name ?? null,
            cohort: r.cohort != null ? Number(r.cohort) : null,
            program_role: r.program_role ?? null,
            fd_required: r.fd_required != null ? Number(r.fd_required) : null,
            ss_required: r.ss_required != null ? Number(r.ss_required) : null,
            mentee_count: r.mentee_count != null ? Number(r.mentee_count) : null
        }));
    return rows.filter((r)=>(r.program_role ?? "").toLowerCase() !== "scholar");
}
async function fetchScholarUids() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("user_roster").select("uid").ilike("program_role", "scholar");
    if (error) throw error;
    return (data ?? []).map((r)=>String(r.uid)).filter(Boolean);
}
}),
"[project]/lib/server/session-records/records.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFrontDeskRecord",
    ()=>getFrontDeskRecord,
    "getFrontDeskRecordsByUid",
    ()=>getFrontDeskRecordsByUid,
    "getFrontDeskRecordsForWeek",
    ()=>getFrontDeskRecordsForWeek,
    "getFrontDeskRecordsForWeekAll",
    ()=>getFrontDeskRecordsForWeekAll,
    "getStudySessionRecord",
    ()=>getStudySessionRecord,
    "getStudySessionRecordsByUid",
    ()=>getStudySessionRecordsByUid,
    "getStudySessionRecordsForWeek",
    ()=>getStudySessionRecordsForWeek,
    "getStudySessionRecordsForWeekAll",
    ()=>getStudySessionRecordsForWeekAll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
;
;
;
async function getFrontDeskRecord(uid, weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("front_desk_records").select("*").eq("uid", uid).eq("week_num", weekNum).maybeSingle();
    if (error) throw error;
    return data;
}
async function getStudySessionRecord(uid, weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("study_session_records").select("*").eq("uid", uid).eq("week_num", weekNum).maybeSingle();
    if (error) throw error;
    return data;
}
async function getFrontDeskRecordsByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("front_desk_records").select("*").eq("uid", uid).order("week_num", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getStudySessionRecordsByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("study_session_records").select("*").eq("uid", uid).order("week_num", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getStudySessionRecordsForWeek(weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("study_session_records").select("*").eq("week_num", weekNum).order("uid", {
        ascending: true
    });
    if (error) throw error;
    const rows = data ?? [];
    if (rows.length === 0) return [];
    const uids = [
        ...new Set(rows.map((r)=>r.uid).filter((u)=>u != null))
    ].map(String);
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    const requiredMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRequiredHoursByUids"])(uids);
    const eligibleUids = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchEligibleScholarUids"])(uids);
    return rows.filter((r)=>r.uid != null && eligibleUids.has(String(r.uid))).map((r)=>({
            ...r,
            scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
            fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
            ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null
        }));
}
async function getStudySessionRecordsForWeekAll(weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("study_session_records").select("*").eq("week_num", weekNum).order("uid", {
        ascending: true
    });
    if (error) throw error;
    const rows = data ?? [];
    if (rows.length === 0) return [];
    const uids = [
        ...new Set(rows.map((r)=>r.uid).filter((u)=>u != null))
    ].map(String);
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    const requiredMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRequiredHoursByUids"])(uids);
    return rows.filter((r)=>r.uid != null).map((r)=>({
            ...r,
            scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
            fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
            ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null
        }));
}
async function getFrontDeskRecordsForWeek(weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("front_desk_records").select("*").eq("week_num", weekNum).order("uid", {
        ascending: true
    });
    if (error) throw error;
    const rows = data ?? [];
    if (rows.length === 0) return [];
    const uids = [
        ...new Set(rows.map((r)=>r.uid).filter((u)=>u != null))
    ].map(String);
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    const requiredMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRequiredHoursByUids"])(uids);
    const eligibleUids = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchEligibleScholarUids"])(uids);
    return rows.filter((r)=>r.uid != null && eligibleUids.has(String(r.uid))).map((r)=>({
            ...r,
            scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
            fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
            ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null
        }));
}
async function getFrontDeskRecordsForWeekAll(weekNum) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("front_desk_records").select("*").eq("week_num", weekNum).order("uid", {
        ascending: true
    });
    if (error) throw error;
    const rows = data ?? [];
    if (rows.length === 0) return [];
    const uids = [
        ...new Set(rows.map((r)=>r.uid).filter((u)=>u != null))
    ].map(String);
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    const requiredMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRequiredHoursByUids"])(uids);
    return rows.filter((r)=>r.uid != null).map((r)=>({
            ...r,
            scholar_name: r.uid != null ? nameMap.get(String(r.uid)) ?? null : null,
            fd_required: r.uid != null ? requiredMap.get(String(r.uid))?.fd_required ?? null : null,
            ss_required: r.uid != null ? requiredMap.get(String(r.uid))?.ss_required ?? null : null
        }));
}
}),
"[project]/lib/server/query-limit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireDateOrUidLimit",
    ()=>requireDateOrUidLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
const DEFAULT_MESSAGE = "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.";
function requireDateOrUidLimit(options, message = DEFAULT_MESSAGE) {
    const hasDateRange = options?.startDate != null || options?.endDate != null;
    const hasUids = (options?.scholarUids?.length ?? 0) > 0;
    if (!hasDateRange && !hasUids) {
        throw new Error(message);
    }
}
}),
"[project]/lib/session-logs/types.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Session log types - designed to work with study_session_logs and similar tables.
 * The minimal row shape allows different tables to be used interchangeably.
 */ /** Eastern timezone for all date logic (handles EST/EDT). Re-exported from lib/time. */ __turbopack_context__.s([
    "DEFAULT_SESSION_CONFIG",
    ()=>DEFAULT_SESSION_CONFIG,
    "SESSION_TYPES",
    ()=>SESSION_TYPES,
    "SESSION_TYPE_FRONT_DESK",
    ()=>SESSION_TYPE_FRONT_DESK,
    "SESSION_TYPE_STUDY",
    ()=>SESSION_TYPE_STUDY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
;
const SESSION_TYPE_STUDY = "Study Session";
const SESSION_TYPE_FRONT_DESK = "Front Desk";
const SESSION_TYPES = [
    SESSION_TYPE_STUDY,
    SESSION_TYPE_FRONT_DESK
];
const DEFAULT_SESSION_CONFIG = {
    entryAction: "Entry",
    exitAction: "Exit"
};
}),
"[project]/lib/server/session-logs/fetch.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchFrontDeskLogs",
    ()=>fetchFrontDeskLogs,
    "fetchStudySessionLogs",
    ()=>fetchStudySessionLogs,
    "requireLogFetchLimit",
    ()=>requireLogFetchLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/query-limit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-logs/types.ts [app-rsc] (ecmascript) <locals>");
;
;
;
;
function toSessionLogRowFrontDesk(row) {
    return {
        id: row.id,
        created_at: row.created_at,
        scholar_uid: row.scholar_uid,
        action_type: row.action_type,
        rep_name: row.rep_name ?? null,
        session_type: row.session_type ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SESSION_TYPE_FRONT_DESK"],
        submitted_by_email: row.submitted_by_email ?? null
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
        submitted_by_email: row.submitted_by_email
    };
}
function requireLogFetchLimit(options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireDateOrUidLimit"])(options);
}
async function fetchFrontDeskLogs(options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireDateOrUidLimit"])(options);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("front_desk_logs").select("id, created_at, scholar_uid, action_type").order("created_at", {
        ascending: true
    });
    if (options?.startDate) query = query.gte("created_at", options.startDate.toISOString());
    if (options?.endDate) query = query.lte("created_at", options.endDate.toISOString());
    if (options?.scholarUids?.length) query = query.in("scholar_uid", options.scholarUids);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row)=>toSessionLogRowFrontDesk(row));
}
async function fetchStudySessionLogs(options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireDateOrUidLimit"])(options);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("study_session_logs").select("id, created_at, rep_name, scholar_uid, action_type, session_type, submitted_by_email").order("created_at", {
        ascending: true
    });
    if (options?.startDate) query = query.gte("created_at", options.startDate.toISOString());
    if (options?.endDate) query = query.lte("created_at", options.endDate.toISOString());
    if (options?.scholarUids?.length) query = query.in("scholar_uid", options.scholarUids);
    if (options?.sessionType) query = query.eq("session_type", options.sessionType);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row)=>toSessionLogRowStudy(row));
}
}),
"[project]/lib/session-logs/session-ticket-utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCleanedAndErroredTickets",
    ()=>getCleanedAndErroredTickets,
    "getScholarsCurrentlyInRoom",
    ()=>getScholarsCurrentlyInRoom,
    "getScholarsWithValidEntryExit",
    ()=>getScholarsWithValidEntryExit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-logs/types.ts [app-rsc] (ecmascript) <locals>");
;
;
/**
 * Check if action is Entry or Exit based on config.
 */ function isEntry(row, config) {
    return (row.action_type ?? "").trim() === config.entryAction;
}
function isExit(row, config) {
    return (row.action_type ?? "").trim() === config.exitAction;
}
function getEasternDayKey(createdAt) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStartOfDayEastern"])(new Date(createdAt)).getTime();
}
function moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored) {
    const lastEntryTicket = tickets.find((t)=>t.created_at === lastEntryAt && isEntry(t, config));
    if (!lastEntryTicket) return;
    const idx = cleaned.findIndex((p)=>p.ticket.id === lastEntryTicket.id);
    if (idx >= 0) {
        cleaned.splice(idx, 1);
        errored.push({
            ticket: lastEntryTicket,
            error: "ENTRY_WITHOUT_SAME_DAY_EXIT"
        });
    }
}
/**
 * Categorize all tickets by scholar as cleaned or errored. Use after fetching log rows;
 * pass treatUnclosedEntryAsError: true for closed-period analysis, and optional sessionType
 * to filter (e.g. SESSION_TYPE_STUDY or SESSION_TYPE_FRONT_DESK).
 *
 * Handles: double exit, double enter, exit before enter, exit without enter,
 * and entry without same-day exit (when treatUnclosedEntryAsError is true).
 * Table-agnostic: works on any array of rows matching SessionLogRow.
 */ function filterBySessionType(rows, sessionType) {
    if (sessionType == null || sessionType === "") return rows;
    return rows.filter((r)=>(r.session_type ?? "").trim() === sessionType);
}
function getCleanedAndErroredTickets(rows, config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_SESSION_CONFIG"], options = {}) {
    const { treatUnclosedEntryAsError = false, sessionType } = options;
    const filtered = filterBySessionType(rows, sessionType);
    const byScholarUid = new Map();
    const allCleaned = [];
    const allErrored = [];
    // Group by scholar_uid
    const byUid = new Map();
    for (const row of filtered){
        const uid = row.scholar_uid ?? "";
        if (!uid) continue;
        if (!byUid.has(uid)) {
            byUid.set(uid, []);
        }
        byUid.get(uid).push(row);
    }
    for (const [uid, tickets] of byUid){
        const sorted = [
            ...tickets
        ].sort((a, b)=>new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const scholarName = sorted[0]?.scholar_name ?? null;
        const { cleaned, errored } = processScholarTickets(sorted, config, treatUnclosedEntryAsError);
        byScholarUid.set(uid, {
            cleaned,
            errored,
            scholarName
        });
        allCleaned.push(...cleaned);
        allErrored.push(...errored);
    }
    return {
        byScholarUid,
        allCleaned,
        allErrored
    };
}
/**
 * Process a single scholar's tickets chronologically.
 */ function processScholarTickets(tickets, config, treatUnclosedEntryAsError) {
    const cleaned = [];
    const errored = [];
    let inRoom = false;
    let lastEntryAt = null;
    let lastActionWasExit = false;
    for (const ticket of tickets){
        const isEntryTicket = isEntry(ticket, config);
        const isExitTicket = isExit(ticket, config);
        if (!isEntryTicket && !isExitTicket) {
            cleaned.push({
                ticket
            });
            lastActionWasExit = false;
            continue;
        }
        if (isEntryTicket) {
            lastActionWasExit = false;
            if (inRoom && lastEntryAt) {
                const lastEntryDay = getEasternDayKey(lastEntryAt);
                const newEntryDay = getEasternDayKey(ticket.created_at);
                if (newEntryDay !== lastEntryDay) {
                    // First entry was previous day: error it, accept new entry
                    moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
                    inRoom = true;
                    lastEntryAt = ticket.created_at;
                    cleaned.push({
                        ticket
                    });
                } else {
                    errored.push({
                        ticket,
                        error: "DOUBLE_ENTER"
                    });
                }
            } else if (inRoom) {
                errored.push({
                    ticket,
                    error: "DOUBLE_ENTER"
                });
            } else {
                inRoom = true;
                lastEntryAt = ticket.created_at;
                cleaned.push({
                    ticket
                });
            }
            continue;
        }
        // isExitTicket
        if (!inRoom) {
            const errorType = lastActionWasExit ? "DOUBLE_EXIT" : "EXIT_BEFORE_ENTER";
            errored.push({
                ticket,
                error: errorType,
                pairedEntryAt: lastEntryAt ?? undefined
            });
            lastActionWasExit = true;
        } else {
            const sameDay = getEasternDayKey(lastEntryAt) === getEasternDayKey(ticket.created_at);
            if (!sameDay) {
                moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
                errored.push({
                    ticket,
                    error: "EXIT_WITHOUT_ENTER",
                    pairedEntryAt: lastEntryAt ?? undefined
                });
            } else {
                cleaned.push({
                    ticket,
                    pairedEntryAt: lastEntryAt ?? undefined
                });
            }
            lastActionWasExit = true;
            inRoom = false;
            lastEntryAt = null;
        }
    }
    if (treatUnclosedEntryAsError && inRoom && lastEntryAt) {
        moveLastEntryToErrored(tickets, lastEntryAt, config, cleaned, errored);
    }
    return {
        cleaned,
        errored
    };
}
function getScholarsCurrentlyInRoom(rows, config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_SESSION_CONFIG"], options = {}) {
    const { sessionType, asOf = new Date() } = options;
    const startOfTodayEastern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStartOfDayEastern"])(asOf).getTime();
    const rowsFromToday = rows.filter((r)=>new Date(r.created_at).getTime() >= startOfTodayEastern);
    const { byScholarUid } = getCleanedAndErroredTickets(rowsFromToday, config, {
        sessionType
    });
    const result = [];
    for (const [uid, { cleaned, scholarName }] of byScholarUid){
        const entryTickets = cleaned.filter((p)=>(p.ticket.action_type ?? "").trim() === config.entryAction);
        const exitTickets = cleaned.filter((p)=>(p.ticket.action_type ?? "").trim() === config.exitAction);
        if (entryTickets.length === 0) continue;
        // Pair entries with exits chronologically
        const entries = [
            ...entryTickets
        ].sort((a, b)=>new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        const exits = [
            ...exitTickets
        ].sort((a, b)=>new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        let exitIdx = 0;
        let lastUnmatchedEntry = null;
        for (const entry of entries){
            const entryTime = new Date(entry.ticket.created_at).getTime();
            // Find next exit after this entry
            while(exitIdx < exits.length && new Date(exits[exitIdx].ticket.created_at).getTime() <= entryTime){
                exitIdx++;
            }
            if (exitIdx < exits.length) {
                exitIdx++; // consumed this exit
                lastUnmatchedEntry = null;
            } else {
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
                sessionType: lastUnmatchedEntry.ticket.session_type ?? undefined
            });
        }
    }
    return result;
}
function getScholarsWithValidEntryExit(rows, config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_SESSION_CONFIG"], options = {}) {
    const { sessionType } = options;
    const { byScholarUid } = getCleanedAndErroredTickets(rows, config, {
        sessionType
    });
    const result = [];
    for (const [uid, { cleaned, scholarName }] of byScholarUid){
        const entryTickets = cleaned.filter((p)=>(p.ticket.action_type ?? "").trim() === config.entryAction).sort((a, b)=>new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        const exitTickets = cleaned.filter((p)=>(p.ticket.action_type ?? "").trim() === config.exitAction).sort((a, b)=>new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime());
        for (const exit of exitTickets){
            const exitTime = new Date(exit.ticket.created_at).getTime();
            const pairedEntryAt = exit.pairedEntryAt;
            if (!pairedEntryAt) continue;
            const entry = entryTickets.find((e)=>e.ticket.created_at === pairedEntryAt);
            if (!entry) continue;
            const entryTime = new Date(pairedEntryAt).getTime();
            const durationMs = exitTime - entryTime;
            result.push({
                scholarUid: uid,
                scholarName,
                entryTicket: entry.ticket,
                exitTicket: exit.ticket,
                entryAt: pairedEntryAt,
                exitAt: exit.ticket.created_at,
                durationMs,
                sessionType: entry.ticket.session_type ?? undefined
            });
        }
    }
    return result;
}
}),
"[project]/lib/session-logs/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enrichCleanedAndErroredWithNames",
    ()=>enrichCleanedAndErroredWithNames,
    "enrichWithScholarNames",
    ()=>enrichWithScholarNames
]);
function enrichCleanedAndErroredWithNames(result, nameMap) {
    const enrichedByScholarUid = new Map(result.byScholarUid);
    for (const [uid, data] of enrichedByScholarUid){
        enrichedByScholarUid.set(uid, {
            ...data,
            scholarName: nameMap.get(uid) ?? null
        });
    }
    return {
        ...result,
        byScholarUid: enrichedByScholarUid
    };
}
function enrichWithScholarNames(items, nameMap) {
    if (items.length === 0) return items;
    return items.map((r)=>({
            ...r,
            scholarName: nameMap.get(r.scholarUid) ?? null
        }));
}
}),
"[project]/lib/server/session-logs/front-desk.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFrontDeskCleanedAndErrored",
    ()=>getFrontDeskCleanedAndErrored,
    "getFrontDeskCompletedSessions",
    ()=>getFrontDeskCompletedSessions,
    "getFrontDeskScholarsInRoom",
    ()=>getFrontDeskScholarsInRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-logs/session-ticket-utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-logs/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-logs/types.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/fetch.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function getFrontDeskCleanedAndErrored(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchFrontDeskLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCleanedAndErroredTickets"])(rows, undefined, {
        treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
        sessionType: options?.sessionType ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SESSION_TYPE_FRONT_DESK"]
    });
    const uids = Array.from(result.byScholarUid.keys());
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichCleanedAndErroredWithNames"])(result, nameMap);
}
async function getFrontDeskScholarsInRoom(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchFrontDeskLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScholarsCurrentlyInRoom"])(rows, undefined, {
        ...options,
        sessionType: options?.sessionType ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SESSION_TYPE_FRONT_DESK"]
    });
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(result.map((r)=>r.scholarUid));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichWithScholarNames"])(result, nameMap);
}
async function getFrontDeskCompletedSessions(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchFrontDeskLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScholarsWithValidEntryExit"])(rows, undefined, {
        ...options,
        sessionType: options?.sessionType ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SESSION_TYPE_FRONT_DESK"]
    });
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(result.map((r)=>r.scholarUid));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichWithScholarNames"])(result, nameMap);
}
}),
"[project]/lib/server/session-logs/study.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStudySessionCleanedAndErrored",
    ()=>getStudySessionCleanedAndErrored,
    "getStudySessionCompletedSessions",
    ()=>getStudySessionCompletedSessions,
    "getStudySessionScholarsInRoom",
    ()=>getStudySessionScholarsInRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-logs/session-ticket-utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-logs/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/fetch.ts [app-rsc] (ecmascript)");
;
;
;
;
;
async function getStudySessionCleanedAndErrored(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchStudySessionLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCleanedAndErroredTickets"])(rows, undefined, {
        treatUnclosedEntryAsError: options?.treatUnclosedEntryAsError,
        sessionType: options?.sessionType
    });
    const uids = Array.from(result.byScholarUid.keys());
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(uids);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichCleanedAndErroredWithNames"])(result, nameMap);
}
async function getStudySessionScholarsInRoom(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchStudySessionLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScholarsCurrentlyInRoom"])(rows, undefined, options ?? {});
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(result.map((r)=>r.scholarUid));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichWithScholarNames"])(result, nameMap);
}
async function getStudySessionCompletedSessions(options) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchStudySessionLogs"])(options);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$session$2d$ticket$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScholarsWithValidEntryExit"])(rows, undefined, options ?? {});
    const nameMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchScholarNamesByUids"])(result.map((r)=>r.scholarUid));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$logs$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enrichWithScholarNames"])(result, nameMap);
}
}),
"[project]/lib/server/session-logs/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Session logs server module. For client-safe types and pure utilities, use @/lib/session-logs.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/fetch.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$front$2d$desk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/front-desk.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$study$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/study.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/lib/server/session-records/sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "syncFrontDeskRecordsForWeek",
    ()=>syncFrontDeskRecordsForWeek,
    "syncFrontDeskRecordsForWeekAllUids",
    ()=>syncFrontDeskRecordsForWeekAllUids,
    "syncStudySessionRecordsForWeek",
    ()=>syncStudySessionRecordsForWeek,
    "syncStudySessionRecordsForWeekAllUids",
    ()=>syncStudySessionRecordsForWeekAllUids
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/server/session-logs/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$front$2d$desk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/front-desk.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$study$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/study.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$weekly$2d$minutes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/weekly-minutes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/records.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
function totalMinutes(m) {
    return m.mon_min + m.tues_min + m.wed_min + m.thurs_min + m.fri_min;
}
/**
 * Shared sync implementation: compute minutes from tickets, then upsert records.
 * When allUids is true, also corrects existing records to zero when tickets say the scholar has no minutes (fixes incorrectly populated records).
 */ async function syncRecordsForWeekInternal(weekNum, kind, options) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) throw new Error(`Invalid week number: ${weekNum}`);
    const fetchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const allUids = options.allUids ?? false;
    const singleUid = options.uid;
    const getSessions = kind === "front_desk" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$front$2d$desk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFrontDeskCompletedSessions"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$study$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudySessionCompletedSessions"];
    const sessions = await getSessions({
        startDate: range.startDate,
        endDate: fetchEnd,
        scholarUids: singleUid !== undefined ? [
            String(singleUid)
        ] : undefined
    });
    const minutesByUid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$weekly$2d$minutes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeWeeklyMinutesByUid"])(sessions, {
        startDate: range.startDate,
        endDate: range.endDate
    });
    let uidsToSync;
    let useEmptyForMissing;
    if (allUids) {
        uidsToSync = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllUserUids"])();
        useEmptyForMissing = true;
    } else {
        uidsToSync = singleUid !== undefined ? minutesByUid.has(String(singleUid)) ? [
            String(singleUid)
        ] : [] : Array.from(minutesByUid.keys());
        useEmptyForMissing = false;
    }
    if (uidsToSync.length === 0) return {
        upserted: 0
    };
    const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
    const getRecord = kind === "front_desk" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFrontDeskRecord"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudySessionRecord"];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let upserted = 0;
    for (const uidStr of uidsToSync){
        const uidNum = parseInt(uidStr, 10);
        if (Number.isNaN(uidNum)) continue;
        const mins = useEmptyForMissing ? minutesByUid.get(uidStr) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMPTY_WEEKLY_MINUTES"] : minutesByUid.get(uidStr);
        const existing = await getRecord(uidNum, weekNum);
        const payload = {
            mon_min: mins.mon_min,
            tues_min: mins.tues_min,
            wed_min: mins.wed_min,
            thurs_min: mins.thurs_min,
            fri_min: mins.fri_min
        };
        if (existing) {
            const { error } = await supabase.from(table).update(payload).eq("id", existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from(table).insert({
                uid: uidNum,
                week_num: weekNum,
                ...payload,
                excuse_min: null,
                excuse: null
            });
            if (error) throw error;
        }
        upserted++;
    }
    if (allUids) {
        await correctRecordsToZeroWhenNoTickets(weekNum, kind, minutesByUid, supabase);
    }
    return {
        upserted
    };
}
/**
 * Treats tickets as ground truth: any existing record for this week whose scholar has no minutes in tickets gets updated to zero.
 * Used only when syncing all UIDs to fix incorrectly populated records (e.g. from debugging).
 */ async function correctRecordsToZeroWhenNoTickets(weekNum, kind, minutesByUid, supabase) {
    const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
    const { data: rows, error } = await supabase.from(table).select("id, uid, mon_min, tues_min, wed_min, thurs_min, fri_min").eq("week_num", weekNum);
    if (error) throw error;
    const list = rows ?? [];
    for (const row of list){
        const uid = row.uid;
        if (uid == null) continue;
        const uidStr = String(uid);
        const fromTickets = minutesByUid.get(uidStr);
        const ticketsSayZero = fromTickets === undefined || totalMinutes(fromTickets) === 0;
        const recordHasMinutes = (row.mon_min ?? 0) + (row.tues_min ?? 0) + (row.wed_min ?? 0) + (row.thurs_min ?? 0) + (row.fri_min ?? 0) > 0;
        if (ticketsSayZero && recordHasMinutes) {
            const { error: updateError } = await supabase.from(table).update({
                mon_min: 0,
                tues_min: 0,
                wed_min: 0,
                thurs_min: 0,
                fri_min: 0
            }).eq("id", row.id);
            if (updateError) throw updateError;
        }
    }
}
async function syncFrontDeskRecordsForWeek(weekNum, uid) {
    return syncRecordsForWeekInternal(weekNum, "front_desk", {
        uid
    });
}
async function syncFrontDeskRecordsForWeekAllUids(weekNum) {
    return syncRecordsForWeekInternal(weekNum, "front_desk", {
        allUids: true
    });
}
async function syncStudySessionRecordsForWeek(weekNum, uid) {
    return syncRecordsForWeekInternal(weekNum, "study_session", {
        uid
    });
}
async function syncStudySessionRecordsForWeekAllUids(weekNum) {
    return syncRecordsForWeekInternal(weekNum, "study_session", {
        allUids: true
    });
}
}),
"[project]/lib/server/session-records/excuse.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateRecordExcuse",
    ()=>updateRecordExcuse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/records.ts [app-rsc] (ecmascript)");
;
;
;
async function updateRecordExcuse(uid, weekNum, kind, payload) {
    const table = kind === "front_desk" ? "front_desk_records" : "study_session_records";
    const existing = kind === "front_desk" ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFrontDeskRecord"])(uid, weekNum) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudySessionRecord"])(uid, weekNum);
    if (!existing) return null;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from(table).update({
        excuse: payload.excuse ?? null,
        excuse_min: payload.excuse_min ?? null
    }).eq("id", existing.id).select().single();
    if (error) throw error;
    return data;
}
}),
"[project]/lib/server/session-records/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Session records server module. For client-safe types and pure utilities, use @/lib/session-records.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/records.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$excuse$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/excuse.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/lib/traffic/traffic-session-utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEntryCountByWeek",
    ()=>getEntryCountByWeek,
    "getTrafficSessions",
    ()=>getTrafficSessions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
;
const ONE_HOUR_MS = 60 * 60 * 1000;
function isEntry(row) {
    return (row.traffic_type ?? "").trim().toLowerCase() === "entry";
}
function isExit(row) {
    return (row.traffic_type ?? "").trim().toLowerCase() === "exit";
}
/**
 * For an entry with no exit: assume they stayed 1 hour from entry time.
 */ function getAssumedExitAt(entryAt) {
    const entryMs = new Date(entryAt).getTime();
    return new Date(entryMs + ONE_HOUR_MS).toISOString();
}
function getTrafficSessions(rows) {
    const byUid = new Map();
    for (const row of rows){
        const uid = row.uid ?? "";
        if (!uid) continue;
        if (!byUid.has(uid)) byUid.set(uid, []);
        byUid.get(uid).push(row);
    }
    const result = [];
    for (const [, tickets] of byUid){
        const sorted = [
            ...tickets
        ].sort((a, b)=>new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        let i = 0;
        while(i < sorted.length){
            const row = sorted[i];
            if (isEntry(row)) {
                const entryAt = row.created_at;
                const entryMs = new Date(entryAt).getTime();
                if (i + 1 < sorted.length && isExit(sorted[i + 1])) {
                    const exitRow = sorted[i + 1];
                    const exitAt = exitRow.created_at;
                    const exitMs = new Date(exitAt).getTime();
                    result.push({
                        uid: row.uid,
                        entryAt,
                        exitAt,
                        durationMs: exitMs - entryMs,
                        assumedExit: false
                    });
                    i += 2;
                    continue;
                }
                const exitAt = getAssumedExitAt(entryAt);
                const exitMs = new Date(exitAt).getTime();
                result.push({
                    uid: row.uid,
                    entryAt,
                    exitAt,
                    durationMs: exitMs - entryMs,
                    assumedExit: true
                });
                i += 1;
            } else {
                i += 1;
            }
        }
    }
    return result;
}
function getEntryCountByWeek(rows, weekNumber) {
    return rows.filter((row)=>{
        if (!isEntry(row)) return false;
        const week = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dateToCampusWeek"])(new Date(row.created_at));
        return week === weekNumber;
    }).length;
}
}),
"[project]/lib/traffic/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Traffic module - client-safe types and pure session/entry utilities.
 * For server-side data fetching (Supabase), use lib/server/traffic.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$traffic$2f$traffic$2d$session$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/traffic/traffic-session-utils.ts [app-rsc] (ecmascript)");
;
}),
"[project]/lib/server/traffic/fetch.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchTrafficLogs",
    ()=>fetchTrafficLogs,
    "requireTrafficFetchLimit",
    ()=>requireTrafficFetchLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/query-limit.ts [app-rsc] (ecmascript)");
;
;
;
function requireTrafficFetchLimit(options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$query$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireDateOrUidLimit"])(options, "At least one of startDate, endDate, or scholarUids (non-empty) is required to limit the search.");
}
async function fetchTrafficLogs(options) {
    requireTrafficFetchLimit(options);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("traffic").select("id, created_at, uid, traffic_type").order("created_at", {
        ascending: true
    });
    if (options?.startDate) {
        query = query.gte("created_at", options.startDate.toISOString());
    }
    if (options?.endDate) {
        query = query.lte("created_at", options.endDate.toISOString());
    }
    if (options?.scholarUids?.length) {
        query = query.in("uid", options.scholarUids);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}
}),
"[project]/lib/server/traffic/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Traffic server module. For client-safe types and pure utilities, use @/lib/traffic.
 */ __turbopack_context__.s([
    "getTrafficEntryCountForWeek",
    ()=>getTrafficEntryCountForWeek,
    "getTrafficEntryCountsForWeeks",
    ()=>getTrafficEntryCountsForWeeks,
    "getTrafficSessionsForWeek",
    ()=>getTrafficSessionsForWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$traffic$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/traffic/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$traffic$2f$traffic$2d$session$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/traffic/traffic-session-utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-records/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/traffic/fetch.ts [app-rsc] (ecmascript)");
;
;
;
;
;
async function getTrafficSessionsForWeek(weekNumber) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNumber);
    if (!range) return [];
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchTrafficLogs"])({
        startDate: range.startDate,
        endDate
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$traffic$2f$traffic$2d$session$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTrafficSessions"])(rows);
}
async function getTrafficEntryCountForWeek(weekNumber) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNumber);
    if (!range) return 0;
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchTrafficLogs"])({
        startDate: range.startDate,
        endDate
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$traffic$2f$traffic$2d$session$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEntryCountByWeek"])(rows, weekNumber);
}
async function getTrafficEntryCountsForWeeks(weekNumbers) {
    if (weekNumbers.length === 0) return [];
    const counts = await Promise.all(weekNumbers.map((weekNumber)=>getTrafficEntryCountForWeek(weekNumber)));
    return weekNumbers.map((weekNumber, i)=>({
            weekNumber,
            entryCount: counts[i]
        }));
}
}),
"[project]/lib/server/form-logs/fetch.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMcfFormLogsByUid",
    ()=>getMcfFormLogsByUid,
    "getMcfFormLogsByUidAndWeek",
    ()=>getMcfFormLogsByUidAndWeek,
    "getMcfFormLogsForWeek",
    ()=>getMcfFormLogsForWeek,
    "getWhafFormLogsByUid",
    ()=>getWhafFormLogsByUid,
    "getWhafFormLogsForWeek",
    ()=>getWhafFormLogsForWeek,
    "getWplFormLogsByUid",
    ()=>getWplFormLogsByUid,
    "getWplFormLogsByUidAndWeek",
    ()=>getWplFormLogsByUidAndWeek,
    "getWplFormLogsForWeek",
    ()=>getWplFormLogsForWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-records/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
async function getMcfFormLogsForWeek(weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const { data, error } = await supabase.from("mcf_form_logs").select("*").gte("created_at", range.startDate.toISOString()).lte("created_at", endDate.toISOString()).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getMcfFormLogsByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("mcf_form_logs").select("*").or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getMcfFormLogsByUidAndWeek(uid, weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const { data, error } = await supabase.from("mcf_form_logs").select("*").or(`mentor_uid.eq.${uid},mentee_uid.eq.${uid}`).gte("created_at", range.startDate.toISOString()).lte("created_at", endDate.toISOString()).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getWhafFormLogsForWeek(weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const { data, error } = await supabase.from("whaf_form_logs").select("*").gte("created_at", range.startDate.toISOString()).lte("created_at", endDate.toISOString()).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getWhafFormLogsByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("whaf_form_logs").select("*").eq("scholar_uid", uid).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getWplFormLogsForWeek(weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const { data, error } = await supabase.from("wpl_form_logs").select("*").gte("created_at", range.startDate.toISOString()).lte("created_at", endDate.toISOString()).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getWplFormLogsByUid(uid) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("wpl_form_logs").select("*").eq("scholar_uid", uid).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
async function getWplFormLogsByUidAndWeek(uid, weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const endDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range);
    const { data, error } = await supabase.from("wpl_form_logs").select("*").eq("scholar_uid", uid).gte("created_at", range.startDate.toISOString()).lte("created_at", endDate.toISOString()).order("created_at", {
        ascending: true
    });
    if (error) throw error;
    return data ?? [];
}
}),
"[project]/lib/server/form-logs/recent-submissions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRecentFormSubmissions",
    ()=>getRecentFormSubmissions,
    "scholarUidFromProfile",
    ()=>scholarUidFromProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/fetch.ts [app-rsc] (ecmascript)");
;
;
function scholarUidFromProfile(profile) {
    if (typeof profile?.student_id === "number" && Number.isFinite(profile.student_id)) {
        return String(profile.student_id);
    }
    return null;
}
function sortByCreatedAtDesc(rows) {
    return [
        ...rows
    ].sort((a, b)=>{
        const aTs = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTs = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTs - aTs;
    });
}
function mapWhafRow(row) {
    return {
        id: `WHAF-${row.id}`,
        formType: "WHAF",
        submittedAt: row.created_at,
        assignment_grades: row.assignment_grades,
        course_changes: row.course_changes,
        missed_classes: row.missed_classes,
        missed_assignments: row.missed_assignments,
        course_change_details: row.course_change_details
    };
}
function mapWplRow(row) {
    return {
        id: `WPL-${row.id}`,
        formType: "WPL",
        submittedAt: row.created_at,
        hours_worked: row.hours_worked,
        projects: row.projects,
        met_with_all: row.met_with_all,
        explanation: row.explanation
    };
}
function mapMcfRow(row) {
    return {
        id: `MCF-${row.id}`,
        formType: "MCF",
        submittedAt: row.created_at,
        mentee_name: row.mentee_name,
        meeting_date: row.meeting_date,
        meeting_time: row.meeting_time,
        met_in_person: row.met_in_person,
        tasks_completed: row.tasks_completed,
        meeting_notes: row.meeting_notes,
        needs_tutor: row.needs_tutor
    };
}
async function getRecentFormSubmissions(params) {
    const { profile } = params;
    const uid = scholarUidFromProfile(profile);
    if (!uid) {
        return [];
    }
    const [whafAll, wplAll, mcfAll] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWhafFormLogsByUid"])(uid),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWplFormLogsByUid"])(uid),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsByUid"])(uid)
    ]);
    const whafRows = sortByCreatedAtDesc(whafAll);
    const wplRows = sortByCreatedAtDesc(wplAll);
    const mcfRows = sortByCreatedAtDesc(mcfAll);
    return [
        ...whafRows.map(mapWhafRow),
        ...wplRows.map(mapWplRow),
        ...mcfRows.map(mapMcfRow)
    ].sort((a, b)=>{
        const aTs = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const bTs = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return bTs - aTs;
    });
}
}),
"[project]/lib/form-logs/deadlines.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Form submission deadlines in Eastern time (America/New_York).
 * - WHAF: late if submitted after Thursday 23:59 EST.
 * - MCF & WPL: late if submitted after Friday 17:00 EST.
 * Client-safe; uses lib/time for campus week boundaries.
 */ __turbopack_context__.s([
    "getMcfWplDeadlineForWeek",
    ()=>getMcfWplDeadlineForWeek,
    "getWhafDeadlineForWeek",
    ()=>getWhafDeadlineForWeek,
    "isMcfLate",
    ()=>isMcfLate,
    "isMcfLateForWeek",
    ()=>isMcfLateForWeek,
    "isWhafLate",
    ()=>isWhafLate,
    "isWhafLateForWeek",
    ()=>isWhafLateForWeek,
    "isWplLate",
    ()=>isWplLate,
    "isWplLateForWeek",
    ()=>isWplLateForWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
;
function getWhafDeadlineForWeek(weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return null;
    const thursdayEnd = range.startDate.getTime() + 3 * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ONE_DAY_MS"] + (23 * 3600 + 59 * 60 + 59) * 1000 + 999;
    return new Date(thursdayEnd);
}
function getMcfWplDeadlineForWeek(weekNum) {
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    if (!range) return null;
    const friday5pm = range.startDate.getTime() + 4 * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ONE_DAY_MS"] + 17 * 3600 * 1000;
    return new Date(friday5pm);
}
function toDate(createdAt) {
    return typeof createdAt === "string" ? new Date(createdAt) : createdAt;
}
/**
 * True if submitted is after the deadline for its campus week.
 * Used by both MCF and WPL (same Friday 17:00 deadline).
 */ function isLateAfterDeadline(createdAt, getDeadlineForWeek) {
    const submitted = toDate(createdAt);
    const weekNum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dateToCampusWeek"])(submitted);
    if (weekNum == null) return false;
    const deadline = getDeadlineForWeek(weekNum);
    if (!deadline) return false;
    return submitted.getTime() > deadline.getTime();
}
function isWhafLate(createdAt) {
    return isLateAfterDeadline(createdAt, getWhafDeadlineForWeek);
}
function isWhafLateForWeek(createdAt, weekNum) {
    const deadline = getWhafDeadlineForWeek(weekNum);
    if (!deadline) return false;
    const submitted = toDate(createdAt);
    return submitted.getTime() > deadline.getTime();
}
function isMcfLate(createdAt) {
    return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}
function isMcfLateForWeek(createdAt, weekNum) {
    const deadline = getMcfWplDeadlineForWeek(weekNum);
    if (!deadline) return false;
    const submitted = toDate(createdAt);
    return submitted.getTime() > deadline.getTime();
}
function isWplLate(createdAt) {
    return isLateAfterDeadline(createdAt, getMcfWplDeadlineForWeek);
}
function isWplLateForWeek(createdAt, weekNum) {
    const deadline = getMcfWplDeadlineForWeek(weekNum);
    if (!deadline) return false;
    const submitted = toDate(createdAt);
    return submitted.getTime() > deadline.getTime();
}
}),
"[project]/lib/form-logs/process.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Processing helpers: attach isLate to form log rows using Eastern-time deadlines.
 * Client-safe; use with rows from lib/server/form-logs or any object with created_at.
 */ __turbopack_context__.s([
    "markMcfFormLogsLate",
    ()=>markMcfFormLogsLate,
    "markWhafFormLogsLate",
    ()=>markWhafFormLogsLate,
    "markWplFormLogsLate",
    ()=>markWplFormLogsLate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-logs/deadlines.ts [app-rsc] (ecmascript)");
;
/**
 * Mark each row with isLate using the given deadline check.
 * Shared implementation for WHAF, MCF, and WPL.
 */ function markFormLogsLate(rows, isLate) {
    return rows.map((row)=>({
            ...row,
            isLate: row.created_at != null && row.created_at !== "" ? isLate(row.created_at) : false
        }));
}
function markWhafFormLogsLate(rows, weekNum) {
    const isLate = weekNum != null ? (c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWhafLateForWeek"])(c, weekNum) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWhafLate"];
    return markFormLogsLate(rows, isLate);
}
function markMcfFormLogsLate(rows, weekNum) {
    const isLate = weekNum != null ? (c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isMcfLateForWeek"])(c, weekNum) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isMcfLate"];
    return markFormLogsLate(rows, isLate);
}
function markWplFormLogsLate(rows, weekNum) {
    const isLate = weekNum != null ? (c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWplLateForWeek"])(c, weekNum) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWplLate"];
    return markFormLogsLate(rows, isLate);
}
}),
"[project]/lib/form-logs/name-matching.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Name normalization and fuzzy matching for team leader lookup (e.g. matching
 * form log rows to TLs when scholar_uid is not yet available). Client-safe.
 */ __turbopack_context__.s([
    "findTeamLeaderUidByFuzzyName",
    ()=>findTeamLeaderUidByFuzzyName,
    "nameTokens",
    ()=>nameTokens,
    "nameVariants",
    ()=>nameVariants,
    "normalizeName",
    ()=>normalizeName
]);
function normalizeName(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[,.]/g, " ").replace(/\s+/g, " ").trim();
}
function nameVariants(s) {
    const n = normalizeName(s);
    const out = [
        n
    ];
    const parts = n.split(",").map((p)=>p.trim()).filter(Boolean);
    if (parts.length === 2) {
        const reversed = [
            parts[1],
            parts[0]
        ].join(" ");
        if (reversed !== n) out.push(reversed);
    }
    return out;
}
function nameTokens(s) {
    return new Set(normalizeName(s).split(" ").filter(Boolean));
}
function findTeamLeaderUidByFuzzyName(name, teamLeaders) {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const inputTokens = nameTokens(trimmed);
    let bestUid = null;
    let bestScore = 0;
    for (const u of teamLeaders){
        const full = [
            u.first_name,
            u.last_name
        ].filter(Boolean).join(" ").trim();
        if (!full) continue;
        const fullNorm = normalizeName(full);
        for (const variant of nameVariants(trimmed)){
            if (fullNorm === variant) return u.uid;
        }
        const tlTokens = nameTokens(full);
        const intersection = [
            ...inputTokens
        ].filter((t)=>tlTokens.has(t)).length;
        const union = new Set([
            ...inputTokens,
            ...tlTokens
        ]).size;
        const score = union > 0 ? intersection / union : 0;
        if (score > bestScore && score >= 0.4) {
            bestScore = score;
            bestUid = u.uid;
        }
    }
    return bestUid;
}
}),
"[project]/lib/form-logs/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Form logs: client-safe deadline and late-processing logic, plus shared activity DTO types.
 * For fetching rows, use @/lib/server/form-logs.
 *
 * Deadlines (Eastern):
 * - WHAF: late if submitted after Thursday 23:59 EST.
 * - MCF & WPL: late if submitted after Friday 17:00 EST.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$deadlines$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-logs/deadlines.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-logs/process.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$name$2d$matching$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-logs/name-matching.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/lib/server/form-logs/with-late.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMcfFormLogsByUidAndWeekWithLate",
    ()=>getMcfFormLogsByUidAndWeekWithLate,
    "getMcfFormLogsByUidWithLate",
    ()=>getMcfFormLogsByUidWithLate,
    "getMcfFormLogsForWeekWithLate",
    ()=>getMcfFormLogsForWeekWithLate,
    "getWhafFormLogsForWeekWithLate",
    ()=>getWhafFormLogsForWeekWithLate,
    "getWplFormLogsByUidAndWeekWithLate",
    ()=>getWplFormLogsByUidAndWeekWithLate,
    "getWplFormLogsByUidWithLate",
    ()=>getWplFormLogsByUidWithLate,
    "getWplFormLogsForWeekWithLate",
    ()=>getWplFormLogsForWeekWithLate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/form-logs/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-logs/process.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/fetch.ts [app-rsc] (ecmascript)");
;
;
;
async function getWhafFormLogsForWeekWithLate(weekNum) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWhafFormLogsForWeek"])(weekNum);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWhafFormLogsLate"])(rows, weekNum);
}
async function getMcfFormLogsForWeekWithLate(weekNum) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsForWeek"])(weekNum);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markMcfFormLogsLate"])(rows, weekNum);
}
async function getMcfFormLogsByUidWithLate(uid) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsByUid"])(uid);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markMcfFormLogsLate"])(rows);
}
async function getMcfFormLogsByUidAndWeekWithLate(uid, weekNum) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsByUidAndWeek"])(uid, weekNum);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markMcfFormLogsLate"])(rows);
}
async function getWplFormLogsForWeekWithLate(weekNum) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWplFormLogsForWeek"])(weekNum);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWplFormLogsLate"])(rows, weekNum);
}
async function getWplFormLogsByUidWithLate(uid) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWplFormLogsByUid"])(uid);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWplFormLogsLate"])(rows);
}
async function getWplFormLogsByUidAndWeekWithLate(uid, weekNum) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWplFormLogsByUidAndWeek"])(uid, weekNum);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$logs$2f$process$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markWplFormLogsLate"])(rows);
}
}),
"[project]/lib/server/form-logs/aggregate.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildTeamLeaderFormStatsForWeek",
    ()=>buildTeamLeaderFormStatsForWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
const NO_SUBMISSION_SENTINEL = "9999-12-31T23:59:59.999Z";
function buildTeamLeaderFormStatsForWeek(teamLeaders, mcfRowsWithLate, whafRowsWithLate, wplRowsWithLate) {
    const tlUids = new Set(teamLeaders.map((u)=>u.uid));
    // MCF this week: match by TL uid (mentor_uid on row).
    const mcfByUid = new Map();
    for (const row of mcfRowsWithLate){
        const mentorUid = row.mentor_uid ?? null;
        if (mentorUid) {
            const cur = mcfByUid.get(mentorUid) ?? {
                count: 0,
                hasLate: false,
                latestAt: ""
            };
            const created = row.created_at ?? "";
            mcfByUid.set(mentorUid, {
                count: cur.count + 1,
                hasLate: cur.hasLate || row.isLate,
                latestAt: created > cur.latestAt ? created : cur.latestAt
            });
        }
    }
    // WHAF this week: scholar_uid is the TL (same person as mentor_uid in MCF).
    const whafByUid = new Map();
    for (const u of teamLeaders){
        whafByUid.set(u.uid, {
            count: 0,
            hasLate: false,
            latestAt: ""
        });
    }
    for (const row of whafRowsWithLate){
        const uid = row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
        if (!uid) continue;
        const cur = whafByUid.get(uid);
        const created = row.created_at ?? "";
        whafByUid.set(uid, {
            count: cur.count + 1,
            hasLate: cur.hasLate || row.isLate,
            latestAt: created > cur.latestAt ? created : cur.latestAt
        });
    }
    // WPL this week: scholar_uid is the TL (same person as mentor_uid in MCF).
    const wplByUid = new Map();
    for (const u of teamLeaders){
        wplByUid.set(u.uid, {
            count: 0,
            hasLate: false,
            latestAt: ""
        });
    }
    for (const row of wplRowsWithLate){
        const uid = row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
        if (!uid) continue;
        const cur = wplByUid.get(uid);
        const created = row.created_at ?? "";
        wplByUid.set(uid, {
            count: cur.count + 1,
            hasLate: cur.hasLate || row.isLate,
            latestAt: created > cur.latestAt ? created : cur.latestAt
        });
    }
    return teamLeaders.map((u)=>{
        const menteeCount = u.mentee_count ?? 0;
        const mcf = mcfByUid.get(u.uid) ?? {
            count: 0,
            hasLate: false,
            latestAt: ""
        };
        const whaf = whafByUid.get(u.uid) ?? {
            count: 0,
            hasLate: false,
            latestAt: ""
        };
        const wpl = wplByUid.get(u.uid) ?? {
            count: 0,
            hasLate: false,
            latestAt: ""
        };
        const mcf_required = menteeCount;
        const mcf_completed = mcf.count;
        const mcf_pct = mcf_required > 0 ? Math.round(mcf_completed / mcf_required * 100) : 100;
        const whaf_required = 1;
        const whaf_completed = whaf.count;
        const whaf_pct = whaf_completed >= whaf_required ? 100 : Math.round(whaf_completed / whaf_required * 100);
        const wpl_required = 1;
        const wpl_completed = wpl.count;
        const wpl_pct = wpl_completed >= wpl_required ? 100 : Math.round(wpl_completed / wpl_required * 100);
        return {
            uid: u.uid,
            name: [
                u.first_name,
                u.last_name
            ].filter(Boolean).join(" ").trim() || u.uid,
            program_role: u.program_role,
            mcf_completed,
            mcf_required,
            mcf_late: mcf.hasLate,
            mcf_pct,
            mcf_latest_at: mcf.latestAt || (mcf_required > 0 ? NO_SUBMISSION_SENTINEL : ""),
            whaf_completed,
            whaf_required,
            whaf_late: whaf.hasLate,
            whaf_pct,
            whaf_latest_at: whaf.latestAt || NO_SUBMISSION_SENTINEL,
            wpl_completed,
            wpl_required,
            wpl_late: wpl.hasLate,
            wpl_pct,
            wpl_latest_at: wpl.latestAt || NO_SUBMISSION_SENTINEL
        };
    });
}
}),
"[project]/lib/server/form-logs/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Form logs server module. Fetches mcf_form_logs, whaf_form_logs, wpl_form_logs
 * by campus week and (where applicable) by uid. Use @/lib/form-logs for late-processing
 * (isWhafLate, markWhafFormLogsLate, etc.) or the *WithLate fetchers below.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/fetch.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$recent$2d$submissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/recent-submissions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/with-late.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$aggregate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/aggregate.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/app/memo/memo-content.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "MemoContent",
    ()=>MemoContent,
    "ProgressCell",
    ()=>ProgressCell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const MemoContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call MemoContent() from the server but MemoContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/memo/memo-content.tsx <module evaluation>", "MemoContent");
const ProgressCell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProgressCell() from the server but ProgressCell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/memo/memo-content.tsx <module evaluation>", "ProgressCell");
}),
"[project]/app/memo/memo-content.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "MemoContent",
    ()=>MemoContent,
    "ProgressCell",
    ()=>ProgressCell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const MemoContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call MemoContent() from the server but MemoContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/memo/memo-content.tsx", "MemoContent");
const ProgressCell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProgressCell() from the server but ProgressCell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/memo/memo-content.tsx", "ProgressCell");
}),
"[project]/app/memo/memo-content.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$memo$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/memo/memo-content.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$memo$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/memo/memo-content.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$memo$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/memo/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MemoPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/time/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/time/campus-week.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/session-records/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-records/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/users.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/server/session-records/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-records/records.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/server/session-logs/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$study$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/study.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$front$2d$desk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/session-logs/front-desk.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/server/traffic/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/server/form-logs/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/with-late.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$aggregate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/form-logs/aggregate.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$memo$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/memo/memo-content.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const dynamic = "force-dynamic";
function isScholar(role) {
    return (role ?? "").toLowerCase() === "scholar";
}
function isTeamLeader(programRole) {
    const r = (programRole ?? "").toLowerCase();
    return r !== "scholar";
}
function hasRequiredHours(u) {
    const fd = u.fd_required ?? 0;
    const ss = u.ss_required ?? 0;
    return fd > 0 || ss > 0;
}
async function MemoPage({ searchParams }) {
    const params = await searchParams;
    const weekParam = params.week ?? "";
    const currentCampusWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dateToCampusWeek"])(new Date());
    const weekNum = weekParam !== "" ? Math.max(1, Math.min(99, parseInt(weekParam, 10) || 1)) : currentCampusWeek != null ? Math.max(1, Math.min(99, currentCampusWeek)) : 1;
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$time$2f$campus$2d$week$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["campusWeekToDateRange"])(weekNum);
    const startDate = range?.startDate ?? undefined;
    const endDate = range ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$records$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWeekFetchEnd"])(range) : undefined;
    const dateRangeOpts = {
        startDate,
        endDate
    };
    const weekPickerMax = Math.max(25, currentCampusWeek ?? 1, weekNum);
    const weekNumbers = Array.from({
        length: weekPickerMax
    }, (_, i)=>i + 1);
    const [allUsers, studyRecords, fdRecords, completedStudy, completedFd, trafficWeeklyData, trafficEntryCountForSelectedWeek, trafficSessions, teamLeadersRaw, mcfRowsWithLate, whafRowsWithLate, wplRowsWithLate] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllUsersForMemo"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudySessionRecordsForWeekAll"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$records$2f$records$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFrontDeskRecordsForWeekAll"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$study$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudySessionCompletedSessions"])(dateRangeOpts),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$session$2d$logs$2f$front$2d$desk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFrontDeskCompletedSessions"])(dateRangeOpts),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getTrafficEntryCountsForWeeks"])(weekNumbers),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getTrafficEntryCountForWeek"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$traffic$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getTrafficSessionsForWeek"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchTeamLeaders"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsForWeekWithLate"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWhafFormLogsForWeekWithLate"])(weekNum),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWplFormLogsForWeekWithLate"])(weekNum)
    ]);
    const teamLeaderFormRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$aggregate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildTeamLeaderFormStatsForWeek"])(teamLeadersRaw, mcfRowsWithLate, whafRowsWithLate, wplRowsWithLate);
    const formCompletionOverall = teamLeaderFormRows.reduce((acc, row)=>({
            whaf_completed: acc.whaf_completed + Math.min(row.whaf_completed, row.whaf_required),
            whaf_required: acc.whaf_required + row.whaf_required,
            whaf_late_count: acc.whaf_late_count + (row.whaf_late ? 1 : 0),
            mcf_completed: acc.mcf_completed + Math.min(row.mcf_completed, row.mcf_required),
            mcf_required: acc.mcf_required + row.mcf_required,
            mcf_late_count: acc.mcf_late_count + (row.mcf_late ? 1 : 0),
            wpl_completed: acc.wpl_completed + Math.min(row.wpl_completed, row.wpl_required),
            wpl_required: acc.wpl_required + row.wpl_required,
            wpl_late_count: acc.wpl_late_count + (row.wpl_late ? 1 : 0)
        }), {
        whaf_completed: 0,
        whaf_required: 0,
        whaf_late_count: 0,
        mcf_completed: 0,
        mcf_required: 0,
        mcf_late_count: 0,
        wpl_completed: 0,
        wpl_required: 0,
        wpl_late_count: 0
    });
    const studyByUid = new Map(studyRecords.filter((r)=>r.uid != null).map((r)=>[
            String(r.uid),
            {
                total: (r.mon_min ?? 0) + (r.tues_min ?? 0) + (r.wed_min ?? 0) + (r.thurs_min ?? 0) + (r.fri_min ?? 0),
                excuse_min: r.excuse_min ?? 0,
                ss_required: r.ss_required ?? null
            }
        ]));
    const fdByUid = new Map(fdRecords.filter((r)=>r.uid != null).map((r)=>[
            String(r.uid),
            {
                total: (r.mon_min ?? 0) + (r.tues_min ?? 0) + (r.wed_min ?? 0) + (r.thurs_min ?? 0) + (r.fri_min ?? 0),
                excuse_min: r.excuse_min ?? 0,
                fd_required: r.fd_required ?? null
            }
        ]));
    const scholars = [];
    const cohort2024 = {
        total: 0,
        fdCompleteCount: 0,
        ssCompleteCount: 0
    };
    const cohort2025 = {
        total: 0,
        fdCompleteCount: 0,
        ssCompleteCount: 0
    };
    for (const u of allUsers){
        if (!isScholar(u.program_role) || !hasRequiredHours(u)) continue;
        const study = studyByUid.get(u.uid) ?? {
            total: 0,
            excuse_min: 0,
            ss_required: u.ss_required ?? null
        };
        const fd = fdByUid.get(u.uid) ?? {
            total: 0,
            excuse_min: 0,
            fd_required: u.fd_required ?? null
        };
        const fdReq = fd.fd_required ?? u.fd_required ?? null;
        const ssReq = study.ss_required ?? u.ss_required ?? null;
        const fdEffective = fd.total + fd.excuse_min;
        const ssEffective = study.total + study.excuse_min;
        const fd_pct = fdReq != null && fdReq > 0 ? fdEffective / fdReq * 100 : null;
        const ss_pct = ssReq != null && ssReq > 0 ? ssEffective / ssReq * 100 : null;
        const name = [
            u.first_name,
            u.last_name
        ].filter(Boolean).join(" ").trim() || u.uid;
        scholars.push({
            uid: u.uid,
            scholar_name: name,
            fd_total: fd.total,
            ss_total: study.total,
            fd_required: fdReq,
            ss_required: ssReq,
            fd_excuse_min: fd.excuse_min,
            ss_excuse_min: study.excuse_min,
            fd_pct,
            ss_pct
        });
        const fdComplete = fd_pct != null && fd_pct >= 100;
        const ssComplete = ss_pct != null && ss_pct >= 100;
        if (u.cohort === 2024) {
            cohort2024.total += 1;
            if (fdComplete) cohort2024.fdCompleteCount += 1;
            if (ssComplete) cohort2024.ssCompleteCount += 1;
        } else if (u.cohort === 2025) {
            cohort2025.total += 1;
            if (fdComplete) cohort2025.fdCompleteCount += 1;
            if (ssComplete) cohort2025.ssCompleteCount += 1;
        }
    }
    const pieData = {
        cohort2024: {
            total: cohort2024.total,
            fdCompleteCount: cohort2024.fdCompleteCount,
            ssCompleteCount: cohort2024.ssCompleteCount,
            fdPercent: cohort2024.total > 0 ? cohort2024.fdCompleteCount / cohort2024.total * 100 : 0,
            ssPercent: cohort2024.total > 0 ? cohort2024.ssCompleteCount / cohort2024.total * 100 : 0
        },
        cohort2025: {
            total: cohort2025.total,
            fdCompleteCount: cohort2025.fdCompleteCount,
            ssCompleteCount: cohort2025.ssCompleteCount,
            fdPercent: cohort2025.total > 0 ? cohort2025.fdCompleteCount / cohort2025.total * 100 : 0,
            ssPercent: cohort2025.total > 0 ? cohort2025.ssCompleteCount / cohort2025.total * 100 : 0
        }
    };
    // Team leaders: non-scholars from user_roster (via fetchAllUsersForMemo)
    const tlUsers = allUsers.filter((u)=>isTeamLeader(u.program_role));
    // MCF: fetch per TL by uid + week (DB filters mentor_uid or mentee_uid = TL uid)
    const mcfByTlUid = new Map();
    await Promise.all(tlUsers.map(async (u)=>{
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$form$2d$logs$2f$with$2d$late$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMcfFormLogsByUidAndWeekWithLate"])(u.uid, weekNum);
        const latestAt = rows.length > 0 ? rows[rows.length - 1].created_at : null;
        mcfByTlUid.set(u.uid, {
            count: rows.length,
            hasLate: rows.some((r)=>r.isLate),
            latestAt
        });
    }));
    const MCF_REQUIRED_PER_WEEK = 1;
    const teamLeaders = tlUsers.map((u)=>{
        const mcf = mcfByTlUid.get(u.uid) ?? {
            count: 0,
            hasLate: false,
            latestAt: null
        };
        const mcf_required = MCF_REQUIRED_PER_WEEK;
        const mcf_pct = mcf_required > 0 ? Math.round(mcf.count / mcf_required * 100) : null;
        return {
            uid: u.uid,
            name: [
                u.first_name,
                u.last_name
            ].filter(Boolean).join(" ").trim() || u.uid,
            mcf_completed: mcf.count,
            mcf_required: mcf_required,
            mcf_late: mcf.hasLate,
            mcf_pct,
            mcf_latest_at: mcf.latestAt ?? endDate?.toISOString() ?? ""
        };
    });
    const weekLabel = range != null ? `Week ${range.weekNumber} (${range.startDate.toLocaleDateString("en-US", {
        timeZone: "America/New_York"
    })} – ${range.endDate.toLocaleDateString("en-US", {
        timeZone: "America/New_York"
    })})` : `Week ${weekNum}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$memo$2f$memo$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MemoContent"], {
        scholars: scholars,
        teamLeaders: teamLeaders,
        pieData: pieData,
        formCompletionOverall: formCompletionOverall,
        completedStudy: completedStudy,
        completedFd: completedFd,
        trafficWeeklyData: trafficWeeklyData,
        trafficEntryCountForSelectedWeek: trafficEntryCountForSelectedWeek,
        trafficSessions: trafficSessions,
        weekLabel: weekLabel,
        currentCampusWeek: currentCampusWeek ?? null,
        selectedWeekNum: weekNum,
        trafficCardSpan: "half",
        trafficCardTitle: "Traffic log",
        trafficCardDescription: null
    }, void 0, false, {
        fileName: "[project]/app/memo/page.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/memo/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/memo/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ec408663._.js.map