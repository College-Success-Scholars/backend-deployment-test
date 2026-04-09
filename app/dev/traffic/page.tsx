import Link from "next/link";
import {
  getTrafficSessionsForWeek,
  getTrafficEntryCountForWeek,
  getTrafficEntryCountsForWeeks,
} from "@/lib/server/traffic";
import { dateToCampusWeek } from "@/lib/time";
import { TrafficHeatMapSection } from "./traffic-heat-map-section";
import { TrafficWeeklyLineChartBySemester } from "./traffic-weekly-line-chart";
import { CampusWeekCard } from "@/components/campus-week-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Traffic | Dev Tools",
  description: "Traffic log summary and heat map by campus week (entries; unpaired entries assumed 1 hour).",
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

  const weekPickerMax = Math.max(
    25,
    currentCampusWeek ?? 1,
    weekNum
  );
  const weekNumbers = Array.from({ length: weekPickerMax }, (_, i) => i + 1);
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
          Unpaired entries assumed 1 hour unless a later exit is recorded.
        </p>
      </div>

      <CampusWeekCard
        basePath="/dev/traffic"
        additionalSearchParams={{ increment: String(slotMinutes) }}
        selectedWeek={weekNum}
      />

      <TrafficWeeklyLineChartBySemester
        data={weeklyData}
        currentCampusWeek={currentCampusWeek}
      />

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
