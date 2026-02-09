import Link from "next/link";
import {
  getStudySessionCleanedAndErrored,
  getStudySessionScholarsInRoom,
  getStudySessionCompletedSessions,
  getFrontDeskCleanedAndErrored,
  getFrontDeskScholarsInRoom,
  getFrontDeskCompletedSessions,
  SESSION_TYPE_STUDY,
  SESSION_TYPE_FRONT_DESK,
} from "@/lib/session-logs";
import type {
  ScholarInRoom,
  ScholarWithCompletedSession,
  CleanedAndErroredResult,
} from "@/lib/session-logs";
import { dateToCampusWeek, campusWeekToDateRange } from "@/lib/time";
import { SessionHeatMap } from "./session-heat-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const metadata = {
  title: "Session Logs Test | Dev Tools",
  description: "Test session log utilities against study_session_logs",
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "short",
    timeStyle: "short",
  });
}

type PageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function SessionLogsTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekParam = params.week;
  const weekNum =
    weekParam != null && weekParam !== ""
      ? Math.max(1, Math.min(30, parseInt(weekParam, 10) || 1))
      : null;

  const range =
    weekNum != null ? campusWeekToDateRange(weekNum) : null;

  // For DB queries: include full last day (end of Sunday)
  const startDate = range?.startDate ?? undefined;
  const endDate = range
    ? new Date(range.endDate.getTime() + ONE_DAY_MS - 1)
    : undefined;

  const dateRangeOpts = { startDate, endDate };

  const [
    cleanedStudy,
    cleanedFd,
    inRoomStudy,
    inRoomFd,
    completedStudy,
    completedFd,
  ] = await Promise.all([
    getStudySessionCleanedAndErrored(dateRangeOpts),
    getFrontDeskCleanedAndErrored(dateRangeOpts),
    getStudySessionScholarsInRoom(dateRangeOpts),
    getFrontDeskScholarsInRoom(dateRangeOpts),
    getStudySessionCompletedSessions(dateRangeOpts),
    getFrontDeskCompletedSessions(dateRangeOpts),
  ]);

  const currentCampusWeek = dateToCampusWeek(new Date());

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
        <h1 className="text-2xl font-bold">Session Logs Test</h1>
        <p className="text-muted-foreground mt-1">
          Study session: study_session_logs. Front desk: front_desk_logs table.
        </p>
      </div>

      {/* Time utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Time utilities</CardTitle>
          <CardDescription>
            Filter sessions by campus week. Uses academic calendar from lib/time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Current campus week:
            </span>
            <Badge variant="secondary">
              {currentCampusWeek ?? "—"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">
              View sessions for a specific week:
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                <Link
                  key={w}
                  href={`/dev/session-logs?week=${w}`}
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
                -{" "}
                {range.endDate.toLocaleDateString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                (ET)
              </span>
              <Link
                href="/dev/session-logs"
                className="ml-3 text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear filter
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Heat Map */}
      <SessionHeatMap completedStudy={completedStudy} completedFd={completedFd} />

      {/* Scholars Currently in Room */}
      <Card>
        <CardHeader>
          <CardTitle>Scholars Currently in Room</CardTitle>
          <CardDescription>
            Valid entry tickets without exit tickets, with time spent so far
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SessionTypeSection
            title={SESSION_TYPE_STUDY}
            data={inRoomStudy}
            formatDuration={formatDuration}
            formatDate={formatDate}
          />
          <SessionTypeSection
            title={SESSION_TYPE_FRONT_DESK}
            data={inRoomFd}
            formatDuration={formatDuration}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>

      {/* Completed Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Entry-Exit Sessions</CardTitle>
          <CardDescription>
            Scholars with valid entry-exit pairs and session duration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SessionTypeSection
            title={SESSION_TYPE_STUDY}
            data={completedStudy}
            formatDuration={formatDuration}
            formatDate={formatDate}
            showCompleted
          />
          <SessionTypeSection
            title={SESSION_TYPE_FRONT_DESK}
            data={completedFd}
            formatDuration={formatDuration}
            formatDate={formatDate}
            showCompleted
          />
        </CardContent>
      </Card>

      {/* Cleaned & Errored Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Cleaned & Errored Tickets</CardTitle>
          <CardDescription>
            Categorized by scholar UID. Errored: double exit/enter, exit before
            enter, entry without exit, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CleanedErroredSection
            result={cleanedStudy}
            title={SESSION_TYPE_STUDY}
            formatDate={formatDate}
          />
          <CleanedErroredSection
            result={cleanedFd}
            title={SESSION_TYPE_FRONT_DESK}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SessionTypeSection({
  title,
  data,
  formatDuration,
  formatDate,
  showCompleted,
}: {
  title: string;
  data: ScholarInRoom[] | ScholarWithCompletedSession[];
  formatDuration: (ms: number) => string;
  formatDate: (iso: string) => string;
  showCompleted?: boolean;
}) {
  return (
    <div>
      <h3 className="font-medium text-sm text-muted-foreground mb-2">
        {title} ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm">No records</p>
      ) : (
        <ul className="space-y-2 rounded-md border p-3 text-sm">
          {data.map((item, i) => {
            const durationMs = showCompleted
              ? "durationMs" in item
                ? item.durationMs
                : 0
              : "timeInRoomMs" in item
                ? item.timeInRoomMs
                : 0;
            return (
              <li
                key={`${item.scholarUid}-${i}`}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="font-medium">
                  {item.scholarName ?? item.scholarUid}
                </span>
                <span className="text-muted-foreground">({item.scholarUid})</span>
                <span className="text-muted-foreground">•</span>
                <span>Entered: {formatDate(item.entryAt)}</span>
                <span className="text-muted-foreground">•</span>
                <span>Duration: {formatDuration(durationMs)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CleanedErroredSection({
  result,
  title,
  formatDate,
}: {
  result: CleanedAndErroredResult;
  title: string;
  formatDate: (iso: string) => string;
}) {
  const scholars = Array.from(result.byScholarUid.entries());

  return (
    <div>
      <h3 className="font-medium text-sm text-muted-foreground mb-2">
        {title} — {result.allCleaned.length} cleaned, {result.allErrored.length}{" "}
        errored
      </h3>
      {scholars.length === 0 ? (
        <p className="text-muted-foreground text-sm">No records</p>
      ) : (
        <ul className="space-y-3">
          {scholars.map(([uid, { cleaned, errored, scholarName }]) => (
            <li
              key={uid}
              className={`rounded-md border p-3 text-sm ${errored.length > 0 ? "border-destructive/50" : ""
                }`}
            >
              <div className="font-medium">
                {scholarName ?? uid}
                <span className="text-muted-foreground font-normal ml-1">
                  ({uid})
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {cleaned.map((p) => (
                  <div key={p.ticket.id} className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0">
                      {p.ticket.action_type ?? "?"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {formatDate(p.ticket.created_at)}
                    </span>
                    {p.pairedEntryAt && (
                      <span className="text-muted-foreground text-xs">
                        (paired w/ entry {formatDate(p.pairedEntryAt)})
                      </span>
                    )}
                  </div>
                ))}
                {errored.map((p) => (
                  <div key={p.ticket.id} className="flex items-center gap-2">
                    <Badge variant="destructive" className="shrink-0">
                      {p.ticket.action_type ?? "?"} — {p.error}
                    </Badge>
                    <span className="text-muted-foreground">
                      {formatDate(p.ticket.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
