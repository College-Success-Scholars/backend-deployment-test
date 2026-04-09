import { redirect } from "next/navigation"
import { CheckCircle2, CircleX } from "lucide-react"
import { getCurrentUserWithProfilesRow } from "@/lib/supabase/server"
import {
  getCurrentWeekContext,
  getCurrentWeekPersonalFormStatuses,
} from "@/lib/server/personal-monitoring"
import { PersonalActivityLog } from "@/components/dashboard/personal-activity-log"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PersonalMonitoringPage() {
  const { user, profile } = await getCurrentUserWithProfilesRow()
  if (!user) redirect("/auth/login")
  const personalFormStatuses = await getCurrentWeekPersonalFormStatuses({
    profile,
    userEmail: user.email ?? null,
  })
  const weekContext = getCurrentWeekContext()
  const weekRangeLabel =
    weekContext.weekNumber &&
    weekContext.weekStartDate &&
    weekContext.weekEndDate
      ? `Week ${weekContext.weekNumber}: ${new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(weekContext.weekStartDate)} - ${new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(weekContext.weekEndDate)}`
      : "Current week unavailable"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
        <span className="text-lg text-muted-foreground tabular-nums">
          {weekRangeLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {personalFormStatuses.map((form) => (
          <Card key={form.name} className="gap-0 py-4 shadow-sm">
            <CardHeader className="!flex flex-row items-start justify-between space-y-0 px-5 pb-2 pt-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {form.name} status
                </CardTitle>
                <p
                  className={`text-xl font-bold ${
                    form.status === "completed" ? "text-emerald-500" : "text-orange-500"
                  }`}
                >
                  {form.status === "completed" ? "Completed" : "Incomplete"}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  form.status === "completed" ? "bg-emerald-100" : "bg-orange-100"
                }`}
              >
                {form.status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <CircleX className="h-6 w-6 text-orange-600" />
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <PersonalActivityLog profile={profile} userEmail={user.email ?? null} />
    </div>
  )
}
