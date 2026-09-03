#!/usr/bin/env bash
# Backfill blank cohort / front-desk / study-session requirements on public.user_roster.
#
# Defaults: cohort 2026, fd_required 180 min/week, ss_required 300 min/week, Scholar rows only.
# Blank columns are filled; existing values are left alone unless --overwrite is passed, so
# repeat runs converge to a no-op.
#
# Usage:
#   ./scripts/backfill-user-roster-defaults.sh --dry-run
#   ./scripts/backfill-user-roster-defaults.sh
#   ./scripts/backfill-user-roster-defaults.sh --cohort 2027 --program-role any
#
# URL: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in the current shell, or URL-only
# from backend/.env (never reads SUPABASE_SERVICE_ROLE_KEY from project env files).
#
# Service role: prompted interactively (hidden) unless already set in this shell.
# --dry-run still needs credentials because it reads the roster before printing the plan.
#
# Exit codes: 0 = success, 1 = failure

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELPER="${REPO_ROOT}/scripts/backfill-user-roster-defaults.py"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/backfill-user-roster-defaults.sh [options]

Fills blank cohort / fd_required / ss_required on public.user_roster.

Options:
  --dry-run              Print the plan; send no writes (still reads the roster)
  --cohort N             Cohort year to fill in (default 2026)
  --fd-required N        Weekly front-desk minutes (default 180)
  --ss-required N        Weekly study-session minutes (default 300)
  --program-role ROLE    Only touch this program_role, case-insensitive
                         (default "Scholar"; use "any" for every row)
  --overwrite            Set all three columns even when they already hold a value
  --include-zero         Treat fd_required / ss_required of 0 as blank
  --batch-size N         Row ids per PATCH request (default 100)
  -h, --help             Show this help

Requires: python3.
EOF
}

for arg in "$@"; do
  case "$arg" in
  -h | --help)
    usage
    exit 0
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

require_supabase_url
require_supabase_service_role

# Key and URL exist only in this process environment for the helper.
exec python3 "$HELPER" "$@"
