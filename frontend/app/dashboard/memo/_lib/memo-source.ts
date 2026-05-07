import { backendGet } from "@/lib/server/api-client"
import type { MemoPageData } from "../types"

export interface MemoSource {
  getWeeklyMemoPageData(weekParam?: string): Promise<MemoPageData>
}

const normalizeWeek = (weekParam?: string) => {
  if (!weekParam) return undefined
  if (!/^\d+$/.test(weekParam)) return undefined
  if (Number(weekParam) <= 0) return undefined
  return weekParam
}

export const backendMemoSource: MemoSource = {
  async getWeeklyMemoPageData(weekParam?: string) {
    const normalizedWeek = normalizeWeek(weekParam)
    const query = normalizedWeek ? `?weekNum=${normalizedWeek}` : ""
    return backendGet<MemoPageData>(`/api/memo/page-data${query}`)
  },
}
