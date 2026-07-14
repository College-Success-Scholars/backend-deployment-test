import React from "react"
import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import {
  assertNoColorTransitionAll,
  assertSemanticSuccessSurface,
  assertThemeSafeMarkup,
} from "@/lib/theme/theme-safety.test-helpers"
import { TrafficSuccessScreen } from "./traffic-success-screen"

describe("TrafficSuccessScreen theme safety", () => {
  it("uses semantic success/card tokens under light", () => {
    const markup = renderToStaticMarkup(
      <TrafficSuccessScreen exitMinutes={60} />
    )
    assertSemanticSuccessSurface(markup, "TrafficSuccessScreen (light)")
    assertNoColorTransitionAll(markup, "TrafficSuccessScreen (light)")
  })

  it("stays theme-safe under .dark wrapper", () => {
    const markup = renderToStaticMarkup(
      <div className="dark">
        <TrafficSuccessScreen exitMinutes={90} />
      </div>
    )
    assertThemeSafeMarkup(markup, "TrafficSuccessScreen (dark)")
    expect(markup).toContain("animate-in")
    expect(markup).not.toContain("transition-all")
  })

  it("keeps enter animations opacity/transform oriented", () => {
    const markup = renderToStaticMarkup(
      <TrafficSuccessScreen exitMinutes={30} />
    )
    expect(markup).toMatch(/animate-in/)
    expect(markup).toMatch(/zoom-in|fade-in/)
    expect(markup).not.toMatch(/bg-white|bg-green-|text-green-/)
  })
})
