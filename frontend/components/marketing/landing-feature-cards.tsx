import {
  BarChart3,
  CalendarRange,
  LayoutGrid,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Engagement insights",
    description:
      "See attendance, points, and your stats on a dashboard built for how CSS tracks success.",
    icon: BarChart3,
    highlight: false,
  },
  {
    title: "Directory",
    description:
      "Search and browse members and mentors so you can connect without digging through spreadsheets.",
    icon: Users,
    highlight: false,
  },
  {
    title: "Events & programs",
    description:
      "Follow mixers, programming, and opportunities so nothing important slips through the cracks.",
    icon: CalendarRange,
    highlight: false,
  },
  {
    title: "Resources & spaces",
    description:
      "Internship board, room info, and day-to-day tools — in one place.",
    icon: LayoutGrid,
    highlight: false,
  },
] as const;

export function LandingFeatureCards({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8 pb-10 pt-10 md:space-y-10 md:pt-12", className)}>
      <section id="features" className="scroll-mt-24">
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon, highlight }) => (
            <Card
              key={title}
              className={cn(
                "gap-0 overflow-hidden rounded-2xl border-0 py-0 shadow-sm",
                highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-foreground",
              )}
            >
              <CardContent className="flex flex-col gap-4 px-5 pb-6 pt-6">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    highlight
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-background text-foreground shadow-sm",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <CardTitle
                  className={cn(
                    "text-base leading-snug",
                    highlight && "text-primary-foreground",
                  )}
                >
                  {title}
                </CardTitle>
                <CardDescription
                  className={cn(
                    "text-sm leading-relaxed",
                    highlight
                      ? "text-primary-foreground/85"
                      : "text-muted-foreground",
                  )}
                >
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t pt-8 text-sm text-muted-foreground">
        © 2026 CSS Atlas Team
      </footer>
    </div>
  );
}
