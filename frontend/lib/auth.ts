/**
 * @file auth.ts
 * @module frontend/lib
 *
 * Frontend role type definitions used to drive role-based UI rendering.
 * Maps to `profiles.app_role` values; consumed by app-sidebar.tsx and
 * dashboard pages for conditional nav and content.
 *
 * ## Responsibilities
 * - Define the `UserRole` union type used across sidebar and dashboard components
 *
 * ## What belongs here
 * - Role type definitions for frontend UI branching
 *
 * ## What does NOT belong here
 * - Auth helpers that read from Supabase (use lib/supabase/server.ts)
 * - Role enforcement / access guards (use requireTeamLeaderOrAbove, requireDeveloper)
 */

export type UserRole = "admin" | "exec" | "scholar" | "team-leader" | "developer" | "default";
