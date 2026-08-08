/**
 * @file team-leader-dashboard.tsx
 * @module frontend/components/dashboard
 *
 * Dashboard view for users with the team_leader role.
 * Shows a summary of mentee activity, form completion rates, session hours,
 * and other team leader-relevant KPIs. Rendered by app/dashboard/page.tsx.
 *
 * ## What belongs here
 * - Team leader-specific dashboard layout and data aggregation
 *
 * ## What does NOT belong here
 * - Scholar-only content (that's scholar-dashboard.tsx)
 * - Admin content (that's admin-dashboard.tsx)
 */
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck } from "lucide-react"

const overviewLinks = [
  {
    title: "Personal",
    href: "/dashboard/personal",
    description:
      "Track your WPL, MCF, and WAHF submission status, plus view your activity log.",
  },
  {
    title: "Mentees",
    href: "/dashboard/mentee",
    description:
      "Monitor your mentees' study sessions, front desk hours, tutoring, and WAHF status.",
  },
  {
    title: "Room Monitoring",
    href: "/dashboard/room",
    description:
      "View real-time room occupancy and scholar presence for study sessions and front desk duty.",
  },
  {
    title: "Weekly Memo",
    href: "/dashboard/memo",
    description:
      "Review the weekly memo: scholar follow-up, team leader form compliance, and attendance.",
  },
] as const

export function TeamLeaderDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Leader Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your team leader dashboard. Use the sidebar to navigate between different monitoring sections.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Team Leader
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>
            Get started with monitoring your team and personal progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <h3 className="mb-2 font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
