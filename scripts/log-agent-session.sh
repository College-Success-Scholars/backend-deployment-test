#!/usr/bin/env bash
# log-agent-session.sh
#
# Records an agent/AI session to docs/agents/logs/.
# Captures: who ran it, verbatim user prompt(s), stated purpose,
# agent response summary, and code changes made.
#
# User Prompt rules:
#   - Verbatim only — never summarize or paraphrase user input.
#   - Multi-turn: separate each exact user message with a line containing only "---".
# Agent Response Summary:
#   - Summarize what the agent did, not what the user asked.
#
# Usage:
#   ./scripts/log-agent-session.sh [OPTIONS]
#
# Options:
#   -t, --title STR        Short session title (used in filename + heading)
#   -U, --user STR         Who ran the session (defaults to git user.email)
#   -u, --purpose STR      One-sentence purpose of the agent call
#   -p, --prompt FILE      Path to a file containing verbatim user prompt(s)
#       --prompt-text STR  Inline verbatim user prompt(s); use "---" between messages
#   -s, --summary FILE     Path to a file with the agent response summary
#       --summary-text STR What the agent did (not a recap of user input)
#   -c, --changes STR      Comma-separated list of files changed
#                          (auto-detected from git diff if omitted)
#   -h, --help             Show this help message
#
# Example (interactive mode — prompts for all fields):
#   ./scripts/log-agent-session.sh
#
# Example (fully scripted):
#   ./scripts/log-agent-session.sh \
#     --title "auth-role-fix" \
#     --user "dev@example.com" \
#     --purpose "Fix hasRoleAtLeast stub that allowed all authenticated users through" \
#     --prompt-text "Fix the role check in frontend/lib/supabase/server.ts" \
#     --summary-text "Implemented ROLE_ORDER map; hasRoleAtLeast now compares numeric levels" \
#     --changes "frontend/lib/supabase/server.ts"

set -euo pipefail

LOGS_DIR="docs/agents/logs"

# ── Parse arguments ────────────────────────────────────────────────────────────
TITLE=""
USER_ID=""
PURPOSE=""
PROMPT_FILE=""
PROMPT_TEXT=""
SUMMARY_FILE=""
SUMMARY_TEXT=""
CHANGES=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--title)        TITLE="$2";       shift 2 ;;
    -U|--user)         USER_ID="$2";     shift 2 ;;
    -u|--purpose)      PURPOSE="$2";     shift 2 ;;
    -p|--prompt)       PROMPT_FILE="$2"; shift 2 ;;
    --prompt-text)     PROMPT_TEXT="$2"; shift 2 ;;
    -s|--summary)      SUMMARY_FILE="$2"; shift 2 ;;
    --summary-text)    SUMMARY_TEXT="$2"; shift 2 ;;
    -c|--changes)      CHANGES="$2";     shift 2 ;;
    -h|--help)
      sed -n '/^# log-agent-session/,/^[^#]/p' "$0" | head -n -1 | sed 's/^# \?//'
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ── Default user to git email ───────────────────────────────────────────────────
if [[ -z "$USER_ID" ]]; then
  USER_ID="$(git config user.email 2>/dev/null || echo "unknown")"
fi

# ── Interactive fallbacks ───────────────────────────────────────────────────────
if [[ -z "$TITLE" ]]; then
  read -r -p "Session title (short, used in filename): " TITLE
fi
if [[ -z "$PURPOSE" ]]; then
  read -r -p "Purpose of this agent call (one sentence): " PURPOSE
fi
if [[ -z "$PROMPT_TEXT" && -z "$PROMPT_FILE" ]]; then
  echo "Enter verbatim user message(s) — do not summarize (end input with a line containing only '==='):"
  echo "  Separate multiple messages with a line containing only '---'."
  lines=()
  while IFS= read -r line; do
    [[ "$line" == "===" ]] && break
    lines+=("$line")
  done
  PROMPT_TEXT="$(printf '%s\n' "${lines[@]}")"
fi
if [[ -z "$SUMMARY_TEXT" && -z "$SUMMARY_FILE" ]]; then
  echo "Enter what the agent did — not a recap of user input (end with a line containing only '==='):"
  lines=()
  while IFS= read -r line; do
    [[ "$line" == "===" ]] && break
    lines+=("$line")
  done
  SUMMARY_TEXT="$(printf '%s\n' "${lines[@]}")"
fi

# ── Resolve prompt content ──────────────────────────────────────────────────────
if [[ -n "$PROMPT_FILE" ]]; then
  PROMPT_CONTENT="$(cat "$PROMPT_FILE")"
else
  PROMPT_CONTENT="$PROMPT_TEXT"
fi

# ── Resolve summary content ─────────────────────────────────────────────────────
if [[ -n "$SUMMARY_FILE" ]]; then
  SUMMARY_CONTENT="$(cat "$SUMMARY_FILE")"
else
  SUMMARY_CONTENT="$SUMMARY_TEXT"
fi

# ── Auto-detect changed files from git if not provided ─────────────────────────
if [[ -z "$CHANGES" ]]; then
  CHANGES_LIST="$(git diff --name-only HEAD 2>/dev/null || true)"
  if [[ -z "$CHANGES_LIST" ]]; then
    CHANGES_LIST="$(git diff --name-only HEAD~1 HEAD 2>/dev/null || true)"
  fi
else
  CHANGES_LIST="$(echo "$CHANGES" | tr ',' '\n' | sed 's/^ *//;s/ *$//')"
fi

# ── Build output filename ───────────────────────────────────────────────────────
TIMESTAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')"
FILENAME="${LOGS_DIR}/${TIMESTAMP}-${SLUG}.md"

mkdir -p "$LOGS_DIR"

# ── Write session file ──────────────────────────────────────────────────────────
cat > "$FILENAME" <<EOF
# ${TITLE}

**Date:** ${TIMESTAMP}
**User:** ${USER_ID}

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

\`\`\`
${PROMPT_CONTENT}
\`\`\`

---

## Purpose

${PURPOSE}

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

${SUMMARY_CONTENT}

---

## Code Changes

EOF

if [[ -n "$CHANGES_LIST" ]]; then
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    echo "- \`${f}\`" >> "$FILENAME"
  done <<< "$CHANGES_LIST"
else
  echo "_No changes detected._" >> "$FILENAME"
fi

echo ""
echo "Session logged to: $FILENAME"
