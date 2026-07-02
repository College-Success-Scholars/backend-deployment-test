export type WeekNavigationInput = {
  trafficWeeklyData: { weekNumber: number }[]
  selectedWeekNumber: number
  currentCampusWeek: number | null
}

export type WeekNavigation = {
  availableWeeks: number[]
  prevWeek: number | null
  nextWeek: number | null
}

export function parseWeekParam(weekParam?: string): number | null {
  if (!weekParam || !/^\d+$/.test(weekParam)) return null
  const weekNumber = Number(weekParam)
  return weekNumber > 0 ? weekNumber : null
}

export function computeWeekNavigation(input: WeekNavigationInput): WeekNavigation {
  const availableWeeks = Array.from(
    new Set([
      ...input.trafficWeeklyData.map((entry) => entry.weekNumber),
      input.selectedWeekNumber,
      ...(input.currentCampusWeek != null ? [input.currentCampusWeek] : []),
    ])
  ).sort((a, b) => a - b)

  const weekIndex = availableWeeks.indexOf(input.selectedWeekNumber)
  const prevWeek = weekIndex > 0 ? availableWeeks[weekIndex - 1] : null
  const nextWeek = weekIndex >= 0 && weekIndex < availableWeeks.length - 1 ? availableWeeks[weekIndex + 1] : null

  return { availableWeeks, prevWeek, nextWeek }
}
