export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "0 min"
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs <= 0) return `${mins} min`
  if (mins <= 0) return `${hrs} hr`
  return `${hrs} hr ${mins} min`
}

export function formatEstimatedExit(
  minutes: number,
  /** Wall clock to project from; pass a ticking value so kiosk UI stays current. */
  now: Date | number = Date.now()
): string {
  if (!minutes || minutes <= 0) return "--:-- --"
  const baseMs = typeof now === "number" ? now : now.getTime()
  const estimated = new Date(baseMs + minutes * 60 * 1000)
  return estimated.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function getCustomTotalMinutes(hours: string, minutes: string): number {
  return Number(hours || 0) * 60 + Number(minutes || 0)
}
