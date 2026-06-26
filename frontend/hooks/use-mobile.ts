/**
 * @file use-mobile.ts
 * @module frontend/hooks
 *
 * React hook that returns true when the viewport is narrower than the
 * mobile breakpoint (768px). Used to conditionally render mobile-optimized
 * layouts or hide desktop-only elements.
 *
 * ## Responsibilities
 * - Listen to window resize events and update the mobile state
 * - Return boolean: true = mobile viewport, false = desktop viewport
 *
 * ## What belongs here
 * - Viewport width detection logic only
 *
 * ## What does NOT belong here
 * - Any UI rendering, Supabase, or API logic
 */
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
