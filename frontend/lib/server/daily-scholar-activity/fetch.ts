import "server-only";
import { backendGet } from "../api-client";

export async function getTotalMinutesForMenteeWeek(params: {
  menteeUid: string; weekNum: number; logSource: string;
}): Promise<number> {
  const { menteeUid, weekNum, logSource } = params;
  return backendGet<number>(
    `/api/daily-activity/minutes?menteeUid=${encodeURIComponent(menteeUid)}&weekNum=${weekNum}&logSource=${encodeURIComponent(logSource)}`
  );
}
