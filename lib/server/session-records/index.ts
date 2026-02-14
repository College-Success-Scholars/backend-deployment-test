/**
 * Session records server module. For client-safe types and pure utilities, use @/lib/session-records.
 */

export {
  getFrontDeskRecord,
  getStudySessionRecord,
  getStudySessionRecordsForWeek,
  getFrontDeskRecordsForWeek,
  type RecordKind,
  type StudySessionRecordWithName,
  type FrontDeskRecordWithName,
} from "./records";
export {
  syncFrontDeskRecordsForWeek,
  syncFrontDeskRecordsForWeekAllUids,
  syncStudySessionRecordsForWeek,
  syncStudySessionRecordsForWeekAllUids,
} from "./sync";
export { updateRecordExcuse, type UpdateExcusePayload } from "./excuse";
