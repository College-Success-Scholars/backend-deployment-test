"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

interface StudySessionChartProps {
  completed: number
  total: number
}

export function StudySessionChart({ completed, total }: StudySessionChartProps) {
  const remaining = total - completed
  const percentage = Math.round((completed / total) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Study Session Hours
        </CardTitle>
        <CardDescription>
          Weekly study session progress and completion
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
              className="bg-green-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${percentage}%` }} 
            />
          </div>
          <div className="flex items-center justify-between text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{percentage}%</p>
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
