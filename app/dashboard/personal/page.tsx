import { redirect } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  CircleX
} from "lucide-react"
import { getCurrentUserWithProfile } from "@/lib/supabase/server"
import {
  formatCampusWeekRangeLabel,
  getCurrentWeekContext,
  getCurrentWeekPersonalFormStatuses,
} from "./middleware"
import { PersonalActivityLogSection } from "./personal-activity-log-section"

function displayName(profile: {
  full_name: string | null
  first_name: string | null
  last_name: string | null
} | null): string {
  if (!profile) return "Unknown user"
  const full = profile.full_name?.trim()
  if (full) return full
  return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || "Unknown user"
}

function displayRole(role: string | null | undefined): string {
  const r = role?.trim()
  return r ? r : "—"
}

function displayTeams(teams: string[] | null | undefined): string {
  if (!teams || teams.length === 0) return "No team assigned"
  return teams.join(", ")
}

export default async function PersonalMonitoringPage() {
  const { user, profile } = await getCurrentUserWithProfile()
  if (!user) redirect("/auth/login")
  const personalFormStatuses = await getCurrentWeekPersonalFormStatuses({
    profile,
  })
  const weekContext = getCurrentWeekContext()
  const weekRangeLabel = formatCampusWeekRangeLabel(
    weekContext.weekStartDate,
    weekContext.weekEndDate,
    weekContext.weekNumber
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal </h1>
        <div className="mt-3 space-y-1 text-sm">

        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <p className="text-lg font-semibold">{weekRangeLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2">
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="h-10 w-10 rounded-full border border-border/60 bg-muted object-cover"
        />
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-muted-foreground">
            {displayRole(profile?.program_role)} · {displayTeams(profile?.teams)}
          </p>
        </div>
      </div>

      {/* Form Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {personalFormStatuses.map((form) => (
          <Card key={form.name} className="gap-0 py-4 shadow-sm">
            <CardHeader className="!flex flex-row items-start justify-between space-y-0 px-5 pb-2 pt-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {form.name} status
                </CardTitle>
                <p
                  className={`mt-1 text-3xl font-bold ${form.status === "completed" ? "text-emerald-500" : "text-orange-500"
                    }`}
                >
                  {form.status === "completed" ? "Completed" : "Incomplete"}
                </p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${form.status === "completed" ? "bg-emerald-100" : "bg-orange-100"
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

      <PersonalActivityLogSection profile={profile} />
    </div>
  )
}
