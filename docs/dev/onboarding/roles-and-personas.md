# Roles & personas

**Docs:** `docs/dev/onboarding/roles-and-personas.md`

## Navigation

[← Onboarding](README.md) › Roles & personas

**Related:** [Supabase test profiles](../supabase/README.md) · [Middleware — acting denylist](../backend/src/middleware/README.md)

---

## Purpose

Understand what each app role can see/do, and how developers safely emulate another roster identity via test personas.

---

## Role hierarchy

Stored on `profiles.app_role` (also reflected on roster views). Hierarchy (lowest → highest):

```text
null (basic user / scholar)
  └─ team_leader
       └─ developer
```

Backend gates (see auth controller middleware):

| Middleware | Who passes |
|------------|------------|
| `requireAuth` | Any authenticated user with a valid JWT |
| `requireTeamLeaderOrAbove` | `team_leader` or `developer` |
| `requireDeveloper` | `developer` only |

Scholars (`program_role` scholar, often `app_role` null) get scholar nav / dashboard surfaces; team leaders get supervisory tools (e.g. Memo access where gated); developers get `/dev` tools and persona switching.

Product vocabulary: [ubiquitous language](../../agents/ubiquitous_language.md).

---

## Day exercise (no code)

1. Sign in as your **developer** account (your real profile — full write access).
2. Open `/dev` and note available **test personas** (after SQL setup — [Supabase README](../supabase/README.md)).
3. Act as **scholar** persona — note Memo / nav differences, empty vs populated widgets.
4. Act as **team leader** persona — compare again.
5. Switch back to **My profile** before any intentional writes.

---

## Acting as a test profile — rules

- Clients send only `dev_test_profiles.id` (cookie → `X-Dev-Active-Profile`); the server resolves `roster_uid`.
- While acting, many **mutations are denylisted** (`rejectWritesWhenActing`). Read-via-POST endpoints and `/api/dev/*` stay allowed. Symptom of a blocked write: error from that middleware rather than a successful `{ data }`.
- Setup SQL order and seed placeholders: [docs/dev/supabase/README.md](../supabase/README.md).

---

## Don’t confuse

| Term | Meaning |
|------|---------|
| `program_role` | Program identity (e.g. scholar) |
| `app_role` | Capability ladder (`null` / `team_leader` / `developer`) |
| Test persona | Curated roster row developers can assume for debugging |
| Your developer profile | Real account — use this for writes and `/api/dev` |

---

## Who to ask

Persona SQL / RLS setup questions: [Miguel](mailto:miguelventura1123@gmail.com), [Ben](mailto:bsaenz454@gmail.com), [Moosay](mailto:97802676+m0osay@users.noreply.github.com).
