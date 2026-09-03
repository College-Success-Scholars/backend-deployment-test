#!/usr/bin/env python3
"""
Insert Google Form CSV dumps into public.mcf_form_logs and public.wpl_form_logs.

Invoked by scripts/backfill-form-logs.sh. Reads headerless (or headered) Sheets
exports, maps them onto the form-log columns, and POSTs via PostgREST. Existing
rows with the same created_at + uid key are skipped, so repeat runs converge
to a no-op unless --force is passed.

Does not write PII or credentials to disk. Service role key must come from the
environment (set by the shell after an interactive prompt).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DIR = REPO_ROOT / "tmp" / "back fill form data"
CAMPUS_TZ = ZoneInfo("America/New_York")
UID_RE = re.compile(r"^\d{9}$")
PROJECT_ITEM_RE = re.compile(r"\s*([^,]+?)\s*\(\s*([^)]+?)\s*\)\s*(?:,|$)")
NA_VALUES = frozenset({"", "n/a", "na", "none", "null"})
PAGE_SIZE = 1000
BATCH_SIZE_DEFAULT = 50

WPL_TABLE = "wpl_form_logs"
MCF_TABLE = "mcf_form_logs"

WPL_POSITIONAL = (
    "timestamp",
    "scholar_uid",
    "week",
    "full_name",
    "hours_worked",
    "projects",
    "unused",
    "met_with_all",
    "explanation",
    "submitted_by_email",
)

MCF_POSITIONAL = (
    "timestamp",
    "mentor_uid",
    "week",
    "mentor_name",
    "mentee_uid",
    "mentee_name",
    "met_in_person",
    "tasks_completed",
    "support_rank",
    "needs_tutor",
    "tutoring_status",
    "meeting_date",
    "meeting_time",
    "meeting_notes",
    "submitted_by_email",
    "reason_no_meeting",
)

HEADER_ALIASES: dict[str, str] = {
    "timestamp": "timestamp",
    "email address": "submitted_by_email",
    "email": "submitted_by_email",
    "submitted by email": "submitted_by_email",
    "uid": "scholar_uid",
    "scholar uid": "scholar_uid",
    "student uid": "scholar_uid",
    "your uid": "scholar_uid",
    "week": "week",
    "week number": "week",
    "week #": "week",
    "full name": "full_name",
    "name": "full_name",
    "hours worked": "hours_worked",
    "hours": "hours_worked",
    "projects": "projects",
    "what projects did you work on": "projects",
    "met with all": "met_with_all",
    "did you meet with all": "met_with_all",
    "explanation": "explanation",
    "mentor uid": "mentor_uid",
    "mentor name": "mentor_name",
    "mentee uid": "mentee_uid",
    "mentee name": "mentee_name",
    "met in person": "met_in_person",
    "did you meet in person": "met_in_person",
    "tasks completed": "tasks_completed",
    "support rank": "support_rank",
    "needs tutor": "needs_tutor",
    "tutoring status": "tutoring_status",
    "meeting date": "meeting_date",
    "meeting time": "meeting_time",
    "meeting notes": "meeting_notes",
    "notes": "meeting_notes",
    "reason no meeting": "reason_no_meeting",
    "reason for no meeting": "reason_no_meeting",
}


def blank_to_none(value: str | None) -> str | None:
    if value is None:
        return None
    text = value.strip()
    return text or None


def none_if_na(value: str | None) -> str | None:
    text = blank_to_none(value)
    if text is None or text.lower() in NA_VALUES:
        return None
    return text


def norm_header(raw: str) -> str:
    cleaned = raw.replace("\ufeff", "").strip().lower()
    cleaned = re.sub(r"[?]+$", "", cleaned)
    return " ".join(cleaned.split())


def looks_like_header(first_cell: str) -> bool:
    return norm_header(first_cell) in {"timestamp", "time stamp"}


def map_headers(fieldnames: list[str]) -> dict[str, str] | None:
    mapping: dict[str, str] = {}
    for original in fieldnames:
        logical = HEADER_ALIASES.get(norm_header(original))
        if logical and logical not in mapping:
            mapping[logical] = original
    if "timestamp" not in mapping:
        return None
    return mapping


def cells_from_row(
    row: list[str],
    positional: tuple[str, ...],
    header_map: dict[str, str] | None,
    named: dict[str, str] | None,
) -> dict[str, str]:
    if header_map is not None and named is not None:
        return {
            logical: (named.get(original) or "").strip()
            for logical, original in header_map.items()
        }
    out: dict[str, str] = {}
    for index, logical in enumerate(positional):
        out[logical] = row[index].strip() if index < len(row) else ""
    return out


def parse_google_timestamp(raw: str) -> str:
    text = raw.strip()
    if not text:
        raise ValueError("empty timestamp")
    for fmt in ("%m/%d/%Y %H:%M:%S", "%m/%d/%Y %H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S"):
        try:
            local = datetime.strptime(text, fmt).replace(tzinfo=CAMPUS_TZ)
            return local.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            continue
    raise ValueError(f"unrecognized timestamp: {text!r}")


def normalize_ts(value: str | None) -> str:
    if not value:
        return ""
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return value.strip()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")


def parse_hours(raw: str) -> float | None:
    text = blank_to_none(raw)
    if text is None:
        return None
    try:
        return float(text)
    except ValueError:
        raise ValueError(f"hours_worked is not a number: {text!r}") from None


def parse_projects(raw: str) -> list[Any] | None:
    text = blank_to_none(raw)
    if text is None:
        return None
    items: list[dict[str, str]] = []
    pos = 0
    for match in PROJECT_ITEM_RE.finditer(text):
        if match.start() != pos:
            return [text]
        items.append({"name": match.group(1).strip(), "hours": match.group(2).strip()})
        pos = match.end()
    if not items or pos != len(text):
        return [text]
    return items


def warn_uid(label: str, uid: str | None, name: str, line_no: int) -> None:
    if uid and UID_RE.fullmatch(uid):
        return
    shown = uid if uid else "(blank)"
    print(
        f"warning: {label} UID not 9 digits on line {line_no} ({name}): {shown}",
        file=sys.stderr,
    )


def read_csv_rows(path: Path) -> tuple[list[list[str]], dict[str, str] | None, list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        raw_rows = [row for row in reader if any(cell.strip() for cell in row)]
    if not raw_rows:
        return [], None, []
    header_map = None
    named_rows: list[dict[str, str]] = []
    if looks_like_header(raw_rows[0][0] if raw_rows[0] else ""):
        header_map = map_headers(raw_rows[0])
        if header_map is None:
            raise SystemExit(f"error: {path} has a header row but no Timestamp column")
        fieldnames = raw_rows[0]
        data_rows = raw_rows[1:]
        named_rows = [dict(zip(fieldnames, row, strict=False)) for row in data_rows]
        return data_rows, header_map, named_rows
    return raw_rows, None, []


def build_wpl_row(cells: dict[str, str], line_no: int) -> dict[str, Any] | None:
    if not any(cells.values()):
        return None
    created_at = parse_google_timestamp(cells.get("timestamp") or "")
    scholar_uid = blank_to_none(cells.get("scholar_uid"))
    full_name = blank_to_none(cells.get("full_name"))
    warn_uid("WPL scholar", scholar_uid, full_name or "unknown", line_no)
    return {
        "created_at": created_at,
        "full_name": full_name,
        "scholar_uid": scholar_uid,
        "hours_worked": parse_hours(cells.get("hours_worked") or ""),
        "projects": parse_projects(cells.get("projects") or ""),
        "met_with_all": blank_to_none(cells.get("met_with_all")),
        "explanation": blank_to_none(cells.get("explanation")),
        "submitted_by_email": blank_to_none(cells.get("submitted_by_email")),
    }


def build_mcf_row(cells: dict[str, str], line_no: int) -> dict[str, Any] | None:
    if not any(cells.values()):
        return None
    created_at = parse_google_timestamp(cells.get("timestamp") or "")
    mentor_name = blank_to_none(cells.get("mentor_name"))
    mentee_name = blank_to_none(cells.get("mentee_name"))
    mentor_uid = blank_to_none(cells.get("mentor_uid"))
    mentee_uid = blank_to_none(cells.get("mentee_uid"))
    warn_uid("MCF mentor", mentor_uid, mentor_name or "unknown", line_no)
    warn_uid("MCF mentee", mentee_uid, mentee_name or "unknown", line_no)
    return {
        "created_at": created_at,
        "mentor_name": mentor_name,
        "mentor_uid": mentor_uid,
        "mentee_name": mentee_name,
        "mentee_uid": mentee_uid,
        "meeting_date": blank_to_none(cells.get("meeting_date")),
        "meeting_time": blank_to_none(cells.get("meeting_time")),
        "met_in_person": blank_to_none(cells.get("met_in_person")),
        "reason_no_meeting": none_if_na(cells.get("reason_no_meeting")),
        "tasks_completed": blank_to_none(cells.get("tasks_completed")),
        "meeting_notes": blank_to_none(cells.get("meeting_notes")),
        "tutoring_status": none_if_na(cells.get("tutoring_status")),
        "needs_tutor": blank_to_none(cells.get("needs_tutor")),
        "support_rank": blank_to_none(cells.get("support_rank")),
        "submitted_by_email": blank_to_none(cells.get("submitted_by_email")),
    }


def load_mapped(
    path: Path | None,
    kind: str,
) -> list[dict[str, Any]]:
    if path is None:
        return []
    if not path.is_file():
        raise SystemExit(f"error: {kind.upper()} CSV not found: {path}")
    positional = WPL_POSITIONAL if kind == "wpl" else MCF_POSITIONAL
    builder = build_wpl_row if kind == "wpl" else build_mcf_row
    raw_rows, header_map, named_rows = read_csv_rows(path)
    mapped: list[dict[str, Any]] = []
    header_offset = 2 if header_map is not None else 1
    for index, row in enumerate(raw_rows):
        named = named_rows[index] if named_rows else None
        cells = cells_from_row(row, positional, header_map, named)
        line_no = index + header_offset
        try:
            payload = builder(cells, line_no)
        except ValueError as exc:
            raise SystemExit(f"error: {path}:{line_no}: {exc}") from exc
        if payload:
            mapped.append(payload)
    return mapped


def wpl_key(row: dict[str, Any]) -> tuple[str, str]:
    return (normalize_ts(row.get("created_at")), str(row.get("scholar_uid") or ""))


def mcf_key(row: dict[str, Any]) -> tuple[str, str, str]:
    return (
        normalize_ts(row.get("created_at")),
        str(row.get("mentor_uid") or ""),
        str(row.get("mentee_uid") or ""),
    )


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


def fetch_all(
    base_url: str,
    service_role: str,
    table: str,
    columns: str,
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0
    while True:
        query = urllib.parse.urlencode(
            {"select": columns, "order": "created_at.asc", "limit": PAGE_SIZE, "offset": offset}
        )
        page = request(base_url, service_role, f"/rest/v1/{table}?{query}")
        if not isinstance(page, list):
            raise SystemExit(f"error: unexpected PostgREST response shape for {table}")
        rows.extend(page)
        if len(page) < PAGE_SIZE:
            return rows
        offset += PAGE_SIZE


def post_batch(
    base_url: str,
    service_role: str,
    table: str,
    batch: list[dict[str, Any]],
) -> None:
    request(base_url, service_role, f"/rest/v1/{table}", "POST", batch)


def preview(value: Any, limit: int = 80) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        text = "; ".join(
            item["name"] if isinstance(item, dict) and "name" in item else str(item) for item in value
        )
    else:
        text = str(value).replace("\n", " ").strip()
    if len(text) > limit:
        return text[: limit - 1] + "…"
    return text


def print_wpl_plan(rows: list[dict[str, Any]], skipped: int) -> None:
    print()
    print(f"=== WPL rows to insert ({len(rows)}; skipped existing {skipped}) ===")
    if not rows:
        print("(none)")
        return
    print("\t".join(("created_at", "scholar_uid", "full_name", "hours_worked", "met_with_all", "email")))
    for row in rows:
        print(
            "\t".join(
                (
                    str(row.get("created_at") or ""),
                    str(row.get("scholar_uid") or ""),
                    str(row.get("full_name") or ""),
                    "" if row.get("hours_worked") is None else str(row["hours_worked"]),
                    str(row.get("met_with_all") or ""),
                    str(row.get("submitted_by_email") or ""),
                )
            )
        )


def print_mcf_plan(rows: list[dict[str, Any]], skipped: int) -> None:
    print()
    print(f"=== MCF rows to insert ({len(rows)}; skipped existing {skipped}) ===")
    if not rows:
        print("(none)")
        return
    print(
        "\t".join(
            (
                "created_at",
                "mentor_uid",
                "mentor_name",
                "mentee_uid",
                "mentee_name",
                "meeting_date",
                "email",
            )
        )
    )
    for row in rows:
        print(
            "\t".join(
                (
                    str(row.get("created_at") or ""),
                    str(row.get("mentor_uid") or ""),
                    str(row.get("mentor_name") or ""),
                    str(row.get("mentee_uid") or ""),
                    str(row.get("mentee_name") or ""),
                    str(row.get("meeting_date") or ""),
                    str(row.get("submitted_by_email") or ""),
                )
            )
        )


def resolve_csv_paths(args: argparse.Namespace) -> tuple[Path | None, Path | None]:
    wpl = Path(args.wpl).expanduser() if args.wpl else None
    mcf = Path(args.mcf).expanduser() if args.mcf else None
    directory = Path(args.dir).expanduser() if args.dir else DEFAULT_DIR
    if not directory.is_absolute():
        directory = (Path.cwd() / directory).resolve()

    if args.only in {"all", "wpl"} and wpl is None:
        candidate = directory / "wpl.csv"
        wpl = candidate if candidate.is_file() else None
    if args.only in {"all", "mcf"} and mcf is None:
        candidate = directory / "mcf.csv"
        mcf = candidate if candidate.is_file() else None

    if args.only == "wpl":
        mcf = None
    elif args.only == "mcf":
        wpl = None

    if wpl is None and mcf is None:
        raise SystemExit(
            f"error: no CSV files found (looked for wpl.csv / mcf.csv under {directory})"
        )
    return wpl, mcf


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backfill mcf_form_logs / wpl_form_logs from Google Form CSV dumps"
    )
    parser.add_argument(
        "--dir",
        default=str(DEFAULT_DIR),
        help=f"Directory containing wpl.csv / mcf.csv (default {DEFAULT_DIR})",
    )
    parser.add_argument("--wpl", help="Explicit WPL CSV path (overrides --dir/wpl.csv)")
    parser.add_argument("--mcf", help="Explicit MCF CSV path (overrides --dir/mcf.csv)")
    parser.add_argument(
        "--only",
        choices=("all", "wpl", "mcf"),
        default="all",
        help="Which form type to load (default all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and print the plan only; send no writes (no credentials needed)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Insert even when a matching created_at + uid row already exists",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE_DEFAULT,
        help=f"Rows per POST request (default {BATCH_SIZE_DEFAULT})",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    wpl_path, mcf_path = resolve_csv_paths(args)

    wpl_rows = load_mapped(wpl_path, "wpl")
    mcf_rows = load_mapped(mcf_path, "mcf")

    print(f"WPL CSV: {wpl_path or '(none)'} — parsed {len(wpl_rows)} row(s)")
    print(f"MCF CSV: {mcf_path or '(none)'} — parsed {len(mcf_rows)} row(s)")

    wpl_skipped = 0
    mcf_skipped = 0

    if args.dry_run:
        print_wpl_plan(wpl_rows, 0)
        print_mcf_plan(mcf_rows, 0)
        if wpl_rows:
            print()
            print("Sample WPL payload (first):")
            print(json.dumps(wpl_rows[0], indent=2))
        if mcf_rows:
            sample = dict(mcf_rows[0])
            sample["meeting_notes"] = preview(sample.get("meeting_notes"), 120) or None
            print()
            print("Sample MCF payload (first; notes truncated):")
            print(json.dumps(sample, indent=2))
        print()
        print("Dry run — no data sent to Supabase.")
        return 0

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

    if not args.force:
        if wpl_rows:
            existing_wpl = {
                wpl_key(row)
                for row in fetch_all(url, key, WPL_TABLE, "created_at,scholar_uid")
            }
            kept = [row for row in wpl_rows if wpl_key(row) not in existing_wpl]
            wpl_skipped = len(wpl_rows) - len(kept)
            wpl_rows = kept
        if mcf_rows:
            existing_mcf = {
                mcf_key(row)
                for row in fetch_all(url, key, MCF_TABLE, "created_at,mentor_uid,mentee_uid")
            }
            kept = [row for row in mcf_rows if mcf_key(row) not in existing_mcf]
            mcf_skipped = len(mcf_rows) - len(kept)
            mcf_rows = kept

    print_wpl_plan(wpl_rows, wpl_skipped)
    print_mcf_plan(mcf_rows, mcf_skipped)

    batch_size = max(1, args.batch_size)
    total = 0
    for table, rows in ((WPL_TABLE, wpl_rows), (MCF_TABLE, mcf_rows)):
        for start in range(0, len(rows), batch_size):
            batch = rows[start : start + batch_size]
            post_batch(url, key, table, batch)
            total += len(batch)
            print(
                f"Inserted {len(batch)} row(s) into {table} "
                f"(running total {total})"
            )

    if total == 0:
        print("Nothing to insert.")
        return 0

    print(f"Done. Inserted {total} row(s) ({len(wpl_rows)} WPL, {len(mcf_rows)} MCF).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
