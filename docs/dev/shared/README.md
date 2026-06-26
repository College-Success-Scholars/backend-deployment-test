# Shared

**Location:** [`shared/`](../../../shared/)  
**Docs:** `docs/dev/shared/README.md`

## Navigation

[← Root](../README.md) › Shared

Children: [src/](src/README.md)

---

## Purpose

A compiled TypeScript library shared between the backend and frontend. Contains only **pure utilities** — no server-side dependencies, no Supabase, no Node-only APIs. This constraint ensures the code runs correctly in both Node (Express) and browser/Edge (Next.js) environments.

---

## Files

| File | Source Link | Description |
|------|-------------|-------------|
| `package.json` | [source](../../../shared/package.json) | Package config; `main` points to `dist/time.js` |
| `tsconfig.json` | [source](../../../shared/tsconfig.json) | TypeScript config (compiles to `dist/`) |

---

## Subdirectories

| Directory | Docs | Description |
|-----------|------|-------------|
| `src/` | [src/README.md](src/README.md) | TypeScript source files |
| `dist/` | _(generated)_ | Compiled output — do not edit manually |

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
