import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTotalMinutesForMenteeWeek } from "@/lib/server/daily-scholar-activity";
import { dateToCampusWeek } from "@/lib/time";

/**
 * Optional dev/preview: set `MENTEE_ACTIVITY_PREVIEW_UID` to a real `mentee_uid` to show
 * summed minutes from `daily_scholar_activity` for the current campus week.
 * Omit in production if unused.
 */
export async function DailyActivityMinutesNote() {
  const uid = process.env.MENTEE_ACTIVITY_PREVIEW_UID?.trim();
  if (!uid) return null;

  const weekNum = dateToCampusWeek(new Date()) ?? 1;
  let minutes: number;
  try {
    minutes = await getTotalMinutesForMenteeWeek({
      menteeUid: uid,
      weekNum,
      logSource: "study_session",
    });
  } catch {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Scholar activity (preview)</CardTitle>
        <CardDescription>
          Campus week {weekNum} · mentee_uid from <code className="text-xs">MENTEE_ACTIVITY_PREVIEW_UID</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{minutes}</p>
        <p className="text-xs text-muted-foreground">Total minutes · log_source study_session</p>
      </CardContent>
    </Card>
  );
}
