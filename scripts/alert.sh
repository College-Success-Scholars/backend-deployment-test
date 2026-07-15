#!/usr/bin/env bash
# alert.sh
#
# Records an architectural or runtime alert as a GitHub Issue (label: architecture-alert).
# Requires: gh CLI authenticated to this repository. There is no markdown fallback —
# open work lives only on GitHub Issues.
#
# Usage:
#   ./scripts/alert.sh [OPTIONS]
#
# Options:
#   -t, --title STR          Short alert title (issue title)
#   -S, --severity STR       Severity level: info | warning | error  (default: warning)
#   -C, --category STR       Category: auth | security | performance | integrity | config
#   -d, --description STR    Full description of the issue
#       --description-file FILE  Path to a file containing the description
#   -f, --files STR          Comma-separated list of affected files
#   -r, --recommendation STR  Recommended action or fix
#   -h, --help               Show this help message
#
# Example:
#   ./scripts/alert.sh \
#     --title "auth-role-hierarchy-duplication" \
#     --severity warning \
#     --category auth \
#     --description "ROLE_ORDER duplicated between frontend and backend." \
#     --files "frontend/lib/supabase/server.ts,backend/src/controllers/auth.controller.ts" \
#     --recommendation "Extract role hierarchy into a shared source of truth."
#
# List open architectural alerts:
#   gh issue list --label architecture-alert --state open

set -euo pipefail

TITLE=""
SEVERITY="warning"
CATEGORY=""
DESCRIPTION=""
DESCRIPTION_FILE=""
FILES=""
RECOMMENDATION=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--title)            TITLE="$2";            shift 2 ;;
    -S|--severity)         SEVERITY="$2";         shift 2 ;;
    -C|--category)         CATEGORY="$2";         shift 2 ;;
    -d|--description)      DESCRIPTION="$2";      shift 2 ;;
    --description-file)    DESCRIPTION_FILE="$2"; shift 2 ;;
    -f|--files)            FILES="$2";            shift 2 ;;
    -r|--recommendation)   RECOMMENDATION="$2";   shift 2 ;;
    -h|--help)
      awk '/^# alert.sh/{p=1} p && /^[^#]/{exit} p{sub(/^# ?/,""); print}' "$0"
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required. Install https://cli.github.com/ and run: gh auth login" >&2
  exit 1
fi

case "$SEVERITY" in
  info|warning|error) ;;
  *) echo "Error: --severity must be one of: info, warning, error" >&2; exit 1 ;;
esac

if [[ -z "$TITLE" ]]; then
  read -r -p "Alert title (short): " TITLE
fi
if [[ -z "$CATEGORY" ]]; then
  read -r -p "Category (auth | security | performance | integrity | config): " CATEGORY
fi
if [[ -z "$DESCRIPTION" && -z "$DESCRIPTION_FILE" ]]; then
  echo "Enter the alert description (end with a line containing only '---'):"
  lines=()
  while IFS= read -r line; do
    [[ "$line" == "---" ]] && break
    lines+=("$line")
  done
  DESCRIPTION="$(printf '%s\n' "${lines[@]}")"
fi
if [[ -z "$RECOMMENDATION" ]]; then
  read -r -p "Recommendation: " RECOMMENDATION
fi

if [[ -n "$DESCRIPTION_FILE" ]]; then
  DESCRIPTION_CONTENT="$(cat "$DESCRIPTION_FILE")"
else
  DESCRIPTION_CONTENT="$DESCRIPTION"
fi

FILES_SECTION="_No files specified._"
if [[ -n "$FILES" ]]; then
  FILES_SECTION=""
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    FILES_SECTION+="- \`${f}\`
"
  done <<< "$(echo "$FILES" | tr ',' '\n' | sed 's/^ *//;s/ *$//')"
fi

ISSUE_TITLE="Alert: ${TITLE}"

BODY="$(cat <<EOF
## Severity

${SEVERITY}

## Category

${CATEGORY}

## Description

${DESCRIPTION_CONTENT}

## Affected files

${FILES_SECTION}

## Recommendation

${RECOMMENDATION}

---
_Opened via \`scripts/alert.sh\`. List with: \`gh issue list --label architecture-alert --state open\`._
EOF
)"

URL="$(gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$BODY" \
  --label "architecture-alert" \
  --label "chore" \
  --label "needs-triage")"

echo ""
echo "Architectural alert opened: $URL"
echo "List open alerts: gh issue list --label architecture-alert --state open"
