// lib/server/actions/profile.ts
"use server"

import { createClient } from "@/lib/supabase/server"
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

  // createClient() uses the session cookie — this runs as the logged-in user,
  // so RLS applies automatically. No manual role check needed here.
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