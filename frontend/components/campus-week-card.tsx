import Link from "next/link";
import { dateToCampusWeek } from "@/lib/time";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DESCRIPTION =
  "Campus week from lib/time. Links through current plus one.";

export type CampusWeekCardProps = {
  /** Base path for week links, e.g. "/dev/traffic" or "/dev/session-records". */
  basePath: string;
  /** Extra query params to include in every week link (e.g. { increment: "15" }). */
  additionalSearchParams?: Record<string, string>;
  /** Currently selected week (highlighted). Omit to not highlight. */
  selectedWeek?: number | null;
};

function buildWeekHref(
  basePath: string,
  week: number,
  additional?: Record<string, string>
): string {
  const params = new URLSearchParams({ week: String(week) });
  if (additional) {
    for (const [k, v] of Object.entries(additional)) {
      params.set(k, v);
    }
  }
  const q = params.toString();
  return q ? `${basePath}?${q}` : `${basePath}`;
}

export function CampusWeekCard({
  basePath,
  additionalSearchParams,
  selectedWeek,
}: CampusWeekCardProps) {
  const currentCampusWeek = dateToCampusWeek(new Date());
  console.log(currentCampusWeek)
  const maxWeek = (currentCampusWeek ?? 1) + 1;
  const weekNumbers = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <Card className="relative">
      <div className="absolute right-6 top-6 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Current campus week:</span>
        <Badge variant="secondary">{currentCampusWeek ?? "—"}</Badge>
      </div>
      <CardHeader>
        <CardTitle>Time</CardTitle>
        <CardDescription>{DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm mb-2">Quick week links:</p>
          <div className="flex flex-wrap gap-1">
            {weekNumbers.map((w) => {
              const href = buildWeekHref(basePath, w, additionalSearchParams);
              const isSelected = selectedWeek != null && selectedWeek === w;
              return (
                <Link
                  key={w}
                  href={href}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {w}
                </Link>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
