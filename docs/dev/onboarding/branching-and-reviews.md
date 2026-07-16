# Branching & reviews

**Docs:** `docs/dev/onboarding/branching-and-reviews.md`

## Navigation

[← Onboarding](README.md) › Branching & reviews

**Also read:** [Golden path (first PR)](golden-path-first-pr.md) · [PR template](../pr/TEMPLATE.md) · [Ask / don’t touch](ask-and-dont-touch.md)

---

## Purpose

How `develop` and `main` are protected, who may change them, and what must happen before code lands on each branch. Enforced by GitHub **repository rulesets** plus [`.github/CODEOWNERS`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/.github/CODEOWNERS).

---

## Branch roles

| Branch | Role |
|--------|------|
| `develop` | Integration branch. Default place for day-to-day work. Feature PRs target **this** branch. |
| `main` | Production line. Junior Developers never push or open PRs here. Releases and hotfixes only. |
| `feature/…`, `fix/…`, etc. | Short-lived work branches. Anyone with Write can push these. |

```text
feature/my-change ──PR + Senior Developer approval──► develop ──PR + 2 Senior Developer approvals──► main
                                                          ▲                                          │
                                                          └──────── hotfix sync back ────────────────┘
```

---

## Teams

GitHub has no built-in “junior / senior” roles. This repo uses org teams:

| Team | Slug | Intent |
|------|------|--------|
| Senior Developers | `@College-Success-Scholars/senior-developers` | May push to `develop` / `main` (ruleset bypass for hotfixes). Approve PRs. Listed in `CODEOWNERS`. |
| Junior Developers | `@College-Success-Scholars/junior-developers` | Push feature branches and open PRs into `develop`. Never update `main`. |

Both teams need **Write** on the repo so juniors can push branches and seniors can review. Enforcement lives in rulesets, not in “Admin vs Write” alone.

---

## What the rulesets enforce

Exact clicks live in **Settings → Rules → Rulesets**. Expected policy:

### `develop`

| Rule | Effect |
|------|--------|
| Restrict who can push | Only Senior Developers (and bypass actors) may push commits directly |
| Require pull request | Merges go through a PR |
| Required approvals | **1** |
| Require review from Code Owners | Approval must come from `@College-Success-Scholars/senior-developers` |
| Required status checks | CI must pass |
| No force-push / no delete | History stays stable |

Junior Developers: branch off `develop` → push a feature branch → open PR **into `develop`** → wait for a Senior Developer (code owner) approval and green CI → merge.

Senior Developers: may push directly to `develop` when that is the agreed path; PRs still use the same review machinery when opened.

### `main`

| Rule | Effect |
|------|--------|
| Restrict who can push | Only Senior Developers |
| Require pull request | Normal path is a PR (typically `develop` → `main`) |
| Required approvals | **2** |
| Require review from Code Owners | Approvals from Senior Developers |
| Required status checks | CI must pass |
| No force-push / no delete | History stays stable |
| Bypass (Senior Developers) | Allows urgent hotfixes without waiting on the full PR gate |

Junior Developers cannot satisfy merge requirements on `main` and must not open PRs targeting it.

---

## CODEOWNERS

[`.github/CODEOWNERS`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/.github/CODEOWNERS) assigns `@College-Success-Scholars/senior-developers` as owners of the whole tree (and `.github/` explicitly).

For that to **block** merges without a Senior Developer review:

1. The `CODEOWNERS` file must exist on the **base** branch of the PR (`develop` or `main`).
2. Each ruleset that requires reviews must enable **Require review from Code Owners**.
3. The **Senior Developers** team must have **Write** access and be allowed to be a code owner (org team visibility / repo permission).

If GitHub marks a CODEOWNERS line invalid, fix the team slug or permissions — do not delete the file.

---

## Hotfixes on `main`

Senior Developers may land a small production fix on `main` quickly (direct push or bypass). Afterward:

1. Bring the same commit(s) back onto `develop` (merge or cherry-pick) so the lines do not diverge.
2. Prefer a short PR into `develop` when the change is non-trivial, so there is a review trail.

Do not leave fixes only on `main`.

---

## Related

- First PR walkthrough (branch → review → `develop`): [Golden path](golden-path-first-pr.md)
- High-risk areas: [Ask / don’t touch](ask-and-dont-touch.md)
- CI workflows: [Deployment](../deployment/README.md)
