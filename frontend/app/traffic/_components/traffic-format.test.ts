import { describe, it, expect } from "vitest"

import {
  formatDuration,
  formatEstimatedExit,
  getCustomTotalMinutes,
} from "./traffic-format"

describe("traffic-format", () => {
  it("formatDuration covers hours and minutes", () => {
    expect(formatDuration(0)).toBe("0 min")
    expect(formatDuration(45)).toBe("45 min")
    expect(formatDuration(60)).toBe("1 hr")
    expect(formatDuration(90)).toBe("1 hr 30 min")
  })

  it("formatEstimatedExit projects from an explicit clock", () => {
    const base = new Date(2024, 5, 15, 14, 0, 0)
    const expected = new Date(base.getTime() + 60 * 60 * 1000).toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "2-digit" }
    )
    expect(formatEstimatedExit(60, base)).toBe(expected)
    expect(formatEstimatedExit(0, base)).toBe("--:-- --")
  })

  it("getCustomTotalMinutes sums hours and minutes", () => {
    expect(getCustomTotalMinutes("1", "30")).toBe(90)
    expect(getCustomTotalMinutes("", "")).toBe(0)
  })
})
