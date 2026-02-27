/**
 * Form logs: client-safe deadline and late-processing logic.
 * For fetching rows, use @/lib/server/form-logs.
 *
 * Deadlines (Eastern):
 * - WHAF: late if submitted after Thursday 23:59 EST.
 * - MCF & WPL: late if submitted after Friday 17:00 EST.
 */

export {
  getWhafDeadlineForWeek,
  getMcfWplDeadlineForWeek,
  isWhafLate,
  isMcfLate,
  isWplLate,
} from "./deadlines";
export {
  markWhafFormLogsLate,
  markMcfFormLogsLate,
  markWplFormLogsLate,
  type FormLogRowWithLate,
} from "./process";
export {
  normalizeName,
  nameVariants,
  nameTokens,
  findTeamLeaderUidByFuzzyName,
  type TeamLeaderNameRecord,
} from "./name-matching";
