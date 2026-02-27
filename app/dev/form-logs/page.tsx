import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateToCampusWeek } from "@/lib/time";
import { fetchTeamLeaders } from "@/lib/server/users";
import {
  getMcfFormLogsForWeekWithLate,
  getWhafFormLogsForWeekWithLate,
  getWplFormLogsForWeekWithLate,
} from "@/lib/server/form-logs";
import { FormLogsTestClient } from "./form-logs-test-client";
import { TeamLeadersTable, type TeamLeaderTableRow } from "./team-leaders-table";

export const metadata = {
  title: "Form Logs Test | Dev Tools",
  description: "Test form log deadline and late-processing logic (WHAF, MCF, WPL)",
};

function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[,.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** If name looks like "Last, First", return also "First Last" for matching. */
function nameVariants(s: string): string[] {
  const n = normalizeName(s);
  const out = [n];
  const parts = n.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2) {
    const reversed = [parts[1], parts[0]].join(" ");
    if (reversed !== n) out.push(reversed);
  }
  return out;
}

/** Tokenize normalized name for fuzzy comparison. */
function nameTokens(s: string): Set<string> {
  return new Set(normalizeName(s).split(" ").filter(Boolean));
}

/**
 * Find team leader uid by fuzzy match on full name.
 * Prefer exact normalized match; otherwise pick TL whose name has best token overlap with the given name.
 * Used as backup when scholar_uid is not yet available on WHAF rows.
 */
function findTeamLeaderUidByFuzzyName(
  name: string,
  teamLeaders: { uid: string; first_name: string | null; last_name: string | null }[]
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const inputTokens = nameTokens(trimmed);
  let bestUid: string | null = null;
  let bestScore = 0;
  for (const u of teamLeaders) {
    const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    if (!full) continue;
    const fullNorm = normalizeName(full);
    for (const variant of nameVariants(trimmed)) {
      if (fullNorm === variant) return u.uid;
    }
    const tlTokens = nameTokens(full);
    const intersection = [...inputTokens].filter((t) => tlTokens.has(t)).length;
    const union = new Set([...inputTokens, ...tlTokens]).size;
    const score = union > 0 ? intersection / union : 0;
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestUid = u.uid;
    }
  }
  return bestUid;
}

