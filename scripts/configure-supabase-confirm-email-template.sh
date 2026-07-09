#!/usr/bin/env bash
# Patch the Supabase "Confirm signup" email template so confirmation links include
# token_hash and type query params for the Next.js /auth/confirm route handler.
#
# Required env:
#   SUPABASE_ACCESS_TOKEN — personal access token from https://supabase.com/dashboard/account/tokens
#   SUPABASE_PROJECT_REF  — project ref (e.g. abcdefghijklmnop), or set NEXT_PUBLIC_SUPABASE_URL
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... ./scripts/configure-supabase-confirm-email-template.sh
#
# Exit codes: 0 = success, 1 = missing config or API error

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE_FILE="${ROOT}/docs/dev/frontend/app/auth/email-templates/confirm-signup.html"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "error: template file not found: $TEMPLATE_FILE" >&2
  exit 1
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
if [[ -z "$PROJECT_REF" && -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]]; then
  PROJECT_REF="$(printf '%s' "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's#https?://([^.]+)\.supabase\.co.*#\1#')"
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "error: SUPABASE_ACCESS_TOKEN is required" >&2
  echo "Create one at https://supabase.com/dashboard/account/tokens" >&2
  exit 1
fi

if [[ -z "$PROJECT_REF" ]]; then
  echo "error: set SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL" >&2
  exit 1
fi

TEMPLATE_CONTENT="$(tr -d '\n' < "$TEMPLATE_FILE" | sed 's/  */ /g')"
export TEMPLATE_CONTENT

PAYLOAD="$(python3 - <<'PY'
import json
import os

content = os.environ["TEMPLATE_CONTENT"]
print(json.dumps({
    "mailer_subjects_confirmation": "Confirm your email",
    "mailer_templates_confirmation_content": content,
}))
PY
)"

echo "Updating Supabase confirm-signup email template for project: $PROJECT_REF"

HTTP_STATUS="$(curl -sS -o /tmp/supabase-auth-config-response.json -w "%{http_code}" \
  -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")"

if [[ "$HTTP_STATUS" != "200" ]]; then
  echo "error: Supabase API returned HTTP $HTTP_STATUS" >&2
  cat /tmp/supabase-auth-config-response.json >&2
  exit 1
fi

echo "Done. Confirm signup emails now link to /auth/confirm?token_hash=...&type=email&next=/dashboard"
echo "Ensure Supabase Auth URL config includes your Site URL and https://<domain>/auth/confirm in Redirect URLs."
