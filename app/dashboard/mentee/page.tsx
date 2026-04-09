import { DailyActivityMinutesNote } from "@/components/dashboard/daily-activity-minutes-note"
import { MenteeMonitoringClient } from "./mentee-monitoring-client"
import { getMenteeMonitoringData } from "./data"
export type { MyMenteeRpcRow, MenteeActivityRpcRow, WeekBreakRpcRow } from "@/lib/types/mentee-rpc"
export type { DailyLogsMinutesRow, WeekOption, WeekUtcDaysMap, WeeklyComplianceRow } from "./data"

export default async function MenteePage() {
  const { mentees, weeklyCompliance, weekOptions, dailyLogsByWeek, weekUtcDaysByWeekNum } =
    await getMenteeMonitoringData()

  return (
    <div className="space-y-6">
      <DailyActivityMinutesNote />
      <MenteeMonitoringClient
        mentees={mentees}
        weeklyCompliance={weeklyCompliance}
        weekOptions={weekOptions}
        dailyLogsByWeek={dailyLogsByWeek}
        weekUtcDaysByWeekNum={weekUtcDaysByWeekNum}
      />
    </div>
  )
}
