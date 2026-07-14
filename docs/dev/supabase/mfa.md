# Supabase MFA (TOTP)

Multi-factor authentication for CSS Atlas uses **Supabase Auth TOTP** (authenticator app). Phone/SMS MFA is not used.

## Enable MFA in the project (ops)

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and select the correct project (staging vs production by env label — do not commit project refs or URLs).
2. Go to **Authentication → Multi-Factor / MFA** (wording may vary slightly by Dashboard version).
3. Enable **TOTP** (app authenticator).
4. Leave **Phone** MFA disabled.
5. Ensure **enrollment** and **verify** (challenge) APIs are allowed so the app can call `mfa.enroll` / `mfa.challenge` / `mfa.verify`.

App routes:

| Route | Purpose |
|-------|---------|
| `/auth/mfa/enroll` | First-time setup and re-enroll after a Dashboard reset |
| `/auth/mfa/verify` | Challenge after password login when a factor already exists |

See also: [Reset a user’s MFA](mfa-reset.md).
