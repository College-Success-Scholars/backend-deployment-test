/**
 * Session logs module - client-safe types and pure data-cleaning utilities.
 * For server-side data fetching (Supabase), use lib/server/session-logs.
 *
 * Typical flow: fetch rows via lib/server/session-logs, then use getCleanedAndErroredTickets
 * or getScholarsWithValidEntryExit / getScholarsCurrentlyInRoom. Enrich with
 * enrichCleanedAndErroredWithNames or enrichWithScholarNames using a name map from
 * fetchScholarNamesByUids. Use getDoubleEntries(completedStudy, completedFrontDesk) to find
 * overlapping study + front-desk sessions.
 */

export {
  getCleanedAndErroredTickets,
  getScholarsCurrentlyInRoom,
  getScholarsWithValidEntryExit,
  type CleanedAndErroredOptions,
  type ScholarsInRoomOptions,
} from "./session-ticket-utils";

export {
  EASTERN_TIMEZONE,
  SESSION_TYPE_STUDY,
  SESSION_TYPE_FRONT_DESK,
} from "./types";

export type {
  SessionLogRow,
  SessionLogConfig,
  SessionType,
  TicketErrorType,
  ProcessedTicket,
  CleanedAndErroredResult,
  ScholarInRoom,
  ScholarWithCompletedSession,
  FrontDeskLogRow,
  StudySessionLogRow,
} from "./types";

export { enrichCleanedAndErroredWithNames, enrichWithScholarNames } from "./utils";

export {
  getDoubleEntries,
  type DoubleEntryOptions,
  type DoubleEntry,
} from "./double-entry";
