"use client"

import type { RefObject } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Clock, Timer, CheckCircle2, UserIcon } from "lucide-react"

import { formatDuration, formatEstimatedExit } from "./traffic-format"

export type DurationChoice = 30 | 60 | 90 | "custom"

export type TrafficCheckInFormProps = {
  uid: string
  uidError: string
  uidInputRef: RefObject<HTMLInputElement | null>
  durationChoice: DurationChoice
  durationMin: number
  customHours: string
  customMinutes: string
  isSubmitting: boolean
  onUidChange: (value: string) => void
  onSelectDuration: (choice: DurationChoice) => void
  onCustomHoursChange: (value: string) => void
  onCustomMinutesChange: (value: string) => void
  onAdjustCustomByMinutes: (delta: number) => void
  onSubmit: () => void
}

export function TrafficCheckInForm({
  uid,
  uidError,
  uidInputRef,
  durationChoice,
  durationMin,
  customHours,
  customMinutes,
  isSubmitting,
  onUidChange,
  onSelectDuration,
  onCustomHoursChange,
  onCustomMinutesChange,
  onAdjustCustomByMinutes,
  onSubmit,
}: TrafficCheckInFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 p-4 lg:p-8 dark:bg-background">
      <Card className="w-full max-w-4xl border-0 shadow-2xl ring-1 ring-border/50">
        <CardHeader className="border-b border-border/40 pb-6 pt-10 text-center">
          <CardTitle className="text-4xl font-black tracking-tight text-foreground">
            Marie Mount Hall
          </CardTitle>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Traffic Logger
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-border/40 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="space-y-8 p-6 md:p-8">
              <div className="space-y-3">
                <Label htmlFor="uid" className="text-sm font-semibold text-foreground/80">
                  Student UID
                </Label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-primary">
                    <UserIcon className="h-5 w-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="uid"
                    ref={uidInputRef}
                    suppressHydrationWarning
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    maxLength={9}
                    value={uid}
                    onChange={(e) => onUidChange(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        onSubmit()
                      }
                    }}
                    placeholder="Type UID"
                    className={`h-14 rounded-xl pl-12 text-lg shadow-sm ${
                      uidError
                        ? "border-destructive bg-destructive/10 focus-visible:ring-destructive"
                        : "bg-card"
                    }`}
                  />
                </div>
                {uidError ? (
                  <p className="ml-1 text-xs font-semibold text-destructive">{uidError}</p>
                ) : (
                  <p className="ml-1 text-xs font-medium text-muted-foreground">
                    9-digit University ID
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-foreground/80">
                  How long will you stay?
                </Label>

                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {(
                    [
                      { label: "30 min", val: 30 as const },
                      { label: "1 hr", val: 60 as const },
                      { label: "1.5 hr", val: 90 as const },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => onSelectDuration(opt.val)}
                      className={`flex h-20 flex-col items-center justify-center rounded-xl border-2 transition-transform hover:bg-muted/50 active:scale-95 ${
                        durationChoice === opt.val
                          ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <Timer
                        className={`mb-1.5 h-6 w-6 transition-transform ${
                          durationChoice === opt.val ? "scale-110" : "opacity-60"
                        }`}
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => onSelectDuration("custom")}
                    className={`flex h-20 flex-col items-center justify-center rounded-xl border-2 transition-transform hover:bg-muted/50 active:scale-95 ${
                      durationChoice === "custom"
                        ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <Clock
                      className={`mb-1.5 h-6 w-6 transition-transform ${
                        durationChoice === "custom" ? "scale-110" : "opacity-60"
                      }`}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Custom
                    </span>
                  </button>
                </div>

                {durationChoice === "custom" && (
                  <div className="my-3 animate-in fade-in-50 slide-in-from-top-2 space-y-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-inner duration-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-primary/80">
                        Custom Time Entry
                      </Label>
                      <div className="flex gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 cursor-pointer px-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => onAdjustCustomByMinutes(15)}
                        >
                          +15m
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 cursor-pointer px-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => onAdjustCustomByMinutes(30)}
                        >
                          +30m
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 cursor-pointer px-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => onAdjustCustomByMinutes(60)}
                        >
                          +1h
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Hours
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={12}
                          value={customHours}
                          onChange={(e) => onCustomHoursChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              onCustomHoursChange(e.currentTarget.value)
                              setTimeout(() => onSubmit(), 50)
                            }
                          }}
                          placeholder="0"
                          className="h-12 rounded-lg border-primary/20 bg-background/80 text-center text-xl font-bold shadow-sm focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Minutes
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          value={customMinutes}
                          onChange={(e) => onCustomMinutesChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              onCustomMinutesChange(e.currentTarget.value)
                              setTimeout(() => onSubmit(), 50)
                            }
                          }}
                          placeholder="0"
                          className="h-12 rounded-lg border-primary/20 bg-background/80 text-center text-xl font-bold shadow-sm focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between bg-muted/5 p-6 md:p-8">
              <div className="flex flex-1 flex-col items-center justify-center">
                <div
                  className={`flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border-2 px-6 py-12 text-center ${
                    durationMin > 0
                      ? "border-primary/20 bg-primary/5 shadow-inner"
                      : "border-dashed border-border bg-muted/30"
                  }`}
                >
                  {durationMin > 0 ? (
                    <>
                      <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/80">
                        <Clock className="h-5 w-5" />
                        Estimated exit
                      </p>
                      <p
                        className="text-6xl font-extrabold tracking-tighter text-foreground tabular-nums lg:text-7xl"
                        suppressHydrationWarning
                      >
                        {formatEstimatedExit(durationMin)}
                      </p>
                      <p className="mt-6 rounded-full border border-border/50 bg-background/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                        {formatDuration(durationMin)} stay
                      </p>
                    </>
                  ) : (
                    <>
                      <Timer className="mb-4 h-12 w-12 text-muted-foreground/30" />
                      <p className="text-base font-medium text-muted-foreground">
                        Select a duration to see exit time
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting || durationMin <= 0}
                  className="group h-16 w-full rounded-2xl bg-success text-xl font-bold text-success-foreground shadow-lg transition-transform hover:bg-success/90 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                  size="lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <Timer className="h-6 w-6 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <CheckCircle2 className="h-7 w-7 transition-transform group-hover:scale-110" />{" "}
                      Record Traffic
                    </span>
                  )}
                </Button>
                <p className="mx-auto mt-4 max-w-sm text-center text-xs font-medium text-muted-foreground">
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
