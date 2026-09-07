# Graph Report - .  (2026-07-17)

## Corpus Check
- 471 files · ~334,043 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2400 nodes · 5293 edges · 187 communities (138 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.76)
- Token cost: 9,500 input · 860,458 output

## Community Hubs (Navigation)
- UI Card & Badge Components
- Dashboard Memo Sub-pages
- Traffic Heat Map & Legacy Memo
- Session Record Backend
- Session Log Backend
- Dev Profile Server Data Layer
- Backend package.json Deps
- Form Log Backend Model/Service
- Memo Page & User Backend
- UI Button & Form Logs Test
- Shared Campus Calendar/Time Utils
- Landing Page & Charts
- Form Log Backend Controller
- Dashboard Nav & Sidebar Widgets
- UI Sidebar/Sheet/Tooltip Primitives
- Legacy Session Ticket Double-Entry
- Personal Dashboard Client
- Frontend tsconfig
- Docs tsconfig
- Dashboard Personal/Settings Pages
- Backend Routes & App Entry
- Legacy Campus Week Time Lib
- Dev Session Logs & Double-Entry Checker
- Weekly Memo Legacy Async Content
- Dev Auth/Profile Server Actions
- App Sidebar & Weekly Memo Access
- Legacy Form Log Deadlines/Name Matching
- Frontend package.json Deps (eslint/tailwind)
- Mentee Monitoring Dashboard
- Backend API Docs & Codebase Notes
- Data Table Components
- Traffic Check-in Form Tests
- Frontend package.json Deps (charts/date)
- Root package.json & Scripts
- Nav Main/Projects/Secondary Components
- Backend tsconfig
- Form Submission Details Modal
- Traffic Backend Service/Controller
- Dashboard Layout & Header
- Issue Tracker & Triage Docs
- Memo Types & Tutoring Log Section
- Weekly Memo Nav Context
- API Client (client/server)
- Activity Log Dictionary & Progress Cell
- shadcn Components Config
- Chart UI Components
- Backend Auth Controller/Routes
- Tutor Report Log Backend
- Weekly Memo Assembler & Risk Classifier
- Dashboard Breadcrumb
- TypeDoc Config
- Auth/Deployment Agent Logs
- Weekly Memo Week Nav & Profile Switcher
- Shared tsconfig
- Memo Backend Controller/Service
- Supabase Migration Baseline Agent Logs
- Frontend/Lib READMEs & Campus Time Docs
- Dev Session Logs Server Data
- Dev Session Records Test Page
- Activity Log Client Widgets
- TypeDoc Backend Entry Points
- Docs API Index Generation Script
- Supabase Client & DB Types
- Docs Site & API Reference Config
- Shared Auth Role Hierarchy
- Backend Layered Architecture Docs
- General Sign-Up Flow Docs
- Auth/RLS Runbook & Roles Docs
- Frontend Lib/Supabase READMEs
- Weekly Memo Mock Data & Types
- Session Log Types
- Frontend package.json Scripts
- TypeDoc Block Tags Config
- Form Deadlines Utils
- Legacy Form View Helpers
- Legacy Session Records Weekly Minutes
- Architectural Alerts Issue Templates
- Frontend App Auth/Traffic Docs
- Supabase Session Middleware & Security
- Auth Confirm/Set-Password Routes
- Team Leader Performance Table
- Root Layout & Theme Provider
- Traffic Layout Idle Reset
- Auth Button & Legacy API Routes
- Mentee RPC Test Script
- Ubiquitous Language: Forms & Memo
- Onboarding Docs
- Legacy Traffic Session Utils
- Shared package.json
- Dev Auth Profile Resolution
- Acting-Mode Write Rejection Middleware
- Full Attendance Detail Section
- Dev Form Logs Test Page
- Docs Link Rewrite Script
- Vercel Deployment Config
- Domain Docs & ADR Conventions
- Daily Scholar Activity Backend
- Dev Tools App Docs
- Dev Handbook & Campus Weeks Docs
- Docs API Coverage Check Script
- CI Jobs & Docker Compose
- Weekly Memo Nav Polish Agent Logs
- Traffic Kiosk Public Access Agent Logs
- Ubiquitous Language: Roles
- Dev Scripts README
- Weekly Memo Source Fetch
- Legacy Memo/Traffic Sync Routes
- TypeDoc Exclude Patterns
- Windows Dev Script (dev.ps1)
- Mentee Backend Service
- Auth Role Hierarchy Dedup Agent Log
- Ubiquitous Language: MCF & Risk
- Theme Safety Check Script
- Docs API Markdown Copy Script
- Dashboard Breadcrumb Agent Log
- Dark Mode Color Token Agent Logs
- Architecture Alerts Skill Agent Logs
- Deployment & Backend READMEs
- Supabase CLI Migrations Docs
- Dev Home Page Client
- Dev Traffic Page
- Frontend ESLint Config
- Issue Tracker Config Docs
- Triage Labels & Bug Template
- Auth Profile Insert Fix Agent Log
- UMD Email Restriction Agent Log
- API Contract Normalization Agent Log
- CODEOWNERS Branching Policy Agent Logs
- Docs Site Generation Agent Log
- Complete Profile Form Fix Agent Log
- Empty Route API Pages Agent Log
- Windows Dev Script Agent Logs
- Frontend Components READMEs
- Dev Session Records Layout
- Dev Shell Script (dev.sh)
- Issue Labels Ensure Script
- Smoke Test Script
- Docker Compose Services
- Smoke Test CORS Fix Agent Log
- D3 Type Declarations
- Next.js Config
- date-fns Dependency
- lucide-react Dependency
- next Dependency
- Radix Checkbox Dependency
- Radix Dialog Dependency
- Radix Dropdown Menu Dependency
- Radix Label Dependency
- Radix Separator Dependency
- Radix Slot Dependency
- Radix Tooltip Dependency
- Supabase SSR Dependency
- Supabase JS Dependency
- tailwind-merge Dependency
- Vercel Analytics Dependency
- Zod Dependency
- PostCSS Config
- Recharts Type Declarations
- TypeDoc Sort Config
- TypeDoc Markdown Plugin
- Alert Script (alert.sh)
- Agent Session Logging Script
- Legacy Alert Migration Script
- Two-App Architecture Concept
- Backend Server Entry Concept
- Docs Root Redirect Agent Log
- Ubiquitous Language: Program
- Ubiquitous Language: Program Admin
- Ubiquitous Language: Scholar ID
- Orphaned Starter File: Deploy Button
- Orphaned Starter File: Hero
- Orphaned Starter File: Next Logo
- Orphaned Starter File: Supabase Logo
- Server Data Scholar UID Helper
- File Icon Asset
- Globe Icon Asset
- Next.js Logo Asset
- UMD McKeldin Library Photo
- UMD Trees Walkway Photo (2)
- UMD Trees Walkway Photo
- Vercel Logo Asset
- Window Icon Asset

## God Nodes (most connected - your core abstractions)
1. `cn()` - 149 edges
2. `react` - 72 edges
3. `getSupabaseClient()` - 66 edges
4. `Card()` - 54 edges
5. `CardContent()` - 52 edges
6. `backendGet()` - 44 edges
7. `CardTitle()` - 41 edges
8. `CardHeader()` - 40 edges
9. `CardDescription()` - 33 edges
10. `Badge()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Traffic Kiosk Public Contract (always-public rule)` --semantically_similar_to--> `requireAuth()`  [INFERRED] [semantically similar]
  docs/dev/frontend/app/traffic/README.md → backend/src/controllers/auth.controller.ts
