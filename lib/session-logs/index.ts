/**
 * Session logs module - client-safe types and pure data-cleaning utilities.
 * For server-side data fetching (Supabase), use lib/server/session-logs.
 */

export {
  getCleanedAndErroredTickets,
  getScholarsCurrentlyInRoom,
  getScholarsWithValidEntryExit,
  type CleanedAndErroredOptions,
  type ScholarsInRoomOptions,
  type ValidEntryExitOptions,
} from "./session-ticket-utils";

export {
  DEFAULT_SESSION_CONFIG,
  EASTERN_TIMEZONE,
  SESSION_TYPE_STUDY,
  SESSION_TYPE_FRONT_DESK,
  SESSION_TYPES,
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
