/**
 * Form logs server module. Fetches mcf_form_logs, whaf_form_logs, wpl_form_logs
 * by campus week and (where applicable) by uid. Use @/lib/form-logs for late-processing
 * (isWhafLate, markWhafFormLogsLate, etc.) or the *WithLate fetchers below.
 */

export type { McfFormLogRow, WhafFormLogRow, WplFormLogRow } from "./types";
export {
  getMcfFormLogsForWeek,
  getMcfFormLogsByUid,
  getMcfFormLogsByUidAndWeek,
  getWhafFormLogsForWeek,
  getWplFormLogsForWeek,
  getWplFormLogsByUid,
  getWplFormLogsByUidAndWeek,
} from "./fetch";
export {
  getWhafFormLogsForWeekWithLate,
  getMcfFormLogsForWeekWithLate,
  getMcfFormLogsByUidWithLate,
  getMcfFormLogsByUidAndWeekWithLate,
  getWplFormLogsForWeekWithLate,
  getWplFormLogsByUidWithLate,
  getWplFormLogsByUidAndWeekWithLate,
  type WhafFormLogRowWithLate,
  type McfFormLogRowWithLate,
  type WplFormLogRowWithLate,
} from "./with-late";
export {
  buildTeamLeaderFormStatsForWeek,
  type TeamLeaderFormStatsRow,
} from "./aggregate";
