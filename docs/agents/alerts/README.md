# Architectural alerts

**Alerts are GitHub Issues only** — label `architecture-alert`.

Do **not** add new markdown files in this folder. Open work is the issue tracker.

## Open / list

```bash
gh issue list --label architecture-alert --state open
```

## Create

- GitHub UI: **Architecture alert** issue template, or
- CLI (requires `gh auth login`):

```bash
./scripts/alert.sh \
  --title "short-kebab-title" \
  --severity warning \
  --category integrity \
  --description "What is wrong." \
  --recommendation "How to fix it."
```

## Resolve

```bash
./scripts/resolve-alert.sh \
  --issue <N> \
  --summary-text "What you fixed"
```

If the issue was already closed by a PR (`Fixes #N`), this still logs a session and comments — it does not fail.

## One-time migration

If any legacy `*.md` alert files remain here (besides this README):

```bash
./scripts/ensure-issue-labels.sh
./scripts/migrate-alerts-to-issues.sh
```
