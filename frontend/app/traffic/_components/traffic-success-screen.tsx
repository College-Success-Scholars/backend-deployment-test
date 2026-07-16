"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock } from "lucide-react"

import { formatEstimatedExit } from "./traffic-format"

export function TrafficSuccessScreen({
  exitMinutes,
}: {
  exitMinutes: number
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-success-muted/50 p-4">
      <Card className="w-full max-w-2xl border-0 bg-card shadow-2xl ring-1 ring-success/20">
        <CardContent className="flex animate-in zoom-in-95 flex-col items-center justify-center py-20 duration-300">
          <div className="mb-6 rounded-full bg-success-muted p-6">
            <CheckCircle2 className="h-24 w-24 animate-in fade-in slide-in-from-bottom-4 text-success duration-500" />
          </div>
          <h2 className="mb-2 text-4xl font-extrabold text-success">Success!</h2>
          <p className="mb-8 text-xl font-medium text-success/80">
            Your visit has been logged.
          </p>

          <div className="w-full max-w-sm rounded-2xl border border-success/30 bg-success-muted p-8 text-center">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-widest text-success/80">
              <Clock className="h-4 w-4" />
              Estimated exit
            </p>
            <p
              className="text-5xl font-extrabold tracking-tighter text-foreground tabular-nums"
              suppressHydrationWarning
            >
              {formatEstimatedExit(exitMinutes)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
