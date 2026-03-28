import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey } from "./public-key";

export function createClient() {
  const supabaseKey = getSupabasePublicKey();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
        auth: {
            flowType: "pkce",
        }
    }
  );
}
