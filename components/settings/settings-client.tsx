"use client"

import { useState } from "react"
import { User, GraduationCap, Briefcase, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProfileRow, GetMyMenteesRpcRow } from "@/lib/types/supabase"

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "program", label: "Program", icon: Briefcase },
  { id: "mentees", label: "Mentees", icon: Users },
] as const

type TabId = (typeof TABS)[number]["id"]

export default function SettingsClient({
  profile,
  mentees,
}: {
  profile: ProfileRow
  mentees: GetMyMenteesRpcRow[]
}) {
  const [activeTab, setActiveTab] = useState<TabId>("personal")

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your current profile information.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav
          role="tablist"
          aria-label="Settings sections"
          className="flex sm:flex-col gap-1 sm:w-48 shrink-0"
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="settings-panel"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer text-left ${
                  selected
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div
          id="settings-panel"
          role="tabpanel"
          aria-label={TABS.find((t) => t.id === activeTab)?.label}
          className="flex-1 min-w-0"
        >
          {activeTab === "personal" && <PersonalTab profile={profile} />}
          {activeTab === "academic" && <AcademicTab profile={profile} />}
          {activeTab === "program" && <ProgramTab profile={profile} />}
          {activeTab === "mentees" && <MenteesTab mentees={mentees} />}
        </div>
      </div>
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input disabled value={value ?? "—"} />
    </div>
  )
}

function TagList({ label, items }: { label: string; items: string[] | null | undefined }) {
  const list = items?.filter(Boolean) ?? []
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {list.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {list.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </h2>
      <Separator />
    </div>
  )
}

function PersonalTab({ profile }: { profile: ProfileRow }) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-6 space-y-6">
        <SectionHeading>Personal Info</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="First name" value={profile.first_name} />
          <ReadonlyField label="Last name" value={profile.last_name} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="Phone number" value={profile.phone_number} />
          <ReadonlyField label="Student ID" value={profile.student_id} />
        </div>

        <TagList label="Email addresses" items={profile.emails} />
      </CardContent>
    </Card>
  )
}

function AcademicTab({ profile }: { profile: ProfileRow }) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-6 space-y-6">
        <SectionHeading>Academic Info</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="Cohort" value={profile.cohort} />
        </div>

        <TagList label="Majors" items={profile.majors} />
        <TagList label="Minors" items={profile.minors} />
      </CardContent>
    </Card>
  )
}

function ProgramTab({ profile }: { profile: ProfileRow }) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-6 space-y-6">
        <SectionHeading>Program Info</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="Status" value={profile.status} />
          <ReadonlyField label="App role" value={profile.app_role} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="Program role" value={profile.program_role} />
          <ReadonlyField label="Mentee count" value={profile.mentee_count} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadonlyField label="FD sessions required" value={profile.fd_required} />
          <ReadonlyField label="SS sessions required" value={profile.ss_required} />
        </div>

        <TagList label="Teams" items={profile.teams} />
      </CardContent>
    </Card>
  )
}

function MenteesTab({ mentees }: { mentees: GetMyMenteesRpcRow[] }) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-6 space-y-6">
        <SectionHeading>Assigned Mentees</SectionHeading>

        <p className="text-sm text-muted-foreground">
          {mentees.length} {mentees.length === 1 ? "mentee" : "mentees"}
        </p>

        {mentees.length === 0 ? (
          <p className="text-sm text-muted-foreground">No mentees assigned.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">FD Required</TableHead>
                  <TableHead className="text-right">SS Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentees.map((m) => (
                  <TableRow key={m.scholar_uid}>
                    <TableCell className="font-medium">
                      {[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {m.fd_required ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {m.ss_required ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
