import Link from "next/link";
import {
  getStudySessionCleanedAndErrored,
  getStudySessionScholarsInRoom,
  getStudySessionCompletedSessions,
  getFrontDeskCleanedAndErrored,
  getFrontDeskScholarsInRoom,
  getFrontDeskCompletedSessions,
} from "@/lib/server/session-logs";
import { SESSION_TYPE_STUDY, SESSION_TYPE_FRONT_DESK } from "@/lib/session-logs";
import type {
  ScholarInRoom,
  ScholarWithCompletedSession,
  CleanedAndErroredResult,
} from "@/lib/session-logs";
import {
  dateToCampusWeek,
  campusWeekToDateRange,
  formatDate,
  formatDuration,
  formatEntryDate,
  getDurationMs,
} from "@/lib/time";
import { getWeekFetchEnd } from "@/lib/session-records";
import { SessionHeatMap } from "./session-heat-map";
import { DoubleEntryChecker } from "@/components/double-entry-checker";
import {
  ScholarDataTable,
  CollapsibleTableSection,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Session Logs Test | Dev Tools",
  description: "Test session log utilities against study_session_logs",
};

type PageProps = {
  searchParams: Promise<{ week?: string; uids?: string }>;
};

export default async function SessionLogsTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const weekParam = params.week;
  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum =
    weekParam != null && weekParam !== ""
      ? Math.max(1, Math.min(30, parseInt(weekParam, 10) || 1))
      : currentCampusWeek != null
        ? Math.max(1, Math.min(30, currentCampusWeek))
        : null;

  const range =
    weekNum != null ? campusWeekToDateRange(weekNum) : null;

  // For DB queries: include full last day (end of Sunday)
  const startDate = range?.startDate ?? undefined;
  const endDate = range ? getWeekFetchEnd(range) : undefined;

  const scholarUids =
    params.uids != null && params.uids !== ""
      ? params.uids
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      : undefined;

  const hasLimit =
    startDate != null || endDate != null || (scholarUids != null && scholarUids.length > 0);

  const dateRangeOpts = { startDate, endDate, scholarUids };

  const [
    cleanedStudy,
    cleanedFd,
    inRoomStudy,
    inRoomFd,
    completedStudy,
    completedFd,
  ] = hasLimit
      ? await Promise.all([
        getStudySessionCleanedAndErrored(dateRangeOpts),
        getFrontDeskCleanedAndErrored(dateRangeOpts),
        getStudySessionScholarsInRoom(dateRangeOpts),
        getFrontDeskScholarsInRoom(dateRangeOpts),
        getStudySessionCompletedSessions(dateRangeOpts),
        getFrontDeskCompletedSessions(dateRangeOpts),
      ])
      : [
        { allCleaned: [], allErrored: [], byScholarUid: new Map() },
        { allCleaned: [], allErrored: [], byScholarUid: new Map() },
        [],
        [],
        [],
        [],
      ];

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

      {!hasLimit && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="pt-6">
            <p className="text-sm">
              Select a <strong>week</strong> or enter <strong>UIDs</strong> (e.g.{" "}
              <code className="rounded bg-muted px-1">?uids=1,2,3</code>) to limit the search and load data.
            </p>
          </CardContent>
        </Card>
      )}

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
                -{" "}
                {range.endDate.toLocaleDateString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                (ET)
              </span>
              <Link
                href={
                  scholarUids
                    ? `/dev/session-logs?uids=${scholarUids.join(",")}`
                    : "/dev/session-logs"
                }
                className="ml-3 text-sm text-muted-foreground hover:text-foreground underline"
              >
                {scholarUids ? "Clear week" : "Clear filter"}
              </Link>
            </div>
          )}
          {scholarUids && scholarUids.length > 0 && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <span className="font-medium">UIDs:</span>{" "}
              <span className="text-muted-foreground font-mono text-xs">
                {scholarUids.join(", ")}
              </span>
              <Link
                href={weekNum != null ? `/dev/session-logs?week=${weekNum}` : "/dev/session-logs"}
                className="ml-3 text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear UIDs
              </Link>
            </div>
          )}
          <p className="text-muted-foreground text-xs mt-2">
            Optional: filter by scholar UIDs with{" "}
            <code className="rounded bg-muted px-1">?uids=1,2,3</code> (comma-separated). Combine with{" "}
            <code className="rounded bg-muted px-1">week</code> for date range + UID filter.
          </p>
        </CardContent>
      </Card>

      {/* Session Heat Map */}
      <SessionHeatMap completedStudy={completedStudy} completedFd={completedFd} />

      {/* Double entries: signed into both front desk and study at same time */}
      {hasLimit && (
        <DoubleEntryChecker
          completedStudy={completedStudy}
          completedFrontDesk={completedFd}
          defaultToleranceMinutes={5}
        />
      )}

      {/* Scholars Currently in Room */}
      <Card>
        <CardHeader>
          <CardTitle>Scholars Currently in Room</CardTitle>
          <CardDescription>
            Valid entry tickets without exit tickets, with time spent so far
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScholarsInRoomTableSection
            title={SESSION_TYPE_STUDY}
            data={inRoomStudy}
            formatDuration={formatDuration}
            formatEntryDate={formatEntryDate}
          />
          <ScholarsInRoomTableSection
            title={SESSION_TYPE_FRONT_DESK}
            data={inRoomFd}
            formatDuration={formatDuration}
            formatEntryDate={formatEntryDate}
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
          <CompletedSessionsTableSection
            title={SESSION_TYPE_STUDY}
            data={completedStudy}
            formatDuration={formatDuration}
            formatEntryDate={(iso) => formatEntryDate(iso, true)}
          />
          <CompletedSessionsTableSection
            title={SESSION_TYPE_FRONT_DESK}
            data={completedFd}
            formatDuration={formatDuration}
            formatEntryDate={(iso) => formatEntryDate(iso, true)}
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

