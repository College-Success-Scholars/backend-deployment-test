"use client"

import { Download, LoaderCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { backendDownload } from "@/lib/client/api-client"

type WeeklyMemoExportButtonProps = {
  weekNumber: number | null
  available: boolean
  onExport?: (weekNumber: number) => Promise<void>
}

export function weeklyMemoPdfFilename(weekNumber: number) {
  return `weekly-memo-week-${weekNumber}.pdf`
}

export async function downloadWeeklyMemoPdf(weekNumber: number) {
  const response = await backendDownload(`/api/memo/pdf?weekNumber=${weekNumber}`)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? weeklyMemoPdfFilename(weekNumber)
  link.click()
  URL.revokeObjectURL(url)
}

export function WeeklyMemoExportButton({ weekNumber, available, onExport = downloadWeeklyMemoPdf }: WeeklyMemoExportButtonProps) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isAvailable = available && weekNumber !== null

  const handleExport = async () => {
    if (weekNumber == null || generating) return

    setGenerating(true)
    setError(null)
    try {
      await onExport(weekNumber)
    } catch {
      setError("PDF generation failed. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  if (!isAvailable) return null

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" onClick={handleExport} disabled={generating} aria-busy={generating}>
        {generating ? <LoaderCircle className="animate-spin" /> : <Download />}
        {generating ? "Generating PDF..." : "Export PDF"}
      </Button>
      {error && <p className="text-destructive text-xs" role="alert">{error}</p>}
    </div>
  )
}
