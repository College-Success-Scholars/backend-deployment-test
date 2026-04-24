import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dateToCampusWeek,
  campusWeekToDateRange,
  formatDate,
} from "@/lib/format/time";
import { getWeekFetchEnd } from "@/lib/format/time";
import { getFrontDeskRecord, getStudySessionRecord } from "@/lib/server/data";
import { fetchFrontDeskLogs, fetchStudySessionLogs } from "@/lib/server/data";
import { getUserByUid } from "@/lib/server/data";
import {
  getWhafFormLogsByUid,
  getMcfFormLogsByUid,
  getWplFormLogsByUid,
} from "@/lib/server/data";
import type { McfFormLogRow, WahfFormLogRow, WplFormLogRow } from "@/lib/types/form-log";
import { CampusWeekCard } from "@/components/campus-week-card";
import { BackButton } from "../back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FormsDetailTables } from "./forms-detail-tables";

export const metadata = {
  title: "Profile | Dev Tools",
  description: "User profile: records, tickets, form submissions",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ week?: string }>;
};

function parseWeek(weekParam: string | undefined, currentWeek: number | null): number {
  if (weekParam != null && weekParam !== "") {
    const n = parseInt(weekParam, 10);
    return Number.isNaN(n) ? 1 : Math.max(1, Math.min(99, n));
  }
  return currentWeek != null ? Math.max(1, currentWeek) : 1;
}

function UidLink({ uid, label }: { uid: string; label?: string }) {
  if (!uid) return <span className="text-muted-foreground">—</span>;
  return (
    <Link
      href={`/dev/profiles/${uid}`}
      className="text-primary hover:underline font-mono text-sm"
    >
      {label ?? uid}
    </Link>
  );
}

