# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

**Pull work only from Ready labels** (`ready-for-agent` / `ready-for-human`). Intake and type labels are not permission to start.

## Type labels

| Label | Meaning |
| ----- | ------- |
| `bug` | Incorrect behavior |
| `feature` | New or changed product behavior |
| `chore` | Tooling, cleanup, docs, CI |

## Architectural alerts

| Label | Meaning |
| ----- | ------- |
| `architecture-alert` | Structural/runtime finding; backlog is GitHub Issues only |

List open architectural alerts:

```bash
gh issue list --label architecture-alert --state open
```

Ensure labels exist: `./scripts/ensure-issue-labels.sh`.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from the triage table.
