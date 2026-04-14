import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createAnonClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server";
import type { GetMyMenteesRpcRow } from "@/lib/types/supabase";

/**
 * Cross-request cached for 1 hour — semester data is app-wide and changes rarely.
 * Outer React.cache deduplicates within a single render pass so unstable_cache
 * isn't hit more than once per request even if called from multiple components.
 *
 * NOTE: Only safe without a user-scoped cache key if the `semesters` table
 * has no user-level RLS. If it does, add the user ID to the cache key array.
 */
export const getActiveSemester = cache(
  unstable_cache(
    async () => {
      const supabase = await createAnonClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      const { data, error } = await supabase
        .from("semesters")
        .select("id, iso_week_offset, start_date, end_date")
        .eq("is_active", true)
        .single();
      if (error) throw new Error(error.message);
      if (!data) throw new Error("No active semester found");
      return data;
    },
    ["active-semester"],
    { revalidate: 3600 }
  )
);

/**
 * Per-request cached. Deduplicates the user fetch across layout, PersonalPage,
 * and anything else that calls this in the same render.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("Unable to fetch user");
  return data.user;
});

/**
 * Per-request cached. Calls getCurrentUser() internally — because that's also
 * cached, the user fetch is never duplicated even across concurrent callers.
 */
export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error || !data) throw new Error("Unable to fetch profile");
  return data;
});

/**
 * Per-request cached. If both Personal and Mentee pages somehow render in the
 * same request, this runs once. More importantly, it's the single source of
 * truth so there's no risk of the two pages diverging.
 */
export const getMyMentees = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_my_mentees");
  if (error) throw new Error(`Unable to fetch mentees: ${error.message}`);
  return (data ?? []) as GetMyMenteesRpcRow[];
});