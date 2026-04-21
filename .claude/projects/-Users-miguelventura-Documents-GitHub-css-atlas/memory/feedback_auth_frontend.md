---
name: Keep auth login on frontend
description: Authentication login/signup flows must stay on the frontend. Only role checking and token verification are on the backend.
type: feedback
---

Keep authentication login/signup/password flows on the frontend (cookie-based Supabase auth). Backend only handles role checking (requireDeveloper, requireTeamLeaderOrAbove, requireAuth) and token verification.

**Why:** User explicitly stated this during migration planning.

**How to apply:** Never move login/signup pages or Supabase auth middleware to the backend. Backend receives Bearer tokens from frontend and verifies them.
