#!/usr/bin/env bash
# resolve-alert.sh
#
# Resolves an architectural alert in docs/agents/alerts/ by logging the fix
# session and deleting the alert file.
#
# Usage:
#   ./scripts/resolve-alert.sh [OPTIONS]
#
# Options:
#   -a, --alert FILE         Path to the alert markdown file (required)
#   -s, --summary FILE       Path to a file with the resolution summary
#       --summary-text STR   Inline resolution summary
#   -u, --purpose STR        Override purpose (defaults to alert description)
#   -c, --changes STR        Comma-separated list of files changed
#                            (auto-detected from git diff if omitted)
#       --dry-run            Show what would happen without logging or deleting
#   -h, --help               Show this help message
#
# Example:
#   ./scripts/resolve-alert.sh \
#     --alert docs/agents/alerts/2026-06-26T055650Z-auth-role-hierarchy-duplication.md \
#     --summary-text "Extracted APP_ROLE_ORDER, hasRoleAtLeast, and mergeProfileWithRoster into shared/auth.ts" \
#     --changes "shared/auth.ts,frontend/lib/supabase/server.ts,backend/src/controllers/auth.controller.ts"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALERTS_DIR="docs/agents/alerts"

ALERT_FILE=""
SUMMARY_FILE=""
SUMMARY_TEXT=""
PURPOSE=""
CHANGES=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -a|--alert)         ALERT_FILE="$2";      shift 2 ;;
    -s|--summary)       SUMMARY_FILE="$2";    shift 2 ;;
    --summary-text)     SUMMARY_TEXT="$2";    shift 2 ;;
    -u|--purpose)       PURPOSE="$2";         shift 2 ;;
    -c|--changes)       CHANGES="$2";         shift 2 ;;
    --dry-run)          DRY_RUN=true;         shift ;;
    -h|--help)
      sed -n '/^# resolve-alert.sh/,/^[^#]/p' "$0" | head -n -1 | sed 's/^# \?//'
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$ALERT_FILE" ]]; then
  echo "Error: --alert is required" >&2
  exit 1
fi

if [[ ! -f "$ALERT_FILE" ]]; then
  echo "Error: alert file not found: $ALERT_FILE" >&2
  exit 1
fi

case "$ALERT_FILE" in
  "${ALERTS_DIR}/"*) ;;
  *)
    echo "Error: alert file must be under ${ALERTS_DIR}/" >&2
    exit 1
    ;;
esac

# ── Extract title from first heading ───────────────────────────────────────────
TITLE="$(sed -n 's/^# //p' "$ALERT_FILE" | head -n 1)"
if [[ -z "$TITLE" ]]; then
  TITLE="$(basename "$ALERT_FILE" .md)"
fi

# ── Extract description (between ## Description and next ---) ──────────────────
if [[ -z "$PURPOSE" ]]; then
  PURPOSE="$(awk '
    /^## Description$/ { found=1; next }
    found && /^---$/ { exit }
    found { print }
  ' "$ALERT_FILE" | sed '/^$/d' | head -n 1)"
  if [[ -z "$PURPOSE" ]]; then
    PURPOSE="Resolve alert: ${TITLE}"
  fi
fi

# ── Resolve summary content ────────────────────────────────────────────────────
if [[ -n "$SUMMARY_FILE" ]]; then
  RESOLVED_SUMMARY="$(cat "$SUMMARY_FILE")"
elif [[ -n "$SUMMARY_TEXT" ]]; then
  RESOLVED_SUMMARY="$SUMMARY_TEXT"
else
  echo "Error: --summary or --summary-text is required" >&2
  exit 1
fi

PROMPT_TEXT="Fix ${TITLE} alert"

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run — would resolve alert: $ALERT_FILE"
  echo "  Title:    $TITLE"
  echo "  Purpose:  $PURPOSE"
  echo "  Summary:  $RESOLVED_SUMMARY"
  echo "  Changes:  ${CHANGES:-<auto-detect from git>}"
  echo "  Action:   log session via log-agent-session.sh, then delete alert file"
  exit 0
fi

# ── Log the resolution session ─────────────────────────────────────────────────
LOG_ARGS=(
  --title "resolve-${TITLE}"
  --purpose "$PURPOSE"
  --prompt-text "$PROMPT_TEXT"
  --summary-text "$RESOLVED_SUMMARY"
)
if [[ -n "$CHANGES" ]]; then
  LOG_ARGS+=(--changes "$CHANGES")
fi

"${SCRIPT_DIR}/log-agent-session.sh" "${LOG_ARGS[@]}"

# ── Delete the alert file ──────────────────────────────────────────────────────
rm "$ALERT_FILE"

echo ""
echo "Alert resolved and deleted: $ALERT_FILE"
