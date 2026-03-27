import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey } from "./public-key";

export function createClient() {
  const supabaseKey = getSupabasePublicKey();

  // #region agent log
  fetch("http://127.0.0.1:7682/ingest/a3f80154-cba6-470b-b5c5-b2e641a9ba29", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "689c88",
    },
    body: JSON.stringify({
      sessionId: "689c88",
      runId: "post-fix",
      location: "lib/supabase/client.ts:createClient",
      message: "browser createClient env probe",
      data: {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
        hasPublishableOrAnon: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY?.trim(),
        ),
        hasPublishableDefault: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim(),
        ),
        hasLegacyAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
        resolvedKeyLen: supabaseKey?.length ?? 0,
        hypothesisId: "H4",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
  );
}
