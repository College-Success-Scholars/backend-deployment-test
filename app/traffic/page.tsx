"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"
import { Clock, Timer, CheckCircle2, UserIcon } from "lucide-react"

type DurationChoice = 30 | 60 | 90 | "custom"

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "0 min"
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs <= 0) return `${mins} min`
  if (mins <= 0) return `${hrs} hr`
  return `${hrs} hr ${mins} min`
}

function formatEstimatedExit(minutes: number): string {
  if (!minutes || minutes <= 0) return "--:-- --"
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
  const [customHours, setCustomHours] = useState("")
  const [customMinutes, setCustomMinutes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const uidInputRef = useRef<HTMLInputElement>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Auto-focus the UID field on load
  useEffect(() => {
    uidInputRef.current?.focus()
  }, [])

  // Sync custom inputs to durationMin live
  useEffect(() => {
    if (durationChoice === "custom") {
      const totalMinutes = getCustomTotalMinutes(customHours, customMinutes)
      setDurationMin(totalMinutes)
    }
  }, [customHours, customMinutes, durationChoice])

  const validateUid = (): boolean => {
    if (!uid || uid.length !== 9 || !/^\d{9}$/.test(uid)) {
      setUidError("UID must be exactly 9 digits")
      uidInputRef.current?.focus()
      return false
    }
    setUidError("")
    return true
  }

  const handleSelectDuration = (choice: DurationChoice) => {
    setDurationChoice(choice)
    if (choice !== "custom") {
      setDurationMin(choice)
    } else {
      // If switching to custom, optionally pre-fill with current duration if it's already set
      if (durationMin > 0 && customHours === "" && customMinutes === "") {
        setCustomHours(Math.floor(durationMin / 60).toString())
        setCustomMinutes((durationMin % 60).toString())
      }
    }
  }

  const adjustCustomByMinutes = (delta: number) => {
    const currentTotal = getCustomTotalMinutes(customHours, customMinutes)
    const nextTotal = Math.max(0, Math.min(720, currentTotal + delta))
    const nextHours = Math.floor(nextTotal / 60)
    const nextMinutes = nextTotal % 60
    setCustomHours(String(nextHours))
    setCustomMinutes(String(nextMinutes))
  }

  const handleSubmitTraffic = async () => {
    if (!validateUid()) {
      return
    }

    if (durationMin <= 0 || durationMin > 720) {
      toast.error("Please select a valid duration between 1 minute and 12 hours.")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("traffic")
        .insert([
          {
            uid: uid,
            created_at: new Date().toISOString(),
            traffic_type: "entry",
            duration_min: durationMin,
          },
        ])

      if (error) {
        console.error("Error inserting traffic row:", error)
        toast.error("Failed to submit traffic entry. Please try again.")
        return
      }

      // Show large success overlay instead of toast
      setShowSuccess(true)

      // Reset form variables internally
      setUid("")
      setUidError("")
      setDurationChoice(60)
      setDurationMin(60)
      setCustomHours("")
      setCustomMinutes("")

      // Auto dismiss success screen after ~4 seconds
      setTimeout(() => {
        setShowSuccess(false)
        // Refocus input for next person
        setTimeout(() => uidInputRef.current?.focus(), 100)
      }, 1500)

    } catch (err) {
      console.error("Unexpected error:", err)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define Success Screen
  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-green-50/50">
        <Card className="w-full max-w-2xl border-0 shadow-2xl ring-1 ring-green-500/20 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-green-100 p-6 mb-6">
              <CheckCircle2 className="h-24 w-24 text-green-600 animate-in slide-in-from-bottom-4 duration-500 fade-in" />
            </div>
            <h2 className="text-4xl font-extrabold text-green-800 mb-2">Success!</h2>
            <p className="text-xl text-green-700/80 mb-8 font-medium">Your visit has been logged.</p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center w-full max-w-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-green-600/80 mb-2 flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" />
                Estimated exit
              </p>
              <p className="text-5xl font-extrabold tracking-tighter text-green-900 tabular-nums">
                {formatEstimatedExit(durationMin)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 lg:p-8 bg-muted/10">
      <Card className="w-full max-w-4xl border-0 shadow-2xl ring-1 ring-border/50">
        <CardHeader className="text-center pb-6 pt-10 border-b border-border/40">
          <CardTitle className="text-4xl font-black tracking-tight text-foreground">
            Marie Mount Hall
          </CardTitle>
          <p className="text-muted-foreground font-semibold text-sm mt-2 uppercase tracking-widest">
            Traffic Logger
          </p>
        </CardHeader>

        {/* Changed layout from single col max-w-md to a 2-col grid when on md/desktop screens */}
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">

            {/* LEFT COLUMN: Input Form */}
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="uid" className="text-sm font-semibold text-foreground/80">Student UID</Label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-primary">
                    <UserIcon className="h-5 w-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="uid"
                    ref={uidInputRef}
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    maxLength={9}
                    value={uid}
                    onChange={(e) => {
                      setUid(e.target.value.replace(/\D/g, ''))
                      setUidError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSubmitTraffic()
                      }
                    }}
                    placeholder="Type UID"
                    className={`h-14 pl-12 text-lg rounded-xl transition-all shadow-sm ${uidError ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50" : "bg-card"}`}
                  />
                </div>
                {uidError ? (
                  <p className="text-xs font-semibold text-red-500 ml-1">{uidError}</p>
                ) : (
                  <p className="text-xs font-medium text-muted-foreground ml-1">9-digit University ID</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-foreground/80">How long will you stay?</Label>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[{ label: '30 min', val: 30 }, { label: '1 hr', val: 60 }, { label: '1.5 hr', val: 90 }].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelectDuration(opt.val as DurationChoice)}
                      className={`flex h-20 flex-col items-center justify-center rounded-xl border-2 transition-all hover:bg-muted/50 active:scale-95 ${durationChoice === opt.val
                        ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card text-muted-foreground hover:border-border/80"
                        }`}
                    >
                      <Timer className={`mb-1.5 h-6 w-6 transition-transform ${durationChoice === opt.val ? "scale-110" : "opacity-60"}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{opt.label}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSelectDuration("custom")}
                    className={`flex h-20 flex-col items-center justify-center rounded-xl border-2 transition-all hover:bg-muted/50 active:scale-95 ${durationChoice === "custom"
                      ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-card text-muted-foreground hover:border-border/80"
                      }`}
                  >
                    <Clock className={`mb-1.5 h-6 w-6 transition-transform ${durationChoice === "custom" ? "scale-110" : "opacity-60"}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Custom</span>
                  </button>
                </div>

                {durationChoice === "custom" && (
                  <div className="my-3 space-y-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-inner animate-in slide-in-from-top-2 fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-primary/80">Custom Time Entry</Label>
                      <div className="flex gap-1.5">
                        <Button type="button" size="sm" variant="outline" className="h-7 cursor-pointer px-2 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => adjustCustomByMinutes(15)}>+15m</Button>
                        <Button type="button" size="sm" variant="outline" className="h-7 cursor-pointer px-2 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => adjustCustomByMinutes(30)}>+30m</Button>
                        <Button type="button" size="sm" variant="outline" className="h-7 cursor-pointer px-2 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => adjustCustomByMinutes(60)}>+1h</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Hours</Label>
                        <Input
                          type="number"
                          min={0}
                          max={12}
                          value={customHours}
                          onChange={(e) => setCustomHours(e.target.value)}
                          placeholder="0"
                          className="h-12 border-primary/20 bg-background/80 text-center text-xl font-bold rounded-lg shadow-sm focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Minutes</Label>
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(e.target.value)}
                          placeholder="0"
                          className="h-12 border-primary/20 bg-background/80 text-center text-xl font-bold rounded-lg shadow-sm focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Live Dashboard & Submit */}
            <div className="p-6 md:p-8 flex flex-col justify-between bg-muted/5">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className={`w-full max-w-sm flex flex-col items-center justify-center rounded-3xl py-12 px-6 text-center border-2 transition-all duration-300 ${durationMin > 0 ? "border-primary/20 bg-primary/5 shadow-inner" : "border-dashed border-border bg-muted/30"}`}>
                  {durationMin > 0 ? (
                    <>
                      <p className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Estimated exit
                      </p>
                      <p className="text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground tabular-nums">
                        {formatEstimatedExit(durationMin)}
                      </p>
                      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/60 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                        {formatDuration(durationMin)} stay
                      </p>
                    </>
                  ) : (
                    <>
                      <Timer className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-base font-medium text-muted-foreground">Select a duration to see exit time</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleSubmitTraffic}
                  disabled={isSubmitting || durationMin <= 0}
                  className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-xl font-bold shadow-lg transition-all active:scale-[0.98] rounded-2xl group disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                  size="lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <Timer className="h-6 w-6 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <CheckCircle2 className="h-7 w-7 group-hover:scale-110 transition-transform" /> Record Traffic
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 font-medium max-w-sm mx-auto">
                  By pressing Record Traffic, you verify your UID is correctly entered above.
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
