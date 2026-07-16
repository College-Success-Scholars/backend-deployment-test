#!/usr/bin/env bash
# resolve-alert.sh
#
# Resolves an architectural alert tracked as a GitHub Issue: logs the fix session,
# then closes the issue if it is still open (comment-only if already closed).
#
# Requires: gh CLI authenticated to this repository.
#
# Usage:
#   ./scripts/resolve-alert.sh [OPTIONS]
#
# Options:
#   -i, --issue N            GitHub issue number (required)
#   -s, --summary FILE       Path to a file with the resolution summary
#       --summary-text STR   Inline resolution summary
#   -u, --purpose STR        Override purpose (defaults from issue title)
#   -c, --changes STR        Comma-separated list of files changed
#                            (auto-detected from git diff if omitted)
#       --dry-run            Show what would happen without logging or closing
#   -h, --help               Show this help message
#
# Example:
#   ./scripts/resolve-alert.sh \
#     --issue 42 \
#     --summary-text "Extracted APP_ROLE_ORDER into shared/auth.ts" \
#     --changes "shared/auth.ts,backend/src/controllers/auth.controller.ts"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ISSUE=""
SUMMARY_FILE=""
SUMMARY_TEXT=""
PURPOSE=""
CHANGES=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -i|--issue)         ISSUE="$2";           shift 2 ;;
    -a|--alert)
      echo "Error: --alert <file> is retired. Architectural alerts are GitHub Issues only." >&2
      echo "Use: $0 --issue <N> --summary-text \"...\"" >&2
      echo "List: gh issue list --label architecture-alert --state open" >&2
      exit 1 ;;
    -s|--summary)       SUMMARY_FILE="$2";    shift 2 ;;
    --summary-text)     SUMMARY_TEXT="$2";    shift 2 ;;
    -u|--purpose)       PURPOSE="$2";         shift 2 ;;
    -c|--changes)       CHANGES="$2";         shift 2 ;;
    --dry-run)          DRY_RUN=true;         shift ;;
    -h|--help)
      awk '/^# resolve-alert.sh/{p=1} p && /^[^#]/{exit} p{sub(/^# ?/,""); print}' "$0"
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$ISSUE" ]]; then
  echo "Error: --issue <N> is required" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required. Install https://cli.github.com/ and run: gh auth login" >&2
  exit 1
fi

if [[ -n "$SUMMARY_FILE" ]]; then
  RESOLVED_SUMMARY="$(cat "$SUMMARY_FILE")"
elif [[ -n "$SUMMARY_TEXT" ]]; then
  RESOLVED_SUMMARY="$SUMMARY_TEXT"
else
  echo "Error: --summary or --summary-text is required" >&2
  exit 1
fi

ISSUE_TITLE="$(gh issue view "$ISSUE" --json title --jq '.title')"
ISSUE_STATE="$(gh issue view "$ISSUE" --json state --jq '.state')"
ISSUE_URL="$(gh issue view "$ISSUE" --json url --jq '.url')"

if [[ -z "$PURPOSE" ]]; then
  PURPOSE="Resolve architectural alert: ${ISSUE_TITLE}"
fi

PROMPT_TEXT="Fix architectural alert #${ISSUE}: ${ISSUE_TITLE}"

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run — would resolve issue #${ISSUE}"
  echo "  Title:    $ISSUE_TITLE"
  echo "  State:    $ISSUE_STATE"
  echo "  URL:      $ISSUE_URL"
  echo "  Purpose:  $PURPOSE"
  echo "  Summary:  $RESOLVED_SUMMARY"
  echo "  Changes:  ${CHANGES:-<auto-detect from git>}"
  if [[ "$ISSUE_STATE" == "OPEN" ]]; then
    echo "  Action:   log session, then gh issue close #${ISSUE}"
  else
    echo "  Action:   log session, then comment on already-closed #${ISSUE} (no re-close)"
  fi
  exit 0
fi

LOG_ARGS=(
  --title "resolve-issue-${ISSUE}"
  --purpose "$PURPOSE"
  --prompt-text "$PROMPT_TEXT"
  --summary-text "$RESOLVED_SUMMARY"
)
if [[ -n "$CHANGES" ]]; then
  LOG_ARGS+=(--changes "$CHANGES")
fi

"${SCRIPT_DIR}/log-agent-session.sh" "${LOG_ARGS[@]}"

COMMENT="$(cat <<EOF
Resolved via \`scripts/resolve-alert.sh\`.

${RESOLVED_SUMMARY}
EOF
)"

if [[ "$ISSUE_STATE" == "OPEN" ]]; then
  gh issue close "$ISSUE" --comment "$COMMENT"
  echo ""
  echo "Architectural alert closed: $ISSUE_URL"
else
  gh issue comment "$ISSUE" --body "$COMMENT"
  echo ""
  echo "Issue #${ISSUE} already ${ISSUE_STATE}; left resolution comment: $ISSUE_URL"
fi
