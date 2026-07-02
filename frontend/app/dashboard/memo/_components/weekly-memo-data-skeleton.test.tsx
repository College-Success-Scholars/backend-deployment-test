import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import { WeeklyMemoDataSkeleton } from "./weekly-memo-data-skeleton"
import { WEEKLY_MEMO_KPI_TITLES } from "../_lib/memo-kpi-titles"

describe("WeeklyMemoDataSkeleton", () => {
  it("renders static section titles and KPI labels while skeletonizing values", () => {
    const html = renderToStaticMarkup(<WeeklyMemoDataSkeleton />)

    for (const title of WEEKLY_MEMO_KPI_TITLES) {
      expect(html).toContain(title)
    }

    expect(html).toContain("Team leader performance")
    expect(html).toContain("Scholar follow-up")
    expect(html).toContain("Recognition board")
    expect(html).toContain("Full attendance detail")
    expect(html).toContain("Form submissions")
    expect(html).toContain('data-slot="skeleton"')
  })
})
