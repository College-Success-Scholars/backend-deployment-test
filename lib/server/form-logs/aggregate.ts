import "server-only";
import type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";
import type { FormLogRowWithLate } from "@/lib/form-logs";

/** One row for the dev form-logs team leaders table (MCF/WHAF/WPL stats per TL). */
export type TeamLeaderFormStatsRow = {
  uid: string;
  name: string;
  program_role: string | null;
  mcf_completed: number;
  mcf_required: number;
  mcf_late: boolean;
  mcf_pct: number;
  mcf_latest_at: string;
  whaf_completed: number;
  whaf_required: number;
  whaf_late: boolean;
  whaf_pct: number;
  whaf_latest_at: string;
  wpl_completed: number;
  wpl_required: number;
  wpl_late: boolean;
  wpl_pct: number;
  wpl_latest_at: string;
};

const NO_SUBMISSION_SENTINEL = "9999-12-31T23:59:59.999Z";

type McfWithLate = FormLogRowWithLate<McfFormLogRow>;
type WhafWithLate = FormLogRowWithLate<WhafFormLogRow>;
type WplWithLate = FormLogRowWithLate<WplFormLogRow>;

type TeamLeaderInput = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  program_role: string | null;
  mentee_count: number | null;
};

/**
 * Build per–team leader form stats for the given week from MCF, WHAF, and WPL
 * rows (with isLate already set). Used by the dev form-logs page.
 */
export function buildTeamLeaderFormStatsForWeek(
  teamLeaders: TeamLeaderInput[],
  mcfRowsWithLate: McfWithLate[],
  whafRowsWithLate: WhafWithLate[],
  wplRowsWithLate: WplWithLate[]
): TeamLeaderFormStatsRow[] {
  const tlUids = new Set(teamLeaders.map((u) => u.uid));

  // MCF this week: match by TL uid (mentor_uid on row).
  const mcfByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const row of mcfRowsWithLate) {
    const mentorUid = row.mentor_uid ?? null;
    if (mentorUid) {
      const cur = mcfByUid.get(mentorUid) ?? { count: 0, hasLate: false, latestAt: "" };
      const created = row.created_at ?? "";
      mcfByUid.set(mentorUid, {
        count: cur.count + 1,
        hasLate: cur.hasLate || row.isLate,
        latestAt: created > cur.latestAt ? created : cur.latestAt,
      });
    }
  }

  // WHAF this week: scholar_uid is the TL (same person as mentor_uid in MCF).
  const whafByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const u of teamLeaders) {
    whafByUid.set(u.uid, { count: 0, hasLate: false, latestAt: "" });
  }
  for (const row of whafRowsWithLate) {
    const uid =
      row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
    if (!uid) continue;
    const cur = whafByUid.get(uid)!;
    const created = row.created_at ?? "";
    whafByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
      latestAt: created > cur.latestAt ? created : cur.latestAt,
    });
  }

  // WPL this week: scholar_uid is the TL (same person as mentor_uid in MCF).
  const wplByUid = new Map<string, { count: number; hasLate: boolean; latestAt: string }>();
  for (const u of teamLeaders) {
    wplByUid.set(u.uid, { count: 0, hasLate: false, latestAt: "" });
  }
  for (const row of wplRowsWithLate) {
    const uid =
      row.scholar_uid && tlUids.has(row.scholar_uid) ? row.scholar_uid : null;
    if (!uid) continue;
    const cur = wplByUid.get(uid)!;
    const created = row.created_at ?? "";
    wplByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
      latestAt: created > cur.latestAt ? created : cur.latestAt,
    });
  }

  return teamLeaders.map((u) => {
    const menteeCount = u.mentee_count ?? 0;
    const mcf = mcfByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const whaf = whafByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const wpl = wplByUid.get(u.uid) ?? { count: 0, hasLate: false, latestAt: "" };
    const mcf_required = menteeCount;
    const mcf_completed = mcf.count;
    const mcf_pct =
      mcf_required > 0 ? Math.round((mcf_completed / mcf_required) * 100) : 100;
    const whaf_required = 1;
    const whaf_completed = whaf.count;
    const whaf_pct =
      whaf_completed >= whaf_required
        ? 100
        : Math.round((whaf_completed / whaf_required) * 100);
    const wpl_required = 1;
    const wpl_completed = wpl.count;
    const wpl_pct =
      wpl_completed >= wpl_required
        ? 100
        : Math.round((wpl_completed / wpl_required) * 100);
    return {
      uid: u.uid,
      name:
        [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
      program_role: u.program_role,
      mcf_completed,
      mcf_required,
      mcf_late: mcf.hasLate,
      mcf_pct,
      mcf_latest_at:
        mcf.latestAt || (mcf_required > 0 ? NO_SUBMISSION_SENTINEL : ""),
      whaf_completed,
      whaf_required,
      whaf_late: whaf.hasLate,
      whaf_pct,
      whaf_latest_at: whaf.latestAt || NO_SUBMISSION_SENTINEL,
      wpl_completed,
      wpl_required,
      wpl_late: wpl.hasLate,
      wpl_pct,
      wpl_latest_at: wpl.latestAt || NO_SUBMISSION_SENTINEL,
    };
  });
}
