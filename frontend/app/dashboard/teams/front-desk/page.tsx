import { Suspense } from "react";
import { TeamsAttendanceClient } from "../_components/teams-attendance-client";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function TeamsPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-[calc(5rem+190px)]" />
      </div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function FrontDeskTeamsPage() {
  return (
    <Suspense fallback={<TeamsPageFallback />}>
      <TeamsAttendanceClient
        kind="front_desk"
        title="Front desk"
        basePath="/dashboard/teams/front-desk"
      />
    </Suspense>
  );
}
