import { redirect } from "next/navigation";

/**
 * Legacy `/memo` URL — superseded by `/dashboard/memo`.
 * @see frontend/legacy/app/memo/ for the retired standalone implementation.
 */
export default function LegacyMemoRedirect() {
  redirect("/dashboard/memo");
}
