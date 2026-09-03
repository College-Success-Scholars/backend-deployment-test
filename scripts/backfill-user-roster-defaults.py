#!/usr/bin/env python3
"""
Backfill blank cohort / FD / SS requirement values on public.user_roster via PostgREST.

Invoked by scripts/backfill-user-roster-defaults.sh. Reads the roster, computes the
minimum patch per row, and PATCHes rows grouped by identical patch. Fills only blank
columns unless --overwrite is passed, so repeat runs converge to a no-op.

Does not write PII or credentials to disk. Service role key must come from the
environment (set by the shell after an interactive prompt).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, NamedTuple

DEFAULT_COHORT = 2026
DEFAULT_FD_REQUIRED = 180
DEFAULT_SS_REQUIRED = 300
DEFAULT_PROGRAM_ROLE = "Scholar"
ANY_PROGRAM_ROLE = "any"

BATCH_SIZE_DEFAULT = 100
PAGE_SIZE = 1000

TABLE = "user_roster"
ROSTER_COLUMNS = (
    "id",
    "uid",
    "first_name",
    "last_name",
    "program_role",
    "cohort",
    "fd_required",
    "ss_required",
)
BACKFILL_COLUMNS = ("cohort", "fd_required", "ss_required")


class Defaults(NamedTuple):
    cohort: int
    fd_required: int
    ss_required: int


def request(
    base_url: str,
    service_role: str,
    path: str,
    method: str = "GET",
    body: Any | None = None,
) -> Any:
    endpoint = base_url.rstrip("/") + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {
        "apikey": service_role,
        "Authorization": f"Bearer {service_role}",
        "Accept": "application/json",
    }
    if data is not None:
        headers["Content-Type"] = "application/json"
        headers["Prefer"] = "return=minimal"

    req = urllib.request.Request(endpoint, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            if resp.status not in (200, 201, 204):
                raise SystemExit(f"error: PostgREST returned HTTP {resp.status}")
            payload = resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"error: PostgREST HTTP {e.code}: {detail}") from e
    except urllib.error.URLError as e:
        raise SystemExit(f"error: request failed: {e.reason}") from e

    if not payload:
        return None
    return json.loads(payload.decode("utf-8"))


def fetch_roster(base_url: str, service_role: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0
    while True:
        query = urllib.parse.urlencode(
            {
                "select": ",".join(ROSTER_COLUMNS),
                "order": "id.asc",
                "limit": PAGE_SIZE,
                "offset": offset,
            }
        )
        page = request(base_url, service_role, f"/rest/v1/{TABLE}?{query}")
        if not isinstance(page, list):
            raise SystemExit("error: unexpected PostgREST response shape for roster read")
        rows.extend(page)
        if len(page) < PAGE_SIZE:
            return rows
        offset += PAGE_SIZE


def is_blank(value: Any, *, zero_is_blank: bool) -> bool:
    if value is None:
        return True
    return zero_is_blank and value == 0


def matches_role(row: dict[str, Any], program_role: str | None) -> bool:
    if program_role is None:
        return True
    return (row.get("program_role") or "").strip().lower() == program_role.strip().lower()


def plan_updates(
    rows: list[dict[str, Any]],
    defaults: Defaults,
    *,
    overwrite: bool,
    include_zero: bool,
) -> list[tuple[dict[str, Any], dict[str, int]]]:
    """Return (row, patch) pairs for rows that need at least one column changed."""
    planned: list[tuple[dict[str, Any], dict[str, int]]] = []
    for row in rows:
        patch: dict[str, int] = {}
        for column, default, zero_is_blank in (
            # Cohort 0 is never a real year, so it always counts as blank.
            ("cohort", defaults.cohort, True),
            ("fd_required", defaults.fd_required, include_zero),
            ("ss_required", defaults.ss_required, include_zero),
        ):
            current = row.get(column)
            if current == default:
                continue
            if overwrite or is_blank(current, zero_is_blank=zero_is_blank):
                patch[column] = default
        if patch:
            planned.append((row, patch))
    return planned


def group_by_patch(
    planned: list[tuple[dict[str, Any], dict[str, int]]],
) -> dict[tuple[tuple[str, int], ...], list[int]]:
    """Collapse rows sharing an identical patch so each shape costs one PATCH batch."""
    groups: dict[tuple[tuple[str, int], ...], list[int]] = {}
    for row, patch in planned:
        groups.setdefault(tuple(sorted(patch.items())), []).append(int(row["id"]))
    return groups


def describe_changes(row: dict[str, Any], patch: dict[str, int]) -> str:
    parts = []
    for column in BACKFILL_COLUMNS:
        if column in patch:
            current = row.get(column)
            shown = "blank" if current is None else str(current)
            parts.append(f"{column}: {shown} -> {patch[column]}")
    return "; ".join(parts)


def print_plan(planned: list[tuple[dict[str, Any], dict[str, int]]]) -> None:
    print()
    print(f"=== Planned roster updates ({len(planned)}) ===")
    if not planned:
        print("(none — roster already matches the defaults)")
        return
    print("\t".join(("uid", "first_name", "last_name", "program_role", "changes")))
    for row, patch in planned:
        print(
            "\t".join(
                (
                    str(row.get("uid") or ""),
                    str(row.get("first_name") or ""),
                    str(row.get("last_name") or ""),
                    str(row.get("program_role") or ""),
                    describe_changes(row, patch),
                )
            )
        )


def print_summary(
    planned: list[tuple[dict[str, Any], dict[str, int]]],
    *,
    total_rows: int,
    candidate_rows: int,
    blank_role_rows: int,
) -> None:
    print()
    print(f"Roster rows read: {total_rows}")
    print(f"Rows matching the role filter: {candidate_rows}")
    if blank_role_rows:
        print(f"Rows with a blank program_role (never match a role filter): {blank_role_rows}")
    for column in BACKFILL_COLUMNS:
        count = sum(1 for _, patch in planned if column in patch)
        print(f"  {column}: {count} row(s) to set")
    print(f"Rows to patch: {len(planned)}")


def apply_updates(
    base_url: str,
    service_role: str,
    groups: dict[tuple[tuple[str, int], ...], list[int]],
    batch_size: int,
) -> int:
    total = 0
    for patch_items, ids in groups.items():
        patch = dict(patch_items)
        for start in range(0, len(ids), batch_size):
            chunk = ids[start : start + batch_size]
            id_list = ",".join(str(i) for i in chunk)
            query = urllib.parse.urlencode({"id": f"in.({id_list})"})
            request(base_url, service_role, f"/rest/v1/{TABLE}?{query}", "PATCH", patch)
            total += len(chunk)
            print(f"Patched {len(chunk)} row(s) with {json.dumps(patch)} (running total {total})")
    return total


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backfill blank cohort / fd_required / ss_required on user_roster"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Read the roster and print the plan only; send no writes",
    )
    parser.add_argument(
        "--cohort", type=int, default=DEFAULT_COHORT, help=f"Cohort year (default {DEFAULT_COHORT})"
    )
    parser.add_argument(
        "--fd-required",
        type=int,
        default=DEFAULT_FD_REQUIRED,
        help=f"Weekly front-desk minutes (default {DEFAULT_FD_REQUIRED})",
    )
    parser.add_argument(
        "--ss-required",
        type=int,
        default=DEFAULT_SS_REQUIRED,
        help=f"Weekly study-session minutes (default {DEFAULT_SS_REQUIRED})",
    )
    parser.add_argument(
        "--program-role",
        default=DEFAULT_PROGRAM_ROLE,
        help=(
            f"Only touch rows with this program_role, case-insensitive "
            f"(default {DEFAULT_PROGRAM_ROLE!r}; use {ANY_PROGRAM_ROLE!r} for every row)"
        ),
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Set all three columns even when they already hold a value",
    )
    parser.add_argument(
        "--include-zero",
        action="store_true",
        help="Treat fd_required / ss_required of 0 as blank",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE_DEFAULT,
        help=f"Row ids per PATCH request (default {BATCH_SIZE_DEFAULT})",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    url = (os.environ.get("SUPABASE_URL") or "").strip()
    key = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
    if not url:
        print("error: SUPABASE_URL is required", file=sys.stderr)
        return 1
    if not key:
        print(
            "error: SUPABASE_SERVICE_ROLE_KEY is required "
            "(prompted by the shell wrapper; never loaded from repo .env files)",
            file=sys.stderr,
        )
        return 1

    program_role = None if args.program_role.strip().lower() == ANY_PROGRAM_ROLE else args.program_role
    defaults = Defaults(
        cohort=args.cohort, fd_required=args.fd_required, ss_required=args.ss_required
    )

    rows = fetch_roster(url, key)
    candidates = [row for row in rows if matches_role(row, program_role)]
    blank_role_rows = sum(1 for row in rows if not (row.get("program_role") or "").strip())
    planned = plan_updates(
        candidates, defaults, overwrite=args.overwrite, include_zero=args.include_zero
    )

    print_plan(planned)
    print_summary(
        planned,
        total_rows=len(rows),
        candidate_rows=len(candidates),
        blank_role_rows=blank_role_rows,
    )

    if args.dry_run:
        print("Dry run — no data sent to Supabase.")
        return 0

    if not planned:
        print("Nothing to patch.")
        return 0

    total = apply_updates(url, key, group_by_patch(planned), max(1, args.batch_size))
    print(f"Done. Patched {total} row(s) in {TABLE}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
