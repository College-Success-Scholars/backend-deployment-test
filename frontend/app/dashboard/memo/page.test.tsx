import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

const { mockWeeklyMemoHeaderShell, mockWeeklyMemoAsyncContent } = vi.hoisted(() => ({
  mockWeeklyMemoHeaderShell: vi.fn(({ weekParam }: { weekParam?: string }) =>
    React.createElement("section", { "data-testid": "weekly-memo-header-shell", "data-week-param": weekParam })
  ),
  mockWeeklyMemoAsyncContent: vi.fn(({ weekParam }: { weekParam?: string }) =>
    React.createElement("section", { "data-testid": "weekly-memo-async-content", "data-week-param": weekParam })
  ),
}))

vi.mock("./_components/weekly-memo-header-shell", () => ({
  WeeklyMemoHeaderShell: mockWeeklyMemoHeaderShell,
}))

vi.mock("./_components/weekly-memo-async-content", () => ({
  WeeklyMemoAsyncContent: mockWeeklyMemoAsyncContent,
}))

vi.mock("./_components/weekly-memo-nav-context", () => ({
  WeeklyMemoNavProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import WeeklyMemoPage from "./page"

const renderPage = async (searchParams: { week?: string }) => {
  const page = await WeeklyMemoPage({ searchParams: Promise.resolve(searchParams) })
  return renderToStaticMarkup(page)
}

describe("dashboard memo page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders persistent header shell and async content with week param", async () => {
    await renderPage({ week: "7" })

    expect(mockWeeklyMemoHeaderShell).toHaveBeenCalledWith(
      expect.objectContaining({ weekParam: "7" }),
      undefined
    )
    expect(mockWeeklyMemoAsyncContent).toHaveBeenCalledWith(
      expect.objectContaining({ weekParam: "7" }),
      undefined
    )
  })

  it("passes undefined week param when query is omitted", async () => {
    await renderPage({})

    expect(mockWeeklyMemoHeaderShell).toHaveBeenCalledWith(
      expect.objectContaining({ weekParam: undefined }),
      undefined
    )
    expect(mockWeeklyMemoAsyncContent).toHaveBeenCalledWith(
      expect.objectContaining({ weekParam: undefined }),
      undefined
    )
  })
})