export default async function DevProfilePage({ params, searchParams }: PageProps) {
  const { uid } = await params;
  const resolvedSearchParams = await searchParams;

  if (!uid || typeof uid !== "string") {
    notFound();
  }

  const user = await getUserByUid(uid);
  if (!user) {
    notFound();
  }

  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNum = parseWeek(resolvedSearchParams.week, currentCampusWeek);
  const range = campusWeekToDateRange(weekNum);
  const startDate = range?.startDate ?? undefined;
  const endDate = range ? getWeekFetchEnd(range) : undefined;
  const dateRangeOpts = { startDate, endDate, scholarUids: [uid] as string[] };

  const uidNum = Number(uid);
  const isScholar = (user.program_role ?? "").toLowerCase() === "scholar";

  const [
    fdRecord,
    ssRecord,
    fdLogs,
    ssLogs,
    whafRows,
    mcfRows,
    wplRows,
  ] = await Promise.all([
    Number.isNaN(uidNum) ? Promise.resolve(null) : getFrontDeskRecord(uidNum, weekNum),
    Number.isNaN(uidNum) ? Promise.resolve(null) : getStudySessionRecord(uidNum, weekNum),
    startDate && endDate ? fetchFrontDeskLogs(dateRangeOpts) : Promise.resolve([]),
    startDate && endDate ? fetchStudySessionLogs(dateRangeOpts) : Promise.resolve([]),
    isScholar ? getWhafFormLogsByUid(uid) : Promise.resolve([] as WahfFormLogRow[]),
    !isScholar ? getMcfFormLogsByUid(uid) : Promise.resolve([] as McfFormLogRow[]),
    !isScholar ? getWplFormLogsByUid(uid) : Promise.resolve([] as WplFormLogRow[]),
  ]);

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.uid;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-12">
      <div>
        <BackButton>← Back</BackButton>
        <h1 className="text-2xl font-bold mt-2">{displayName}</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm">UID: {user.uid}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isScholar ? "default" : "secondary"}>
            {user.program_role ?? "—"}
          </Badge>
          {user.cohort != null && (
            <span className="text-sm text-muted-foreground">Cohort {user.cohort}</span>
          )}
          <span className="text-sm text-muted-foreground">
            FD required: {user.fd_required ?? "—"} min · SS required: {user.ss_required ?? "—"} min
          </span>
        </div>
      </div>

      <CampusWeekCard
        basePath={`/dev/profiles/${uid}`}
        selectedWeek={weekNum}
      />

      {isScholar && (
        <>
          {/* FD record */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Front desk record (week {weekNum})</CardTitle>
              <CardDescription>Weekly minutes and excuse</CardDescription>
            </CardHeader>
            <CardContent>
              {fdRecord ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mon</TableHead>
                      <TableHead>Tue</TableHead>
                      <TableHead>Wed</TableHead>
                      <TableHead>Thu</TableHead>
                      <TableHead>Fri</TableHead>
                      <TableHead>Excuse min</TableHead>
                      <TableHead>Excuse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{fdRecord.mon_min ?? "—"}</TableCell>
                      <TableCell>{fdRecord.tues_min ?? "—"}</TableCell>
                      <TableCell>{fdRecord.wed_min ?? "—"}</TableCell>
                      <TableCell>{fdRecord.thurs_min ?? "—"}</TableCell>
                      <TableCell>{fdRecord.fri_min ?? "—"}</TableCell>
                      <TableCell>{fdRecord.excuse_min ?? "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{fdRecord.excuse ?? "—"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm">No front desk record for this week.</p>
              )}
            </CardContent>
          </Card>

          {/* SS record */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study session record (week {weekNum})</CardTitle>
              <CardDescription>Weekly minutes and excuse</CardDescription>
            </CardHeader>
            <CardContent>
              {ssRecord ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mon</TableHead>
                      <TableHead>Tue</TableHead>
                      <TableHead>Wed</TableHead>
                      <TableHead>Thu</TableHead>
                      <TableHead>Fri</TableHead>
                      <TableHead>Excuse min</TableHead>
                      <TableHead>Excuse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{ssRecord.mon_min ?? "—"}</TableCell>
                      <TableCell>{ssRecord.tues_min ?? "—"}</TableCell>
                      <TableCell>{ssRecord.wed_min ?? "—"}</TableCell>
                      <TableCell>{ssRecord.thurs_min ?? "—"}</TableCell>
                      <TableCell>{ssRecord.fri_min ?? "—"}</TableCell>
                      <TableCell>{ssRecord.excuse_min ?? "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ssRecord.excuse ?? "—"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm">No study session record for this week.</p>
              )}
            </CardContent>
          </Card>

          {/* FD tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Front desk tickets (week {weekNum})</CardTitle>
              <CardDescription>Raw log entries</CardDescription>
            </CardHeader>
            <CardContent>
              {fdLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No front desk tickets in this range.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fdLogs.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell className="text-sm">{formatDate(row.created_at)}</TableCell>
                        <TableCell>{row.action_type ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* SS tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study session tickets (week {weekNum})</CardTitle>
              <CardDescription>Raw log entries</CardDescription>
            </CardHeader>
            <CardContent>
              {ssLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No study session tickets in this range.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Session type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ssLogs.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell className="text-sm">{formatDate(row.created_at)}</TableCell>
                        <TableCell>{row.action_type ?? "—"}</TableCell>
                        <TableCell>{row.session_type ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Forms: WHAF for scholar */}
      {isScholar && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">WHAF submissions</CardTitle>
            <CardDescription>Weekly Honors Academic Form (scholar)</CardDescription>
          </CardHeader>
          <CardContent>
            {whafRows.length === 0 ? (
              <p className="text-muted-foreground text-sm">No WHAF submissions.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created</TableHead>
                    <TableHead>Scholar</TableHead>
                    <TableHead>TL contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {whafRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-sm">{formatDate(row.created_at)}</TableCell>
                      <TableCell>
                        <UidLink uid={row.scholar_uid ?? ""} label={row.scholar_name ?? row.scholar_uid ?? "—"} />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{row.team_leader_contact ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Forms: MCF + WPL for TL */}
      {!isScholar && (
        <>
          <FormsDetailTables mcfRows={mcfRows} wplRows={wplRows} />
        </>
      )}
    </div>
  );
}
