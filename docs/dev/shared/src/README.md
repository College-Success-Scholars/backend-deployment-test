# shared/src

**Location:** [`shared/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared) (source files are at the shared root, not in a src/ subdirectory)  
**Docs:** `docs/dev/shared/src/README.md`

## Navigation

[← Root](../../README.md) › [Shared](../README.md) › src

---

## Purpose

Pure TypeScript source for the shared library. All exports are re-exported through `time.ts` as a single barrel. The library provides the campus week calendar system and Eastern-timezone date utilities used by both backend services and frontend components.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `time.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/time.ts) | Barrel export — re-exports everything from the other files; this is the main import target |
| `time-config.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/time-config.ts) | Academic calendar constants: `FALL_SEMESTER_FIRST_DAY`, winter break dates, ignored-week arrays |
| `time-types.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/time-types.ts) | TypeScript types: `CampusWeekDateRange`, `WeekDateRange` |
| `eastern-time.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/eastern-time.ts) | Timezone-safe date utilities for Eastern Time (America/New_York): parse, format, add days, get day of week, etc. |
| `campus-calendar.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/campus-calendar.ts) | Campus week calendar built from `time-config.ts` constants: `weekOf(date)` and `rangeOf(weekNum)` |
| `auth.ts` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/auth.ts) | Auth constants and helpers: `APP_ROLE_ORDER`, `hasRoleAtLeast`, `mergeProfileWithRoster` |

---

## Key Exports (from `time.ts`)

```typescript
// Campus calendar
campusWeekToDateRange(weekNum: number): CampusWeekDateRange
dateToCampusWeek(date: Date): number

// Eastern time utilities
parseEasternDate(input: string): Date          // "YYYY-MM-DD" → UTC Date
getEasternDateParts(date: Date): { year, month, day }
getStartOfDayEastern(date: Date): Date
addEasternCalendarDays(date: Date, delta: number): Date
easternCalendarDaysBetween(earlier: Date, later: Date): number
getEasternDayOfWeek(date: Date): number        // 0=Sun
mondayOfWeekEastern(date: Date): Date

// Formatting
formatEntryDate(iso: string, showTime?: boolean): string
formatDuration(ms: number): string             // "Xh Ym Zs"
formatDate(iso: string): string
formatMinutesToHoursAndMinutes(minutes: number): string

// Config constants
FALL_SEMESTER_FIRST_DAY: string                // "YYYY-MM-DD"
WEEKS_IGNORE_FORMS: number[]
WEEKS_IGNORE_SESSIONS: number[]
```

---

## Standards

- **`time.ts` is the only public import target** — consumers import from `shared/dist/time.js`, not from sub-files.
- **Update `time.ts` barrel** when adding a new export to any other file.
- **`time-config.ts` is the only place to change calendar dates** — do not hardcode academic year dates anywhere else.
- **No side effects** — all source files are pure declarations and function definitions.
- **Run `npm run build --prefix shared`** after every change — backend and frontend use the compiled `dist/`.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../../reference/README.md).

| Module | Reference |
|--------|----------|
| `auth` | [API](../../../reference/api/shared/auth/README.md) |
| `campus-calendar` | [API](../../../reference/api/shared/campus-calendar/README.md) |
| `eastern-time` | [API](../../../reference/api/shared/eastern-time/README.md) |
| `time` | [API](../../../reference/api/shared/time/README.md) |
| `time-config` | [API](../../../reference/api/shared/time-config/README.md) |
| `time-types` | [API](../../../reference/api/shared/time-types/README.md) |

