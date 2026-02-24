import Link from "next/link";
import {
  getTrafficSessionsForWeek,
  getTrafficEntryCountForWeek,
  getTrafficEntryCountsForWeeks,
} from "@/lib/server/traffic";
import { dateToCampusWeek, campusWeekToDateRange } from "@/lib/time";
import { TrafficHeatMapSection } from "./traffic-heat-map-section";
import { TrafficWeeklyLineChartBySemester } from "./traffic-weekly-line-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Traffic | Dev Tools",
  description: "Traffic log summary and heat map by campus week (entries; unpaired entries assumed until midnight ET).",
};

/** Slot size options for the heat map (minutes). Defined here so the server component does not depend on client-component exports. */
const SLOT_MINUTES_OPTIONS = [15, 30, 60] as const;

type PageProps = {
  searchParams: Promise<{ week?: string; increment?: string }>;
};

function parseSlotMinutes(incrementParam: string | undefined): number {
  const n = incrementParam != null ? parseInt(incrementParam, 10) : NaN;
  return (SLOT_MINUTES_OPTIONS as readonly number[]).includes(n) ? n : 15;
}

export default async function DevTrafficPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekParam = params.week;
  const incrementParam = params.increment;
  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum =
    weekParam != null && weekParam !== ""
      ? Math.max(1, Math.min(30, parseInt(weekParam, 10) || 1))
      : currentCampusWeek != null
        ? Math.max(1, Math.min(30, currentCampusWeek))
        : 1;
  const slotMinutes = parseSlotMinutes(incrementParam);

  const range = campusWeekToDateRange(weekNum);

  function linkUrl(opts: { week?: number; increment?: number }): string {
    const w = opts.week ?? weekNum;
    const inc = opts.increment ?? slotMinutes;
    const sp = new URLSearchParams();
    sp.set("week", String(w));
    sp.set("increment", String(inc));
    return `/dev/traffic?${sp.toString()}`;
  }

  const weekNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const [entryCount, sessions, weeklyData] = await Promise.all([
    getTrafficEntryCountForWeek(weekNum),
    getTrafficSessionsForWeek(weekNum),
    getTrafficEntryCountsForWeeks(weekNumbers),
  ]);

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dev"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Dev Tools
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Traffic</h1>
        <p className="text-muted-foreground mt-1">
          Entry/exit from <code className="rounded bg-muted px-1">public.traffic</code>.
          Unpaired entries assumed until midnight Eastern (rest of day).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Week selector</CardTitle>
          <CardDescription>
            Campus week from <code className="rounded bg-muted px-1">lib/time</code> (academic calendar).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current campus week:</span>
            <Badge variant="secondary">
              {currentCampusWeek ?? "—"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">
              View traffic for a specific week:
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                <Link
                  key={w}
                  href={linkUrl({ week: w })}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${weekNum === w
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

      <TrafficWeeklyLineChartBySemester data={weeklyData} />

      <Card>
        <CardHeader>
          <CardTitle>Entry tickets this week</CardTitle>
          <CardDescription>
            Total number of entry records in the selected campus week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">{entryCount}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Sessions (with assumed exits for unpaired entries): {sessions.length}
          </p>
        </CardContent>
      </Card>

      <TrafficHeatMapSection
        sessions={sessions}
        initialSlotMinutes={slotMinutes}
      />
    </div>
  );
}
