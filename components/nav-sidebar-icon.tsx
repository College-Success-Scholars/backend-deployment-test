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
      className="shrink-0 transition-[fill,stroke] duration-150"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth={active ? 0 : 2}
    />
  )
}
