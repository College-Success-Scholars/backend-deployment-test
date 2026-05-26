export type CampusDay = `${number}-${number}-${number}`;

export type CampusCalendarConfig = {
  fallSemesterFirstDay: CampusDay;
  winterBreakFirstDay: CampusDay;
  winterBreakLastDay: CampusDay;
  timeZone?: "America/New_York";
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

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function parseEasternDate(input: CampusDay, timeZone: "America/New_York"): Date {
  const [year, month, day] = input.split("-").map(Number);
  if (!year || !month || !day) throw new Error(`Invalid campus day: ${input}`);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    second: "numeric",
  });
  const parts = formatter.formatToParts(utcNoon);
  const hour = parseInt(parts.find((part) => part.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((part) => part.type === "minute")?.value ?? "0", 10);
  const second = parseInt(parts.find((part) => part.type === "second")?.value ?? "0", 10);
  const easternMsSinceMidnight = (hour * 3600 + minute * 60 + second) * 1000;
  return new Date(utcNoon.getTime() - easternMsSinceMidnight);
}

function getEasternDateParts(d: Date, timeZone: "America/New_York"): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(d);
  const year = parseInt(parts.find((part) => part.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((part) => part.type === "month")?.value ?? "1", 10) - 1;
  const day = parseInt(parts.find((part) => part.type === "day")?.value ?? "1", 10);
  return { year, month, day };
}

function startOfDayEastern(d: Date, timeZone: "America/New_York"): Date {
  const { year, month, day } = getEasternDateParts(d, timeZone);
  const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` as CampusDay;
  return parseEasternDate(value, timeZone);
}

function addEasternCalendarDays(d: Date, deltaDays: number, timeZone: "America/New_York"): Date {
  const { year, month, day } = getEasternDateParts(startOfDayEastern(d, timeZone), timeZone);
  const rolled = new Date(Date.UTC(year, month, day + deltaDays));
  const value = `${rolled.getUTCFullYear()}-${String(rolled.getUTCMonth() + 1).padStart(2, "0")}-${String(rolled.getUTCDate()).padStart(2, "0")}` as CampusDay;
  return parseEasternDate(value, timeZone);
}

function easternCalendarDaysBetween(earlier: Date, later: Date, timeZone: "America/New_York"): number {
  const a = getEasternDateParts(startOfDayEastern(earlier, timeZone), timeZone);
  const b = getEasternDateParts(startOfDayEastern(later, timeZone), timeZone);
  const aMs = Date.UTC(a.year, a.month, a.day);
  const bMs = Date.UTC(b.year, b.month, b.day);
  return Math.round((bMs - aMs) / ONE_DAY_MS);
}

function getEasternDayOfWeek(d: Date, timeZone: "America/New_York"): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  });
  const day = formatter.format(d);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[day] ?? 0;
}

function mondayOfWeekEastern(d: Date, timeZone: "America/New_York"): Date {
  const easternDay = startOfDayEastern(d, timeZone);
  const backToMonday = (getEasternDayOfWeek(easternDay, timeZone) + 6) % 7;
  return addEasternCalendarDays(easternDay, -backToMonday, timeZone);
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
      const easternDay = startOfDayEastern(date, timeZone);
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
