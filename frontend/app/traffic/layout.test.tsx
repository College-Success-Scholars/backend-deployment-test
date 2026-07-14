import React from "react"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("@/components/layout/idle-reset-provider", () => ({
  IdleResetProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import TrafficLayout from "./layout"

const trafficDir = dirname(fileURLToPath(import.meta.url))

/** Patterns that would re-introduce an auth/role gate on the public kiosk. */
const FORBIDDEN_GATE_PATTERNS: RegExp[] = [
  /\bredirect\s*\(/,
  /\bcanAccessWeeklyMemo\b/,
  /\bcanAccessMenteeMonitoring\b/,
  /\brequireTeamLeaderOrAbove\b/,
  /\brequireUser\b/,
  /\brequireDeveloper\b/,
  /\bgetCurrentUser\b/,
  /\bgetCurrentProfile\b/,
  /\bgetCurrentUserWithProfile\b/,
  /\/api\/auth\/me/,
]

describe("TrafficLayout public access", () => {
  it("must not auth- or role-gate the public foot-traffic kiosk", () => {
    const source = readFileSync(join(trafficDir, "layout.tsx"), "utf8")

    for (const pattern of FORBIDDEN_GATE_PATTERNS) {
      expect(source, `layout.tsx must not match ${pattern}`).not.toMatch(pattern)
    }
  })

  it("still allows the public path in session middleware", () => {
    const middlewareSource = readFileSync(
      join(trafficDir, "../../lib/supabase/middleware.ts"),
      "utf8"
    )

    expect(middlewareSource).toMatch(/pathname !== "\/traffic"/)
    expect(middlewareSource).toMatch(/pathname\.startsWith\("\/traffic\/"\)/)
  })

  it("renders kiosk children without redirecting", () => {
    const markup = renderToStaticMarkup(
      <TrafficLayout>
        <div data-testid="traffic-kiosk">kiosk-ok</div>
      </TrafficLayout>
    )

    expect(markup).toContain("kiosk-ok")
    expect(markup).not.toContain("dashboard")
  })
})
