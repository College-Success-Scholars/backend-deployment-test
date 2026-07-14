/**
 * CSS custom property references for charts and non-Tailwind color consumers.
 * Prefer these over hardcoded hex so light/dark tokens update automatically.
 */
export const cssColor = {
  success: "var(--success)",
  successForeground: "var(--success-foreground)",
  successMuted: "var(--success-muted)",
  successMutedForeground: "var(--success-muted-foreground)",
  warning: "var(--warning)",
  warningForeground: "var(--warning-foreground)",
  warningMuted: "var(--warning-muted)",
  warningMutedForeground: "var(--warning-muted-foreground)",
  info: "var(--info)",
  infoForeground: "var(--info-foreground)",
  infoMuted: "var(--info-muted)",
  infoMutedForeground: "var(--info-muted-foreground)",
  destructive: "var(--destructive)",
  mutedForeground: "var(--muted-foreground)",
  background: "var(--background)",
  card: "var(--card)",
  frontDesk: "var(--front-desk)",
  study: "var(--study)",
  traffic: "var(--traffic)",
  formWahf: "var(--form-wahf)",
  formMcf: "var(--form-mcf)",
  formWpl: "var(--form-wpl)",
  formLate: "var(--form-late)",
} as const

/**
 * Read a computed CSS color from the document root (client-only).
 * Useful when a library needs a resolved rgb/hex string instead of `var(--…)`.
 */
export function readCssColor(
  property: string,
  element: Element = document.documentElement
): string {
  return getComputedStyle(element).getPropertyValue(property).trim()
}

/**
 * Theme-aware intensity blend for heatmaps (empty → token).
 * Uses `color-mix` so light/dark tokens update without hex interpolation.
 */
export function themeIntensity(
  tokenVar: string,
  t: number,
  baseVar: string = cssColor.background
): string | undefined {
  if (t <= 0) return undefined
  const pct = Math.round(Math.min(1, Math.max(0, t)) * 100)
  if (pct >= 100) return tokenVar
  return `color-mix(in oklch, ${tokenVar} ${pct}%, ${baseVar})`
}
