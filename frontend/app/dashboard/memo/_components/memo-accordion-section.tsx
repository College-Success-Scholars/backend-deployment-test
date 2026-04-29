import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type MemoAccordionSectionProps = {
  title: string
  badgeText?: string
  badgeClassName?: string
  rightLabel?: string
  defaultOpen?: boolean
  children: ReactNode
}

export function MemoAccordionSection({
  title,
  badgeText,
  badgeClassName,
  rightLabel,
  defaultOpen = false,
  children,
}: MemoAccordionSectionProps) {
  return (
    <Card className="gap-0 py-0">
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="group w-full cursor-pointer px-4 py-3 text-left">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {badgeText ? <Badge className={badgeClassName}>{badgeText}</Badge> : null}
            </div>
            <div className="flex items-center gap-2">
              {rightLabel ? <span className="text-muted-foreground text-xs">{rightLabel}</span> : null}
              <ChevronDown className="text-muted-foreground size-4 transition-transform group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className={cn("overflow-hidden border-t data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down")}>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
