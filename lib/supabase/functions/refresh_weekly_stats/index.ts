import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

// ─── CORS ─────────────────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RefreshPayload {
  week_num: number;
  semester_id: number;
}

interface Semester {
  id: number;
  start_date: string;
}

interface ScholarProfile {
  uid: string;
  fd_required: number;
  ss_required: number;
}

interface ActivityRow {
  scholar_uid: string;
  log_source: string; // 'front_desk' | 'study_session'
  duration_minutes: number;
}

interface WahfRow {
  scholar_uid: string;
  created_at: string;
  assignment_grades: unknown;
}

interface McfRow {
  mentee_uid: string;
  created_at: string;
}

interface WplRow {
  scholar_uid: string;
  created_at: string;
}

interface TutorRow {
  scholar_uid: string;
}

interface PriorStatRow {
  scholar_uid: string;
  week_num: number;
  is_flagged: boolean;
}

interface TrafficRow {
  uid: string;
  traffic_type: string; // 'front_desk' | 'study_session' | 'tutoring'
}

interface ScholarStatUpsert {
  scholar_uid: string;
  semester_id: number;
  week_num: number;
  fd_minutes: number;
  ss_minutes: number;
  fd_completion: number;
  ss_completion: number;
  wahf_submitted: boolean;
  mcf_submitted: boolean;
  wpl_submitted: boolean;
  missed_tutoring: boolean;
  is_flagged: boolean;
  weeks_flagged: number;
  grade_trend: "improving" | "flat" | "declining" | null;
  updated_at: string;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Returns the UTC [start, end] datetime range for a given program week.
 * Program week 1 begins on semester.start_date.
 * Assumes weeks run Mon–Sun; adjust setUTCDay logic if your weeks differ.
 */
function getWeekDateRange(
  semesterStartDate: string,
  weekNum: number
): { start: Date; end: Date } {
  const start = new Date(semesterStartDate);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + (weekNum - 1) * 7);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

// ─── Grade helpers ────────────────────────────────────────────────────────────

const GRADE_MAP: Record<string, number> = {
  "A+": 4.3, A: 4.0,  "A-": 3.7,
  "B+": 3.3, B: 3.0,  "B-": 2.7,
  "C+": 2.3, C: 2.0,  "C-": 1.7,
  "D+": 1.3, D: 1.0,  "D-": 0.7,
  F: 0.0,
};

/**
 * Below a C-average (2.0) is considered a "low grade" flag.
 * Adjust threshold as needed.
 */
const LOW_GRADE_THRESHOLD = 2.0;

/**
 * Derives a mean GPA score from the assignment_grades jsonb field in whaf_form_logs.
 *
 * Supports two shapes — update this function if your jsonb structure differs:
 *   Array<{ course: string; grade: string }>   e.g. [{ course: "MATH101", grade: "B+" }]
 *   { [course: string]: string }               e.g. { "MATH101": "B+" }
 *
 * Returns null if no parseable grades are found.
 */
function extractAvgGrade(grades: unknown): number | null {
  if (!grades) return null;

  let letters: string[] = [];

  if (Array.isArray(grades)) {
    letters = grades
      .map((g: any) => g?.grade ?? g?.letter ?? g?.letter_grade)
      .filter(Boolean);
  } else if (typeof grades === "object") {
    letters = Object.values(grades as Record<string, string>).filter(Boolean);
  }

  const scores = letters
    .map((l) => GRADE_MAP[String(l).toUpperCase().trim()])
    .filter((s): s is number => s !== undefined);

  return scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;
}

/**
 * Computes trend direction from a chronologically-ordered array of nullable
 * GPA scores using simple linear regression.
 *
 * Thresholds (±0.15 GPA points per week) can be tuned to taste.
 */
function computeGradeTrend(
  scores: (number | null)[]
): "improving" | "flat" | "declining" | null {
  const valid = scores.filter((s): s is number => s !== null);
  if (valid.length < 2) return null;

  const n = valid.length;
  const xMean = (n - 1) / 2;
  const yMean = valid.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (valid[i] - yMean);
    den += Math.pow(i - xMean, 2);
  }

  const slope = den === 0 ? 0 : num / den;

  if (slope > 0.15) return "improving";
  if (slope < -0.15) return "declining";
  return "flat";
}

// ─── Flag helpers ─────────────────────────────────────────────────────────────

