# Ask / don’t touch

**Docs:** `docs/dev/onboarding/ask-and-dont-touch.md`

## Navigation

[← Onboarding](README.md) › Ask / don’t touch

**PR shape:** always use [`docs/dev/pr/TEMPLATE.md`](../pr/TEMPLATE.md)

---

## Who to ask

Writers with commits in this repository (as of this writing):

| Name | Email |
|------|-------|
| Miguel Ventura | [miguelventura1123@gmail.com](mailto:miguelventura1123@gmail.com) |
| Ben (Benjamin Saenz) | [bsaenz454@gmail.com](mailto:bsaenz454@gmail.com) |
| Moosay Hailewold | [97802676+m0osay@users.noreply.github.com](mailto:97802676+m0osay@users.noreply.github.com) |

When emailing, include: branch name, what you tried, error text / screenshot, and whether a **test persona** was active.

Prefer GitHub review comments or issues for async design discussion so the trail stays on the PR.

---

## Ask *before* changing

| Area | Why |
|------|-----|
| Supabase migrations / Dashboard SQL / RLS policies | Easy to lock out roles or drift from seeded environments |
| Auth middleware (`requireAuth`, role gates) or JWT / `AsyncLocalStorage` binding | Breaks the whole API surface |
| `rejectWritesWhenActing` denylist semantics | Security boundary for persona switching |
| `shared/time-config.ts` academic calendar constants | Year-wide data alignment (Memo, records, forms) |
| Deploy topology / secrets / CORS defaults for production | [Deployment](../deployment/README.md) |

Safe default for a first week: UI copy, display wiring of existing API fields, tests, docs — via the [golden path](golden-path-first-pr.md).

---

## Don’t commit

- Secrets (`.env`, `.env.local`, keys, tokens)
- One-off personal experiment routes without a ticket
- Drive-by refactors mixed into a feature PR

Structural findings (schema drift, duplicated auth, dead domain modules): open an **Architecture alert** issue (UI template or `./scripts/alert.sh`) — do not add files under `docs/agents/alerts/`. See [issue tracker](../../agents/issue-tracker.md).

---

## PR reminder

Copy the canonical template — [`docs/dev/pr/TEMPLATE.md`](../pr/TEMPLATE.md) — and fill **Test plan** with the scripts you actually ran.
