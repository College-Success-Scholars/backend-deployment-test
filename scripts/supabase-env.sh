#!/usr/bin/env bash
# Supabase credential resolution shared by the ops scripts. Source it; do not execute it.
#
# Callers must set REPO_ROOT before sourcing, then call:
#   require_supabase_url           — resolves + validates SUPABASE_URL
#   require_supabase_service_role  — hidden prompt unless already exported in this shell
#
# The service role key is never read from project env files: it is pasted per run so it
# only ever lives in the calling process environment.

# SUPABASE_URL, else NEXT_PUBLIC_SUPABASE_URL, else the URL keys in backend/.env.
_load_url_from_backend_env() {
  local env_file="${REPO_ROOT}/backend/.env"
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

require_supabase_url() {
  if [[ -z "${SUPABASE_URL:-}" && -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]]; then
    export SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
  fi

  if [[ -z "${SUPABASE_URL:-}" ]]; then
    _load_url_from_backend_env
  fi

  if [[ -z "${SUPABASE_URL:-}" ]]; then
    echo "error: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL (or put SUPABASE_URL in backend/.env)" >&2
    return 1
  fi
}

require_supabase_service_role() {
  if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
    if [[ ! -t 0 ]]; then
      echo "error: SUPABASE_SERVICE_ROLE_KEY is unset and stdin is not a TTY (cannot prompt)" >&2
      echo "Export SUPABASE_SERVICE_ROLE_KEY in this shell for non-interactive runs." >&2
      return 1
    fi
    echo "Paste Supabase service role key (input hidden), then Enter:" >&2
    read -r -s SUPABASE_SERVICE_ROLE_KEY
    echo >&2
    export SUPABASE_SERVICE_ROLE_KEY
  fi

  if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
    echo "error: service role key is empty" >&2
    return 1
  fi
}
