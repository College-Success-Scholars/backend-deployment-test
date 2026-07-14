import type { LucideIcon } from "lucide-react"

export function NavSidebarIcon({
  icon: Icon,
  active,
}: {
  icon: LucideIcon
  active: boolean
}) {
  return (
    <Icon
      aria-hidden
      className="shrink-0 transition-colors duration-150"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
  )
}
