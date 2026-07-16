# Agent Documentation

**Location:** [`docs/agents/`](../../agents/codebase-notes.md)  
**Docs:** `docs/dev/agents/README.md`

## Navigation

[← Root](../README.md) › Agent Docs

---

## Purpose

Knowledge base for AI coding agents working in this repository. Contains codebase notes, domain vocabulary, and issue-tracking conventions that help agents understand the project context without reading all source files from scratch.

Humans: prefer the [handbook home](../README.md) and [onboarding](../onboarding/README.md). Agents: start with [`codebase-notes.md`](../../agents/codebase-notes.md).

---

## Files

| File | Docs Link | Description |
|------|-------------|-------------|
| `codebase-notes.md` | [codebase-notes](../../agents/codebase-notes.md) | Architecture overview, request flow, auth pattern, backend/frontend how-it-works |
| `domain.md` | [domain](../../agents/domain.md) | How to read and use domain documentation files |
| `ubiquitous_language.md` | [ubiquitous_language](../../agents/ubiquitous_language.md) | Domain glossary — authoritative definitions for all domain terms |
| `issue-tracker.md` | [issue-tracker](../../agents/issue-tracker.md) | Issue tracking conventions |
| `triage-labels.md` | [triage-labels](../../agents/triage-labels.md) | Issue triage label definitions |
| `github-project-board.md` | [github-project-board](../../agents/github-project-board.md) | Optional Project Kanban ↔ triage label mapping |
| `general-sign-up-flow.md` | [general-sign-up-flow](../../agents/general-sign-up-flow.md) | Scholar onboarding / profile column matrix |

---

## Standards

- **`codebase-notes.md` must be kept current** — update it whenever the architecture changes (new route group, new auth pattern, new service, etc.).
- **`ubiquitous_language.md` is the source of truth for terminology** — before introducing a new term in code or comments, check or update this file.
- **Do not put implementation details here** — agent docs describe *what exists and why*, not *how to build it*. Implementation guidance belongs in `docs/dev/`.
- **No secrets or environment-specific values** — these files may be passed directly to AI contexts.
