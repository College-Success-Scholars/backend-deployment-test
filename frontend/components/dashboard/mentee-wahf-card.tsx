"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface MenteeWahfCardProps {
  menteeName: string
  formTitle?: string
  dueDate: string
  submitted: boolean
  daysOverdue?: number
}

export function MenteeWahfCard({
  menteeName,
  formTitle = "Weekly Academic Honors Form",
  dueDate,
  submitted,
  daysOverdue,
}: MenteeWahfCardProps) {
  const alertState = !submitted && daysOverdue != null && daysOverdue > 0

  return (
    <Card
      className={cn(
        "h-full min-h-0 flex-col justify-start py-0",
        alertState && "border-destructive/50"
      )}
    >
      <CardContent className="flex flex-1 flex-col justify-start space-y-4 pt-4 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          WAHF submission
        </p>
        <div
          className={cn(
            "rounded-lg border p-4",
            alertState
              ? "border-destructive/30 bg-destructive/10"
              : "border-border bg-muted/40"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p
                className={cn(
                  "font-semibold",
                  alertState ? "text-destructive" : "text-foreground"
                )}
              >
                {formTitle}
              </p>
              <p
                className={cn(
                  "text-sm",
                  alertState ? "text-destructive/90" : "text-muted-foreground"
                )}
              >
                Due {dueDate}
                {alertState && daysOverdue != null ? (
                  <> &middot; {daysOverdue} days overdue</>
                ) : null}
              </p>
            </div>
            <Badge variant={submitted ? "default" : "destructive"} className="shrink-0">
              {submitted ? "Submitted" : "Not submitted"}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {submitted
            ? `${menteeName} is up to date on this form.`
            : `Follow up with ${menteeName} to submit this form immediately.`}
        </p>
      </CardContent>
    </Card>
  )
}
