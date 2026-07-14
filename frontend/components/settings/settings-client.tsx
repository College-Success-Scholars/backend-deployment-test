"use client"

import { useEffect, useState } from "react"
import { User, GraduationCap, Briefcase, Users, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import {
  nextTotpFriendlyName,
  unenrollUnverifiedFactors,
} from "@/lib/supabase/mfa"
import type { ProfileRow, MenteeRow } from "@/lib/types/supabase"

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "program", label: "Program", icon: Briefcase },
  { id: "mentees", label: "Mentees", icon: Users },
  { id: "security", label: "Security", icon: Shield },
] as const

type TabId = (typeof TABS)[number]["id"]

export default function SettingsClient({
  profile,
  mentees,
}: {
  profile: ProfileRow
  mentees: MenteeRow[]
}) {
  const [activeTab, setActiveTab] = useState<TabId>("personal")

  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Profile"

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          {displayName} &middot; View your profile information
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
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
          {activeTab === "security" && <SecurityTab />}
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
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </h2>
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

function MenteesTab({ mentees }: { mentees: MenteeRow[] }) {
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

type FactorRow = { id: string; friendly_name?: string | null; status: string }

function SecurityTab() {
  const [factors, setFactors] = useState<FactorRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rotate, setRotate] = useState<{
    factorId: string
    qrCode: string
    secret: string
  } | null>(null)
  const [code, setCode] = useState("")

  async function refreshFactors() {
    const supabase = createClient()
    const { data, error: listError } = await supabase.auth.mfa.listFactors()
    if (listError) {
      setError(listError.message)
      setFactors([])
    } else {
      setFactors(data?.totp ?? [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    void refreshFactors()
  }, [])

  async function startRotation() {
    setBusy(true)
    setError(null)
    setMessage(null)
    const supabase = createClient()

    try {
      const cleaned = await unenrollUnverifiedFactors(
        () => supabase.auth.mfa.listFactors(),
        (args) => supabase.auth.mfa.unenroll(args),
      )
      if (cleaned.error) throw new Error(cleaned.error)

      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: nextTotpFriendlyName(),
      })
      if (enrollError || !enrollData) throw enrollError ?? new Error("Enrollment failed")

      setRotate({
        factorId: enrollData.id,
        qrCode: enrollData.totp.qr_code,
        secret: enrollData.totp.secret,
      })
      setCode("")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start rotation")
    } finally {
      setBusy(false)
    }
  }

  async function confirmRotation(e: React.FormEvent) {
    e.preventDefault()
    if (!rotate) return
    setBusy(true)
    setError(null)
    const supabase = createClient()

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: rotate.factorId })
      if (challenge.error) throw challenge.error

      const verify = await supabase.auth.mfa.verify({
        factorId: rotate.factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      })
      if (verify.error) throw verify.error

      const oldVerified = factors.filter(
        (f) => f.status === "verified" && f.id !== rotate.factorId,
      )
      for (const old of oldVerified) {
        await supabase.auth.mfa.unenroll({ factorId: old.id })
      }

      setRotate(null)
      setMessage("Authenticator updated. Use the new device for future sign-ins.")
      await refreshFactors()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code")
    } finally {
      setBusy(false)
    }
  }

  async function cancelRotation() {
    if (!rotate) return
    setBusy(true)
    const supabase = createClient()
    await supabase.auth.mfa.unenroll({ factorId: rotate.factorId })
    setRotate(null)
    setCode("")
    setBusy(false)
    setMessage("Rotation cancelled.")
    await refreshFactors()
  }

  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-6 space-y-6">
        <SectionHeading>Security</SectionHeading>
        <p className="text-sm text-muted-foreground">
          Multi-factor authentication is required and cannot be disabled. Rotate to a new
          authenticator if you change phones. Lost access entirely? Ask a developer to remove
          your factors in the Supabase Dashboard (see{" "}
          <span className="font-medium">docs/dev/supabase/mfa-reset.md</span>).
        </p>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading factors…</p>
        ) : factors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No authenticator enrolled.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {factors.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <span>{f.friendly_name || "Authenticator"}</span>
                <Badge variant="secondary">{f.status}</Badge>
              </li>
            ))}
          </ul>
        )}

        {rotate && (
          <form onSubmit={(e) => void confirmRotation(e)} className="space-y-4 rounded-md border p-4">
            <p className="text-sm font-medium">Scan with your new authenticator app</p>
            <div
              className="mx-auto max-w-[200px] [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: rotate.qrCode }}
            />
            <p className="text-xs text-muted-foreground break-all">
              Secret: <span className="font-mono">{rotate.secret}</span>
            </p>
            <div className="grid gap-2">
              <Label htmlFor="rotate-code">New device code</Label>
              <Input
                id="rotate-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Verifying…" : "Confirm new authenticator"}
              </Button>
              <Button type="button" variant="secondary" disabled={busy} onClick={() => void cancelRotation()}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        {!rotate && (
          <Button type="button" disabled={busy} onClick={() => void startRotation()}>
            {busy ? "Working…" : "Rotate authenticator"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
