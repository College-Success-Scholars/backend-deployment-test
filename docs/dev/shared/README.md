# Shared

**Location:** [`shared/`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared)  
**Docs:** `docs/dev/shared/README.md`

## Navigation

[← Root](../README.md) › Shared

Children: [time & auth source files](src/README.md) (files live at the `shared/` root, not in a `src/` subdirectory)

---

## Purpose

A compiled TypeScript library shared between the backend and frontend. Contains only **pure utilities** — no server-side dependencies, no Supabase, no Node-only APIs. This constraint ensures the code runs correctly in both Node (Express) and browser/Edge (Next.js) environments.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `package.json` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/package.json) | Package config; `main` points to `dist/time.js` |
| `tsconfig.json` | [source](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/shared/tsconfig.json) | TypeScript config (compiles to `dist/`) |

---

## Subdirectories

| Directory | Docs | Description |
|-----------|------|-------------|
| `dist/` | _(generated)_ | Compiled output — do not edit manually |

Source files (`time.ts`, `auth.ts`, `campus-calendar.ts`, etc.) live at the **`shared/` root**. See [src/README.md](src/README.md) for the file index.

---

## Scripts

```bash
npm run build   # tsc → outputs to dist/
```

The shared package **must be built before** starting the backend or frontend. Both consume `shared/dist/`.

---

## How to Import

From backend or frontend:
```typescript
import { campusWeekToDateRange, dateToCampusWeek } from "shared/dist/time.js";
```

Or via the package name (if workspace symlinks are configured):
```typescript
import { campusWeekToDateRange } from "@css-atlas/shared";
```

---

## Standards

- **No side effects** — all exports are pure functions or constants.
- **No Supabase, no `server-only`, no Node-only imports** — this package must be importable from Next.js client components.
- **No React** — this is plain TypeScript, not a component library.
- **Add to `src/time.ts` exports** when adding new utilities — `time.ts` is the barrel file.
- **Run `npm run build --prefix shared` after any change** before testing in backend or frontend.
- **Compiled `dist/` is gitignored** — never commit it.
- **Types live in `time-types.ts`**, configuration constants in `time-config.ts`.

<!-- AUTO-API-REFERENCE:START -->

## API Reference

Generated from TypeScript signatures (parameters and returns on each symbol page). See also the [API Reference hub](../../reference/README.md).

| Module | Reference |
|--------|----------|
| `auth` | [API](../../reference/api/shared/auth/README.md) |
| `campus-calendar` | [API](../../reference/api/shared/campus-calendar/README.md) |
| `eastern-time` | [API](../../reference/api/shared/eastern-time/README.md) |
| `time` | [API](../../reference/api/shared/time/README.md) |
| `time-config` | [API](../../reference/api/shared/time-config/README.md) |
| `time-types` | [API](../../reference/api/shared/time-types/README.md) |

<details>
<summary>All exports (47)</summary>