<details>
<summary>All exports (47)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `addEasternCalendarDays` | functions | [docs](../../../reference/api/shared/eastern-time/functions/addEasternCalendarDays.md) |
| `APP_ROLE_ORDER` | variables | [docs](../../../reference/api/shared/auth/variables/APP_ROLE_ORDER.md) |
| `AppRole` | type-aliases | [docs](../../../reference/api/shared/auth/type-aliases/AppRole.md) |
| `CAMPUS_WEEK` | variables | [docs](../../../reference/api/shared/time/variables/CAMPUS_WEEK.md) |
| `CampusCalendar` | interfaces | [docs](../../../reference/api/shared/campus-calendar/interfaces/CampusCalendar.md) |
| `CampusCalendarConfig` | type-aliases | [docs](../../../reference/api/shared/campus-calendar/type-aliases/CampusCalendarConfig.md) |
| `CampusDay` | type-aliases | [docs](../../../reference/api/shared/campus-calendar/type-aliases/CampusDay.md) |
| `CampusWeekDateRange` | type-aliases | [docs](../../../reference/api/shared/time-types/type-aliases/CampusWeekDateRange.md) |
| `CampusWeekRange` | type-aliases | [docs](../../../reference/api/shared/campus-calendar/type-aliases/CampusWeekRange.md) |
| `campusWeekToDateRange` | functions | [docs](../../../reference/api/shared/time/functions/campusWeekToDateRange.md) |
| `createCampusCalendar` | functions | [docs](../../../reference/api/shared/campus-calendar/functions/createCampusCalendar.md) |
| `dateToCampusWeek` | functions | [docs](../../../reference/api/shared/time/functions/dateToCampusWeek.md) |
| `DEV_ACTIVE_PROFILE_COOKIE` | variables | [docs](../../../reference/api/shared/auth/variables/DEV_ACTIVE_PROFILE_COOKIE.md) |
| `DEV_ACTIVE_PROFILE_HEADER` | variables | [docs](../../../reference/api/shared/auth/variables/DEV_ACTIVE_PROFILE_HEADER.md) |
| `DevTestProfileRow` | type-aliases | [docs](../../../reference/api/shared/auth/type-aliases/DevTestProfileRow.md) |
| `EASTERN_TIMEZONE` | variables | [docs](../../../reference/api/shared/eastern-time/variables/EASTERN_TIMEZONE.md) |
| `easternCalendarDaysBetween` | functions | [docs](../../../reference/api/shared/eastern-time/functions/easternCalendarDaysBetween.md) |
| `EasternTimeZone` | type-aliases | [docs](../../../reference/api/shared/eastern-time/type-aliases/EasternTimeZone.md) |
| `FALL_SEMESTER_FIRST_DAY` | variables | [docs](../../../reference/api/shared/time-config/variables/FALL_SEMESTER_FIRST_DAY.md) |
| `formatDate` | functions | [docs](../../../reference/api/shared/time/functions/formatDate.md) |
| `formatDuration` | functions | [docs](../../../reference/api/shared/time/functions/formatDuration.md) |
| `formatEntryDate` | functions | [docs](../../../reference/api/shared/time/functions/formatEntryDate.md) |
| `formatMinutesToHoursAndMinutes` | functions | [docs](../../../reference/api/shared/time/functions/formatMinutesToHoursAndMinutes.md) |
| `getCampusWeekForIsoWeek` | functions | [docs](../../../reference/api/shared/time/functions/getCampusWeekForIsoWeek.md) |
| `getDurationMs` | functions | [docs](../../../reference/api/shared/time/functions/getDurationMs.md) |
| `getEasternDateParts` | functions | [docs](../../../reference/api/shared/eastern-time/functions/getEasternDateParts.md) |
| `getEasternDayOfWeek` | functions | [docs](../../../reference/api/shared/eastern-time/functions/getEasternDayOfWeek.md) |
| `getEffectiveScholarId` | functions | [docs](../../../reference/api/shared/auth/functions/getEffectiveScholarId.md) |
| `getStartOfDayEastern` | functions | [docs](../../../reference/api/shared/eastern-time/functions/getStartOfDayEastern.md) |
| `getWeekFetchEnd` | functions | [docs](../../../reference/api/shared/time/functions/getWeekFetchEnd.md) |
| `hasRoleAtLeast` | functions | [docs](../../../reference/api/shared/auth/functions/hasRoleAtLeast.md) |
| `isDeveloperProfile` | functions | [docs](../../../reference/api/shared/auth/functions/isDeveloperProfile.md) |
| `isUmdEmail` | functions | [docs](../../../reference/api/shared/auth/functions/isUmdEmail.md) |
| `isValidUuid` | functions | [docs](../../../reference/api/shared/auth/functions/isValidUuid.md) |
| `mapTestProfileToEffectiveRow` | functions | [docs](../../../reference/api/shared/auth/functions/mapTestProfileToEffectiveRow.md) |
| `mergeProfileWithRoster` | functions | [docs](../../../reference/api/shared/auth/functions/mergeProfileWithRoster.md) |
| `MinAppRole` | type-aliases | [docs](../../../reference/api/shared/auth/type-aliases/MinAppRole.md) |
| `mondayOfWeekEastern` | functions | [docs](../../../reference/api/shared/eastern-time/functions/mondayOfWeekEastern.md) |
| `ONE_DAY_MS` | variables | [docs](../../../reference/api/shared/eastern-time/variables/ONE_DAY_MS.md) |
| `parseEasternDate` | functions | [docs](../../../reference/api/shared/eastern-time/functions/parseEasternDate.md) |
| `ProfileWithRoster` | type-aliases | [docs](../../../reference/api/shared/auth/type-aliases/ProfileWithRoster.md) |
| `WeekDateRange` | type-aliases | [docs](../../../reference/api/shared/time-types/type-aliases/WeekDateRange.md) |
| `WEEKS_IGNORE_FORMS` | variables | [docs](../../../reference/api/shared/time-config/variables/WEEKS_IGNORE_FORMS.md) |
| `WEEKS_IGNORE_SESSIONS` | variables | [docs](../../../reference/api/shared/time-config/variables/WEEKS_IGNORE_SESSIONS.md) |
| `WINTER_BREAK_CAMPUS_WEEK_NUMBER` | variables | [docs](../../../reference/api/shared/time/variables/WINTER_BREAK_CAMPUS_WEEK_NUMBER.md) |
| `WINTER_BREAK_FIRST_DAY` | variables | [docs](../../../reference/api/shared/time-config/variables/WINTER_BREAK_FIRST_DAY.md) |
| `WINTER_BREAK_LAST_DAY` | variables | [docs](../../../reference/api/shared/time-config/variables/WINTER_BREAK_LAST_DAY.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
