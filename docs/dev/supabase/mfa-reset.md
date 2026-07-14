# Reset a user’s MFA (Supabase Dashboard)

When a user loses access to their authenticator app, reset their TOTP factors in the Dashboard. There is **no in-app admin reset** and **no service-role API** for this in v1.

## Walkthrough

1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select the **correct project** (production vs staging). Identify projects by environment label in your org — do **not** paste project refs, Dashboard deep links that embed `<project-ref>`, or API URLs into tickets or commits.
3. Go to **Authentication → Users**.
4. Search for the user by email (e.g. `scholar@umd.edu`) and open their user detail.
5. Find the user’s **MFA / factors** section (UI may say “Factors” or list TOTP devices).
6. **Delete / remove** all TOTP factors for that user.
7. Ask the user to:
   - Fully **sign out** of CSS Atlas (clears a stale session / AAL claim).
   - Sign in again with email + password.
   - Complete **`/auth/mfa/enroll`** (scan QR + enter a 6-digit code).

After factors are removed and they sign in, the app treats them as enrolled-TFA-missing and routes to enroll before the dashboard.

## Do not document or share

- Project ref or `https://<project-ref>.supabase.co`
- Publishable, anon, or service-role keys
- Dashboard URLs that embed a project id (prefer menu paths like **Authentication → Users**)
