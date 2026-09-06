import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, UserCheck, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export function RoomSummaryCards({
  totalPresent,
  studyCount,
  frontDeskCount,
}: {
  totalPresent: number
  studyCount: number
  frontDeskCount: number
}) {
  const cards: {
    title: string
    value: number
    description: string
    icon: LucideIcon
  }[] = [
    {
      title: "Total Present",
      value: totalPresent,
      description: "Scholars currently in the building",
      icon: Users,
    },
    {
      title: "Study Session",
      value: studyCount,
      description: "In study session room",
      icon: BookOpen,
    },
    {
      title: "Front Desk",
      value: frontDeskCount,
      description: "Currently assigned to front desk",
      icon: UserCheck,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ title, value, description, icon: Icon }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
