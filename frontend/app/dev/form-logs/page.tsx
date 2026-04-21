import Link from "next/link";
import { CampusWeekCard } from "@/components/campus-week-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateToCampusWeek } from "@/lib/format/time";
import { fetchTeamLeaders, fetchAllUsersForMemo } from "@/lib/server/data";
import {
  getMcfFormLogsForWeekWithLate,
  getWhafFormLogsForWeekWithLate,
  getWplFormLogsForWeekWithLate,
  buildTeamLeaderFormStatsForWeek,
} from "@/lib/server/data";
import {
  FormCompletionOverviewCard,
  FormCompletionDonut,
  FORM_COMPLETION_WHAF_COLOR,
} from "@/components/form-completion-overview-card";
import { TeamLeadersTable } from "./team-leaders-table";

export const metadata = {
  title: "Form Logs Test | Dev Tools",
  description: "Test form log deadline and late-processing logic (WHAF, MCF, WPL)",
};

type PageProps = { searchParams: Promise<{ week?: string }> };

function parseWeekParam(
  weekParam: string | undefined,
  currentCampusWeek: number | null
): number {
  if (weekParam != null && weekParam !== "") {
    const parsed = parseInt(weekParam, 10);
    return Math.max(1, Math.min(30, Number.isNaN(parsed) ? 1 : parsed));
  }
  return currentCampusWeek != null
    ? Math.max(1, Math.min(30, currentCampusWeek))
    : 1;
}

export default async function FormLogsTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum = parseWeekParam(params.week, currentCampusWeek);

  const [teamLeadersRaw, mcfRowsWithLate, whafRows, wplRowsWithLate, allUsers] =
    await Promise.all([
      fetchTeamLeaders(),
      getMcfFormLogsForWeekWithLate(weekNum),
      getWhafFormLogsForWeekWithLate(weekNum),
      getWplFormLogsForWeekWithLate(weekNum),
      fetchAllUsersForMemo(),
    ]);

  const whafSubmitterUids = new Set(
    whafRows.map((r) => r.scholar_uid).filter((uid): uid is string => Boolean(uid))
  );
  const totalEveryone = allUsers.length;
  const everyoneWithWhaf = allUsers.filter((u) => whafSubmitterUids.has(u.uid)).length;
  const everyoneWhafPct =
    totalEveryone > 0 ? Math.round((everyoneWithWhaf / totalEveryone) * 100) : 0;

  const teamLeaderRows = await buildTeamLeaderFormStatsForWeek(
    teamLeadersRaw,
    mcfRowsWithLate,
    whafRows,
    wplRowsWithLate,
    weekNum
  );

  // Overall completion stats across all team leaders (including late counts for pie charts).
  // Cap each TL's completed at required so double submissions don't inflate totals (e.g. 45/44).
  const overall = teamLeaderRows.reduce(
    (acc, row) => ({
      whaf_completed: acc.whaf_completed + Math.min(row.whaf_completed, row.whaf_required),
      whaf_required: acc.whaf_required + row.whaf_required,
      whaf_late_count: acc.whaf_late_count + (row.whaf_late ? 1 : 0),
      mcf_completed: acc.mcf_completed + Math.min(row.mcf_completed, row.mcf_required),
      mcf_required: acc.mcf_required + row.mcf_required,
      mcf_late_count: acc.mcf_late_count + (row.mcf_late ? 1 : 0),
      wpl_completed: acc.wpl_completed + Math.min(row.wpl_completed, row.wpl_required),
      wpl_required: acc.wpl_required + row.wpl_required,
      wpl_late_count: acc.wpl_late_count + (row.wpl_late ? 1 : 0),
    }),
    {
      whaf_completed: 0,
      whaf_required: 0,
      whaf_late_count: 0,
      mcf_completed: 0,
      mcf_required: 0,
      mcf_late_count: 0,
      wpl_completed: 0,
      wpl_required: 0,
      wpl_late_count: 0,
    }
  );
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
          Deadline and late-check logic from{" "}
          <code className="rounded bg-muted px-1">lib/form-logs</code>. WHAF:
          late after Thursday 23:59 EST. MCF & WPL: late after Friday 17:00 EST.
        </p>
      </div>

      <CampusWeekCard
        basePath="/dev/form-logs"
        selectedWeek={weekNum}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>WHAF completion (everyone)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8">
            <FormCompletionDonut
              label="WHAF"
              percentComplete={totalEveryone > 0 ? everyoneWhafPct : null}
              total={totalEveryone}
              completeCount={everyoneWithWhaf}
              lateCount={0}
              strokeColor={FORM_COMPLETION_WHAF_COLOR}
            />
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <FormCompletionOverviewCard overall={overall} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team leaders</CardTitle>
          <CardDescription>
            All users with a non-scholar program role. WHAF required = 1 per TL.
            MCF required = mentee count. WHAF late = Thu 23:59 ET, MCF late = Fri
            17:00 ET (week {weekNum}).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <TeamLeadersTable rows={teamLeaderRows} />
        </CardContent>
      </Card>
    </div>
  );
}
