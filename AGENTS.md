## Agent skills

### Issue tracker

Issues are tracked in this repository's GitHub Issues and managed via `gh` (`gh auth login` required). See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the canonical default labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Architectural alerts

Architectural alerts are **GitHub Issues** labeled `architecture-alert` — not files under `docs/agents/alerts/`. Discover open work with:

```bash
gh issue list --label architecture-alert --state open
```

Open via the **Architecture alert** issue template or `./scripts/alert.sh`. Resolve with `./scripts/resolve-alert.sh --issue <N>`.

To check whether open alerts still match the tree, use the project skill `.cursor/skills/scan-architecture-alerts/` (“scan alerts”).

### Domain docs

Domain docs use a single-context layout (root `CONTEXT.md` + `docs/adr/` when present). See `docs/agents/domain.md`.

## Knowledge base

The codebase has a specfic structure to follow and to generally maintain. See `docs/agents/codebase-notes.md`
