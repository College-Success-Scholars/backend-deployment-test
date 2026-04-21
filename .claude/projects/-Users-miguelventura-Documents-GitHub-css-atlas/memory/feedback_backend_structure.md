---
name: Backend folder structure preference
description: User wants exactly 4 folders in backend — models (types), services (logic), controllers (role checking + handlers), routes (Express routes). No lib/, config/, middleware/ folders.
type: feedback
---

Keep backend organized into exactly 4 folders: models, services, controllers, routes.

**Why:** User explicitly requested this structure during the migration. Everything must fit into one of these four folders.

**How to apply:** Types/interfaces → models. Business logic + Supabase queries → services. Request handling + role checking → controllers. Express Router definitions → routes. Supabase client config lives in services (supabase.service.ts).
