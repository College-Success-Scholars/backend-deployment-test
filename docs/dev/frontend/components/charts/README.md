# components/charts

**Location:** [`frontend/components/charts/`](../../../../../frontend/components/charts/)  
**Docs:** `docs/dev/frontend/components/charts/README.md`

## Navigation

[← Root](../../../README.md) › [Frontend](../../README.md) › [components](../README.md) › charts

---

## Purpose

Chart and visualization components shared across routes. Wrap Recharts output with `<ChartContainer>` from `components/ui/chart.tsx`.

---

## Files

| File | Description |
|------|-------------|
| `chart-radial-stacked.tsx` | Stacked radial chart |
| `chart-radial-text.tsx` | Radial chart with center text label |
| `front-desk-chart.tsx` | Front desk session hours chart |
| `study-session-chart.tsx` | Study session hours chart |

---

## Standards

- **Shared charts live here** — not under `app/dev/` or route folders.
- **Use Recharts + `ChartContainer`** — match existing chart styling.
- **Client components** — charts require `"use client"`.
