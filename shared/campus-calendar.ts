/**
 * @file campus-calendar.ts
 * @module shared
 *
 * Campus week calendar factory and implementation.
 * Constructs a calendar from the academic year configuration in time-config.ts
 * and provides methods to convert between dates and campus week numbers.
 * Week 1 starts on FALL_SEMESTER_FIRST_DAY; winter break weeks are
 * numbered but marked as break weeks.
 *
 * ## Responsibilities
 * - Build the campus week calendar from config constants
 * - weekOf(date): convert a date to its campus week number
 * - rangeOf(weekNum): convert a campus week number to its date range
 *
 * ## What belongs here
 * - Campus week calendar construction and date<→>week conversion
 *
 * ## What does NOT belong here
 * - Eastern time date arithmetic (that's eastern-time.ts)
 * - Configuration constants (that's time-config.ts)
 * - Formatting utilities (those are in time.ts)
 */
import {
  addEasternCalendarDays,
  easternCalendarDaysBetween,
  getEasternDayOfWeek,
  getStartOfDayEastern,
  mondayOfWeekEastern,
  parseEasternDate,
  type EasternTimeZone,
} from "./eastern-time.js";

export type CampusDay = `${number}-${number}-${number}`;

export type CampusCalendarConfig = {
  fallSemesterFirstDay: CampusDay;
  winterBreakFirstDay: CampusDay;
  winterBreakLastDay: CampusDay;
  timeZone?: EasternTimeZone;
};

export type CampusWeekRange = {
  week: number;
  startDate: Date;
  endDate: Date;
  fetchEndExclusiveIso: string;
};

export interface CampusCalendar {
  weekOf(input: Date | CampusDay): number | null;
  rangeOf(week: number): CampusWeekRange | null;
  currentWeek(now?: Date): number | null;
}

export function createCampusCalendar(config: CampusCalendarConfig): CampusCalendar {
  const timeZone = config.timeZone ?? "America/New_York";
  const semesterStart = parseEasternDate(config.fallSemesterFirstDay, timeZone);
  const winterStart = parseEasternDate(config.winterBreakFirstDay, timeZone);
  const winterEnd = parseEasternDate(config.winterBreakLastDay, timeZone);
  const weekOneMonday = mondayOfWeekEastern(semesterStart, timeZone);
  const firstSpringMonday = (() => {
    const dayAfterBreak = addEasternCalendarDays(winterEnd, 1, timeZone);
    const dayOfWeek = getEasternDayOfWeek(dayAfterBreak, timeZone);
    const daysUntilMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
    return addEasternCalendarDays(dayAfterBreak, daysUntilMonday, timeZone);
  })();
  const winterBreakWeek = (() => {
    const dayBeforeWinter = addEasternCalendarDays(winterStart, -1, timeZone);
    const daysFromWeekOne = easternCalendarDaysBetween(weekOneMonday, dayBeforeWinter, timeZone);
    return Math.floor(daysFromWeekOne / 7) + 2;
  })();

  return {
    weekOf(input: Date | CampusDay): number | null {
      const date = typeof input === "string" ? parseEasternDate(input, timeZone) : input;
      const easternDay = getStartOfDayEastern(date, timeZone);
      const t = easternDay.getTime();

      if (t < weekOneMonday.getTime()) return null;
      if (t >= winterStart.getTime() && t <= winterEnd.getTime()) return winterBreakWeek;

      if (t < winterStart.getTime()) {
        const days = easternCalendarDaysBetween(weekOneMonday, easternDay, timeZone);
        return Math.floor(days / 7) + 1;
      }

      if (t < firstSpringMonday.getTime()) return winterBreakWeek + 1;

      const daysFromSpringStart = easternCalendarDaysBetween(firstSpringMonday, easternDay, timeZone);
      return winterBreakWeek + 1 + Math.floor(daysFromSpringStart / 7);
    },
    rangeOf(week: number): CampusWeekRange | null {
      if (week < 1) return null;

      if (week < winterBreakWeek) {
        const startDate = addEasternCalendarDays(weekOneMonday, (week - 1) * 7, timeZone);
        const endDate = addEasternCalendarDays(startDate, 6, timeZone);
        return {
          week,
          startDate,
          endDate,
          fetchEndExclusiveIso: addEasternCalendarDays(endDate, 1, timeZone).toISOString(),
        };
      }

      if (week === winterBreakWeek) {
        return {
          week,
          startDate: new Date(winterStart.getTime()),
          endDate: new Date(winterEnd.getTime()),
          fetchEndExclusiveIso: addEasternCalendarDays(winterEnd, 1, timeZone).toISOString(),
        };
      }

      const weeksAfterBreak = week - winterBreakWeek - 1;
      const startDate = addEasternCalendarDays(firstSpringMonday, weeksAfterBreak * 7, timeZone);
      const endDate = addEasternCalendarDays(startDate, 6, timeZone);
      return {
        week,
        startDate,
        endDate,
        fetchEndExclusiveIso: addEasternCalendarDays(endDate, 1, timeZone).toISOString(),
      };
    },
    currentWeek(now?: Date): number | null {
      return this.weekOf(now ?? new Date());
    },
  };
}
