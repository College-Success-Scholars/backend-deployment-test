"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  FrontDeskRecordRow,
  StudySessionRecordRow,
} from "@/lib/session-records";
import {
  ScholarDataTable,
  CollapsibleTableSection,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import {
  dateToCampusWeek,
  campusWeekToDateRange,
  formatMinutesToHoursAndMinutes,
} from "@/lib/time";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StudyRecordRow = StudySessionRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};
type FrontDeskRecordRowWithName = FrontDeskRecordRow & {
  scholar_name?: string | null;
  fd_required?: number | null;
  ss_required?: number | null;
};

type StudyRecordRowWithTotal = StudyRecordRow & { total: number };
type FrontDeskRecordRowWithTotal = FrontDeskRecordRowWithName & { total: number };

/** Row with both fd/ss totals and required hours for the progress column. */
type RecordRowWithProgress = (StudyRecordRowWithTotal | FrontDeskRecordRowWithTotal) & {
  fd_total: number;
  ss_total: number;
  fd_required: number | null;
  ss_required: number | null;
  _tableType: "study" | "fd";
  /** Percentage (0–100) for sorting; -1 when N/A. */
  _requiredPct: number;
};

function addTotalStudy(row: StudyRecordRow): StudyRecordRowWithTotal {
  const total =
    (row.mon_min ?? 0) +
    (row.tues_min ?? 0) +
    (row.wed_min ?? 0) +
    (row.thurs_min ?? 0) +
    (row.fri_min ?? 0);
  return { ...row, total };
}

function addTotalFrontDesk(row: FrontDeskRecordRowWithName): FrontDeskRecordRowWithTotal {
  const total =
    (row.mon_min ?? 0) +
    (row.tues_min ?? 0) +
    (row.wed_min ?? 0) +
    (row.thurs_min ?? 0) +
    (row.fri_min ?? 0);
  return { ...row, total };
}

function mergeWithOtherTable(
  studyRows: StudyRecordRowWithTotal[],
  fdRows: FrontDeskRecordRowWithTotal[]
): {
  studyWithProgress: RecordRowWithProgress[];
  fdWithProgress: RecordRowWithProgress[];
} {
  const fdByUid = new Map<number, FrontDeskRecordRowWithTotal>();
  for (const r of fdRows) {
    if (r.uid != null) fdByUid.set(r.uid, r);
  }
  const studyByUid = new Map<number, StudyRecordRowWithTotal>();
  for (const r of studyRows) {
    if (r.uid != null) studyByUid.set(r.uid, r);
  }
  const studyWithProgress: RecordRowWithProgress[] = studyRows.map((r) => {
    const fd = r.uid != null ? fdByUid.get(r.uid) : undefined;
    const ssReq = r.ss_required ?? 0;
    const ssTotal = r.total;
    const pct = ssReq > 0 ? (ssTotal / ssReq) * 100 : -1;
    return {
      ...r,
      fd_total: fd?.total ?? 0,
      ss_total: r.total,
      fd_required: r.fd_required ?? null,
      ss_required: r.ss_required ?? null,
      _tableType: "study" as const,
      _requiredPct: pct,
    } as RecordRowWithProgress;
  });
  const fdWithProgress: RecordRowWithProgress[] = fdRows.map((r) => {
    const study = r.uid != null ? studyByUid.get(r.uid) : undefined;
    const fdReq = r.fd_required ?? 0;
    const fdTotal = r.total;
    const pct = fdReq > 0 ? (fdTotal / fdReq) * 100 : -1;
    return {
      ...r,
      fd_total: r.total,
      ss_total: study?.total ?? 0,
      fd_required: r.fd_required ?? null,
      ss_required: r.ss_required ?? null,
      _tableType: "fd" as const,
      _requiredPct: pct,
    } as RecordRowWithProgress;
  });
  return { studyWithProgress, fdWithProgress };
}

