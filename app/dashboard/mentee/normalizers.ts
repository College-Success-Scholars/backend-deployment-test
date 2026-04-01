import type { MenteeActivityRpcRow } from "@/lib/types/mentee-rpc"

export type ActivityLogSource =
  | "front_desk"
  | "study_session"
  | "front_desk_logs"
  | "study_session_logs"

export function normalizeScholarUid(value: string | null | undefined): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function parseScholarUidNumber(value: string | null | undefined): number | null {
  const uid = normalizeScholarUid(value)
  if (!uid) return null
  const parsed = Number.parseInt(uid, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export function normalizeActivityDateIso(activityDate: string | null | undefined): string | null {
  if (!activityDate) return null
  const match = String(activityDate).match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

export function normalizeActivityLogSource(
  logSource: MenteeActivityRpcRow["log_source"]
): ActivityLogSource | null {
  if (
    logSource === "front_desk" ||
    logSource === "study_session" ||
    logSource === "front_desk_logs" ||
    logSource === "study_session_logs"
  ) {
    return logSource
  }
  return null
}

export function isDailyLogSource(
  source: ActivityLogSource
): source is "front_desk_logs" | "study_session_logs" {
  return source === "front_desk_logs" || source === "study_session_logs"
}

export function toMinutes(value: number | null | undefined): number {
  return value ?? 0
}

export function weekUidKey(weekNum: number, uid: string | number): string {
  return `${weekNum}|${uid}`
}

export function weekUidDateKey(weekNum: number, uid: string, dateIso: string): string {
  return `${weekNum}|${uid}|${dateIso}`
}
