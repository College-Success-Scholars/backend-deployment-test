#!/usr/bin/env bash
# Ingest a roster CSV into public.user_roster via Supabase PostgREST.
#
# Sensitive: reads the CSV from the path you pass and streams rows to Supabase.
# Does not write transformed PII or the service role key to disk.
#
# Usage:
#   ./scripts/ingest-user-roster.sh path/to/roster.csv
#   ./scripts/ingest-user-roster.sh --dry-run path/to/roster.csv
#
# URL: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in the current shell, or URL-only
# from backend/.env (never reads SUPABASE_SERVICE_ROLE_KEY from project env files).
#
# Service role: prompted interactively (hidden) unless already set in this shell.
# --dry-run skips the prompt and does not POST.
#
# Exit codes: 0 = success, 1 = failure

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELPER="${REPO_ROOT}/scripts/ingest-user-roster.py"
DRY_RUN=0
CSV_PATH=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/ingest-user-roster.sh [--dry-run] path/to/roster.csv

Streams mapped rows into public.user_roster. Non-9-digit UIDs become NULL.
University Email is preferred when @umd.edu / @terpmail.umd.edu; otherwise
Primary Email is used and a contact report is printed to stdout.

Requires: python3, curl (curl unused by helper; python uses urllib).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      echo "error: unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$CSV_PATH" ]]; then
        echo "error: unexpected argument: $1" >&2
        exit 1
      fi
      CSV_PATH="$1"
      shift
      ;;
  esac
done

if [[ -z "$CSV_PATH" ]]; then
  echo "error: CSV path is required" >&2
  usage >&2
  exit 1
fi

if [[ ! -f "$CSV_PATH" ]]; then
  echo "error: CSV not found: $CSV_PATH" >&2
  exit 1
fi

if [[ ! -f "$HELPER" ]]; then
  echo "error: helper not found: $HELPER" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 is required" >&2
  exit 1
fi

# shellcheck source=scripts/supabase-env.sh
source "${REPO_ROOT}/scripts/supabase-env.sh"

# A dry run neither reads nor writes Supabase, so it needs no credentials.
if [[ "$DRY_RUN" -eq 0 ]]; then
  require_supabase_url
  require_supabase_service_role
fi

PY_ARGS=("$HELPER" "$CSV_PATH")
if [[ "$DRY_RUN" -eq 1 ]]; then
  PY_ARGS+=(--dry-run)
fi

# Key and URL exist only in this process environment for the helper.
exec python3 "${PY_ARGS[@]}"
