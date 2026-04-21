/** Normalize pathname for comparisons (trailing slash, empty). */
export function normalizePath(p: string): string {
  const t = p.replace(/\/$/, "")
  return t === "" ? "/" : t
}

/** Longest matching sub-URL for nested sidebar items (exact or prefix). */
export function getActiveSubUrl(
  pathname: string,
  subItems: { url: string }[]
): string | null {
  const p = normalizePath(pathname)
  const urls = subItems.map((s) => normalizePath(s.url))
  const matches = urls.filter((u) => p === u || p.startsWith(`${u}/`))
  if (matches.length === 0) return null
  return matches.reduce((a, b) => (a.length >= b.length ? a : b))
}

/** Active link: prefix match, except `homePath` matches only exactly (e.g. /dashboard vs /dashboard/personal). */
export function isLinkActive(
  pathname: string,
  url: string,
  options?: { homePath?: string }
): boolean {
  const p = normalizePath(pathname)
  const u = normalizePath(url)
  if (options?.homePath && u === options.homePath) {
    return p === options.homePath
  }
  return p === u || p.startsWith(`${u}/`)
}

export function isNavItemActive(
  pathname: string,
  item: { url: string; items?: { url: string }[] }
): boolean {
  if (item.items?.length) {
    return getActiveSubUrl(pathname, item.items) !== null
  }
  return isLinkActive(pathname, item.url, { homePath: "/dashboard" })
}

export function isNavSubItemActive(
  pathname: string,
  subItemUrl: string,
  siblingItems: { url: string }[]
): boolean {
  const active = getActiveSubUrl(pathname, siblingItems)
  return active !== null && active === normalizePath(subItemUrl)
}
