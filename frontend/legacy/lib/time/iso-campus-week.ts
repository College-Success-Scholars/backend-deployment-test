import { startOfISOWeek } from "date-fns"
import { dateToCampusWeek } from "./campus-week"

/**
 * Maps an ISO week number (relative to the current calendar week) to a campus week number.
 * Used for form deadlines and status that are keyed by campus week.
 */
export function getCampusWeekForIsoWeek(
  isoWeek: number,
  currentIsoWeek: number,
): number | null {
  const now = new Date()
  const ref = startOfISOWeek(now)
  const diff = isoWeek - currentIsoWeek
  const targetDate = new Date(ref.getTime() + diff * 7 * 24 * 60 * 60 * 1000)
  return dateToCampusWeek(targetDate)
}
