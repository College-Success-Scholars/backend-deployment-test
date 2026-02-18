"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, User } from "lucide-react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TutoringSession {
  id: string
  course: string
  tutorName: string
  date: string
  duration: number // in minutes
  topic?: string
}

interface TutoringHoursProps {
  menteeName: string
  sessions: TutoringSession[]
}

export function TutoringHours({ menteeName, sessions }: TutoringHoursProps) {
  // Calculate total hours
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal place

  // Group sessions by course for summary
  const courseSummary = sessions.reduce((acc, session) => {
    if (!acc[session.course]) {
      acc[session.course] = {
        course: session.course,
        totalMinutes: 0,
        sessionCount: 0,
        tutors: new Set<string>()
      }
    }
    acc[session.course].totalMinutes += session.duration
    acc[session.course].sessionCount += 1
    acc[session.course].tutors.add(session.tutorName)
    return acc
  }, {} as Record<string, { course: string; totalMinutes: number; sessionCount: number; tutors: Set<string> }>)

  const courseSummaries = Object.values(courseSummary).map(course => ({
    ...course,
    totalHours: Math.round((course.totalMinutes / 60) * 10) / 10,
    tutorNames: Array.from(course.tutors).join(", ")
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Tutoring Hours
        </CardTitle>
        <CardDescription>
          Tutoring sessions attended by {menteeName} this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex justify-between gap-4">
            <div className="flex-1 text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalHours}</div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
            <div className="flex-1 text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>

          {/* Course Summary */}
          {courseSummaries.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                By Course
              </h4>
              <div className="space-y-2">
                {courseSummaries.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{course.course}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.sessionCount} session{course.sessionCount !== 1 ? 's' : ''} • {course.tutorNames}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{course.totalHours}h</p>
                      <p className="text-xs text-muted-foreground">total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Sessions Table */}
          {sessions.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session Details
              </h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Topic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            {session.course}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {session.tutorName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {Math.round((session.duration / 60) * 10) / 10}h
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {session.topic || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tutoring sessions this week</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
