import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FETCH_ITEMS = [
  "Scholars & team leaders",
  "Study session records (selected week)",
  "Front desk records (selected week)",
  "Completed FD & SS sessions",
  "Traffic entry counts (all weeks)",
  "Traffic sessions (selected week)",
];

export default function MemoLoading() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 py-4">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          Fetching data for selected week…
        </p>
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
          {FETCH_ITEMS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
