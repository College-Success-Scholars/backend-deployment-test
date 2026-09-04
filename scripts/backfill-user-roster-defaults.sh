#!/usr/bin/env bash
# Backfill blank cohort / front-desk / study-session requirements on public.user_roster.
#
# Blank cohort fills to 2026. Scholar hours depend on cohort (stored as minutes):
#   2025 → 2h front desk / 3h study session (120 / 180)
#   2026 → 3h front desk / 5h study session (180 / 300)
# Team leaders (not scholars) get 0 / 0. Unmapped scholar cohorts skip hours.
# Blank columns are filled; existing hour values are left alone unless --overwrite
# is passed. An existing cohort year is never replaced. Repeat runs converge to a no-op.
#
# Usage:
#   ./scripts/backfill-user-roster-defaults.sh --dry-run
#   ./scripts/backfill-user-roster-defaults.sh
#   ./scripts/backfill-user-roster-defaults.sh --overwrite --include-zero
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

Fills blank cohort and role/cohort-based fd_required / ss_required on public.user_roster.

Scholar weekly minutes by cohort:
  2025  front desk 2h (120)   study session 3h (180)
  2026  front desk 3h (180)   study session 5h (300)
Team leaders get 0 / 0. Scholars in any other cohort are listed and skip hours.

Options:
  --dry-run              Print the plan; send no writes (still reads the roster)
  --cohort N             Cohort year to fill when cohort is blank (default 2026)
  --program-role ROLE    Only touch this program_role, case-insensitive
                         (default Scholar and Team Leader; use "any" for every row)
  --overwrite            Set fd_required / ss_required even when they already hold
                         a value. Does not overwrite an existing cohort year
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
