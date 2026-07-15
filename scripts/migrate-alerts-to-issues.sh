#!/usr/bin/env bash
# migrate-alerts-to-issues.sh
#
# One-shot: open a GitHub Issue for each remaining markdown file in
# docs/agents/alerts/ (except README.md), then delete those files.
# Requires: gh auth + labels from ensure-issue-labels.sh
#
# Usage:
#   ./scripts/ensure-issue-labels.sh
#   ./scripts/migrate-alerts-to-issues.sh
#   ./scripts/migrate-alerts-to-issues.sh --dry-run

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ALERTS_DIR="${ROOT_DIR}/docs/agents/alerts"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help)
      awk '/^# migrate-alerts-to-issues.sh/{p=1} p && /^[^#]/{exit} p{sub(/^# ?/,""); print}' "$0"
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required. Install https://cli.github.com/ and run: gh auth login" >&2
  exit 1
fi

shopt -s nullglob
files=("${ALERTS_DIR}"/*.md)
migrated=0

for file in "${files[@]}"; do
  base="$(basename "$file")"
  if [[ "$base" == "README.md" ]]; then
    continue
  fi

  title="$(sed -n 's/^# //p' "$file" | head -n 1)"
  severity="$(sed -n 's/^\*\*Severity:\*\* //p' "$file" | head -n 1)"
  category="$(sed -n 's/^\*\*Category:\*\* //p' "$file" | head -n 1)"
  [[ -z "$severity" ]] && severity="warning"
  [[ -z "$category" ]] && category="integrity"

  description="$(awk '
    /^## Description$/ { found=1; next }
    found && /^---$/ { exit }
    found { print }
  ' "$file")"

  recommendation="$(awk '
    /^## Recommendation$/ { found=1; next }
    found && /^## / { exit }
    found { print }
  ' "$file")"

  files_section="$(awk '
    /^## Affected Files$/ { found=1; next }
    found && /^---$/ { exit }
    found { print }
  ' "$file")"

  body="$(cat <<EOF
## Severity

${severity}

## Category

${category}

## Description

${description}

## Affected files

${files_section}

## Recommendation

${recommendation}

---
_Migrated from \`${base}\` via \`scripts/migrate-alerts-to-issues.sh\`._
EOF
)"

  issue_title="Alert: ${title}"

  if [[ "$DRY_RUN" == true ]]; then
    echo "Would open: ${issue_title} (from ${base})"
    migrated=$((migrated + 1))
    continue
  fi

  url="$(gh issue create \
    --title "$issue_title" \
    --body "$body" \
    --label "architecture-alert" \
    --label "chore" \
    --label "needs-triage")"
  echo "Opened ${url} ← ${base}"
  rm "$file"
  migrated=$((migrated + 1))
done

echo ""
if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run: would migrate ${migrated} alert file(s)."
else
  echo "Migrated ${migrated} alert file(s). Remaining backlog: gh issue list --label architecture-alert --state open"
fi
