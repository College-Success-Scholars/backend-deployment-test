/**
 * @file use-minute-now.ts
 * @module frontend/hooks
 *
 * Returns a Date that updates once per wall-clock minute (aligned to :00).
 * Used by long-lived kiosk UIs so "now + duration" labels stay current.
 */
"use client"

import { useEffect, useState } from "react"

const MINUTE_MS = 60_000

function msUntilNextMinute(fromMs: number = Date.now()): number {
  return MINUTE_MS - (fromMs % MINUTE_MS)
}

/**
 * Live "now" that ticks at each wall-clock minute boundary.
 * First update waits until the next minute, then every 60s thereafter.
 */
export function useMinuteNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined

    const timeoutId = setTimeout(() => {
      setNow(new Date())
      intervalId = setInterval(() => setNow(new Date()), MINUTE_MS)
    }, msUntilNextMinute())

    return () => {
      clearTimeout(timeoutId)
      if (intervalId !== undefined) clearInterval(intervalId)
    }
  }, [])

  return now
}
