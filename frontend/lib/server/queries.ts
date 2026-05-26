import { cache } from "react";
import { backendGet } from "./api-client";

export const getActiveSemester = cache(async () => {
  return backendGet<{ id: number; iso_week_offset: number; start_date: string; end_date: string }>("/api/auth/semester");
});

export const getCurrentUser = cache(async () => {
  return backendGet<{ user: { id: string; email: string | null }; profile: Record<string, unknown> | null }>("/api/auth/me");
});

export const getCurrentProfile = cache(async () => {
  return backendGet<Record<string, unknown>>("/api/auth/profile");
});

export const getMyMentees = cache(async () => {
  return backendGet<Array<Record<string, unknown>>>("/api/auth/mentees");
});
