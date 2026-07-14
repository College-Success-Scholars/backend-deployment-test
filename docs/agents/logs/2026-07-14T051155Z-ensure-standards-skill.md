# ensure-standards-skill

**Date:** 2026-07-14T051155Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by \`---\`._

```
make a skill to ensure the staged changes that an agent made is inline with the documentation for those files. call this function whenever i say "ensure standards"
```

---

## Purpose

Add a project skill that checks staged changes against docs/dev README standards

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Created .cursor/skills/ensure-standards/SKILL.md. On "ensure standards", the agent collects staged diffs, maps each path to the nearest docs/dev README (plus parent Standards, codebase-notes, API.md when relevant), checks Standards/Files/Purpose alignment, fixes clear code or doc drift, stages corrections, and reports Pass/Fixed/Needs decision.

---

## Code Changes

- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/activity.routes.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/form-log.routes.ts`
- `backend/src/routes/session-log.routes.ts`
- `backend/src/routes/session-record.routes.ts`
- `backend/src/routes/traffic.routes.ts`
- `backend/src/routes/user.routes.ts`
- `docs/agents/general-sign-up-flow.md`
- `docs/dev/frontend/app/auth/README.md`
- `docs/dev/frontend/components/settings/README.md`
- `docs/dev/frontend/lib/supabase/README.md`
- `docs/dev/supabase/README.md`
- `frontend/app/auth/complete-profile/page.tsx`
- `frontend/app/auth/confirm/route.ts`
- `frontend/app/dashboard/layout.tsx`
- `frontend/components/auth/complete-profile-form.tsx`
- `frontend/components/auth/login-form.tsx`
- `frontend/components/auth/update-password-form.tsx`
- `frontend/components/settings/settings-client.tsx`
- `scripts/log-agent-session.sh`
