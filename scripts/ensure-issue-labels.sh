#!/usr/bin/env bash
# ensure-issue-labels.sh
#
# Idempotently creates GitHub labels used for triage, type, and architectural alerts.
# Requires: gh CLI authenticated to this repository.
#
# Usage:
#   ./scripts/ensure-issue-labels.sh

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required. Install https://cli.github.com/ and authenticate (gh auth login)." >&2
  exit 1
fi

ensure_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  # --force upserts (avoids pagination misses from gh label list)
  gh label create "$name" --color "$color" --description "$description" --force >/dev/null
  echo "ensured: $name"
}

# Triage
ensure_label "needs-triage" "FBCA04" "Maintainer needs to evaluate"
ensure_label "needs-info" "D4C5F9" "Waiting on reporter"
ensure_label "ready-for-agent" "0E8A16" "Fully specified; AFK agent OK"
ensure_label "ready-for-human" "1D76DB" "Requires human implementation"
ensure_label "wontfix" "FFFFFF" "Will not be actioned"

# Type
ensure_label "bug" "D73A4A" "Incorrect behavior"
ensure_label "feature" "A2EEEF" "New or changed product behavior"
ensure_label "chore" "FEF2C0" "Tooling, cleanup, docs, CI"

# Architectural
ensure_label "architecture-alert" "B60205" "Structural/runtime finding; backlog is GitHub only"

echo ""
echo "Labels ensured."
