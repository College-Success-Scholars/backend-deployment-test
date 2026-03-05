"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

type DurationChoice = 30 | 60 | 90 | "custom"

function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs <= 0) return `${mins} min`
  if (mins <= 0) return `${hrs} hr`
  return `${hrs} hr ${mins} min`
}

function formatEstimatedExit(minutes: number): string {
  const estimated = new Date(Date.now() + minutes * 60 * 1000)
  return estimated.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function getCustomTotalMinutes(hours: string, minutes: string): number {
  return Number(hours || 0) * 60 + Number(minutes || 0)
}

export default function TrafficPage() {
  const [uid, setUid] = useState("")
  const [uidError, setUidError] = useState("")
  const [durationChoice, setDurationChoice] = useState<DurationChoice>(60)
  const [durationMin, setDurationMin] = useState<number>(60)
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [customHours, setCustomHours] = useState("")
  const [customMinutes, setCustomMinutes] = useState("")
  const [customError, setCustomError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey)

  const validateUid = (): boolean => {
    if (!uid || uid.length !== 9 || !/^\d{9}$/.test(uid)) {
      setUidError("UID must be exactly 9 digits")
      return false
    }
    setUidError("")
    return true
  }

  const handleSelectDuration = (choice: DurationChoice) => {
    setDurationChoice(choice)
    if (choice === "custom") {
      setIsCustomOpen(true)
      return
    }
    setDurationMin(choice)
  }

  const handleApplyCustom = () => {
    const hoursNum = Number(customHours || 0)
    const minutesNum = Number(customMinutes || 0)
    if (!Number.isFinite(hoursNum) || !Number.isFinite(minutesNum)) {
      setCustomError("Enter valid numbers for hours and minutes.")
      return
    }
    if (hoursNum < 0 || minutesNum < 0 || minutesNum > 59) {
      setCustomError("Hours must be 0+ and minutes must be 0 to 59.")
      return
    }
    const totalMinutes = hoursNum * 60 + minutesNum
    if (totalMinutes <= 0 || totalMinutes > 720) {
      setCustomError("Custom duration must be between 1 and 720 minutes.")
      return
    }

    setDurationMin(totalMinutes)
    setDurationChoice("custom")
    setCustomError("")
    setIsCustomOpen(false)
  }

  const adjustCustomByMinutes = (delta: number) => {
    const currentTotal = getCustomTotalMinutes(customHours, customMinutes)
    const nextTotal = Math.max(0, Math.min(720, currentTotal + delta))
    const nextHours = Math.floor(nextTotal / 60)
    const nextMinutes = nextTotal % 60
    setCustomHours(String(nextHours))
    setCustomMinutes(String(nextMinutes))
    setCustomError("")
  }

  const closeCustomModal = () => {
    setIsCustomOpen(false)
    setCustomError("")
    if (durationMin === 30 || durationMin === 60 || durationMin === 90) {
      setDurationChoice(durationMin)
      return
    }
    setDurationChoice("custom")
  }

  const handleSubmitTraffic = async () => {
    if (!validateUid()) {
      return
    }

    if (durationMin <= 0) {
      toast.error("Choose a valid duration.")
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("traffic")
        .insert([
          {
            uid: uid,
            created_at: new Date().toISOString(),
            traffic_type: "entry",
            duration_min: durationMin,
          },
        ])
        .select()

      if (error) {
        console.error("Error inserting traffic row:", error)
        toast.error("Failed to submit traffic entry")
        return
      }

      console.log(data)
      toast.success(
        `Submitted ${formatDuration(durationMin)}. Estimated exit: ${formatEstimatedExit(durationMin)}`
      )
      setUid("")
      setUidError("")
      setDurationChoice(60)
      setDurationMin(60)
      setCustomHours("")
      setCustomMinutes("")
      setCustomError("")
    } catch (err) {
      console.error("Unexpected error:", err)
      toast.error("Failed to submit traffic entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const customTotalMinutes = getCustomTotalMinutes(customHours, customMinutes)
  const canApplyCustom =
    customTotalMinutes > 0 &&
    customTotalMinutes <= 720 &&
    Number(customHours || 0) >= 0 &&
    Number(customMinutes || 0) >= 0 &&
    Number(customMinutes || 0) <= 59

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Marie Mount Hall Traffic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="uid">UID</Label>
            <Input
              id="uid"
              type="text"
              value={uid}
              onChange={(e) => {
                setUid(e.target.value)
                setUidError("")
              }}
              placeholder="Enter UID"
              className={uidError ? "border-red-500" : ""}
            />
            {uidError && (
              <p className="text-sm text-red-500">{uidError}</p>
            )}
            {!uidError && (
              <p className="text-sm text-muted-foreground">UID must be exactly 9 digits</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Estimated Duration</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={durationChoice === 30 ? "default" : "outline"}
                onClick={() => handleSelectDuration(30)}
              >
                30 min
              </Button>
              <Button
                type="button"
                variant={durationChoice === 60 ? "default" : "outline"}
                onClick={() => handleSelectDuration(60)}
              >
                60 min
              </Button>
              <Button
                type="button"
                variant={durationChoice === 90 ? "default" : "outline"}
                onClick={() => handleSelectDuration(90)}
              >
                90 min
              </Button>
              <Button
                type="button"
                variant={durationChoice === "custom" ? "default" : "outline"}
                onClick={() => handleSelectDuration("custom")}
              >
                Custom
              </Button>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-sm font-medium">Selected: {formatDuration(durationMin)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Estimated exit: {formatEstimatedExit(durationMin)}
              </p>
            </div>
          </div>

          <div>
            <Button
              onClick={handleSubmitTraffic}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white hover:cursor-pointer hover:bg-green-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Custom Duration</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter how long you scholar plans to stay.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="custom-hours">Hours</Label>
                <Input
                  id="custom-hours"
                  type="number"
                  min={0}
                  max={12}
                  value={customHours}
                  onChange={(e) => {
                    setCustomHours(e.target.value)
                    setCustomError("")
                  }}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-minutes">Minutes</Label>
                <Input
                  id="custom-minutes"
                  type="number"
                  min={0}
                  max={59}
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value)
                    setCustomError("")
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              <Button type="button" variant="outline" onClick={() => adjustCustomByMinutes(15)}>
                +15m
              </Button>
              <Button type="button" variant="outline" onClick={() => adjustCustomByMinutes(30)}>
                +30m
              </Button>
              <Button type="button" variant="outline" onClick={() => adjustCustomByMinutes(60)}>
                +60m
              </Button>
              <Button type="button" variant="outline" onClick={() => adjustCustomByMinutes(90)}>
                +90m
              </Button>
            </div>

            {customError ? (
              <p className="mt-3 text-sm text-red-500">{customError}</p>
            ) : (
              <div className="mt-3 rounded-md border bg-muted/30 p-3">
                <p className="text-sm font-medium">Total: {formatDuration(customTotalMinutes)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated exit: {formatEstimatedExit(customTotalMinutes)}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeCustomModal}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleApplyCustom} disabled={!canApplyCustom}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
