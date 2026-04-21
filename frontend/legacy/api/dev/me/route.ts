import { getDeveloperUser, getCurrentUserWithProfile } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Returns the current user if they have developer access.
 * Use from client components to get developer user info without server components.
 * Returns 403 if not a developer.
 */
export async function GET() {
  const user = await getDeveloperUser();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden: Developer access required" },
      { status: 403 },
    );
  }

  const { profile } = await getCurrentUserWithProfile();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    profile: profile
      ? {
          app_role: profile.app_role,
          email: profile.email,
        }
      : null,
  });
}
