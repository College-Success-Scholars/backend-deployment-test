import React, { createRef } from "react"
import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import {
  assertNoColorTransitionAll,
  assertThemeSafeMarkup,
} from "@/lib/theme/theme-safety.test-helpers"
import { TrafficCheckInForm } from "./traffic-check-in-form"

const baseProps = {
  uid: "123456789",
  uidError: "",
  uidInputRef: createRef<HTMLInputElement>(),
  durationChoice: 60 as const,
  durationMin: 60,
  customHours: "",
  customMinutes: "",
  isSubmitting: false,
  onUidChange: vi.fn(),
  onSelectDuration: vi.fn(),
  onCustomHoursChange: vi.fn(),
  onCustomMinutesChange: vi.fn(),
  onAdjustCustomByMinutes: vi.fn(),
  onSubmit: vi.fn(),
}

describe("TrafficCheckInForm theme safety", () => {
  it("avoids palette greens, bg-white, and transition-all on themed surfaces", () => {
    const markup = renderToStaticMarkup(<TrafficCheckInForm {...baseProps} />)
    assertThemeSafeMarkup(markup, "TrafficCheckInForm")
    assertNoColorTransitionAll(markup, "TrafficCheckInForm")
    expect(markup).toContain("bg-success")
    expect(markup).toContain("Record Traffic")
  })

  it("uses destructive tokens for UID errors", () => {
    const markup = renderToStaticMarkup(
      <TrafficCheckInForm {...baseProps} uidError="UID must be exactly 9 digits" />
    )
    expect(markup).toContain("text-destructive")
    expect(markup).not.toMatch(/text-red-500|bg-red-50/)
    assertThemeSafeMarkup(markup, "TrafficCheckInForm (error)")
  })

  it("stays theme-safe under .dark", () => {
    const markup = renderToStaticMarkup(
      <div className="dark">
        <TrafficCheckInForm {...baseProps} />
      </div>
    )
    assertThemeSafeMarkup(markup, "TrafficCheckInForm (dark)")
  })
})