- `mentee-wahf-card.tsx (duplicate, removed)` --semantically_similar_to--> `WahfCard()`  [INFERRED] [semantically similar]
  docs/agents/logs/2026-07-11T072147Z-frontend-component-reorganization.md → frontend/components/mentee-monitoring/wahf-card.tsx
- `Developer Scratchpad Pattern (app/dev, requireDeveloper-gated)` --semantically_similar_to--> `rejectWritesWhenActing()`  [INFERRED] [semantically similar]
  docs/dev/frontend/app/dev/README.md → backend/src/middleware/reject-writes-when-acting.ts
- `tl-pages-effective-role-redirect (agent log)` --references--> `canAccessWeeklyMemo()`  [AMBIGUOUS]
  docs/agents/logs/2026-07-14T231614Z-tl-pages-effective-role-redirect.md → frontend/lib/auth.ts
- `tl-pages-effective-role-redirect (agent log)` --references--> `getTeamLeaderOrAboveUser()`  [AMBIGUOUS]
  docs/agents/logs/2026-07-14T231614Z-tl-pages-effective-role-redirect.md → frontend/lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI Pipeline (shared-build → backend/frontend-test → docker-build → smoke-test)** — github_workflows_ci_shared_build, github_workflows_ci_backend_test, github_workflows_ci_frontend_test, github_workflows_ci_docker_build, github_workflows_ci_smoke_test [EXTRACTED 1.00]
- **Backend Auth-to-Data Request Flow** — docs_agents_codebase_notes_request_flow, docs_agents_codebase_notes_auth_controller, docs_agents_codebase_notes_supabase_client, backend_api_requireauth [EXTRACTED 1.00]
- **Architectural Alerts Issue Workflow** — agents_architectural_alerts, github_issue_template_architecture_alert_template, docs_agents_alerts_readme_doc, scripts_alert_sh, scripts_resolve_alert_sh [EXTRACTED 1.00]
- **Weekly Memo composed of KPI cards, Recognition board, Attendance detail, Form submissions, scoped to a Campus Week** — docs_agents_ubiquitous_language_weekly_memo, docs_agents_ubiquitous_language_campus_week, docs_agents_ubiquitous_language_kpi_card, docs_agents_ubiquitous_language_scholar_follow_up, docs_agents_ubiquitous_language_recognition_board, docs_agents_ubiquitous_language_attendance_detail, docs_agents_ubiquitous_language_form_submissions [EXTRACTED 1.00]
- **GitHub issue triage pipeline: Issues, Triage labels, Project board, and the issue-triage Action** — docs_agents_issue_tracker_issue_tracker, docs_agents_triage_labels_triage_labels, docs_agents_github_project_board_github_project_board, docs_agents_issue_tracker_issue_triage_workflow [EXTRACTED 1.00]
- **In-source READMEs point to canonical docs/dev/ counterparts (frontend, lib, and inconsistently dev routes)** — frontend_readme_frontend, frontend_lib_readme_lib, frontend_app_dev_readme_dev_tools, docs_dev_frontend_readme_readme, docs_dev_frontend_lib_readme_readme, docs_dev_frontend_app_dev_readme_readme [INFERRED 0.75]
- **Auth Role Hierarchy Consolidation into shared/auth.ts** — frontend_lib_supabase_server_hasroleatleast, shared_auth_hasroleatleast, shared_auth_app_role_order, backend_src_controllers_auth_controller [INFERRED 0.85]
- **Weekly Memo Feature Evolution (Nav Polish, Wire Contract Normalization, Tutoring Log)** — frontend_app_dashboard_memo__components_weekly_memo_week_nav_weeklymemoweeknav, backend_src_services_memo_page_service, frontend_app_dashboard_memo__components_tutoring_log_section_tutoringlogsection [INFERRED 0.75]
- **Orphaned Next.js/Supabase Starter Template Files Deleted Together** — frontend_components_hero_hero, frontend_components_deploy_button_deploybutton, frontend_components_next_logo_nextlogo, frontend_components_supabase_logo_supabaselogo [EXTRACTED 1.00]
- **Dark Mode & Badge Theming Feature Arc** — docs_agents_logs_2026_07_14t223319z_dark_mode_centralized_colors_log, docs_agents_logs_2026_07_14t225729z_soft_badge_muted_foreground_log, docs_agents_logs_2026_07_14t231238z_warning_badge_dark_ink_log [INFERRED 0.85]
- **Traffic Public Kiosk & TL Redirect Feature Arc** — docs_agents_logs_2026_07_14t231614z_tl_pages_effective_role_redirect_log, docs_agents_logs_2026_07_14t232442z_traffic_public_ungated_kiosk_log, docs_agents_logs_2026_07_14t233049z_traffic_public_docs_and_layout_test_log, docs_agents_logs_2026_07_14t233705z_tl_redirects_and_public_traffic_kiosk_log [INFERRED 0.90]
- **Docs Tree Restructuring Initiative** — docs_agents_logs_2026_07_14t000158z_fix_empty_route_api_pages_log, docs_agents_logs_2026_07_14t195736z_onboarding_docs_section_log, docs_agents_logs_2026_07_14t212028z_trim_handbook_docs_log [INFERRED 0.75]
- **Supabase Backend Access Migration Effort** — docs_agents_logs_2026_07_15t052419z_supabase_phase1_baseline_dump_log, docs_agents_logs_2026_07_15t054133z_supabase_step2_migration_history_repair_log, docs_agents_logs_2026_07_15t061532z_backend_typed_supabase_client_log, docs_agents_logs_2026_07_15t065838z_delete_supabase_service_reexport_log, docs_agents_logs_2026_07_15t052419z_supabase_phase1_baseline_dump_baseline, docs_agents_logs_2026_07_15t061532z_backend_typed_supabase_client_client [INFERRED 0.85]
- **CODEOWNERS and Branching Policy Rollout** — docs_agents_logs_2026_07_16t150516z_codeowners_and_branching_docs_log, docs_agents_logs_2026_07_16t150919z_fix_codeowners_team_slugs_log, docs_agents_logs_2026_07_16t151415z_codeowners_branching_policy_log, docs_agents_logs_2026_07_16t151415z_codeowners_branching_policy_policy [EXTRACTED 1.00]
- **Milestones Draft Lifecycle (create, adapt, annotate, delete)** — docs_agents_logs_2026_07_15t232905z_github_project_board_and_milestones_draft_log, docs_agents_logs_2026_07_16t052019z_adapt_milestones_product_order_log, docs_agents_logs_2026_07_16t052050z_google_form_intake_docs_log, docs_agents_logs_2026_07_16t060553z_delete_milestones_draft_log, docs_agents_logs_2026_07_15t232905z_github_project_board_and_milestones_draft_milestones [EXTRACTED 1.00]
- **Traffic Domain Layered Implementation (route/controller/service/model)** — backend_src_routes_traffic_routes, backend_src_controllers_traffic_controller, backend_src_services_traffic_service, backend_src_models_traffic_model [EXTRACTED 1.00]
- **Scholar Sign-up Email Confirmation & Profile Completion Flow** — docs_dev_frontend_app_auth_email_templates_confirm_signup, frontend_app_auth_confirm_route_ts, frontend_app_auth_complete_profile_flow, backend_src_controllers_auth_controller_buildscholarprofileinsertrow [EXTRACTED 1.00]
- **Supabase JWT Request-Scoped Client Flow (runWithToken -> AsyncLocalStorage -> getSupabaseClient)** — backend_src_controllers_auth_controller, backend_src_supabase_client_runwithtoken, backend_src_supabase_client_getsupabaseclient [EXTRACTED 1.00]
- **Guided first-week onboarding path** — docs_dev_onboarding_day_0_setup, docs_dev_onboarding_roles_and_personas, docs_dev_onboarding_campus_weeks, docs_dev_onboarding_branching_and_reviews, docs_dev_onboarding_golden_path_first_pr [EXTRACTED 1.00]
- **Architecture-alert issue-tracking script flow** — docs_dev_scripts_readme_alert_sh, docs_dev_scripts_readme_resolve_alert_sh, docs_dev_scripts_readme_ensure_issue_labels_sh, docs_dev_scripts_readme_migrate_alerts_to_issues_sh [EXTRACTED 1.00]
- **PR review process (branch policy + template + walkthrough)** — docs_dev_onboarding_branching_and_reviews, docs_dev_pr_template, docs_dev_onboarding_golden_path_first_pr [EXTRACTED 1.00]

