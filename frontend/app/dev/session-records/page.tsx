"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { backendGet, backendPost, backendPatch } from "@/lib/client/api-client";
import type {
  FrontDeskRecordRow,
  StudySessionRecordRow,
} from "@/lib/types/session-record";
import {
  ScholarDataTable,
  CollapsibleTableSection,
  type ScholarDataTableColumn,
} from "@/components/scholar-data-table";
import {
  dateToCampusWeek,
  formatMinutesToHoursAndMinutes,
} from "@/lib/format/time";
import { CampusWeekCard } from "@/components/campus-week-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    const excused = r.excuse_min ?? 0;
    const effectiveTotal = ssTotal + excused;
    const pct = ssReq > 0 ? (effectiveTotal / ssReq) * 100 : -1;
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
    const excused = r.excuse_min ?? 0;
    const effectiveTotal = fdTotal + excused;
    const pct = fdReq > 0 ? (effectiveTotal / fdReq) * 100 : -1;
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
  const excused = row.excuse_min ?? 0;
  const effectiveTotal = total + excused;
  if (req <= 0) return "bg-muted/50";
  const pct = (effectiveTotal / req) * 100;
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
  const excused = row.excuse_min ?? 0;
  const effectiveTotal = total + excused;
  const label = isFd ? "FD" : "SS";
  const bgClass = getRequiredBgClass(row);
  const hasReq = req != null && req > 0;
  const pct = hasReq ? Math.round((effectiveTotal / req) * 100) : null;
  return (
    <div
      className={`flex items-center gap-3 rounded px-2 py-1 text-xs ${bgClass}`}
      title={`${label}. Green: ≥90%, Yellow: 75–90%, Red: <75%.${excused > 0 ? ` Includes ${excused} min excused.` : ""}`}
    >
      {hasReq ? (
        <>
          <span>
            <span className="whitespace-pre-line font-semibold">
              {formatMinutesToHoursAndMinutes(effectiveTotal)}
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

function getSharedMinutesColumns(
  onAddExcuse: (row: RecordRowWithProgress) => void
): ScholarDataTableColumn<RecordRowWithProgress>[] {
  return [
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
            onClick={() => onAddExcuse(row)}
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
}

function ExcuseModal({
  open,
  onOpenChange,
  row,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: RecordRowWithProgress | null;
  onSuccess: () => void;
}) {
  const [excuse, setExcuse] = useState("");
  const [excuseMin, setExcuseMin] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens with a row
  useEffect(() => {
    if (open && row) {
      setExcuse(row.excuse ?? "");
      setExcuseMin(row.excuse_min != null ? String(row.excuse_min) : "");
      setError(null);
    }
  }, [open, row]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!row || row.uid == null || row.week_num == null) return;
    setSubmitting(true);
    setError(null);
    const weekNum = row.week_num;
    const uid = row.uid;
    const excuseMinNum = excuseMin.trim() === "" ? null : parseInt(excuseMin, 10);
    const payload = {
      uid,
      weekNum,
      excuse: excuse.trim() || null,
      excuse_min: excuseMinNum != null && !Number.isNaN(excuseMinNum) ? excuseMinNum : null,
    };
    const route = row._tableType === "fd" ? "front-desk" : "study";
    try {
      const result = await backendPatch(`/api/session-records/${route}/excuse`, payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSuccess();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!row) return null;

  const tableLabel = row._tableType === "fd" ? "Front desk" : "Study session";
  const scholarLabel = row.scholar_name ?? `UID ${row.uid}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {row.excuse ? "Edit excuse" : "Add excuse"}
          </DialogTitle>
          <DialogDescription>
            {tableLabel} · Week {row.week_num} · {scholarLabel}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excuse-modal-excuse">Excuse (reason)</Label>
            <Input
              id="excuse-modal-excuse"
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
              placeholder="e.g. Sick day, family event"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excuse-modal-min">Minutes excused (optional)</Label>
            <Input
              id="excuse-modal-min"
              type="number"
              min={0}
              value={excuseMin}
              onChange={(e) => setExcuseMin(e.target.value)}
              placeholder="e.g. 60"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save excuse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

  const [excuseModalOpen, setExcuseModalOpen] = useState(false);
  const [excuseModalRow, setExcuseModalRow] = useState<RecordRowWithProgress | null>(null);

  const refetchAllRecords = useCallback(() => {
    if (!effectiveWeek) return;
    const weekNum = parseInt(effectiveWeek, 10);
    if (Number.isNaN(weekNum) || weekNum < 1) return;
    setAllScholarsRecords("loading");
    setAllFrontDeskRecords("loading");
    backendGet<StudyRecordRow[]>(`/api/session-records/study/week/${weekNum}`)
      .then((result) => {
        setAllScholarsRecords(result.ok ? result.data : null);
      })
      .catch(() => setAllScholarsRecords(null));
    backendGet<FrontDeskRecordRowWithName[]>(`/api/session-records/front-desk/week/${weekNum}`)
      .then((result) => {
        setAllFrontDeskRecords(result.ok ? result.data : null);
      })
      .catch(() => setAllFrontDeskRecords(null));
  }, [effectiveWeek]);

  const sharedMinutesColumns = useMemo(
    () =>
      getSharedMinutesColumns((row) => {
        setExcuseModalRow(row);
        setExcuseModalOpen(true);
      }),
    []
  );

  const weekNumForRange =
    effectiveWeek !== ""
      ? Math.max(1, Math.min(99, parseInt(effectiveWeek, 10) || 1))
      : null;

  const fetchRecord = useCallback(async (uid: number, week: number) => {
    setRecordRequested(true);
    setRecord("loading");
    try {
      const result = await backendGet<FrontDeskRecordRow | null>(`/api/session-records/front-desk/${uid}/week/${week}`);
      setRecord(result.ok ? result.data : null);
    } catch {
      setRecord(null);
    }
  }, []);

  const fetchStudyRecord = useCallback(async (uid: number, week: number) => {
    setStudyRecordRequested(true);
    setStudyRecord("loading");
    try {
      const result = await backendGet<StudySessionRecordRow | null>(`/api/session-records/study/${uid}/week/${week}`);
      setStudyRecord(result.ok ? result.data : null);
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
    backendGet<StudyRecordRow[]>(`/api/session-records/study/week/${weekNum}`)
      .then((result) => {
        if (cancelled) return;
        setAllScholarsRecords(result.ok ? result.data : null);
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
    backendGet<FrontDeskRecordRowWithName[]>(`/api/session-records/front-desk/week/${weekNum}`)
      .then((result) => {
        if (cancelled) return;
        setAllFrontDeskRecords(result.ok ? result.data : null);
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
      const result = await backendPost<{ upserted: number }>("/api/session-records/front-desk/sync", { weekNum, uid: uidNum });
      if (!result.ok) {
        setSyncMessage({ type: "err", text: result.error });
        return;
      }
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.data.upserted} record(s) for week ${weekNum}.`,
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
      const result = await backendPost<{ upserted: number }>("/api/session-records/study/sync", { weekNum, uid: uidNum });
      if (!result.ok) {
        setStudySyncMessage({ type: "err", text: result.error });
        return;
      }
      setStudySyncMessage({
        type: "ok",
        text: `Synced ${result.data.upserted} study session record(s) for week ${weekNum}.`,
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
      const result = await backendPost<{ upserted: number }>("/api/session-records/study/sync-all", { weekNum });
      if (!result.ok) {
        setStudySyncMessage({ type: "err", text: result.error });
        return;
      }
      setStudySyncMessage({
        type: "ok",
        text: `Synced ${result.data.upserted} study session record(s) for all users (week ${weekNum}).`,
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
      const result = await backendPost<{ upserted: number }>("/api/session-records/front-desk/sync-all", { weekNum });
      if (!result.ok) {
        setSyncMessage({ type: "err", text: result.error });
        return;
      }
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.data.upserted} record(s) for all users (week ${weekNum}).`,
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
      <ExcuseModal
        open={excuseModalOpen}
        onOpenChange={setExcuseModalOpen}
        row={excuseModalRow}
        onSuccess={refetchAllRecords}
      />
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

      <CampusWeekCard
        basePath="/dev/session-records"
        additionalSearchParams={uidParam ? { uid: uidParam } : undefined}
        selectedWeek={weekNumForRange}
      />

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
            UID if provided). &quot;Sync all UIDs&quot; upserts one row per user in public.user_roster
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
