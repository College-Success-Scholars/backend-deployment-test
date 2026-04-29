import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeeklyKpiCard } from "../types"

type WeeklyKpiCardsProps = {
  cards: WeeklyKpiCard[]
}

export function WeeklyKpiCards({ cards }: WeeklyKpiCardsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="gap-0 bg-muted/20 py-0">
          <CardHeader className="gap-1 px-4 pt-4 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            <div className="text-3xl font-semibold">{card.primaryValue}</div>
            <p className="text-muted-foreground text-xs">{card.secondaryText}</p>
            {card.trendText && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <TrendingUp className="size-3" />
                <span>{card.trendText}</span>
              </div>
            )}
            {card.subStats.length > 0 && (
              <div className="flex gap-5 pt-1">
                {card.subStats.map((stat) => (
                  <div key={stat.label} className="space-y-0.5 text-sm">
                    <div className="text-muted-foreground text-xs">{stat.label}</div>
                    <div className="font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
