"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getFrontDeskRecord,
  syncFrontDeskRecordsForWeek,
  syncFrontDeskRecordsForWeekAllUids,
} from "@/lib/session-records";
import type { FrontDeskRecordRow } from "@/lib/session-records";
import { dateToCampusWeek, campusWeekToDateRange } from "@/lib/time";
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

export default function SessionRecordsTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week") ?? "";
  const uidParam = searchParams.get("uid") ?? "";

  const [getUid, setGetUid] = useState(uidParam);
  const [getWeek, setGetWeek] = useState(weekParam || "");
  const [record, setRecord] = useState<FrontDeskRecordRow | null | "loading">(null);
  const [recordRequested, setRecordRequested] = useState(false);

  const [syncWeek, setSyncWeek] = useState(weekParam || "");
  const [syncUid, setSyncUid] = useState(uidParam);
  const [syncing, setSyncing] = useState<"one" | "all" | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const currentCampusWeek = dateToCampusWeek(new Date());
  const weekNumForRange =
    weekParam !== "" ? Math.max(1, Math.min(99, parseInt(weekParam, 10) || 1)) : null;
  const range = weekNumForRange != null ? campusWeekToDateRange(weekNumForRange) : null;

  const fetchRecord = useCallback(async (uid: number, week: number) => {
    setRecordRequested(true);
    setRecord("loading");
    try {
      const r = await getFrontDeskRecord(uid, week);
      setRecord(r);
    } catch {
      setRecord(null);
    }
  }, []);

  useEffect(() => {
    if (!weekParam || !uidParam) return;
    const uidNum = parseInt(uidParam, 10);
    const weekNum = parseInt(weekParam, 10);
    if (Number.isNaN(uidNum) || Number.isNaN(weekNum) || weekNum < 1) return;
    fetchRecord(uidNum, weekNum);
  }, [weekParam, uidParam, fetchRecord]);

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
      const result = await syncFrontDeskRecordsForWeek(weekNum, uidNum);
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} record(s) for week ${weekNum}.`,
      });
      if (getUid && getWeek) fetchRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
    } catch (e) {
      setSyncMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Sync failed.",
      });
    } finally {
      setSyncing(null);
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
      const result = await syncFrontDeskRecordsForWeekAllUids(weekNum);
      setSyncMessage({
        type: "ok",
        text: `Synced ${result.upserted} record(s) for all users (week ${weekNum}).`,
      });
      if (getUid && getWeek) fetchRecord(parseInt(getUid, 10), parseInt(getWeek, 10));
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
    <div className="container mx-auto max-w-3xl space-y-8 py-12">
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
          Sync and read <code className="rounded bg-muted px-1">front_desk_records</code> from
          ticket data (lib/session-records).
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
            View a single record by UID and week. Use the Session Logs page to find UIDs, then
            enter below or open e.g. /dev/session-records?uid=123&amp;week=5.
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
            <div className="rounded-md border bg-muted/30 p-4 text-sm">
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync records</CardTitle>
          <CardDescription>
            Sync front_desk_records from front_desk_logs tickets for a given week. &quot;Sync for
            week&quot; updates only scholars who have tickets that week (or a single UID if
            provided). &quot;Sync all UIDs&quot; upserts one row per user in public.users (zeros if
            no tickets).
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
        </CardContent>
      </Card>
    </div>
  );
}
