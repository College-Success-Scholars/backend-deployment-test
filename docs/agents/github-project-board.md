# GitHub Project board

Optional Kanban view on top of [GitHub Issues](issue-tracker.md). Issues remain the only backlog; the board organizes status for humans.

## Setup (once)

1. Create a **Projects (v2)** board from the **Kanban** template (or Team planning, then reshape).
2. Rename Status columns to match the table below.
3. Optionally enable **Auto-add** (Project → Workflows) so new Issues in this repo land in **Triage**.
4. Use **Milestones** for direction (themes / quarters); use the board for weekly execution.

## Column ↔ label mapping

| Board column | Meaning | Issue labels / signals |
|--------------|---------|------------------------|
| **Triage** | Just filed; maintainer has not decided | `needs-triage` |
| **Needs info** | Waiting on reporter | `needs-info` |
| **Ready** | Pull-to-work | `ready-for-agent` or `ready-for-human` |
| **In progress** | Someone is implementing | assignee and/or open branch |
| **In review** | Change proposed | linked open PR |
| **Blocked** | Explicitly stuck | comment or optional `blocked` label |
| **Done** | Finished | closed Issue / merged PR |

Only **Ready** means start work. Type labels (`bug` / `feature` / `chore` / `architecture-alert`) and intake (`needs-triage`) are not permission to implement — see [triage-labels](triage-labels.md).

## Cadence

- **Weekly:** Move cards; demote stale Ready items; close `wontfix`.
- **Biweekly / monthly:** Review Milestone scope (what ships next vs waits).
- **Intake:** File via Issue forms; only a triage owner promotes to Ready.

## Do not

- Treat the board as a second backlog (no project-only cards without an Issue).
- Auto-promote new Issues to Ready.
- Maintain conflicting Status on the board and triage labels without reconciling in triage.
