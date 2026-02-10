/**
 * Session records: weekly minute aggregates synced from session log tickets.
 * Uses lib/session-logs for ticket fetching and processing; this module handles
 * the records tables (front_desk_records, future study_session_records).
 */

export {
  getFrontDeskRecord,
  getFrontDeskRecordByUidString,
  syncFrontDeskRecordsForWeek,
  syncFrontDeskRecordsForWeekAllUids,
} from "./front-desk-records";

export type { FrontDeskRecordRow } from "./front-desk-records";

export {
  getStudySessionRecord,
  getStudySessionRecordByUidString,
  syncStudySessionRecordsForWeek,
  syncStudySessionRecordsForWeekAllUids,
} from "./study-session-records";

export type { StudySessionRecordRow } from "./study-session-records";

export { computeWeeklyMinutesByUid } from "./weekly-minutes";

export type { WeeklyMinutesByDay, WeekDateRange } from "./weekly-minutes";
