import { describe, expect, it, vi, beforeEach } from "vitest"

const { mockBackendGet } = vi.hoisted(() => ({
  mockBackendGet: vi.fn(),
}))

vi.mock("@/lib/server/api-client", () => ({
  backendGet: mockBackendGet,
}))

import { backendMemoSource } from "./memo-source"

describe("memo-source", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("uses weekNum query for valid week params", async () => {
    mockBackendGet.mockResolvedValue({})
    await backendMemoSource.getWeeklyMemoPageData("9")
    expect(mockBackendGet).toHaveBeenCalledWith("/api/memo/page-data?weekNum=9")
  })

  it("omits weekNum query for invalid week params", async () => {
    mockBackendGet.mockResolvedValue({})
    await backendMemoSource.getWeeklyMemoPageData("abc")
    expect(mockBackendGet).toHaveBeenCalledWith("/api/memo/page-data")
  })
})
