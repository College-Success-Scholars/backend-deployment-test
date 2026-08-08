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

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELPER="${ROOT}/scripts/ingest-user-roster.py"
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

# URL-only from backend/.env — never load service role from project env files.
load_url_from_backend_env() {
  local env_file="${ROOT}/backend/.env"
  [[ -f "$env_file" ]] || return 0
  local line name val
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line#"${line%%[![:space:]]*}"}"
    [[ -z "$line" || "$line" == \#* ]] && continue
    name="${line%%=*}"
    name="${name%"${name##*[![:space:]]}"}"
    [[ "$name" == "SUPABASE_URL" || "$name" == "NEXT_PUBLIC_SUPABASE_URL" ]] || continue
    val="${line#*=}"
    val="${val#"${val%%[![:space:]]*}"}"
    val="${val%"${val##*[![:space:]]}"}"
    if [[ "$val" == \"*\" && "$val" == *\" ]]; then
      val="${val:1:${#val}-2}"
    elif [[ "$val" == \'*\' && "$val" == *\' ]]; then
      val="${val:1:${#val}-2}"
    fi
    if [[ -z "${SUPABASE_URL:-}" && -n "$val" ]]; then
      export SUPABASE_URL="$val"
    fi
  done < "$env_file"
}

if [[ -z "${SUPABASE_URL:-}" && -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]]; then
  export SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
fi

if [[ -z "${SUPABASE_URL:-}" ]]; then
  load_url_from_backend_env
fi

if [[ "$DRY_RUN" -eq 0 ]]; then
  if [[ -z "${SUPABASE_URL:-}" ]]; then
    echo "error: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL (or put SUPABASE_URL in backend/.env)" >&2
    exit 1
  fi

  if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
    if [[ ! -t 0 ]]; then
      echo "error: SUPABASE_SERVICE_ROLE_KEY is unset and stdin is not a TTY (cannot prompt)" >&2
      echo "Export SUPABASE_SERVICE_ROLE_KEY in this shell for non-interactive runs." >&2
      exit 1
    fi
    echo "Paste Supabase service role key (input hidden), then Enter:" >&2
    # Do not load from repo .env — operator pastes from Dashboard for this run only.
    read -r -s SUPABASE_SERVICE_ROLE_KEY
    echo >&2
    export SUPABASE_SERVICE_ROLE_KEY
  fi

  if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
    echo "error: service role key is empty" >&2
    exit 1
  fi
fi

PY_ARGS=("$HELPER" "$CSV_PATH")
if [[ "$DRY_RUN" -eq 1 ]]; then
  PY_ARGS+=(--dry-run)
fi

# Key and URL exist only in this process environment for the helper.
exec python3 "${PY_ARGS[@]}"
