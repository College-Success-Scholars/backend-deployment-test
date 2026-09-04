#!/usr/bin/env python3
"""
Backfill blank cohort / FD / SS requirement values on public.user_roster via PostgREST.

Invoked by scripts/backfill-user-roster-defaults.sh. Reads the roster, computes the
minimum patch per row, and PATCHes rows grouped by identical patch. Fills only blank
columns unless --overwrite is passed (hours only — an existing cohort year is never
replaced), so repeat runs converge to a no-op.

Scholar weekly minutes come from cohort. Team leaders (and other non-scholars in
scope) get 0 / 0. Does not write PII or credentials to disk. Service role key must
come from the environment (set by the shell after an interactive prompt).
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

MINUTES_PER_HOUR = 60
DEFAULT_COHORT = 2026
DEFAULT_PROGRAM_ROLE = "scholar-or-tl"
ANY_PROGRAM_ROLE = "any"

# Scholar weekly requirements by incoming class year: (fd_required, ss_required) minutes.
SCHOLAR_REQUIRED_MINUTES_BY_COHORT: dict[int, tuple[int, int]] = {
    2025: (2 * MINUTES_PER_HOUR, 3 * MINUTES_PER_HOUR),
    2026: (3 * MINUTES_PER_HOUR, 5 * MINUTES_PER_HOUR),
}
TEAM_LEADER_REQUIRED_MINUTES = (0, 0)

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
CHANGE_LABELS = {
    "cohort": "cohort",
    "fd_required": "fd",
    "ss_required": "ss",
}

# uid | name | role | cohort | changes/reason — fits a typical 100-char terminal.
TABLE_HEADERS = ("UID", "NAME", "ROLE", "COHORT", "DETAIL")
TABLE_WIDTHS = (9, 20, 13, 6, 50)


class Skip(NamedTuple):
    row: dict[str, Any]
    reason: str


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


def normalize_program_role(value: Any) -> str:
    return str(value or "").strip().lower().replace("_", " ")


def is_scholar_role(value: Any) -> bool:
    return normalize_program_role(value) == "scholar"


def is_team_leader_role(value: Any) -> bool:
    return normalize_program_role(value) == "team leader"


def matches_role(row: dict[str, Any], program_role: str | None) -> bool:
    role = normalize_program_role(row.get("program_role"))
    if program_role is None:
        return True
    if program_role == DEFAULT_PROGRAM_ROLE:
        return is_scholar_role(role) or is_team_leader_role(role)
    return role == normalize_program_role(program_role)


def parse_cohort(value: Any) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def required_minutes_for_row(row: dict[str, Any], effective_cohort: int) -> tuple[int, int] | None:
    """Return (fd_required, ss_required) minutes, or None when a scholar cohort is unmapped."""
    if is_scholar_role(row.get("program_role")):
        return SCHOLAR_REQUIRED_MINUTES_BY_COHORT.get(effective_cohort)
    return TEAM_LEADER_REQUIRED_MINUTES


def plan_updates(
    rows: list[dict[str, Any]],
    default_cohort: int,
    *,
    overwrite: bool,
    include_zero: bool,
) -> tuple[list[tuple[dict[str, Any], dict[str, int]]], list[Skip]]:
    """Return (row, patch) pairs plus scholars skipped because their cohort has no hour map."""
    planned: list[tuple[dict[str, Any], dict[str, int]]] = []
    skipped: list[Skip] = []
    for row in rows:
        patch: dict[str, int] = {}
        current_cohort = parse_cohort(row.get("cohort"))
        cohort_blank = current_cohort is None or is_blank(current_cohort, zero_is_blank=True)
        if cohort_blank:
            effective_cohort = default_cohort
            patch["cohort"] = default_cohort
        else:
            effective_cohort = current_cohort

        hours = required_minutes_for_row(row, effective_cohort)
        if hours is None:
            needs_hours = overwrite or is_blank(
                row.get("fd_required"), zero_is_blank=include_zero
            ) or is_blank(row.get("ss_required"), zero_is_blank=include_zero)
            if needs_hours:
                skipped.append(
                    Skip(
                        row,
                        f"scholar cohort {effective_cohort} has no hour mapping",
                    )
                )
        else:
            fd_required, ss_required = hours
            for column, target, zero_is_blank in (
                ("fd_required", fd_required, include_zero),
                ("ss_required", ss_required, include_zero),
            ):
                current = row.get(column)
                if current == target:
                    continue
                if overwrite or is_blank(current, zero_is_blank=zero_is_blank):
                    patch[column] = target

        if patch:
            planned.append((row, patch))
    return planned, skipped


def group_by_patch(
    planned: list[tuple[dict[str, Any], dict[str, int]]],
) -> dict[tuple[tuple[str, int], ...], list[int]]:
    """Collapse rows sharing an identical patch so each shape costs one PATCH batch."""
    groups: dict[tuple[tuple[str, int], ...], list[int]] = {}
    for row, patch in planned:
        groups.setdefault(tuple(sorted(patch.items())), []).append(int(row["id"]))
    return groups


def clip(value: Any, width: int) -> str:
    """Fit a cell to `width`, collapsing whitespace and appending … when truncated."""
    text = " ".join(str(value or "").split())
    if width <= 0:
        return ""
    if len(text) <= width:
        return text.ljust(width)
    if width == 1:
        return "…"
    return (text[: width - 1] + "…").ljust(width)


def format_row(values: tuple[Any, ...]) -> str:
    return "  ".join(clip(value, width) for value, width in zip(values, TABLE_WIDTHS, strict=True))


def display_name(row: dict[str, Any]) -> str:
    return " ".join(
        part
        for part in (
            str(row.get("first_name") or "").strip(),
            str(row.get("last_name") or "").strip(),
        )
        if part
    )


def display_cohort(row: dict[str, Any]) -> str:
    cohort = row.get("cohort")
    if cohort in (None, ""):
        return "blank"
    return str(cohort)


def describe_changes(row: dict[str, Any], patch: dict[str, int]) -> str:
    parts = []
    for column in BACKFILL_COLUMNS:
        if column in patch:
            current = row.get(column)
            shown = "blank" if current is None else str(current)
            parts.append(f"{CHANGE_LABELS[column]} {shown}->{patch[column]}")
    return "; ".join(parts)


def print_table(title: str, rows: list[tuple[Any, ...]], *, empty: str) -> None:
    print()
    print(f"=== {title} ({len(rows)}) ===")
    if not rows:
        print(empty)
        return
    print(format_row(TABLE_HEADERS))
    print("  ".join("-" * width for width in TABLE_WIDTHS))
    for values in rows:
        print(format_row(values))


def print_plan(planned: list[tuple[dict[str, Any], dict[str, int]]]) -> None:
    print_table(
        "Planned roster updates",
        [
            (
                row.get("uid") or "",
                display_name(row),
                row.get("program_role") or "",
                display_cohort(row),
                describe_changes(row, patch),
            )
            for row, patch in planned
        ],
        empty="(none — roster already matches the defaults)",
    )


def print_skipped(skipped: list[Skip]) -> None:
    if not skipped:
        return
    print_table(
        "Skipped hour mapping",
        [
            (
                item.row.get("uid") or "",
                display_name(item.row),
                item.row.get("program_role") or "",
                display_cohort(item.row),
                item.reason,
            )
            for item in skipped
        ],
        empty="(none)",
    )


def print_summary(
    planned: list[tuple[dict[str, Any], dict[str, int]]],
    skipped: list[Skip],
    *,
    total_rows: int,
    candidate_rows: int,
    blank_role_rows: int,
) -> None:
    print()
    print(f"Roster rows read: {total_rows}")
    print(f"Rows matching the role filter: {candidate_rows}")
    if blank_role_rows:
        print(f"Rows with a blank program_role (never match a named role filter): {blank_role_rows}")
    for column in BACKFILL_COLUMNS:
        count = sum(1 for _, patch in planned if column in patch)
        print(f"  {column}: {count} row(s) to set")
    print(f"Rows to patch: {len(planned)}")
    print(f"Scholars skipped (unmapped cohort): {len(skipped)}")


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


def parse_program_role_arg(raw: str) -> str | None:
    normalized = raw.strip().lower().replace("_", "-")
    if normalized == ANY_PROGRAM_ROLE:
        return None
    if normalized == DEFAULT_PROGRAM_ROLE:
        return DEFAULT_PROGRAM_ROLE
    return raw.strip()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backfill blank cohort and role/cohort-based fd_required / ss_required on user_roster"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Read the roster and print the plan only; send no writes",
    )
    parser.add_argument(
        "--cohort",
        type=int,
        default=DEFAULT_COHORT,
        help=f"Cohort year to fill when cohort is blank (default {DEFAULT_COHORT})",
    )
    parser.add_argument(
        "--program-role",
        default=DEFAULT_PROGRAM_ROLE,
        help=(
            "Only touch this program_role, case-insensitive "
            f"(default Scholar and Team Leader; use {ANY_PROGRAM_ROLE!r} for every row)"
        ),
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help=(
            "Set fd_required / ss_required even when they already hold a value. "
            "Does not overwrite an existing cohort year"
        ),
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

    program_role = parse_program_role_arg(args.program_role)
    rows = fetch_roster(url, key)
    candidates = [row for row in rows if matches_role(row, program_role)]
    blank_role_rows = sum(1 for row in rows if not (row.get("program_role") or "").strip())
    planned, skipped = plan_updates(
        candidates, args.cohort, overwrite=args.overwrite, include_zero=args.include_zero
    )

    print_plan(planned)
    print_skipped(skipped)
    print_summary(
        planned,
        skipped,
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