## Communities (187 total, 49 thin omitted)

### Community 0 - "UI Card & Badge Components"
Cohesion: 0.09
Nodes (33): MemoAccordionSectionProps, WeeklyKpiCardsProps, metadata, PageProps, metadata, metadata, PageProps, SLOT_MINUTES_OPTIONS (+25 more)

### Community 1 - "Dashboard Memo Sub-pages"
Cohesion: 0.07
Nodes (36): Settings Formatting Cleanup, AddOpportunityForm, getUniqueCompanies(), getUniqueTags(), InternshipBoardPage(), mockOpportunities, Opportunity, FormSubmissionsSectionProps (+28 more)

### Community 2 - "Traffic Heat Map & Legacy Memo"
Cohesion: 0.05
Nodes (43): addSessionToGrid(), aggregate(), DAYS, parseET(), SLOT_OPTIONS, TrafficHeatMapSection(), TrafficHeatMapSectionProps, SLOT_MINUTES_OPTIONS (+35 more)

### Community 3 - "Session Record Backend"
Cohesion: 0.08
Nodes (52): excuseFrontDesk(), excuseStudy(), getFrontDesk(), getStudy(), getTestProfiles(), syncFrontDesk(), syncFrontDeskAll(), syncStudy() (+44 more)

### Community 4 - "Session Log Backend"
Cohesion: 0.10
Nodes (49): fetchFrontDesk(), fetchStudy(), frontDeskCleaned(), frontDeskCompleted(), frontDeskInRoom(), parseDateOrUndefined(), studyCleaned(), studyCompleted() (+41 more)

### Community 5 - "Dev Profile Server Data Layer"
Cohesion: 0.07
Nodes (41): DevProfilePage(), parseWeek(), DailyActivityMinutesNote(), backendGet(), fetchAllUserUids(), fetchScholarUids(), FrontDeskRecordWithName, getFrontDeskRecord() (+33 more)

### Community 6 - "Backend package.json Deps"
Cohesion: 0.04
Nodes (44): author, dependencies, cors, date-fns, dotenv, express, @supabase/supabase-js, description (+36 more)

### Community 7 - "Form Log Backend Model/Service"
Cohesion: 0.10
Nodes (39): recentSubmissions(), ActivityFormType, FormLogRowWithLate, McfFormLogRow, RecentFormSubmission, TeamLeaderFormStatsRow, TeamLeaderNameRecord, WahfFormLogRow (+31 more)

### Community 8 - "Memo Page & User Backend"
Cohesion: 0.10
Nodes (36): teamLeaderStats(), allUids(), eligibleScholars(), getByUid(), memoUsers(), requiredHours(), scholarNames(), scholarUids() (+28 more)

### Community 9 - "UI Button & Form Logs Test"
Cohesion: 0.14
Nodes (16): Event, TrafficCheckInFormProps, ForgotPasswordForm(), LoginForm(), LogoutButton(), SignUpForm(), copy, UpdatePasswordForm() (+8 more)

### Community 10 - "Shared Campus Calendar/Time Utils"
Cohesion: 0.11
Nodes (23): CampusCalendar, CampusCalendarConfig, CampusDay, CampusWeekRange, createCampusCalendar(), config, addEasternCalendarDays(), easternCalendarDaysBetween() (+15 more)

### Community 11 - "Landing Page & Charts"
Cohesion: 0.09
Nodes (28): Home(), CompleteProfileForm(), DailyWeekTile, FrontDeskChart(), FrontDeskChartProps, StudySessionChart(), StudySessionChartProps, mentee-wahf-card.tsx (duplicate, removed) (+20 more)

### Community 12 - "Form Log Backend Controller"
Cohesion: 0.11
Nodes (36): getFormLog(), dailyActivityByUids(), getFormLog(), mcfByUid(), mcfByUidAndWeek(), mcfByUidAndWeekWithLate(), mcfByUids(), mcfByUidWithLate() (+28 more)

### Community 13 - "Dashboard Nav & Sidebar Widgets"
Cohesion: 0.10
Nodes (22): DirectoryDashboard(), FilterDropdownProps, filterOptions, ProfileCardProps, TODO: Implement profile navigation or modal, sampleProfiles, getInitials(), NavUser() (+14 more)

### Community 14 - "UI Sidebar/Sheet/Tooltip Primitives"
Cohesion: 0.09
Nodes (28): NavProjects(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+20 more)

### Community 15 - "Legacy Session Ticket Double-Entry"
Cohesion: 0.14
Nodes (30): DoubleEntry, DoubleEntryOptions, getDoubleEntries(), overlapMs(), CleanedAndErroredOptions, filterBySessionType(), getCleanedAndErroredTickets(), getEasternDayKey() (+22 more)

### Community 16 - "Personal Dashboard Client"
Cohesion: 0.10
Nodes (29): DialogState, FORM_DEADLINES, FORM_TYPES, FORM_URLS, FormDetailDialog(), FormDetailDialogContent(), FormTabBody(), HistoryFormRow() (+21 more)

### Community 17 - "Frontend tsconfig"
Cohesion: 0.06
Nodes (32): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+24 more)