function ScholarsInRoomTableSection({
  title,
  data,
  formatDuration,
  formatEntryDate,
}: {
  title: string;
  data: ScholarInRoom[];
  formatDuration: (ms: number) => string;
  formatEntryDate: (iso: string) => string;
}) {
  type Row = ScholarInRoom & {
    enteredDisplay: string;
    durationDisplay: string;
    nameSort: string;
  };
  const tableData: Row[] = data.map((row) => ({
    ...row,
    enteredDisplay: formatEntryDate(row.entryAt),
    durationDisplay: formatDuration(row.timeInRoomMs),
    nameSort: (row.scholarName ?? row.scholarUid).toLowerCase(),
  }));

  const extraColumns: ScholarDataTableColumn<Row>[] = [
    {
      id: "entered",
      header: "Entered",
      width: "20%",
      field: "enteredDisplay",
      sortField: "entryAt",
      cellClassName: "text-muted-foreground",
      sortable: true,
    },
    {
      id: "duration",
      header: "Duration",
      width: "20%",
      field: "durationDisplay",
      sortField: "timeInRoomMs",
      sortable: true,
    },
  ];
  return (
    <CollapsibleTableSection title={`${title} (${data.length})`}>
      <ScholarDataTable<Row>
        data={tableData}
        rowKeyField="scholarUid"
        nameColumn={{
          header: "",
          colSpan: 2,
          width: "40%",
          field: "scholarName",
          fallbackField: "scholarUid",
          sortField: "nameSort",
          cellClassName: "font-medium",
          sortable: true,
        }}
        uidColumn={{
          header: "UID",
          width: "20%",
          field: "scholarUid",
          cellClassName: "text-muted-foreground font-mono text-xs",
          sortable: true,
        }}
        columns={extraColumns}
      />
    </CollapsibleTableSection>
  );
}

function CompletedSessionsTableSection({
  title,
  data,
  formatDuration,
  formatEntryDate,
}: {
  title: string;
  data: ScholarWithCompletedSession[];
  formatDuration: (ms: number) => string;
  formatEntryDate: (iso: string) => string;
}) {
  type Row = ScholarWithCompletedSession & {
    enteredDisplay: string;
    durationDisplay: string;
    durationMs: number;
    nameSort: string;
  };
  const tableData: Row[] = data.map((row) => ({
    ...row,
    enteredDisplay: formatEntryDate(row.entryAt),
    durationDisplay: formatDuration(getDurationMs(row)),
    durationMs: getDurationMs(row),
    nameSort: (row.scholarName ?? row.scholarUid).toLowerCase(),
  }));

  const extraColumns: ScholarDataTableColumn<Row>[] = [
    {
      id: "entered",
      header: "Entered",
      width: "20%",
      field: "enteredDisplay",
      sortField: "entryAt",
      cellClassName: "text-muted-foreground",
      sortable: true,
    },
    {
      id: "duration",
      header: "Duration",
      width: "20%",
      field: "durationDisplay",
      sortField: "durationMs",
      cellClassName: "text-muted-foreground",
      sortable: true,
    },
  ];
  return (
    <CollapsibleTableSection title={`${title} (${data.length})`}>
      <ScholarDataTable<Row>
        data={tableData}
        rowKeyField="scholarUid"
        nameColumn={{
          header: "",
          colSpan: 2,
          width: "40%",
          field: "scholarName",
          fallbackField: "scholarUid",
          sortField: "nameSort",
          cellClassName: "font-medium",
          sortable: true,
        }}
        uidColumn={{
          header: "UID",
          width: "20%",
          field: "scholarUid",
          cellClassName: "text-muted-foreground font-mono text-xs",
          sortable: true,
        }}
        columns={extraColumns}
      />
    </CollapsibleTableSection>
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
  const scholars = Array.from(result.byScholarUid.entries()).filter(
    ([_, { errored }]) => errored.length > 0
  );

  return (
    <CollapsibleTableSection
      title={`${title} — ${result.allCleaned.length} cleaned, ${result.allErrored.length} errored`}
    >
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
    </CollapsibleTableSection>
  );
}
