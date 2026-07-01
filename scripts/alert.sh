#!/usr/bin/env bash
# alert.sh
#
# Records an architectural or runtime alert to docs/agents/alerts/.
# Captures: title, severity, category, description, affected files, and recommendation.
#
# Usage:
#   ./scripts/alert.sh [OPTIONS]
#
# Options:
#   -t, --title STR          Short alert title (used in filename + heading)
#   -S, --severity STR       Severity level: info | warning | error  (default: warning)
#   -C, --category STR       Category: auth | security | performance | integrity | config
#   -d, --description STR    Full description of the issue
#       --description-file FILE  Path to a file containing the description
#   -f, --files STR          Comma-separated list of affected files
#   -r, --recommendation STR  Recommended action or fix
#   -h, --help               Show this help message
#
# Example (fully scripted):
#   ./scripts/alert.sh \
#     --title "auth-role-hierarchy-duplication" \
#     --severity warning \
#     --category auth \
#     --description "ROLE_ORDER duplicated between frontend and backend with different implementations." \
#     --files "frontend/lib/supabase/server.ts,backend/src/controllers/auth.controller.ts" \
#     --recommendation "Extract role hierarchy into a shared source of truth."
#
# Example (interactive — prompts for all fields):
#   ./scripts/alert.sh

set -euo pipefail

ALERTS_DIR="docs/agents/alerts"

# ── Parse arguments ────────────────────────────────────────────────────────────
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
      sed -n '/^# alert.sh/,/^[^#]/p' "$0" | head -n -1 | sed 's/^# \?//'
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ── Validate severity ──────────────────────────────────────────────────────────
case "$SEVERITY" in
  info|warning|error) ;;
  *) echo "Error: --severity must be one of: info, warning, error" >&2; exit 1 ;;
esac

# ── Interactive fallbacks ───────────────────────────────────────────────────────
if [[ -z "$TITLE" ]]; then
  read -r -p "Alert title (short, used in filename): " TITLE
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
  read -r -p "Recommendation (one sentence): " RECOMMENDATION
fi

# ── Resolve description content ────────────────────────────────────────────────
if [[ -n "$DESCRIPTION_FILE" ]]; then
  DESCRIPTION_CONTENT="$(cat "$DESCRIPTION_FILE")"
else
  DESCRIPTION_CONTENT="$DESCRIPTION"
fi

# ── Resolve affected files ─────────────────────────────────────────────────────
if [[ -n "$FILES" ]]; then
  FILES_LIST="$(echo "$FILES" | tr ',' '\n' | sed 's/^ *//;s/ *$//')"
else
  FILES_LIST=""
fi

# ── Build output filename ───────────────────────────────────────────────────────
TIMESTAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')"
FILENAME="${ALERTS_DIR}/${TIMESTAMP}-${SLUG}.md"

mkdir -p "$ALERTS_DIR"

# ── Write alert file ────────────────────────────────────────────────────────────
cat > "$FILENAME" <<EOF
# ${TITLE}

**Date:** ${TIMESTAMP}
**Severity:** ${SEVERITY}
**Category:** ${CATEGORY}

---

## Description

${DESCRIPTION_CONTENT}

---

## Affected Files

EOF

if [[ -n "$FILES_LIST" ]]; then
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    echo "- \`${f}\`" >> "$FILENAME"
  done <<< "$FILES_LIST"
else
  echo "_No files specified._" >> "$FILENAME"
fi

cat >> "$FILENAME" <<EOF

---

## Recommendation

${RECOMMENDATION}
EOF

echo ""
echo "Alert logged to: $FILENAME"