### Community 18 - "Docs tsconfig"
Cohesion: 0.06
Nodes (32): backend/dist/**, backend/src/**/*.ts, frontend/lib/**/*.ts, frontend/lib/**/*.tsx, shared/dist/**, shared/**/*.ts, **/*.spec.ts, compilerOptions (+24 more)

### Community 19 - "Dashboard Personal/Settings Pages"
Cohesion: 0.12
Nodes (25): Campus Week Calendar Preferred Over /api/auth/semester, Auth Semester Sparingly Docs, Auth Semester: When Calendar Unfit, WeeklyMemoLayout(), MenteePage(), PersonalPage(), SettingsPage(), LegacyMemoLayout() (+17 more)

### Community 20 - "Backend Routes & App Entry"
Cohesion: 0.10
Nodes (16): allowedOrigins, app, getRequestUrl(), requestLogger(), router, router, router, router (+8 more)

### Community 21 - "Legacy Campus Week Time Lib"
Cohesion: 0.14
Nodes (26): addEasternCalendarDays(), CAMPUS_WEEK, CampusWeekDateRange, campusWeekToDateRange(), dateToCampusWeek(), daysBackToMondayEastern(), easternCalendarDaysBetween(), FIRST_SPRING_MONDAY (+18 more)

### Community 22 - "Dev Session Logs & Double-Entry Checker"
Cohesion: 0.10
Nodes (18): metadata, PageProps, addSessionToGrid(), aggregate(), DAYS, HOURS, parseET(), SessionHeatMap() (+10 more)

### Community 23 - "Weekly Memo Legacy Async Content"
Cohesion: 0.11
Nodes (21): FormSubmissionsSection(), renderStatus(), RecognitionBoardSection(), RecognitionBoardSectionProps, ScholarFollowUpTable(), TutoringLogSection(), WeeklyKpiCards(), {
  mockGetWeeklyMemoPageData,
  mockWeeklyMemoNavSync,
  mockWeeklyKpiCards,
  mockTeamLeaderPerformanceTable,
  mockScholarFollowUpTable,
  mockRecognitionBoardSection,
  mockTutoringLogSection,
  mockFullAttendanceDetailSection,
  mockFormSubmissionsSection,
} (+13 more)

### Community 24 - "Dev Auth/Profile Server Actions"
Cohesion: 0.14
Nodes (17): GET(), PATCH(), GET(), POST(), POST(), PATCH(), GET(), POST() (+9 more)

### Community 25 - "App Sidebar & Weekly Memo Access"
Cohesion: 0.15
Nodes (23): DevLayout(), metadata, DevActingBanner(), DevActingBannerProps, AppSidebar(), AppSidebarProps, defaultData, getRoleBasedNav() (+15 more)

### Community 26 - "Legacy Form Log Deadlines/Name Matching"
Cohesion: 0.21
Nodes (22): getMcfWplDeadlineForWeek(), getWhafDeadlineForWeek(), isLateAfterDeadline(), isMcfLate(), isMcfLateForWeek(), isWhafLate(), isWhafLateForWeek(), isWplLate() (+14 more)

### Community 27 - "Frontend package.json Deps (eslint/tailwind)"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, tailwindcss (+17 more)

### Community 28 - "Mentee Monitoring Dashboard"
Cohesion: 0.17
Nodes (19): MenteeMonitoringClient(), SeminarsCard(), TutoringCard(), TutoringCardProps, computeDailyHours(), computeTutoringSessions(), computeWahfStatus(), computeWeekOptions() (+11 more)

### Community 29 - "Backend API Docs & Codebase Notes"
Cohesion: 0.09
Nodes (24): Knowledge Base Pointer (codebase-notes.md), buildScholarProfileInsertRow (user.service.ts), CSS Atlas Backend API Documentation, get_my_mentees Supabase RPC, get_weekly_memo Supabase RPC, refresh_weekly_stats Supabase Edge Function, requireAuth (auth level), requireDeveloper (auth level) (+16 more)

### Community 30 - "Data Table Components"
Cohesion: 0.13
Nodes (19): TeamLeadersTable(), displayName(), ProfilesUserTable(), DataTable(), DataTableColumn, DataTableColumnConfig, DataTableProps, getCellDisplay() (+11 more)

### Community 31 - "Traffic Check-in Form Tests"
Cohesion: 0.19
Nodes (15): totalMinutes(), DurationChoice, baseProps, TrafficCheckInForm(), formatDuration(), formatEstimatedExit(), getCustomTotalMinutes(), TrafficSuccessScreen() (+7 more)

### Community 32 - "Frontend package.json Deps (charts/date)"
Cohesion: 0.09
Nodes (23): class-variance-authority, clsx, d3, @date-fns/utc, dependencies, class-variance-authority, clsx, d3 (+15 more)

### Community 33 - "Root package.json & Scripts"
Cohesion: 0.09
Nodes (22): dependencies, @radix-ui/react-accordion, devDependencies, typedoc, typedoc-plugin-markdown, typescript, typedoc, typescript (+14 more)

### Community 34 - "Nav Main/Projects/Secondary Components"
Cohesion: 0.18
Nodes (17): NavMain(), NavSecondary(), NavSidebarIcon(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarMenu(), SidebarMenuAction() (+9 more)

### Community 35 - "Backend tsconfig"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, declarationMap, isolatedModules, jsx, module, moduleDetection, noUncheckedIndexedAccess (+12 more)

### Community 36 - "Form Submission Details Modal"
Cohesion: 0.24
Nodes (18): formatAssignmentGrades(), formatProjects(), formatStructured(), formatSubmittedAt(), McfRows(), SubmissionDetailsModal(), WhafRows(), WplRows() (+10 more)

### Community 37 - "Traffic Backend Service/Controller"
Cohesion: 0.21
Nodes (17): trafficCount(), entryCount(), entryCounts(), parseWeekNum(), sessionsForWeek(), TrafficRow, TrafficSession, WeekEntryCount (+9 more)

### Community 38 - "Dashboard Layout & Header"
Cohesion: 0.13
Nodes (13): CompleteProfilePage(), DashboardLayout(), Page(), DefaultDashboard(), ScholarDashboard(), TeamLeaderDashboard(), DashboardHeader(), ThemeToggle() (+5 more)

### Community 39 - "Issue Tracker & Triage Docs"
Cohesion: 0.13
Nodes (19): Blocked column, GitHub Project Board, Needs info column, Ready column, Triage column, scripts/alert.sh, scripts/ensure-issue-labels.sh, Issue Tracker (GitHub Issues) (+11 more)

### Community 40 - "Memo Types & Tutoring Log Section"
Cohesion: 0.12
Nodes (17): DAY_SORT_MAP, emptySessionColumns, sessionColumns, TutoringLogSectionProps, FormSubmissionRow, FormSubmissionsSectionData, FormSubmissionStatus, FormSubmissionSummary (+9 more)

### Community 41 - "Weekly Memo Nav Context"
Cohesion: 0.15
Nodes (15): WeeklyMemoHeaderShell(), WeeklyMemoHeaderShellContent(), WeeklyMemoHeaderShellProps, defaultState, useWeeklyMemoNav(), WeeklyMemoNavContext, WeeklyMemoNavProvider(), WeeklyMemoNavSetterContext (+7 more)

### Community 42 - "API Client (client/server)"
Cohesion: 0.26
Nodes (16): ApiLogScope, buildBackendRequestUrl(), logApiError(), logApiRequest(), logApiResponse(), scopeLabel(), backendFetch(), backendPatch() (+8 more)

### Community 43 - "Activity Log Dictionary & Progress Cell"
Cohesion: 0.16
Nodes (16): Frontend Component Reorganization, /memo route (thin redirect to /dashboard/memo), formatRequiredAsHours(), getPctBgClass(), ProgressCell(), ProgressCellCountProps, ProgressCellProps, ProgressCellTimeProps (+8 more)

### Community 44 - "shadcn Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 45 - "Chart UI Components"
Cohesion: 0.18
Nodes (12): chartData, chartData, CardFooter(), ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent() (+4 more)

### Community 46 - "Backend Auth Controller/Routes"
Cohesion: 0.26
Nodes (14): createProfile(), CreateProfileBody, extractUser(), formatSupabaseError(), getMe(), getProfile(), nextWithToken(), requireAuth() (+6 more)

### Community 47 - "Tutor Report Log Backend"
Cohesion: 0.25
Nodes (14): tutorReportsByUids(), attended(), byUid(), byUidAndWeek(), forWeek(), paramStr(), TODO: A future column (e.g. `session_date`) will allow tutors to specify, TutorReportLogRow (+6 more)

### Community 48 - "Weekly Memo Assembler & Risk Classifier"
Cohesion: 0.23
Nodes (12): Frontend Dashboard Memo README, Frontend Dashboard README, classifyScholarFollowUpRisk(), toScholarYear(), aggregateSessionMinutes(), assembleWeeklyMemo(), buildTeamLeaderRows(), buildTutoringLog() (+4 more)

### Community 49 - "Dashboard Breadcrumb"
Cohesion: 0.20
Nodes (13): DashboardBreadcrumb(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator() (+5 more)

### Community 50 - "TypeDoc Config"
Cohesion: 0.12
Nodes (16): categorizeByGroup, entryPointStrategy, excludeExternals, excludeInternal, excludePrivate, githubPages, gitRevision, includeVersion (+8 more)

### Community 51 - "Auth/Deployment Agent Logs"
Cohesion: 0.14
Nodes (16): getActiveSemester(), supabase-schema-drift-alert (agent log), Supabase-vs-codebase schema drift remediation plan, Deployment topology documentation (Railway/Vercel/Docker Compose), deployment-architecture-docs (agent log), nixpacks-vs-docker (agent log), Nixpacks auto-build vs explicit Dockerfile trade-off, onboarding-docs-section (agent log) (+8 more)

### Community 52 - "Weekly Memo Week Nav & Profile Switcher"
Cohesion: 0.21
Nodes (12): WeeklyMemoWeekNavProps, ProfileSwitcher(), ProfileSwitcherProps, Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+4 more)

### Community 53 - "Shared tsconfig"
Cohesion: 0.12
Nodes (15): ./dist, compilerOptions, declaration, module, moduleResolution, outDir, rootDir, skipLibCheck (+7 more)

### Community 54 - "Memo Backend Controller/Service"
Cohesion: 0.21
Nodes (12): Form Log Controller Direct-Supabase-Query Handlers (whafByUids, mcfByUids, wplByUids, tutorReportsByUids, dailyActivityByUids, getFormLog), pageData(), parseWeekNumberFromBody(), refreshStats(), sync(), weeklyMemo(), getWeeklyMemo(), syncMemo() (+4 more)

### Community 55 - "Supabase Migration Baseline Agent Logs"
Cohesion: 0.22
Nodes (15): Supabase Migration Baseline, Agent Log: supabase-phase1-baseline-dump, Backend-Only Supabase Access Pattern, Agent Log: docs-no-supabase-edge-functions, Agent Log: supabase-step2-migration-history-repair, Backend Typed Supabase Client (backend/src/supabase), Agent Log: backend-typed-supabase-client, Agent Log: delete-supabase-service-reexport (+7 more)

### Community 56 - "Frontend/Lib READMEs & Campus Time Docs"
Cohesion: 0.18
Nodes (13): docs/dev/frontend/lib/README.md (canonical), lib/time/config.ts (FALL_SEMESTER_FIRST_DAY, WINTER_BREAK_FIRST_DAY, WINTER_BREAK_LAST_DAY), Campus time (lib/time) semantics, lib/client/ (browser-side backend API client), frontend/lib (shared utilities, types, server-side data layer), lib/server/ (server-only backend API client), lib/supabase/ (auth-only Supabase client factories), lib/utils.ts (cn()) (+5 more)

### Community 57 - "Dev Session Logs Server Data"
Cohesion: 0.23
Nodes (15): SessionLogsTestPage(), backendPost(), dateOpts(), fetchFrontDeskLogs(), fetchStudySessionLogs(), getFrontDeskCleanedAndErrored(), getFrontDeskCompletedSessions(), getFrontDeskScholarsInRoom() (+7 more)

### Community 58 - "Dev Session Records Test Page"
Cohesion: 0.19
Nodes (13): addTotalFrontDesk(), addTotalStudy(), CombinedTotalProgressCell(), formatRequiredAsHours(), FrontDeskRecordRowWithName, FrontDeskRecordRowWithTotal, getRequiredBgClass(), getSharedMinutesColumns() (+5 more)

### Community 59 - "Activity Log Client Widgets"
Cohesion: 0.19
Nodes (12): ActivityLogClient(), FilterType, formatSubmittedAt(), renderDetails(), stringifyValue(), FilterType, formatSubmittedAt(), PersonalActivityLogClient() (+4 more)

### Community 60 - "TypeDoc Backend Entry Points"
Cohesion: 0.13
Nodes (15): backend/src/controllers, backend/src/middleware, backend/src/models, backend/src/services, backend/src/supabase/client.ts, frontend/lib, shared/auth.ts, shared/campus-calendar.ts (+7 more)

### Community 61 - "Docs API Index Generation Script"
Cohesion: 0.24
Nodes (13): API_ROOT, buildModuleTable(), buildRoutesSection(), buildSection(), hub, KIND_DIRS, listChildModules(), listDocumentedModules() (+5 more)

### Community 62 - "Supabase Client & DB Types"
Cohesion: 0.15
Nodes (12): AppSupabaseClient, tokenStore, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+4 more)

### Community 63 - "Docs Site & API Reference Config"
Cohesion: 0.18
Nodes (14): Ubiquitous Language (domain glossary), docs/dev/backend/api.md (REST API), docs/dev/frontend/README.md (canonical), docs/dev/README.md (handbook home), CSS Atlas Docs landing/redirect page, API Reference (TypeDoc generated), frontend/components/mentee-monitoring/utils.ts, frontend/components/personal/utils.ts (+6 more)

### Community 64 - "Shared Auth Role Hierarchy"
Cohesion: 0.20
Nodes (11): AppRole, DevTestProfileRow, getEffectiveScholarId(), isValidUuid(), mapTestProfileToEffectiveRow(), mergeProfileWithRoster(), MinAppRole, ProfileWithRoster (+3 more)

### Community 65 - "Backend Layered Architecture Docs"
Cohesion: 0.24
Nodes (12): Four-Layer Backend Architecture (routes -> controllers -> services -> models), app.ts (Express app factory), requireSelfOrTeamLeader(), router, server.ts (process entry point), Supabase Per-Request Client Pattern (JWT via AsyncLocalStorage), Backend Controllers README, Backend Models README (+4 more)

### Community 66 - "General Sign-Up Flow Docs"
Cohesion: 0.17
Nodes (13): auth.controller.ts (POST /api/auth/profile), public.dev_test_profiles (developer persona switching), General Sign-Up Flow, Invite alternate flow (type=invite), mergeProfileWithRoster (roster backfill mechanism), Pre-provisioned users flow, Removal checklist for self-service sign-up, requireTeamLeaderOrAbove (memo access guard) (+5 more)

### Community 67 - "Auth/RLS Runbook & Roles Docs"
Cohesion: 0.19
Nodes (13): Backend Middleware README, api-client.ts JWT-to-backend fetch flow, recordTrafficEntry public unauthenticated endpoint, Auth & RLS runbook, Auth flow: Supabase sign-in → JWT → requireAuth → runWithToken/AsyncLocalStorage → RLS, Roles & personas, Role hierarchy: scholar → team_leader → developer, Test persona acting-as mechanism (+5 more)

### Community 68 - "Frontend Lib/Supabase READMEs"
Cohesion: 0.18
Nodes (13): frontend/legacy README, Do-not-import-from-legacy rule, frontend/lib README, Server-only modules never bundled for client (golden rule), lib/server README, lib/supabase README, Supabase client used only for auth, not domain data, Profile source: public.profiles joined with public.user_roster (+5 more)

### Community 69 - "Weekly Memo Mock Data & Types"
Cohesion: 0.18
Nodes (10): baseMemoData, scholarCombinedCompletion(), sortScholars(), sortTeamLeaders(), STATUS_SCORE, teamLeaderIssueScore(), weeklyMemoByWeek, FormStatus (+2 more)

### Community 70 - "Session Log Types"
Cohesion: 0.17
Nodes (12): CleanedAndErroredOptions, CleanedAndErroredResult, computeOverlapMs(), DoubleEntry, getDoubleEntries(), ProcessedTicket, ScholarInRoom, ScholarsInRoomOptions (+4 more)

### Community 71 - "Frontend package.json Scripts"
Cohesion: 0.15
Nodes (12): name, private, scripts, build, check:theme-safety, dev, lint, start (+4 more)

### Community 72 - "TypeDoc Block Tags Config"
Cohesion: 0.15
Nodes (13): @deprecated, @example, @file, @module, @param, @remarks, @return, @returns (+5 more)

### Community 73 - "Form Deadlines Utils"
Cohesion: 0.42
Nodes (11): getFormStatusForWeek(), getMcfWplDeadlineForWeek(), getWhafDeadlineForWeek(), isLateAfterDeadline(), isMcfLate(), isMcfLateForWeek(), isWhafLate(), isWhafLateForWeek() (+3 more)

### Community 74 - "Legacy Form View Helpers"
Cohesion: 0.27
Nodes (7): formatHoursLabel(), formatProjectItem(), formatValue(), getObjectValueByKeyPattern(), isEmptyValue(), parseWplProjectRows(), WplProjectRow

### Community 75 - "Legacy Session Records Weekly Minutes"
Cohesion: 0.32
Nodes (8): FrontDeskRecordRow, StudySessionRecordRow, EMPTY_WEEKLY_MINUTES, getWeekFetchEnd(), computeWeeklyMinutesByUid(), WeekDateRange, WeeklyMinutesByDay, getEasternDayOfWeek()

### Community 76 - "Architectural Alerts Issue Templates"
Cohesion: 0.25
Nodes (11): Architectural Alerts are GitHub Issues Only, .cursor/skills/scan-architecture-alerts (scan alerts skill), Architectural Alerts README, Architecture Alert Issue Template, Chore Issue Template, Ask-before Areas (auth, RLS, time-config, deploy), Feature Issue Template, scripts/alert.sh (+3 more)

### Community 77 - "Frontend App Auth/Traffic Docs"
Cohesion: 0.24
Nodes (11): buildScholarProfileInsertRow(), Agent Documentation README, Confirm Signup Email Template, Frontend App Auth README, Frontend App Dev README, Frontend App README, Frontend App Traffic README, Scholar Onboarding / Complete-Profile Flow (+3 more)

### Community 78 - "Supabase Session Middleware & Security"
Cohesion: 0.27
Nodes (8): Fail-Closed Session Check, Doc Review + Security Audit + Remove hasEnvVars, isDeveloperProfile (frontend/lib/auth.ts), IMPORTANT: You *must* return the supabaseResponse object as it is., IMPORTANT: If you remove getClaims() and you use server-side rendering, updateSession(), getSupabasePublicKey(), hasEnvVars (frontend/lib/utils.ts, removed)

### Community 79 - "Auth Confirm/Set-Password Routes"
Cohesion: 0.27
Nodes (7): Supabase Email-Confirmation Template Fix, Fix Signup Email Confirm Token Hash, GET(), Page(), PageProps, getSafeInternalPath(), configure-supabase-confirm-email-template.sh script

### Community 80 - "Team Leader Performance Table"
Cohesion: 0.20
Nodes (9): columns, filterBar, requiresFollowUp(), STATUS_SORT_ORDER, statusClassName, TeamLeaderPerformanceTable(), TeamLeaderPerformanceTableProps, TeamLeaderPerformanceRow (+1 more)

### Community 81 - "Root Layout & Theme Provider"
Cohesion: 0.24
Nodes (6): geistMono, geistSans, metadata, InviteFromHashRedirect(), ThemeProvider(), ThemedToaster()

### Community 82 - "Traffic Layout Idle Reset"
Cohesion: 0.25
Nodes (7): FORBIDDEN_GATE_PATTERNS, trafficDir, TrafficLayout(), IdleResetProvider(), IdleResetProviderProps, useIdleReset(), UseIdleResetOptions

### Community 83 - "Auth Button & Legacy API Routes"
Cohesion: 0.24
Nodes (8): AuthButton(), GET(), Params, basicInfoSchema, scholarProfileSchema, trafficEntrySchema, updateBasicInfo(), createClient()

### Community 84 - "Mentee RPC Test Script"
Cohesion: 0.29
Nodes (10): assertActivityRow(), assertComplianceRow(), assertWeekBreakRow(), __dirname, loadDotEnvFiles(), main(), parseEnvFile(), projectRoot (+2 more)

### Community 85 - "Ubiquitous Language: Forms & Memo"
Cohesion: 0.20
Nodes (10): Attendance detail, Campus Week, Form status, Form submissions, KPI card, Program member, Recognition board, WAHF (Weekly Academic Honors Form) (+2 more)

### Community 86 - "Onboarding Docs"
Cohesion: 0.36
Nodes (10): Ask / don't touch, High-risk areas requiring ask-before-change, Branching & reviews, CODEOWNERS senior-developer review requirement, develop/main branch ruleset policy, Day 0 setup, Day 0 clone-to-running-stack checklist, Golden path — first PR (+2 more)

### Community 87 - "Legacy Traffic Session Utils"
Cohesion: 0.44
Nodes (7): getAssumedExitAt(), getEntryCountByWeek(), getTrafficSessions(), isEntry(), isExit(), TrafficRow, TrafficSession

### Community 88 - "Shared package.json"
Cohesion: 0.20
Nodes (9): devDependencies, typescript, typescript, name, private, scripts, build, type (+1 more)

### Community 89 - "Dev Auth Profile Resolution"
Cohesion: 0.28
Nodes (8): AuthenticatedRequest, getTestProfile(), setActiveProfile(), ProfilesRow, EffectiveProfileResult, getTestProfileById(), readActiveTestProfileId(), resolveEffectiveProfile()

### Community 90 - "Acting-Mode Write Rejection Middleware"
Cohesion: 0.36
Nodes (5): ACTING_BLOCKED_POST_PATHS, isActingWriteRequest(), rejectWritesWhenActing(), requestPath(), Developer Scratchpad Pattern (app/dev, requireDeveloper-gated)

### Community 91 - "Full Attendance Detail Section"
Cohesion: 0.28
Nodes (7): columns, FullAttendanceDetailSection(), FullAttendanceDetailSectionProps, AttendanceDetailRow, FullAttendanceDetailSectionData, completionColor(), CompletionMeter()

### Community 92 - "Dev Form Logs Test Page"
Cohesion: 0.22
Nodes (9): FormLogsTestPage(), parseWeekParam(), DevProfilesPage(), fetchAllUsersForMemo(), fetchTeamLeaders(), getMcfFormLogsForWeekWithLate(), getTeamLeaderFormStatsForWeek(), getWhafFormLogsForWeekWithLate() (+1 more)

### Community 93 - "Docs Link Rewrite Script"
Cohesion: 0.28
Nodes (7): __dirname, DOCS, files, resolveLink(), rewriteFile(), ROOT, toPosix()

### Community 94 - "Vercel Deployment Config"
Cohesion: 0.22
Nodes (8): entrypoint, routePrefix, experimentalServices, backend, frontend, entrypoint, framework, routePrefix

### Community 95 - "Domain Docs & ADR Conventions"
Cohesion: 0.25
Nodes (8): Domain Docs (agent skill), docs/adr/ Architecture Decision Records, Flag ADR Conflicts Explicitly, CONTEXT-MAP.md, CONTEXT.md, Domain Docs (how skills consume domain documentation), Use the Glossary's Vocabulary, /grill-with-docs producer skill

### Community 96 - "Daily Scholar Activity Backend"
Cohesion: 0.36
Nodes (5): minutes(), DailyScholarActivityMinutesRow, DailyScholarLogSource, getTotalMinutesForMenteeWeek(), MINUTES_COLUMN

### Community 97 - "Dev Tools App Docs"
Cohesion: 0.25
Nodes (7): backend/src/routes/dev.routes.ts, docs/dev/backend/src/middleware/README.md (mutation denylist), docs/dev/frontend/app/dev/README.md (canonical, nav-linked), Dev Tools (frontend/app/dev, developer-only), requireDeveloper middleware, Test profile switcher, effectiveScholarId

### Community 98 - "Dev Handbook & Campus Weeks Docs"
Cohesion: 0.36
Nodes (8): Campus weeks, Campus week numbering system, CSS Atlas — Developer Documentation, Standards across the whole codebase (9 rules), Shared README, shared/ must be pure TypeScript (no server deps, no Supabase, no Node-only APIs), shared/src README, time.ts barrel export pattern

### Community 99 - "Docs API Coverage Check Script"
Cohesion: 0.25
Nodes (5): API_ROOT, generated, missing, ROOT, ROOTS

### Community 100 - "CI Jobs & Docker Compose"
Cohesion: 0.33
Nodes (7): CSS Atlas Docker Compose Stack, CI Job: backend-test, CI Job: docker-build, CI Job: frontend-test, CI Job: shared-build, CI Job: smoke-test, scripts/smoke-test.sh

### Community 101 - "Weekly Memo Nav Polish Agent Logs"
Cohesion: 0.29
Nodes (7): Weekly Memo Week Navigation Polish, Weekly Memo Tutoring Log, TutoringLogSection component, WeeklyMemoDataSkeleton component, WeeklyMemoNavContext (client nav context), WeeklyMemoWeekNav component, computeWeekNavigation helper

### Community 102 - "Traffic Kiosk Public Access Agent Logs"
Cohesion: 0.62
Nodes (7): tl-pages-effective-role-redirect (agent log), Team-leader-only page redirect using effective auth profile, traffic-public-ungated-kiosk (agent log), /traffic as a public, ungated foot-traffic kiosk, traffic-public-docs-and-layout-test (agent log), tl-redirects-and-public-traffic-kiosk (agent log), recordTrafficEntry()

### Community 103 - "Ubiquitous Language: Roles"
Cohesion: 0.29
Nodes (7): Developer role, Front desk completion, Mentee, Primary Team Leader, Scholar, Study session completion, Team Leader

### Community 104 - "Dev Scripts README"
Cohesion: 0.38
Nodes (7): Scripts README, alert.sh (open architecture-alert GitHub Issue), dev.sh / dev.ps1 local dev-stack scripts, ensure-issue-labels.sh (idempotent label creation), log-agent-session.sh (records agent/AI session), migrate-alerts-to-issues.sh (legacy alert markdown → Issues), resolve-alert.sh (close/resolve an alert issue)

### Community 105 - "Weekly Memo Source Fetch"
Cohesion: 0.33
Nodes (3): backendMemoSource, MemoSource, { mockBackendGet }

### Community 106 - "Legacy Memo/Traffic Sync Routes"
Cohesion: 0.38
Nodes (5): POST(), GET(), getTeamLeaderOrAboveUser(), hasRoleAtLeast (frontend/lib/supabase/server.ts), requireTeamLeaderOrAbove()

### Community 107 - "TypeDoc Exclude Patterns"
Cohesion: 0.29
Nodes (7): backend/src/supabase/database.types.ts, frontend/components/ui/**, **/*.{test,spec}.ts, exclude, backend/src/tests/**, frontend/legacy/**, **/node_modules/**

### Community 108 - "Windows Dev Script (dev.ps1)"
Cohesion: 0.43
Nodes (5): Get-NpmCommand(), Invoke-Npm(), Start-NpmProcess(), Stop-ChildProcesses(), Stop-ProcessTree()

### Community 109 - "Mentee Backend Service"
Cohesion: 0.47
Nodes (4): getMentees(), MenteeRow, getMenteesByMentorKey(), getMyMentees()

### Community 110 - "Auth Role Hierarchy Dedup Agent Log"
Cohesion: 0.40
Nodes (5): APP_ROLE_ORDER re-export (user.model.ts), Resolve Auth Role Hierarchy Duplication, resolve-alert.sh script, APP_ROLE_ORDER, hasRoleAtLeast()

### Community 111 - "Ubiquitous Language: MCF & Risk"
Cohesion: 0.33
Nodes (6): Flag, Low-grade alert, MCF (Mentee Check-in Form), MCF support rating, Scholar follow-up, Scholar follow-up risk

### Community 112 - "Theme Safety Check Script"
Cohesion: 0.33
Nodes (4): FORBIDDEN, ROOT, SCAN_ROOTS, violations

### Community 113 - "Docs API Markdown Copy Script"
Cohesion: 0.33
Nodes (5): body, dest, ROOT, src, stripped

### Community 114 - "Dashboard Breadcrumb Agent Log"
Cohesion: 0.50
Nodes (5): Dashboard Breadcrumb + Dev Script, DashboardBreadcrumb component, DashboardHeader component, formatUserRoleLabel (frontend/lib/dashboard-breadcrumb.ts), scripts/dev.sh (local dev starter)

### Community 115 - "Dark Mode Color Token Agent Logs"
Cohesion: 0.50
Nodes (5): next-themes dark mode with centralized semantic color tokens, dark-mode-centralized-colors (agent log), soft-badge-muted-foreground (agent log), Soft status badge muted-foreground token pairing, warning-badge-dark-ink (agent log)

### Community 116 - "Architecture Alerts Skill Agent Logs"
Cohesion: 0.60
Nodes (5): Agent Log: scan-architecture-alerts-skill, scan-architecture-alerts Skill, Agent Log: scan-architecture-alerts, Agent Log: github-issues-alerts-workflow-wt, GitHub-only Issues Alerts Workflow

### Community 117 - "Deployment & Backend READMEs"
Cohesion: 0.50
Nodes (5): Backend README, Deployment README, CI/CD Workflows (ci.yml, docs.yml), Same-Origin Vercel (experimentalServices), Split Deploy (Railway Services)

### Community 118 - "Supabase CLI Migrations Docs"
Cohesion: 0.40
Nodes (5): docs/dev/supabase/README.md, migrations/20260715051600_baseline.sql, supabase/config.toml, supabase/migrations/, Supabase (CLI) — versioned SQL for cloud project

### Community 119 - "Dev Home Page Client"
Cohesion: 0.60
Nodes (4): DevTestClient(), DevMeResponse, DevPage(), backendGet()

### Community 120 - "Dev Traffic Page"
Cohesion: 0.40
Nodes (5): DevTrafficPage(), parseSlotMinutes(), getTrafficEntryCountForWeek(), getTrafficEntryCountsForWeeks(), getTrafficSessionsForWeek()

### Community 121 - "Frontend ESLint Config"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 122 - "Issue Tracker Config Docs"
Cohesion: 0.50
Nodes (4): Issue Tracker (agent skill), Issue Tracker Conventions Doc, Developer Onboarding README, Issue Template Chooser Config

### Community 123 - "Triage Labels & Bug Template"
Cohesion: 0.50
Nodes (4): Triage Labels (canonical default labels), Triage Labels Doc (docs/agents/triage-labels.md), Bug Issue Template, Issue Triage Workflow Job: needs-triage

### Community 124 - "Auth Profile Insert Fix Agent Log"
Cohesion: 0.67
Nodes (4): parseCreateProfileBody(), formatSupabaseError (user.service.ts), supabaseErrorStatus (user.service.ts), Fix Profile Insert Supabase 400

### Community 125 - "UMD Email Restriction Agent Log"
Cohesion: 0.67
Nodes (4): POST/GET /api/auth/profile endpoints, UMD Email Restriction (sign-up), Scholar Onboarding UMD Email, isUmdEmail()

### Community 126 - "API Contract Normalization Agent Log"
Cohesion: 0.50
Nodes (4): API Wire Boundary Normalization, API Contract Normalization, Ubiquitous Language (docs/agents/ubiquitous_language.md), buildTeamLeaderFormStatsForWeek (removed decoy function)

### Community 127 - "CODEOWNERS Branching Policy Agent Logs"
Cohesion: 1.00
Nodes (4): Agent Log: codeowners-and-branching-docs, Agent Log: fix-codeowners-team-slugs, Agent Log: codeowners-branching-policy, CODEOWNERS / Branching Review Policy

### Community 128 - "Docs Site Generation Agent Log"
Cohesion: 1.00
Nodes (3): MkDocs Material Documentation Site, TypeDoc Markdown Reference Generation, GitHub Pages + TypeDoc Docs Site

### Community 129 - "Complete Profile Form Fix Agent Log"
Cohesion: 1.00
Nodes (3): Fix Complete Profile Invalid Base URL, complete-profile-form.tsx, createScholarProfile()

### Community 130 - "Empty Route API Pages Agent Log"
Cohesion: 0.67
Nodes (3): fix-empty-route-api-pages (agent log), TypeDoc API doc exclusion for default-only Express routers, draft-develop-to-main-pr (agent log)

### Community 131 - "Windows Dev Script Agent Logs"
Cohesion: 1.00
Nodes (3): Agent Log: windows-dev-ps1, scripts/dev.ps1 Windows Dev Script, Agent Log: onboarding-windows-dev-ps1

### Community 132 - "Frontend Components READMEs"
Cohesion: 1.00
Nodes (3): Frontend Components Dashboard README, Frontend Components README, Component Placement Rules (ui/layout/auth/data-display/charts/etc.)

## Ambiguous Edges - Review These
- `canAccessWeeklyMemo()` → `tl-pages-effective-role-redirect (agent log)`  [AMBIGUOUS]
  docs/agents/logs/2026-07-14T231614Z-tl-pages-effective-role-redirect.md · relation: references
- `getTeamLeaderOrAboveUser()` → `tl-pages-effective-role-redirect (agent log)`  [AMBIGUOUS]
  docs/agents/logs/2026-07-14T231614Z-tl-pages-effective-role-redirect.md · relation: references
- `requireTeamLeaderOrAbove()` → `tl-pages-effective-role-redirect (agent log)`  [AMBIGUOUS]
  docs/agents/logs/2026-07-14T231614Z-tl-pages-effective-role-redirect.md · relation: references
- `Dev Tools (frontend/app/dev, developer-only)` → `docs/dev/frontend/app/dev/README.md (canonical, nav-linked)`  [AMBIGUOUS]
  mkdocs.yml · relation: conceptually_related_to
- `Agent Documentation README` → `Scholar Onboarding / Complete-Profile Flow`  [AMBIGUOUS]
  docs/dev/agents/README.md · relation: references

## Knowledge Gaps
- **624 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+619 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `canAccessWeeklyMemo()` and `tl-pages-effective-role-redirect (agent log)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `getTeamLeaderOrAboveUser()` and `tl-pages-effective-role-redirect (agent log)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `requireTeamLeaderOrAbove()` and `tl-pages-effective-role-redirect (agent log)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Dev Tools (frontend/app/dev, developer-only)` and `docs/dev/frontend/app/dev/README.md (canonical, nav-linked)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Agent Documentation README` and `Scholar Onboarding / Complete-Profile Flow`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `react` connect `UI Button & Form Logs Test` to `UI Card & Badge Components`, `Dashboard Memo Sub-pages`, `Traffic Heat Map & Legacy Memo`, `Dev Session Records Layout`, `Landing Page & Charts`, `Dashboard Nav & Sidebar Widgets`, `UI Sidebar/Sheet/Tooltip Primitives`, `Personal Dashboard Client`, `Frontend tsconfig`, `Dashboard Personal/Settings Pages`, `Dev Session Logs & Double-Entry Checker`, `Weekly Memo Legacy Async Content`, `App Sidebar & Weekly Memo Access`, `Mentee Monitoring Dashboard`, `Data Table Components`, `Traffic Check-in Form Tests`, `Nav Main/Projects/Secondary Components`, `Dashboard Layout & Header`, `Memo Types & Tutoring Log Section`, `Weekly Memo Nav Context`, `Chart UI Components`, `Dashboard Breadcrumb`, `Weekly Memo Week Nav & Profile Switcher`, `Dev Session Records Test Page`, `Activity Log Client Widgets`, `Root Layout & Theme Provider`, `Traffic Layout Idle Reset`, `Full Attendance Detail Section`, `Dev Home Page Client`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `getActiveSemester` connect `Dashboard Personal/Settings Pages` to `Mentee Monitoring Dashboard`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._