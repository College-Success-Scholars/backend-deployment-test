/**
 * Re-export theme-safety assertions for component/page tests.
 * Prefer importing from here in `*.test.tsx` files.
 */
export {
  THEME_UNSAFE_PATTERNS,
  MUTED_FOREGROUND_ANTIPATTERN,
  assertThemeSafeMarkup,
  assertNoColorTransitionAll,
  assertNoMutedForegroundAntipattern,
  assertSemanticSuccessSurface,
  findThemeUnsafeMatches,
} from "./theme-safety"
