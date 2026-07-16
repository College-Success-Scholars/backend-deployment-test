/**
 * Forbidden patterns for theme-safe product UI (animated surfaces, overlays, kiosk pages).
 * Shared by Vitest helpers and scripts/check-theme-safety.mjs (keep lists aligned).
 */
export const THEME_UNSAFE_PATTERNS: RegExp[] = [
  /\bbg-white\b/,
  /\bbg-green-/,
  /\btext-green-/,
  /\bborder-green-/,
  /\bbg-red-50\b/,
  /\btransition-all\b/,
  /#[0-9a-fA-F]{3,8}\b/,
]

/** Soft chip antipattern: solid *-foreground ink on *-muted surface (fails in dark mode). */
export const MUTED_FOREGROUND_ANTIPATTERN =
  /\bbg-(success|warning|info)-muted\b[\s\S]{0,80}?\btext-(success|warning|info)-foreground\b|\btext-(success|warning|info)-foreground\b[\s\S]{0,80}?\bbg-(success|warning|info)-muted\b/

export function findThemeUnsafeMatches(source: string): string[] {
  const matches: string[] = []
  for (const pattern of THEME_UNSAFE_PATTERNS) {
    const found = source.match(new RegExp(pattern.source, "g"))
    if (found) matches.push(...found)
  }
  return matches
}

export function assertThemeSafeMarkup(markup: string, label = "markup"): void {
  const hits = findThemeUnsafeMatches(markup)
  if (hits.length > 0) {
    throw new Error(
      `${label} is not theme-safe; forbidden patterns: ${[...new Set(hits)].join(", ")}`
    )
  }
  assertNoMutedForegroundAntipattern(markup, label)
}

export function assertNoColorTransitionAll(markupOrClass: string, label = "source"): void {
  if (/\btransition-all\b/.test(markupOrClass)) {
    throw new Error(
      `${label} uses transition-all on a theme-dependent surface; use transition-transform or transition-opacity instead`
    )
  }
}

export function assertNoMutedForegroundAntipattern(
  source: string,
  label = "source"
): void {
  if (MUTED_FOREGROUND_ANTIPATTERN.test(source)) {
    throw new Error(
      `${label} pairs bg-*-muted with text-*-foreground; use text-*-muted-foreground (or Badge variant success|warning|info) instead`
    )
  }
}

/** Success/kiosk surfaces should resolve through semantic success/card tokens. */
export function assertSemanticSuccessSurface(markup: string, label = "success surface"): void {
  const hasSuccess =
    /\bbg-success\b/.test(markup) ||
    /\btext-success\b/.test(markup) ||
    /\bbg-success-muted\b/.test(markup)
  const hasCard = /\bbg-card\b/.test(markup)
  if (!hasSuccess || !hasCard) {
    throw new Error(
      `${label} must use semantic success tokens and bg-card (found success=${hasSuccess}, card=${hasCard})`
    )
  }
  assertThemeSafeMarkup(markup, label)
}