function getRequiredBgClass(row: RecordRowWithProgress): string {
  const isFd = row._tableType === "fd";
  const req = isFd ? (row.fd_required ?? 0) : (row.ss_required ?? 0);
  const total = isFd ? row.fd_total : row.ss_total;
  if (req <= 0) return "bg-muted/50";
  const pct = (total / req) * 100;
  if (pct >= 90) return "bg-green-500/20";
  if (pct >= 75) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

/** Format required minutes as hours (e.g. 60 → "1h", 90 → "1.5h"). */
function formatRequiredAsHours(mins: number): string {
  return `${mins / 60}h`;
}

function CombinedTotalProgressCell({ row }: { row: RecordRowWithProgress }) {
  const isFd = row._tableType === "fd";
  const req = isFd ? row.fd_required : row.ss_required;
  const total = isFd ? row.fd_total : row.ss_total;
  const label = isFd ? "FD" : "SS";
  const bgClass = getRequiredBgClass(row);
  const hasReq = req != null && req > 0;
  const pct = hasReq ? Math.round((total / req) * 100) : null;
  return (
    <div
      className={`flex items-center gap-3 rounded px-2 py-1 text-xs ${bgClass}`}
      title={`${label}. Green: ≥90%, Yellow: 75–90%, Red: <75%`}
    >
      {hasReq ? (
        <>
          <span>
            <span className="whitespace-pre-line font-semibold">
              {formatMinutesToHoursAndMinutes(total)}
            </span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-xs">{formatRequiredAsHours(req)}</span>
          </span>
          <span className="text-xs font-bold text-white">{pct}%</span>
        </>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}

const sharedMinutesColumns: ScholarDataTableColumn<RecordRowWithProgress>[] = [
    {
      id: "mon",
      header: "Mon",
      field: "mon_min",
      sortable: true,
      renderCell: (row) => (
        <span className="whitespace-pre-line">
          {formatMinutesToHoursAndMinutes(row.mon_min ?? 0)}
        </span>
      ),
    },
    {
      id: "tues",
      header: "Tue",
      field: "tues_min",
      sortable: true,
      renderCell: (row) => (
        <span className="whitespace-pre-line">
          {formatMinutesToHoursAndMinutes(row.tues_min ?? 0)}
        </span>
      ),
    },
    {
      id: "wed",
      header: "Wed",
      field: "wed_min",
      sortable: true,
      renderCell: (row) => (
        <span className="whitespace-pre-line">
          {formatMinutesToHoursAndMinutes(row.wed_min ?? 0)}
        </span>
      ),
    },
    {
      id: "thurs",
      header: "Thu",
      field: "thurs_min",
      sortable: true,
      renderCell: (row) => (
        <span className="whitespace-pre-line">
          {formatMinutesToHoursAndMinutes(row.thurs_min ?? 0)}
        </span>
      ),
    },
    {
      id: "fri",
      header: "Fri",
      field: "fri_min",
      sortable: true,
      renderCell: (row) => (
        <span className="whitespace-pre-line">
          {formatMinutesToHoursAndMinutes(row.fri_min ?? 0)}
        </span>
      ),
    },
    {
      id: "excuses",
      header: "Excuses",
      field: "excuse",
      sortable: true,
      renderCell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">
            {row.excuse ?? "—"}
            {row.excuse_min != null ? ` (${row.excuse_min} min excused)` : ""}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              /* TODO: open add-excuse flow for row.uid, row.week_num */
            }}
          >
            Add excuse
          </Button>
        </div>
      ),
    },
    {
      id: "total-progress",
      header: "",
      field: "total",
      colSpan: 2,
      sortable: true,
      sortField: "_requiredPct" as keyof RecordRowWithProgress,
      renderCell: (row) => <CombinedTotalProgressCell row={row} />,
    },
  ];

export default function SessionRecordsTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week") ?? "";
  const uidParam = searchParams.get("uid") ?? "";

  const currentCampusWeek = dateToCampusWeek(new Date());
  const effectiveWeek =
    weekParam !== ""
      ? weekParam
      : currentCampusWeek != null
        ? String(currentCampusWeek)
        : "";

  const [getUid, setGetUid] = useState(uidParam);
  const [getWeek, setGetWeek] = useState(weekParam || String(currentCampusWeek ?? ""));
  const [record, setRecord] = useState<FrontDeskRecordRow | null | "loading">(null);
  const [recordRequested, setRecordRequested] = useState(false);

  const [studyRecord, setStudyRecord] = useState<
    StudySessionRecordRow | null | "loading"
  >(null);
  const [studyRecordRequested, setStudyRecordRequested] = useState(false);

  const [syncWeek, setSyncWeek] = useState(weekParam || String(currentCampusWeek ?? ""));
  const [syncUid, setSyncUid] = useState(uidParam);
  const [syncing, setSyncing] = useState<"one" | "all" | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [studySyncing, setStudySyncing] = useState<"one" | "all" | null>(null);
  const [studySyncMessage, setStudySyncMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [allScholarsRecords, setAllScholarsRecords] = useState<
    StudyRecordRow[] | "loading" | null
  >(null);
  const [allFrontDeskRecords, setAllFrontDeskRecords] = useState<
    FrontDeskRecordRowWithName[] | "loading" | null
  >(null);

  const weekNumForRange =
    effectiveWeek !== ""
      ? Math.max(1, Math.min(99, parseInt(effectiveWeek, 10) || 1))
      : null;
  const range = weekNumForRange != null ? campusWeekToDateRange(weekNumForRange) : null;

  const fetchRecord = useCallback(async (uid: number, week: number) => {
    setRecordRequested(true);
    setRecord("loading");
    try {
      const res = await fetch(
        `/api/dev/session-records/front-desk?uid=${uid}&week=${week}`
      );
      const json = await res.json();
      if (!res.ok) {
        setRecord(null);
        return;
      }
      setRecord(json.data ?? null);
    } catch {
      setRecord(null);
    }
  }, []);

  const fetchStudyRecord = useCallback(async (uid: number, week: number) => {
    setStudyRecordRequested(true);
    setStudyRecord("loading");
    try {
      const res = await fetch(
        `/api/dev/session-records/study?uid=${uid}&week=${week}`
      );
      const json = await res.json();
      if (!res.ok) {
        setStudyRecord(null);
        return;
      }
      setStudyRecord(json.data ?? null);
    } catch {
      setStudyRecord(null);
    }
  }, []);

  useEffect(() => {
    if (!weekParam || !uidParam) return;
    const uidNum = parseInt(uidParam, 10);
    const weekNum = parseInt(weekParam, 10);
    if (Number.isNaN(uidNum) || Number.isNaN(weekNum) || weekNum < 1) return;
    fetchRecord(uidNum, weekNum);
    fetchStudyRecord(uidNum, weekNum);
  }, [weekParam, uidParam, fetchRecord, fetchStudyRecord]);

  useEffect(() => {
    if (!effectiveWeek) {
      setAllScholarsRecords(null);
      return;
    }
    const weekNum = parseInt(effectiveWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setAllScholarsRecords(null);
      return;
    }
    let cancelled = false;
    setAllScholarsRecords("loading");
    fetch(`/api/dev/session-records/study?week=${weekNum}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (json == null) {
          setAllScholarsRecords(null);
          return;
        }
        setAllScholarsRecords((json.data ?? []) as StudyRecordRow[]);
      })
      .catch(() => {
        if (!cancelled) setAllScholarsRecords(null);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveWeek]);

  useEffect(() => {
    if (!effectiveWeek) {
      setAllFrontDeskRecords(null);
      return;
    }
    const weekNum = parseInt(effectiveWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setAllFrontDeskRecords(null);
      return;
    }
    let cancelled = false;
    setAllFrontDeskRecords("loading");
    fetch(`/api/dev/session-records/front-desk?week=${weekNum}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (json == null) {
          setAllFrontDeskRecords(null);
          return;
        }
        setAllFrontDeskRecords((json.data ?? []) as FrontDeskRecordRowWithName[]);
      })
      .catch(() => {
        if (!cancelled) setAllFrontDeskRecords(null);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveWeek]);

  function handleGetRecord(e: React.FormEvent) {
    e.preventDefault();
    const uidNum = parseInt(getUid, 10);
    const weekNum = parseInt(getWeek, 10);
    if (Number.isNaN(uidNum) || Number.isNaN(weekNum) || weekNum < 1) {
      setRecordRequested(true);
      setRecord(null);
      return;
    }
    setRecordRequested(true);
    setStudyRecordRequested(true);
    router.push(`/dev/session-records?uid=${uidNum}&week=${weekNum}`);
  }

  async function handleSyncForWeek() {
    const weekNum = parseInt(syncWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setSyncMessage({ type: "err", text: "Enter a valid week number (≥ 1)." });
      return;
    }
    const uidNum = syncUid.trim() ? parseInt(syncUid, 10) : undefined;
    if (syncUid.trim() && (uidNum === undefined || Number.isNaN(uidNum))) {
      setSyncMessage({ type: "err", text: "UID must be a number or empty." });
      return;
    }
    setSyncing("one");
    setSyncMessage(null);
    try {
      const res = await fetch("/api/dev/session-records/front-desk/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNum, uid: uidNum }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSyncMessage({
          type: "err",
          text: json.error ?? "Sync failed.",
        });
        return;
      }
      const result = json.data as { upserted: number };
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} record(s) for week ${weekNum}.`,
      });
      if (getUid && getWeek) {
        fetchRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
        fetchStudyRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
      }
    } catch (e) {
      setSyncMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Sync failed.",
      });
    } finally {
      setSyncing(null);
    }
  }

  async function handleStudySyncForWeek() {
    const weekNum = parseInt(syncWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setStudySyncMessage({ type: "err", text: "Enter a valid week number (≥ 1)." });
      return;
    }
    const uidNum = syncUid.trim() ? parseInt(syncUid, 10) : undefined;
    if (syncUid.trim() && (uidNum === undefined || Number.isNaN(uidNum))) {
      setStudySyncMessage({ type: "err", text: "UID must be a number or empty." });
      return;
    }
    setStudySyncing("one");
    setStudySyncMessage(null);
    try {
      const res = await fetch("/api/dev/session-records/study/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNum, uid: uidNum }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStudySyncMessage({
          type: "err",
          text: json.error ?? "Study session sync failed.",
        });
        return;
      }
      const result = json.data as { upserted: number };
      setStudySyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} study session record(s) for week ${weekNum}.`,
      });
      if (getUid && getWeek) {
        fetchStudyRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
      }
    } catch (e) {
      setStudySyncMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Study session sync failed.",
      });
    } finally {
      setStudySyncing(null);
    }
  }

  async function handleStudySyncAllUids() {
    const weekNum = parseInt(syncWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setStudySyncMessage({ type: "err", text: "Enter a valid week number (≥ 1)." });
      return;
    }
    setStudySyncing("all");
    setStudySyncMessage(null);
    try {
      const res = await fetch("/api/dev/session-records/study/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNum }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStudySyncMessage({
          type: "err",
          text: json.error ?? "Study session sync failed.",
        });
        return;
      }
      const result = json.data as { upserted: number };
      setStudySyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} study session record(s) for all users (week ${weekNum}).`,
      });
      if (getUid && getWeek) {
        fetchStudyRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
      }
    } catch (e) {
      setStudySyncMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Study session sync failed.",
      });
    } finally {
      setStudySyncing(null);
    }
  }

  async function handleSyncAllUids() {
    const weekNum = parseInt(syncWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) {
      setSyncMessage({ type: "err", text: "Enter a valid week number (≥ 1)." });
      return;
    }
    setSyncing("all");
    setSyncMessage(null);
    try {
      const res = await fetch("/api/dev/session-records/front-desk/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekNum }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSyncMessage({
          type: "err",
          text: json.error ?? "Sync failed.",
        });
        return;
      }
      const result = json.data as { upserted: number };
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} record(s) for all users (week ${weekNum}).`,
      });
      if (getUid && getWeek) {
        fetchRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
        fetchStudyRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
      }
    } catch (e) {
      setSyncMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Sync failed.",
      });
    } finally {
      setSyncing(null);
    }
  }

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
        <h1 className="text-2xl font-bold">Session Records Test</h1>
        <p className="text-muted-foreground mt-1">
          Sync and read <code className="rounded bg-muted px-1">front_desk_records</code> and{" "}
          <code className="rounded bg-muted px-1">study_session_records</code> via{" "}
          <code className="rounded bg-muted px-1">/api/dev/session-records</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time</CardTitle>
          <CardDescription>
            Current campus week from lib/time. Use week links or forms below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current campus week:</span>
            <Badge variant="secondary">{currentCampusWeek ?? "—"}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">Quick week links:</p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                <Link
                  key={w}
                  href={`/dev/session-records?week=${w}${uidParam ? `&uid=${uidParam}` : ""}`}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
          <CardTitle>Get record</CardTitle>
          <CardDescription>
            View front desk and study session records by UID and week. Use the Session Logs page
            to find UIDs, then enter below or open e.g. /dev/session-records?uid=123&amp;week=5.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleGetRecord} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="get-uid">UID</Label>
              <Input
                id="get-uid"
                type="number"
                min={1}
                value={getUid}
                onChange={(e) => setGetUid(e.target.value)}
                placeholder="e.g. 123"
                className="w-24"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="get-week">Week</Label>
              <Input
                id="get-week"
                type="number"
                min={1}
                value={getWeek}
                onChange={(e) => setGetWeek(e.target.value)}
                placeholder="e.g. 5"
                className="w-20"
              />
            </div>
            <Button type="submit">Get record</Button>
          </form>
          {recordRequested && (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-4 text-sm">
                <p className="font-medium text-muted-foreground mb-2">Front desk record</p>
                {record === "loading" ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : record === null ? (
                  <p className="text-muted-foreground">
                    No record found for UID {getUid} and week {getWeek}.
                  </p>
                ) : (
                  <dl className="grid gap-1 sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">id</dt>
                      <dd className="font-mono">{record.id}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">uid</dt>
                      <dd className="font-mono">{record.uid}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">week_num</dt>
                      <dd className="font-mono">{record.week_num}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">mon_min</dt>
                      <dd className="font-mono">{record.mon_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">tues_min</dt>
                      <dd className="font-mono">{record.tues_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">wed_min</dt>
                      <dd className="font-mono">{record.wed_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">thurs_min</dt>
                      <dd className="font-mono">{record.thurs_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">fri_min</dt>
                      <dd className="font-mono">{record.fri_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">excuse_min</dt>
                      <dd className="font-mono">{record.excuse_min ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">excuse</dt>
                      <dd className="font-mono">{record.excuse ?? "—"}</dd>
                    </div>
                  </dl>
                )}
              </div>
              {studyRecordRequested && (
                <div className="rounded-md border bg-muted/30 p-4 text-sm">
                  <p className="font-medium text-muted-foreground mb-2">Study session record</p>
                  {studyRecord === "loading" ? (
                    <p className="text-muted-foreground">Loading…</p>
                  ) : studyRecord === null ? (
                    <p className="text-muted-foreground">
                      No study session record for UID {getUid} and week {getWeek}.
                    </p>
                  ) : (
                    <dl className="grid gap-1 sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">id</dt>
                        <dd className="font-mono">{studyRecord.id}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">uid</dt>
                        <dd className="font-mono">{studyRecord.uid}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">week_num</dt>
                        <dd className="font-mono">{studyRecord.week_num}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">mon_min</dt>
                        <dd className="font-mono">{studyRecord.mon_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">tues_min</dt>
                        <dd className="font-mono">{studyRecord.tues_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">wed_min</dt>
                        <dd className="font-mono">{studyRecord.wed_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">thurs_min</dt>
                        <dd className="font-mono">{studyRecord.thurs_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">fri_min</dt>
                        <dd className="font-mono">{studyRecord.fri_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">excuse_min</dt>
                        <dd className="font-mono">{studyRecord.excuse_min ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">excuse</dt>
                        <dd className="font-mono">{studyRecord.excuse ?? "—"}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All scholars&apos; records</CardTitle>
          <CardDescription>
            Study session and front desk records for the selected week. Select a week via the links
            above or the form, then view or add excuses below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {!effectiveWeek ? (
            <p className="text-muted-foreground text-sm">
              Select a week using the quick week links or the form above to load all scholars&apos;
              records.
            </p>
          ) : (
            <>
              <CollapsibleTableSection title="Study session records" defaultOpen={true}>
                {allScholarsRecords === "loading" ||
                allFrontDeskRecords === "loading" ? (
                  <p className="text-muted-foreground text-sm">Loading…</p>
                ) : allScholarsRecords === null ||
                  allScholarsRecords.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No study session records for week {effectiveWeek}.
                  </p>
                ) : (
                  <ScholarDataTable<RecordRowWithProgress>
                    data={mergeWithOtherTable(
                      allScholarsRecords.map(addTotalStudy),
                      allFrontDeskRecords !== null
                        ? allFrontDeskRecords.map(addTotalFrontDesk)
                        : []
                    ).studyWithProgress}
                    rowKeyField="id"
                    nameColumn={{
                      field: "scholar_name",
                      fallbackField: "uid",
                      header: "Scholar",
                      sortable: true,
                    }}
                    uidColumn={{ field: "uid", sortable: true }}
                    columns={sharedMinutesColumns}
                    emptyMessage="No records"
                  />
                )}
              </CollapsibleTableSection>
              <CollapsibleTableSection title="Front desk records" defaultOpen={true}>
                {allScholarsRecords === "loading" ||
                allFrontDeskRecords === "loading" ? (
                  <p className="text-muted-foreground text-sm">Loading…</p>
                ) : allFrontDeskRecords === null ||
                  allFrontDeskRecords.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No front desk records for week {effectiveWeek}.
                  </p>
                ) : (
                  <ScholarDataTable<RecordRowWithProgress>
                    data={mergeWithOtherTable(
                      allScholarsRecords !== null ? allScholarsRecords.map(addTotalStudy) : [],
                      allFrontDeskRecords.map(addTotalFrontDesk)
                    ).fdWithProgress}
                    rowKeyField="id"
                    nameColumn={{
                      field: "scholar_name",
                      fallbackField: "uid",
                      header: "Scholar",
                      sortable: true,
                    }}
                    uidColumn={{ field: "uid", sortable: true }}
                    columns={sharedMinutesColumns}
                    emptyMessage="No records"
                  />
                )}
              </CollapsibleTableSection>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync records</CardTitle>
          <CardDescription>
            Sync front_desk_records and study_session_records from ticket data for a given week.
            &quot;Sync for week&quot; updates only scholars who have tickets that week (or a single
            UID if provided). &quot;Sync all UIDs&quot; upserts one row per user in public.users
            (zeros if no tickets).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sync-week">Week number</Label>
              <Input
                id="sync-week"
                type="number"
                min={1}
                value={syncWeek}
                onChange={(e) => setSyncWeek(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sync-uid">UID (optional, for &quot;Sync for week&quot;)</Label>
              <Input
                id="sync-uid"
                type="text"
                inputMode="numeric"
                value={syncUid}
                onChange={(e) => setSyncUid(e.target.value)}
                placeholder="Leave empty for all with tickets"
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">Front desk</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSyncForWeek}
                disabled={syncing !== null}
                variant="default"
              >
                {syncing === "one" ? "Syncing…" : "Sync for week (uid or all with tickets)"}
              </Button>
              <Button
                onClick={handleSyncAllUids}
                disabled={syncing !== null}
                variant="secondary"
              >
                {syncing === "all" ? "Syncing…" : "Sync all UIDs for week"}
              </Button>
            </div>
            {syncMessage && (
              <p
                className={
                  syncMessage.type === "err"
                    ? "text-destructive text-sm"
                    : "text-muted-foreground text-sm"
                }
              >
                {syncMessage.text}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">Study session</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleStudySyncForWeek}
                disabled={studySyncing !== null}
                variant="default"
              >
                {studySyncing === "one"
                  ? "Syncing…"
                  : "Sync for week (uid or all with tickets)"}
              </Button>
              <Button
                onClick={handleStudySyncAllUids}
                disabled={studySyncing !== null}
                variant="secondary"
              >
                {studySyncing === "all" ? "Syncing…" : "Sync all UIDs for week"}
              </Button>
            </div>
            {studySyncMessage && (
              <p
                className={
                  studySyncMessage.type === "err"
                    ? "text-destructive text-sm"
                    : "text-muted-foreground text-sm"
                }
              >
                {studySyncMessage.text}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
