/**
 * @file actions.ts
 * @module frontend/lib/server
 *
 * Next.js Server Actions for form submissions and data mutations from the frontend.
 * Server Actions marked with "use server" can be called directly from Client Components
 * and are executed securely on the server.
 *
 * ## Responsibilities
 * - Handle profile update mutations (basic info, etc.)
 * - Validate inputs with Zod before writing to Supabase or calling the backend
 * - Revalidate Next.js cache paths after mutations
 *
 * ## What belongs here
 * - "use server" functions that handle form submissions or mutations
 * - Zod input validation schemas
 *
 * ## What does NOT belong here
 * - Data fetching (use data.ts or api-client.ts instead)
 * - Client-side logic
 */
"use server"

import { createClient } from "@/lib/supabase/server"
import { backendPost } from "@/lib/server/api-client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const basicInfoSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
})

export async function updateBasicInfo(formData: unknown) {
  const parsed = basicInfoSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: "Invalid input" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

const scholarProfileSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  student_id: z.string().min(1).max(50),
  phone_number: z.string().max(20).nullable().optional(),
  cohort: z.number().int().positive(),
})

export async function createScholarProfile(formData: unknown) {
  const parsed = scholarProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: "Invalid input" }
  }

  try {
    await backendPost("/api/auth/profile", {
      ...parsed.data,
      phone_number: parsed.data.phone_number ?? null,
    })
    revalidatePath("/dashboard")
    revalidatePath("/auth/complete-profile")
    return { success: true as const }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to create profile",
    }
  }
}
