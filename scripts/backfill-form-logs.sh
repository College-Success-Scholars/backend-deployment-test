#!/usr/bin/env bash
# Backfill public.mcf_form_logs and public.wpl_form_logs from Google Form CSV dumps.
#
# Default source: tmp/back fill form data/{wpl,mcf}.csv (headerless Sheets exports).
# Existing created_at + uid rows are skipped unless --force is passed, so repeat
# runs converge to a no-op.
#
# Usage:
#   ./scripts/backfill-form-logs.sh --dry-run
#   ./scripts/backfill-form-logs.sh
#   ./scripts/backfill-form-logs.sh --only wpl --dir "tmp/back fill form data"
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
HELPER="${REPO_ROOT}/scripts/backfill-form-logs.py"
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage:
  ./scripts/backfill-form-logs.sh [options]

Inserts Google Form CSV dumps into public.wpl_form_logs and public.mcf_form_logs.

Options:
  --dry-run              Parse and print the plan; send no writes
  --dir PATH             Directory with wpl.csv / mcf.csv
                         (default: tmp/back fill form data)
  --wpl PATH             Explicit WPL CSV path
  --mcf PATH             Explicit MCF CSV path
  --only wpl|mcf|all     Load one form type (default all)
  --force                Insert even when a matching row already exists
  --batch-size N         Rows per POST request (default 50)
  -h, --help             Show this help

Requires: python3.
The CSVs are PII — this script does not write transformed copies to disk.
EOF
}

for arg in "$@"; do
  case "$arg" in
  -h | --help)
    usage
    exit 0
    ;;
  --dry-run)
    DRY_RUN=1
    ;;
  esac
done

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

# Key and URL exist only in this process environment for the helper.
exec python3 "$HELPER" "$@"