export default async function FormLogsTestPage() {
  const teamLeadersRaw = await fetchTeamLeaders();
  const currentWeek = dateToCampusWeek(new Date()) ?? 1;

  // All form fetches: current week only.
  const [mcfRowsWithLate, whafRows, wplRowsWithLate] = await Promise.all([
    getMcfFormLogsForWeekWithLate(currentWeek),
    getWhafFormLogsForWeekWithLate(currentWeek),
    getWplFormLogsForWeekWithLate(currentWeek),
  ]);

  // TL name → uid (exact variants) for matching form rows to TLs.
  const tlNameToUid = new Map<string, string>();
  for (const u of teamLeadersRaw) {
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    if (name) {
      for (const variant of nameVariants(name)) {
        tlNameToUid.set(variant, u.uid);
      }
    }
  }

  // MCF this week: match by TL uid (mentor_uid on row).
  const mcfByUid = new Map<string, { count: number; hasLate: boolean }>();
  for (const row of mcfRowsWithLate) {
    const mentorUid = row.mentor_uid ?? null;
    if (mentorUid) {
      const cur = mcfByUid.get(mentorUid) ?? { count: 0, hasLate: false };
      mcfByUid.set(mentorUid, {
        count: cur.count + 1,
        hasLate: cur.hasLate || row.isLate,
      });
    }
  }

  // scholar_uid → TL from this week's MCF only (mentee_uid → mentor_uid).
  const scholarToTlFromWeek = new Map<string, string>();
  for (const row of mcfRowsWithLate) {
    const menteeUid = row.mentee_uid ?? null;
    const mentorUid = row.mentor_uid ?? null;
    if (menteeUid && mentorUid) {
      scholarToTlFromWeek.set(menteeUid, mentorUid);
    }
  }

  // WHAF this week: match by uid (when scholar_uid → TL exists) or fuzzy name (team_leader_contact / scholar_name).
  const whafByUid = new Map<string, { count: number; hasLate: boolean }>();
  for (const u of teamLeadersRaw) {
    whafByUid.set(u.uid, { count: 0, hasLate: false });
  }
  for (const row of whafRows) {
    let uid: string | null = null;
    if (row.scholar_uid) {
      uid = scholarToTlFromWeek.get(row.scholar_uid) ?? null;
    }
    if (!uid) {
      const contact = (row.team_leader_contact ?? "").trim();
      const scholarName = (row.scholar_name ?? "").trim();
      for (const nameToTry of [contact, scholarName]) {
        if (!nameToTry) continue;
        for (const variant of nameVariants(nameToTry)) {
          uid = tlNameToUid.get(variant);
          if (uid) break;
        }
        if (!uid) uid = findTeamLeaderUidByFuzzyName(nameToTry, teamLeadersRaw);
        if (uid) break;
      }
    }
    if (!uid) continue;
    const cur = whafByUid.get(uid)!;
    whafByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
    });
  }

  // WPL this week: match by scholar_uid → TL (from this week's MCF) or fuzzy name (full_name).
  const wplByUid = new Map<string, { count: number; hasLate: boolean }>();
  for (const u of teamLeadersRaw) {
    wplByUid.set(u.uid, { count: 0, hasLate: false });
  }
  for (const row of wplRowsWithLate) {
    let uid: string | null = null;
    if (row.scholar_uid) {
      uid = scholarToTlFromWeek.get(row.scholar_uid) ?? null;
    }
    if (!uid && row.full_name) {
      const nameToTry = row.full_name.trim();
      for (const variant of nameVariants(nameToTry)) {
        uid = tlNameToUid.get(variant);
        if (uid) break;
      }
      if (!uid) uid = findTeamLeaderUidByFuzzyName(nameToTry, teamLeadersRaw);
    }
    if (!uid) continue;
    const cur = wplByUid.get(uid)!;
    wplByUid.set(uid, {
      count: cur.count + 1,
      hasLate: cur.hasLate || row.isLate,
    });
  }

  const teamLeaderRows: TeamLeaderTableRow[] = teamLeadersRaw.map((u) => {
    const menteeCount = u.mentee_count ?? 0;
    const mcf = mcfByUid.get(u.uid) ?? { count: 0, hasLate: false };
    const whaf = whafByUid.get(u.uid) ?? { count: 0, hasLate: false };
    const wpl = wplByUid.get(u.uid) ?? { count: 0, hasLate: false };
    const mcf_required = menteeCount;
    const mcf_completed = mcf.count;
    const mcf_pct =
      mcf_required > 0
        ? Math.round((mcf_completed / mcf_required) * 100)
        : 100;
    // WHAF: every team leader must submit one, regardless of mentee count.
    const whaf_required = 1;
    const whaf_completed = whaf.count;
    const whaf_pct =
      whaf_completed >= whaf_required
        ? 100
        : Math.round((whaf_completed / whaf_required) * 100);
    // WPL: everyone (each team leader) submits one, same as WHAF.
    const wpl_required = 1;
    const wpl_completed = wpl.count;
    const wpl_pct =
      wpl_completed >= wpl_required
        ? 100
        : Math.round((wpl_completed / wpl_required) * 100);
    return {
      uid: u.uid,
      name: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.uid,
      program_role: u.program_role,
      mcf_completed,
      mcf_required,
      mcf_late: mcf.hasLate,
      mcf_pct,
      whaf_completed,
      whaf_required,
      whaf_late: whaf.hasLate,
      whaf_pct,
      wpl_completed,
      wpl_required,
      wpl_late: wpl.hasLate,
      wpl_pct,
    };
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dev"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Dev Tools
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Form Logs Test</h1>
        <p className="text-muted-foreground mt-1">
          Deadline and late-check logic from <code className="rounded bg-muted px-1">lib/form-logs</code>.
          WHAF: late after Thursday 23:59 EST. MCF & WPL: late after Friday 17:00 EST.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deadline rules (Eastern)</CardTitle>
          <CardDescription>
            Campus week is Monday–Sunday from lib/time. Deadlines are in America/New_York.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>WHAF:</strong> late if submitted after{" "}
            <span className="text-muted-foreground">Thursday 23:59:59.999 EST</span> of that campus week.
          </p>
          <p>
            <strong>MCF & WPL:</strong> late if submitted after{" "}
            <span className="text-muted-foreground">Friday 17:00:00 EST</span> of that campus week.
          </p>
          <p className="pt-2 text-muted-foreground">
            Processing: <code className="rounded bg-muted px-1">markWhafFormLogsLate</code>,{" "}
            <code className="rounded bg-muted px-1">markMcfFormLogsLate</code>,{" "}
            <code className="rounded bg-muted px-1">markWplFormLogsLate</code> attach{" "}
            <code className="rounded bg-muted px-1">isLate</code> to rows. Fetch rows via{" "}
            <code className="rounded bg-muted px-1">lib/server/form-logs</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team leaders</CardTitle>
          <CardDescription>
            All users with a non-scholar program role. WHAF required = 1 per TL (every team leader must submit). MCF required = mentee count. WHAF late = Thu 23:59 ET, MCF late = Fri 17:00 ET (week {currentWeek}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamLeadersTable rows={teamLeaderRows} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Try it</h2>
        <FormLogsTestClient />
      </div>
    </div>
  );
}