/**
 * Counts consecutive weeks where is_flagged = true, walking backward from
 * the current week. Includes the current week in the count if flagged.
 *
 * Example: prior weeks flagged = [10: true, 9: true, 8: false], current = 11, flagged
 * → weeks_flagged = 3  (weeks 9, 10, 11)
 */
function countConsecutiveFlagged(
  priorStats: PriorStatRow[],
  currentWeekNum: number,
  isCurrentlyFlagged: boolean
): number {
  const flagMap = new Map<number, boolean>(
    priorStats.map((s) => [s.week_num, s.is_flagged])
  );

  let count = isCurrentlyFlagged ? 1 : 0;
  let w = currentWeekNum - 1;

  while (w >= 1 && flagMap.get(w) === true) {
    count++;
    w--;
  }

  return count;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

function assertNoError(error: any, label: string) {
  if (error) throw new Error(`[${label}] ${error.message}`);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase: SupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── Validate payload ─────────────────────────────────────────────────────
    const payload: RefreshPayload = await req.json();
    const { week_num, semester_id } = payload;

    if (!week_num || !semester_id) {
      return new Response(
        JSON.stringify({ error: "week_num and semester_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── 1. Semester ──────────────────────────────────────────────────────────
    const { data: semester, error: semErr } = await supabase
      .from("semesters")
      .select("id, start_date")
      .eq("id", semester_id)
      .single<Semester>();

    assertNoError(semErr, "semester");
    if (!semester) throw new Error("Semester not found");

    const { start: weekStart, end: weekEnd } = getWeekDateRange(
      semester.start_date,
      week_num
    );

    // Trend window: up to 3 weeks prior (or start of semester)
    const trendWeekStart = Math.max(1, week_num - 3);
    const { start: trendRangeStart } = getWeekDateRange(
      semester.start_date,
      trendWeekStart
    );

    const weekStartISO = weekStart.toISOString();
    const weekEndISO = weekEnd.toISOString();
    const trendStartISO = trendRangeStart.toISOString();

    // ── 2. Active scholars ───────────────────────────────────────────────────
    // Excludes GA and Admin — include TLs since they have attendance requirements.
    // Joins profiles for fd_required / ss_required.
    const { data: rosterRows, error: rosterErr } = await supabase
      .from("user_roster")
      .select("uid, profiles!inner(fd_required, ss_required)")
      .eq("status", "active")
      .not("program_role", "in", '("GA","Admin")');

    assertNoError(rosterErr, "roster");

    const scholars: ScholarProfile[] = (rosterRows ?? []).map((r: any) => ({
      uid: r.uid,
      fd_required: r.profiles?.fd_required ?? 0,
      ss_required: r.profiles?.ss_required ?? 0,
    }));

    const uids = scholars.map((s) => s.uid);

    if (!uids.length) {
      console.log("[refresh_weekly_stats] No active scholars found — exiting.");
      return new Response(JSON.stringify({ refreshed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── 3. Parallel data fetch ───────────────────────────────────────────────
    // All queries scoped to active scholar UIDs and the target week.
    // daily_scholar_activity is filtered by both week_num AND activity_date
    // to guard against week_num collisions across semesters.
    const [
      activityRes,    // FD + SS minutes for this week
      wahfRes,        // WAHF submissions this week
      mcfRes,         // MCF submissions this week
      wplRes,         // WPL submissions this week
      tutorRes,       // Tutor session reports this week
      priorWahfRes,   // WAHF from prior 3 weeks (for grade trend)
      priorStatsRes,  // scholar_weekly_stats rows (for weeks_flagged)
      trafficRes,     // Raw traffic rows for this week
    ] = await Promise.all([
      supabase
        .from("daily_scholar_activity")
        .select("scholar_uid, log_source, duration_minutes")
        .in("scholar_uid", uids)
        .eq("week_num", week_num)
        .gte("activity_date", weekStart.toISOString().split("T")[0])
        .lte("activity_date", weekEnd.toISOString().split("T")[0]),

      supabase
        .from("whaf_form_logs")
        .select("scholar_uid, created_at, assignment_grades")
        .in("scholar_uid", uids)
        .gte("created_at", weekStartISO)
        .lte("created_at", weekEndISO),

      supabase
        .from("mcf_form_logs")
        .select("mentee_uid, created_at")
        .in("mentee_uid", uids)
        .gte("created_at", weekStartISO)
        .lte("created_at", weekEndISO),

      supabase
        .from("wpl_form_logs")
        .select("scholar_uid, created_at")
        .in("scholar_uid", uids)
        .gte("created_at", weekStartISO)
        .lte("created_at", weekEndISO),

      // Absence of a tutor_report_log for a scholar this week = missed_tutoring.
      // If tutoring is conditional (not all scholars require it), you may want
      // to cross-reference mcf_form_logs.needs_tutor before flagging.
      supabase
        .from("tutor_report_logs")
        .select("scholar_uid")
        .in("scholar_uid", uids)
        .gte("created_at", weekStartISO)
        .lte("created_at", weekEndISO),

      supabase
        .from("whaf_form_logs")
        .select("scholar_uid, created_at, assignment_grades")
        .in("scholar_uid", uids)
        .gte("created_at", trendStartISO)
        .lt("created_at", weekStartISO),

      // Look back up to 12 weeks to support long consecutive-flag streaks
      supabase
        .from("scholar_weekly_stats")
        .select("scholar_uid, week_num, is_flagged")
        .eq("semester_id", semester_id)
        .in("scholar_uid", uids)
        .lt("week_num", week_num)
        .gte("week_num", Math.max(1, week_num - 12)),

      supabase
        .from("traffic")
        .select("uid, traffic_type")
        .in("uid", uids)
        .gte("created_at", weekStartISO)
        .lte("created_at", weekEndISO),
    ]);

    // Surface any fetch errors before doing any computation
    assertNoError(activityRes.error, "daily_scholar_activity");
    assertNoError(wahfRes.error, "whaf_form_logs");
    assertNoError(mcfRes.error, "mcf_form_logs");
    assertNoError(wplRes.error, "wpl_form_logs");
    assertNoError(tutorRes.error, "tutor_report_logs");
    assertNoError(priorWahfRes.error, "whaf_form_logs (prior)");
    assertNoError(priorStatsRes.error, "scholar_weekly_stats (prior)");
    assertNoError(trafficRes.error, "traffic");

    const activityRows = (activityRes.data ?? []) as ActivityRow[];
    const wahfRows = (wahfRes.data ?? []) as WahfRow[];
    const mcfRows = (mcfRes.data ?? []) as McfRow[];
    const wplRows = (wplRes.data ?? []) as WplRow[];
    const tutorRows = (tutorRes.data ?? []) as TutorRow[];
    const priorWahfRows = (priorWahfRes.data ?? []) as WahfRow[];
    const priorStats = (priorStatsRes.data ?? []) as PriorStatRow[];
    const trafficRows = (trafficRes.data ?? []) as TrafficRow[];

    // ── 4. Build lookup structures ───────────────────────────────────────────

    // Attendance: sum FD and SS minutes per scholar
    const activityByScholar = new Map<string, { fd: number; ss: number }>();
    for (const row of activityRows) {
      const cur = activityByScholar.get(row.scholar_uid) ?? { fd: 0, ss: 0 };
      if (row.log_source === "front_desk") cur.fd += row.duration_minutes ?? 0;
      if (row.log_source === "study_session") cur.ss += row.duration_minutes ?? 0;
      activityByScholar.set(row.scholar_uid, cur);
    }

    // Form submission sets
    const wahfSubmitted = new Set(wahfRows.map((r) => r.scholar_uid).filter(Boolean));
    const mcfSubmitted = new Set(mcfRows.map((r) => r.mentee_uid).filter(Boolean));
    const wplSubmitted = new Set(wplRows.map((r) => r.scholar_uid).filter(Boolean));
    const hadTutoringSession = new Set(tutorRows.map((r) => r.scholar_uid).filter(Boolean));

    // Current week grade scores per scholar
    const currentGradeByScholar = new Map<string, number | null>();
    for (const row of wahfRows) {
      currentGradeByScholar.set(row.scholar_uid, extractAvgGrade(row.assignment_grades));
    }

    // Prior grade scores per scholar, sorted chronologically for trend computation
    const priorGradesByScholar = new Map<string, number[]>();
    const sortedPriorWahf = [...priorWahfRows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    for (const row of sortedPriorWahf) {
      const score = extractAvgGrade(row.assignment_grades);
      if (score !== null) {
        const arr = priorGradesByScholar.get(row.scholar_uid) ?? [];
        arr.push(score);
        priorGradesByScholar.set(row.scholar_uid, arr);
      }
    }

    // Prior stats per scholar for weeks_flagged calculation
    const priorStatsByScholar = new Map<string, PriorStatRow[]>();
    for (const row of priorStats) {
      const arr = priorStatsByScholar.get(row.scholar_uid) ?? [];
      arr.push(row);
      priorStatsByScholar.set(row.scholar_uid, arr);
    }

    // ── 5. Build upsert rows ─────────────────────────────────────────────────
    const statsUpserts: ScholarStatUpsert[] = scholars.map((scholar) => {
      const activity = activityByScholar.get(scholar.uid) ?? { fd: 0, ss: 0 };

      // Completion as a percentage, capped at 100
      const fdCompletion =
        scholar.fd_required > 0
          ? Math.min(100, (activity.fd / scholar.fd_required) * 100)
          : 100;
      const ssCompletion =
        scholar.ss_required > 0
          ? Math.min(100, (activity.ss / scholar.ss_required) * 100)
          : 100;

      const hasWahf = wahfSubmitted.has(scholar.uid);
      const hasMcf = mcfSubmitted.has(scholar.uid);
      const hasWpl = wplSubmitted.has(scholar.uid);
      const hadTutoring = hadTutoringSession.has(scholar.uid);

      // Grades
      const currentGrade = currentGradeByScholar.get(scholar.uid) ?? null;
      const isLowGrade = currentGrade !== null && currentGrade < LOW_GRADE_THRESHOLD;
      const priorGrades = priorGradesByScholar.get(scholar.uid) ?? [];
      const gradeTrend = computeGradeTrend([...priorGrades, currentGrade]);

      // Flag: true if any condition fails
      // Attendance threshold: 80% completion required to avoid a flag.
      // Adjust this threshold to match your program's policy.
      const isFlagged =
        !hasWahf ||
        !hasMcf ||
        !hasWpl ||
        !hadTutoring ||
        isLowGrade ||
        fdCompletion < 80 ||
        ssCompletion < 80;

      const weeksF = countConsecutiveFlagged(
        priorStatsByScholar.get(scholar.uid) ?? [],
        week_num,
        isFlagged
      );

      return {
        scholar_uid: scholar.uid,
        semester_id,
        week_num,
        fd_minutes: activity.fd,
        ss_minutes: activity.ss,
        fd_completion: Math.round(fdCompletion * 100) / 100,
        ss_completion: Math.round(ssCompletion * 100) / 100,
        wahf_submitted: hasWahf,
        mcf_submitted: hasMcf,
        wpl_submitted: hasWpl,
        missed_tutoring: !hadTutoring,
        is_flagged: isFlagged,
        weeks_flagged: weeksF,
        grade_trend: gradeTrend,
        updated_at: new Date().toISOString(),
      };
    });

    // ── 6. Upsert scholar_weekly_stats ───────────────────────────────────────
    const { error: statsUpsertErr } = await supabase
      .from("scholar_weekly_stats")
      .upsert(statsUpserts, {
        onConflict: "scholar_uid,semester_id,week_num",
        ignoreDuplicates: false,
      });

    assertNoError(statsUpsertErr, "scholar_weekly_stats upsert");

    // ── 7. Upsert traffic_weekly_summary ─────────────────────────────────────
    const trafficSummary = {
      semester_id,
      week_num,
      fd_visits: trafficRows.filter((r) => r.traffic_type === "front_desk").length,
      ss_visits: trafficRows.filter((r) => r.traffic_type === "study_session").length,
      tutoring_visits: trafficRows.filter((r) => r.traffic_type === "tutoring").length,
    };

    const { error: trafficUpsertErr } = await supabase
      .from("traffic_weekly_summary")
      .upsert(trafficSummary, {
        onConflict: "semester_id,week_num",
        ignoreDuplicates: false,
      });

    assertNoError(trafficUpsertErr, "traffic_weekly_summary upsert");

    // ── 8. Done ──────────────────────────────────────────────────────────────
    console.log(
      `[refresh_weekly_stats] semester=${semester_id} week=${week_num} scholars=${statsUpserts.length}`
    );

    return new Response(
      JSON.stringify({ refreshed: statsUpserts.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[refresh_weekly_stats] ERROR:", message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});