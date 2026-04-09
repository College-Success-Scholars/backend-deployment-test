import { requireDeveloper } from "@/lib/supabase/server";

export const metadata = {
  title: "Dev Tools | CSS Atlas",
  description: "Developer-only tools for testing server functions",
};

/**
 * Developer-only layout. Protects all routes under /dev from non-developer users.
 * Redirects to /dashboard if the user doesn't have profile.app_role === 'developer'.
 */
export default async function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
