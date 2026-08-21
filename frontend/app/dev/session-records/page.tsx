/**
 * @file page.tsx
 * @module frontend/app/dev/session-records
 *
 * Retired scratchpad. Weekly minutes are computed on read via /api/attendance.
 */
import Link from "next/link";

export const metadata = {
  title: "Session Records (retired) | Dev Tools",
  description: "Session-record sync is retired; use campus-week attendance boards",
};

export default function SessionRecordsRetiredPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-4 py-12">
      <h1 className="text-2xl font-bold">Session records retired</h1>
      <p className="text-muted-foreground">
        <code className="rounded bg-muted px-1">front_desk_records</code> /{" "}
        <code className="rounded bg-muted px-1">study_session_records</code> are
        frozen SQL snapshots. Memo and teams boards compute minutes on read from
        tickets and store excuses in{" "}
        <code className="rounded bg-muted px-1">scholar_week_excuses</code>.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-sm">
        <li>
          <Link href="/dashboard/teams/front-desk" className="text-primary hover:underline">
            Front desk attendance board
          </Link>
        </li>
        <li>
          <Link href="/dashboard/teams/study" className="text-primary hover:underline">
            Study session attendance board
          </Link>
        </li>
        <li>
          <Link href="/dev/session-logs" className="text-primary hover:underline">
            Raw session tickets
          </Link>
        </li>
      </ul>
    </div>
  );
}
