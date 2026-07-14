import { describe, it, expect } from "vitest"

import {
  assertNoMutedForegroundAntipattern,
  MUTED_FOREGROUND_ANTIPATTERN,
} from "./theme-safety.test-helpers"

describe("muted-foreground chip pairing", () => {
  it("rejects bg-*-muted with text-*-foreground", () => {
    expect(() =>
      assertNoMutedForegroundAntipattern(
        "border-warning/40 bg-warning-muted text-warning-foreground"
      )
    ).toThrow(/muted-foreground/)
  })

  it("allows bg-*-muted with text-*-muted-foreground", () => {
    expect(() =>
      assertNoMutedForegroundAntipattern(
        "border-warning/40 bg-warning-muted text-warning-muted-foreground"
      )
    ).not.toThrow()
  })

  it("matches reverse order of classes", () => {
    expect(
      MUTED_FOREGROUND_ANTIPATTERN.test(
        "text-success-foreground bg-success-muted"
      )
    ).toBe(true)
  })
})
