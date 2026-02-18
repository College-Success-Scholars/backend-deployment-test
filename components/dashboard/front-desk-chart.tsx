"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck } from "lucide-react"

interface FrontDeskChartProps {
  completed: number
  total: number
}

export function FrontDeskChart({ completed, total }: FrontDeskChartProps) {
  const remaining = total - completed
  const percentage = Math.round((completed / total) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Front Desk Hours
        </CardTitle>
        <CardDescription>
          Weekly front desk duty progress and completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Hours</span>
            <span className="text-sm text-muted-foreground">{completed}/{total} completed</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${percentage}%` }} 
            />
          </div>
          <div className="flex items-center justify-between text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{remaining}</p>
              <p className="text-xs text-muted-foreground">Hours Left</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
