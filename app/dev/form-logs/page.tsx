import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateToCampusWeek, campusWeekToDateRange } from "@/lib/time";
import { fetchTeamLeaders } from "@/lib/server/users";
import {
  getMcfFormLogsForWeekWithLate,
  getWhafFormLogsForWeekWithLate,
  getWplFormLogsForWeekWithLate,
  buildTeamLeaderFormStatsForWeek,
} from "@/lib/server/form-logs";
import { Badge } from "@/components/ui/badge";
import { FormLogsTestClient } from "./form-logs-test-client";
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

function formLogsWeekLink(week: number): string {
  return `/dev/form-logs?week=${week}`;
}

export default async function FormLogsTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum = parseWeekParam(params.week, currentCampusWeek);
  const range = campusWeekToDateRange(weekNum);

  const [teamLeadersRaw, mcfRowsWithLate, whafRows, wplRowsWithLate] =
    await Promise.all([
      fetchTeamLeaders(),
      getMcfFormLogsForWeekWithLate(weekNum),
      getWhafFormLogsForWeekWithLate(weekNum),
      getWplFormLogsForWeekWithLate(weekNum),
    ]);

  const teamLeaderRows = buildTeamLeaderFormStatsForWeek(
    teamLeadersRaw,
    mcfRowsWithLate,
    whafRows,
    wplRowsWithLate
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

      <Card>
        <CardHeader>
          <CardTitle>Week selector</CardTitle>
          <CardDescription>
            Campus week from{" "}
            <code className="rounded bg-muted px-1">lib/time</code> (academic
            calendar). Deadlines: WHAF Thu 23:59 ET, MCF & WPL Fri 17:00 ET.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current campus week:</span>
            <Badge variant="secondary">{currentCampusWeek ?? "—"}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">
              View form logs for a specific week:
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                <Link
                  key={w}
                  href={formLogsWeekLink(w)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                    weekNum === w
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {w}
                </Link>
              ))}
            </div>
          </div>
          {range && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <span className="font-medium">Week {range.weekNumber}:</span>{" "}
              <span className="text-muted-foreground">
                {range.startDate.toLocaleDateString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                –{" "}
                {range.endDate.toLocaleDateString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                (ET)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team leaders</CardTitle>
          <CardDescription>
            All users with a non-scholar program role. WHAF required = 1 per TL.
            MCF required = mentee count. WHAF late = Thu 23:59 ET, MCF late = Fri
            17:00 ET (week {weekNum}).
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
