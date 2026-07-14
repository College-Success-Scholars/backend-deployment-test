const completionColor = (pct: number) => (pct >= 90 ? "#22c55e" : pct < 60 ? "#ef4444" : "#f59e0b")

export function CompletionMeter({ pct }: { pct: number }) {
  const boundedPct = Math.max(0, Math.min(100, pct))

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${boundedPct}%`, backgroundColor: completionColor(boundedPct) }}
        />
      </div>
      <span className="text-xs font-medium">{pct}%</span>
    </div>
  )
}
