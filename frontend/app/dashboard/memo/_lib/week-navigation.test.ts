import { describe, expect, it } from "vitest"

import { computeWeekNavigation, parseWeekParam } from "./week-navigation"

describe("parseWeekParam", () => {
  it("returns null for missing or invalid values", () => {
    expect(parseWeekParam(undefined)).toBeNull()
    expect(parseWeekParam("")).toBeNull()
    expect(parseWeekParam("abc")).toBeNull()
    expect(parseWeekParam("0")).toBeNull()
  })

  it("returns positive integers for valid week params", () => {
    expect(parseWeekParam("5")).toBe(5)
    expect(parseWeekParam("12")).toBe(12)
  })
})

describe("computeWeekNavigation", () => {
  it("builds sparse available weeks from traffic, selected, and current campus week", () => {
    const result = computeWeekNavigation({
      trafficWeeklyData: [{ weekNumber: 4 }, { weekNumber: 6 }],
      selectedWeekNum: 5,
      currentCampusWeek: 7,
    })

    expect(result.availableWeeks).toEqual([4, 5, 6, 7])
    expect(result.prevWeek).toBe(4)
    expect(result.nextWeek).toBe(6)
  })

  it("uses current campus week as next when beyond traffic weeks", () => {
    const result = computeWeekNavigation({
      trafficWeeklyData: [{ weekNumber: 5 }],
      selectedWeekNum: 6,
      currentCampusWeek: 7,
    })

    expect(result.availableWeeks).toEqual([5, 6, 7])
    expect(result.prevWeek).toBe(5)
    expect(result.nextWeek).toBe(7)
  })

  it("returns null prev/next at list boundaries", () => {
    const first = computeWeekNavigation({
      trafficWeeklyData: [{ weekNumber: 3 }],
      selectedWeekNum: 3,
      currentCampusWeek: 5,
    })
    expect(first.prevWeek).toBeNull()
    expect(first.nextWeek).toBe(5)

    const last = computeWeekNavigation({
      trafficWeeklyData: [{ weekNumber: 3 }],
      selectedWeekNum: 5,
      currentCampusWeek: 5,
    })
    expect(last.prevWeek).toBe(3)
    expect(last.nextWeek).toBeNull()
  })
})