| Symbol | Kind | Detail |
|--------|------|--------|
| `addEasternCalendarDays` | functions | [docs](../../reference/api/shared/eastern-time/functions/addEasternCalendarDays.md) |
| `APP_ROLE_ORDER` | variables | [docs](../../reference/api/shared/auth/variables/APP_ROLE_ORDER.md) |
| `AppRole` | type-aliases | [docs](../../reference/api/shared/auth/type-aliases/AppRole.md) |
| `CAMPUS_WEEK` | variables | [docs](../../reference/api/shared/time/variables/CAMPUS_WEEK.md) |
| `CampusCalendar` | interfaces | [docs](../../reference/api/shared/campus-calendar/interfaces/CampusCalendar.md) |
| `CampusCalendarConfig` | type-aliases | [docs](../../reference/api/shared/campus-calendar/type-aliases/CampusCalendarConfig.md) |
| `CampusDay` | type-aliases | [docs](../../reference/api/shared/campus-calendar/type-aliases/CampusDay.md) |
| `CampusWeekDateRange` | type-aliases | [docs](../../reference/api/shared/time-types/type-aliases/CampusWeekDateRange.md) |
| `CampusWeekRange` | type-aliases | [docs](../../reference/api/shared/campus-calendar/type-aliases/CampusWeekRange.md) |
| `campusWeekToDateRange` | functions | [docs](../../reference/api/shared/time/functions/campusWeekToDateRange.md) |
| `createCampusCalendar` | functions | [docs](../../reference/api/shared/campus-calendar/functions/createCampusCalendar.md) |
| `dateToCampusWeek` | functions | [docs](../../reference/api/shared/time/functions/dateToCampusWeek.md) |
| `DEV_ACTIVE_PROFILE_COOKIE` | variables | [docs](../../reference/api/shared/auth/variables/DEV_ACTIVE_PROFILE_COOKIE.md) |
| `DEV_ACTIVE_PROFILE_HEADER` | variables | [docs](../../reference/api/shared/auth/variables/DEV_ACTIVE_PROFILE_HEADER.md) |
| `DevTestProfileRow` | type-aliases | [docs](../../reference/api/shared/auth/type-aliases/DevTestProfileRow.md) |
| `EASTERN_TIMEZONE` | variables | [docs](../../reference/api/shared/eastern-time/variables/EASTERN_TIMEZONE.md) |
| `easternCalendarDaysBetween` | functions | [docs](../../reference/api/shared/eastern-time/functions/easternCalendarDaysBetween.md) |
| `EasternTimeZone` | type-aliases | [docs](../../reference/api/shared/eastern-time/type-aliases/EasternTimeZone.md) |
| `FALL_SEMESTER_FIRST_DAY` | variables | [docs](../../reference/api/shared/time-config/variables/FALL_SEMESTER_FIRST_DAY.md) |
| `formatDate` | functions | [docs](../../reference/api/shared/time/functions/formatDate.md) |
| `formatDuration` | functions | [docs](../../reference/api/shared/time/functions/formatDuration.md) |
| `formatEntryDate` | functions | [docs](../../reference/api/shared/time/functions/formatEntryDate.md) |
| `formatMinutesToHoursAndMinutes` | functions | [docs](../../reference/api/shared/time/functions/formatMinutesToHoursAndMinutes.md) |
| `getCampusWeekForIsoWeek` | functions | [docs](../../reference/api/shared/time/functions/getCampusWeekForIsoWeek.md) |
| `getDurationMs` | functions | [docs](../../reference/api/shared/time/functions/getDurationMs.md) |
| `getEasternDateParts` | functions | [docs](../../reference/api/shared/eastern-time/functions/getEasternDateParts.md) |
| `getEasternDayOfWeek` | functions | [docs](../../reference/api/shared/eastern-time/functions/getEasternDayOfWeek.md) |
| `getEffectiveScholarId` | functions | [docs](../../reference/api/shared/auth/functions/getEffectiveScholarId.md) |
| `getStartOfDayEastern` | functions | [docs](../../reference/api/shared/eastern-time/functions/getStartOfDayEastern.md) |
| `getWeekFetchEnd` | functions | [docs](../../reference/api/shared/time/functions/getWeekFetchEnd.md) |
| `hasRoleAtLeast` | functions | [docs](../../reference/api/shared/auth/functions/hasRoleAtLeast.md) |
| `isDeveloperProfile` | functions | [docs](../../reference/api/shared/auth/functions/isDeveloperProfile.md) |
| `isUmdEmail` | functions | [docs](../../reference/api/shared/auth/functions/isUmdEmail.md) |
| `isValidUuid` | functions | [docs](../../reference/api/shared/auth/functions/isValidUuid.md) |
| `mapTestProfileToEffectiveRow` | functions | [docs](../../reference/api/shared/auth/functions/mapTestProfileToEffectiveRow.md) |
| `mergeProfileWithRoster` | functions | [docs](../../reference/api/shared/auth/functions/mergeProfileWithRoster.md) |
| `MinAppRole` | type-aliases | [docs](../../reference/api/shared/auth/type-aliases/MinAppRole.md) |
| `mondayOfWeekEastern` | functions | [docs](../../reference/api/shared/eastern-time/functions/mondayOfWeekEastern.md) |
| `ONE_DAY_MS` | variables | [docs](../../reference/api/shared/eastern-time/variables/ONE_DAY_MS.md) |
| `parseEasternDate` | functions | [docs](../../reference/api/shared/eastern-time/functions/parseEasternDate.md) |
| `ProfileWithRoster` | type-aliases | [docs](../../reference/api/shared/auth/type-aliases/ProfileWithRoster.md) |
| `WeekDateRange` | type-aliases | [docs](../../reference/api/shared/time-types/type-aliases/WeekDateRange.md) |
| `WEEKS_IGNORE_FORMS` | variables | [docs](../../reference/api/shared/time-config/variables/WEEKS_IGNORE_FORMS.md) |
| `WEEKS_IGNORE_SESSIONS` | variables | [docs](../../reference/api/shared/time-config/variables/WEEKS_IGNORE_SESSIONS.md) |
| `WINTER_BREAK_CAMPUS_WEEK_NUMBER` | variables | [docs](../../reference/api/shared/time/variables/WINTER_BREAK_CAMPUS_WEEK_NUMBER.md) |
| `WINTER_BREAK_FIRST_DAY` | variables | [docs](../../reference/api/shared/time-config/variables/WINTER_BREAK_FIRST_DAY.md) |
| `WINTER_BREAK_LAST_DAY` | variables | [docs](../../reference/api/shared/time-config/variables/WINTER_BREAK_LAST_DAY.md) |

</details>

<!-- AUTO-API-REFERENCE:END -->
