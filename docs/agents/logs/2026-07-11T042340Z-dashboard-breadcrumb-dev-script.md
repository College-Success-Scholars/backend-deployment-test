# dashboard-breadcrumb-dev-script

**Date:** 2026-07-11T042340Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
DOM Path: div.group/.idebar-wrapper ha.-data-[variant=in.et]:bg-.idebar flex min-h-.vh w-full > main.bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=in.et]:m-2 md:peer-data-[variant=in.et]:ml-0 md:peer-data-[variant=in.et]:rounded-xl md:peer-data-[variant=in.et]:.hadow-.m md:peer-data-[variant=in.et]:peer-data-[.tate=collap.ed]:ml-2 > header.flex h-16 .hrink-0 item.-center gap-2
Position: top=8px, left=256px, width=1451px, height=64px
React Component: TooltipProviderProvider
HTML Element: <header class="flex h-16 shrink-0 items-center gap-2" data-cursor-element-id="cursor-el-1">Toggle Sidebar Dashboard Team Leader</header> this should be tied to the app_role and page that the client is currently on

---

DOM Path: div.group/.idebar-wrapper ha.-data-[variant=in.et]:bg-.idebar flex min-h-.vh w-full > main.bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=in.et]:m-2 md:peer-data-[variant=in.et]:ml-0 md:peer-data-[variant=in.et]:rounded-xl md:peer-data-[variant=in.et]:.hadow-.m md:peer-data-[variant=in.et]:peer-data-[.tate=collap.ed]:ml-2 > header.flex h-16 .hrink-0 item.-center gap-2 > div.flex item.-center gap-2 px-4 > nav > ol.text-muted-foreground flex flex-wrap item.-center gap-1.5 text-.m break-word. .m:gap-2.5 > li.inline-flex item.-center gap-1.5 > span.text-foreground font-normal
Position: top=30px, left=425px, width=49px, height=20px
React Component: h
HTML Element: <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" class="text-foreground font-normal" data-cursor-element-id="cursor-el-1">Scholar</span> scratch the app_role part, just do a standard breacrumb

---

make sure the directory page follows the same padding and style rules as the dashboard as the scholars home page

---

is there a better way to have the docker compose spin up for developing?

---

make a dev.sh script

---

scripts/dev.sh: line 98: wait: -n: invalid option

---

log it
```

---

## Purpose

Improve dashboard chrome and add a one-command local dev starter script.

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Implemented route-based `DashboardBreadcrumb` and `DashboardHeader` in the shared dashboard layout (Home on `/dashboard`, Dashboard → page name on sub-routes). Removed duplicate sidebar shell from the directory page and aligned its layout with the scholar home (`space-y-12 p-4`, matching header). Added `formatUserRoleLabel` for the sidebar subtitle. Advised that production `docker-compose.yml` is for CI/smoke, not daily dev; host-native `npm run dev` is faster. Created `scripts/dev.sh` to build shared, run `tsc --watch`, and start backend + frontend with env checks and cleanup on Ctrl+C. Fixed macOS Bash 3.2 incompatibility by replacing `wait -n` with `wait`.

---

## Code Changes

- `frontend/PR-debug-vercel-deployment.md`
- `frontend/app/dashboard/directory/page.tsx`
- `frontend/app/dashboard/layout.tsx`
- `frontend/components/app-sidebar.tsx`
- `frontend/components/dashboard/directory-dashboard.tsx`
- `frontend/lib/auth.test.ts`
- `frontend/lib/auth.ts`
