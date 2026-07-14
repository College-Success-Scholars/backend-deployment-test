"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicKey } from "@/lib/supabase/public-key"
import { toast } from "sonner"

import {
  TrafficCheckInForm,
  type DurationChoice,
} from "./_components/traffic-check-in-form"
import { TrafficSuccessScreen } from "./_components/traffic-success-screen"
import { getCustomTotalMinutes } from "./_components/traffic-format"

export default function TrafficPage() {
  const [uid, setUid] = useState("")
  const [uidError, setUidError] = useState("")
  const [durationChoice, setDurationChoice] = useState<DurationChoice>(60)
  const [durationMin, setDurationMin] = useState<number>(60)
  const [customHours, setCustomHours] = useState("")
  const [customMinutes, setCustomMinutes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  /** Submitted stay length for the success overlay only (form resets `durationMin` after submit). */
  const [successExitMinutes, setSuccessExitMinutes] = useState<number | null>(null)

  const uidInputRef = useRef<HTMLInputElement>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = getSupabasePublicKey()
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

  useEffect(() => {
    uidInputRef.current?.focus()
  }, [])

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
    } else if (durationMin > 0 && customHours === "" && customMinutes === "") {
      setCustomHours(Math.floor(durationMin / 60).toString())
      setCustomMinutes((durationMin % 60).toString())
    }
  }

  const adjustCustomByMinutes = (delta: number) => {
    const currentTotal = getCustomTotalMinutes(customHours, customMinutes)
    const nextTotal = Math.max(0, Math.min(720, currentTotal + delta))
    setCustomHours(String(Math.floor(nextTotal / 60)))
    setCustomMinutes(String(nextTotal % 60))
  }

  const handleSubmitTraffic = async () => {
    if (isSubmitting) return

    if (!validateUid()) {
      return
    }

    if (durationMin <= 0 || durationMin > 720) {
      toast.error("Please select a valid duration between 1 minute and 12 hours.")
      return
    }

    setIsSubmitting(true)
    try {
      if (!supabase) {
        toast.error("Supabase is not configured. Please check environment variables.")
        return
      }

      const { error } = await supabase.from("traffic").insert([
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

      setSuccessExitMinutes(durationMin)
      setShowSuccess(true)

      setUid("")
      setUidError("")
      setDurationChoice(60)
      setDurationMin(60)
      setCustomHours("")
      setCustomMinutes("")

      setTimeout(() => {
        setShowSuccess(false)
        setSuccessExitMinutes(null)
        setTimeout(() => uidInputRef.current?.focus(), 100)
      }, 1500)
    } catch (err) {
      console.error("Unexpected error:", err)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitRef = useRef(handleSubmitTraffic)
  useEffect(() => {
    submitRef.current = handleSubmitTraffic
  })

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLElement
        if (target.tagName === "INPUT") return
        if (target.tagName === "BUTTON" && target.textContent?.includes("Record Traffic"))
          return

        e.preventDefault()
        submitRef.current()
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  if (showSuccess) {
    return (
      <TrafficSuccessScreen exitMinutes={successExitMinutes ?? durationMin} />
    )
  }

  return (
    <TrafficCheckInForm
      uid={uid}
      uidError={uidError}
      uidInputRef={uidInputRef}
      durationChoice={durationChoice}
      durationMin={durationMin}
      customHours={customHours}
      customMinutes={customMinutes}
      isSubmitting={isSubmitting}
      onUidChange={(value) => {
        setUid(value)
        setUidError("")
      }}
      onSelectDuration={handleSelectDuration}
      onCustomHoursChange={setCustomHours}
      onCustomMinutesChange={setCustomMinutes}
      onAdjustCustomByMinutes={adjustCustomByMinutes}
      onSubmit={handleSubmitTraffic}
    />
  )
}
