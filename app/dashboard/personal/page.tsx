import { redirect } from "next/navigation"
import { 
  CheckCircle2,
  CircleX
} from "lucide-react"
import { getCurrentUserWithProfilesRow } from "@/lib/supabase/server"
import {
  getCurrentWeekPersonalFormStatuses,
} from "@/lib/server/personal-monitoring"
import { PersonalActivityLog } from "@/components/dashboard/personal-activity-log"

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
  const { user, profile } = await getCurrentUserWithProfilesRow()
  if (!user) redirect("/auth/login")
  const name = displayName(profile)
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`
  const personalFormStatuses = await getCurrentWeekPersonalFormStatuses({
    profile,
    userEmail: user.email ?? null,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Monitoring</h1>
        <p className="text-muted-foreground">
          Track your personal progress, form submissions, and activities
        </p>
        <div className="mt-3 space-y-1 text-sm">
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
        </div>
      </div>

      {/* Form Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {personalFormStatuses.map((form) => (
          <div key={form.name} className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-semibold leading-none text-foreground">{form.name} Status</p>
                <p
                  className={`mt-1 text-3xl font-bold ${
                    form.status === "completed" ? "text-emerald-500" : "text-orange-500"
                  }`}
                >
                  {form.status === "completed" ? "Completed" : "Incomplete"}
                </p>
                <p className="mt-2 text-2xl text-muted-foreground">{form.detail}</p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  form.status === "completed" ? "bg-emerald-100" : "bg-orange-100"
                }`}
              >
                {form.status === "completed" ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                ) : (
                  <CircleX className="h-8 w-8 text-orange-600" />
                )}
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${
                  form.status === "completed" ? "w-full bg-emerald-500" : "w-1/2 bg-orange-500"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <PersonalActivityLog profile={profile} userEmail={user.email ?? null} />
    </div>
  )
}
