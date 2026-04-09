import { NextResponse } from "next/server"
import { getMenteeWeekData } from "../data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const weekNumRaw = searchParams.get("week_num")
  const weekNum = Number.parseInt(weekNumRaw ?? "", 10)

  if (!Number.isFinite(weekNum) || weekNum <= 0) {
    return NextResponse.json({ error: "Invalid week_num" }, { status: 400 })
  }

  const data = await getMenteeWeekData(weekNum)
  return NextResponse.json(data)
}
