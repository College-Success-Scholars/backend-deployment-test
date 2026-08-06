#!/usr/bin/env python3
"""
Parse a roster CSV and insert rows into public.user_roster via PostgREST.

Invoked by scripts/ingest-user-roster.sh. Does not write PII or credentials to disk.
Service role key must come from the environment (set by the shell after an interactive prompt).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import urllib.error
import urllib.request
from typing import Any

UMD_EMAIL_DOMAINS = frozenset({"umd.edu", "terpmail.umd.edu"})
EXPECTED_UNIVERSITY_EMAIL = "@umd.edu or @terpmail.umd.edu"
UID_RE = re.compile(r"^\d{9}$")
BATCH_SIZE_DEFAULT = 50

# Normalized header -> logical field
HEADER_ALIASES: dict[str, str] = {
    "first name": "first_name",
    "last name": "last_name",
    "uid": "uid",
    "cell phone": "phone",
    "primary email": "primary_email",
    "university email (directory id)": "university_email",
    "university email": "university_email",
    "major": "major",
}


def norm_header(raw: str) -> str:
    return " ".join(raw.replace("\ufeff", "").strip().lower().split())


def is_umd_email(email: str) -> bool:
    normalized = email.strip().lower()
    at = normalized.rfind("@")
    if at <= 0 or at == len(normalized) - 1:
        return False
    domain = normalized[at + 1 :]
    return domain in UMD_EMAIL_DOMAINS


def cell(row: dict[str, str], key: str) -> str:
    return (row.get(key) or "").strip()


def map_headers(fieldnames: list[str] | None) -> dict[str, str]:
    """Return logical_field -> original CSV header name."""
    if not fieldnames:
        raise SystemExit("error: CSV has no header row")
    mapping: dict[str, str] = {}
    for original in fieldnames:
        logical = HEADER_ALIASES.get(norm_header(original))
        if logical and logical not in mapping:
            mapping[logical] = original
    required = ("first_name", "last_name")
    missing = [r for r in required if r not in mapping]
    if missing:
        raise SystemExit(
            f"error: CSV missing required columns: {', '.join(missing)} "
            f"(got headers: {fieldnames})"
        )
    if "university_email" not in mapping and "primary_email" not in mapping:
        raise SystemExit(
            "error: CSV needs Primary Email and/or University Email (Directory ID)"
        )
    return mapping


def get_field(row: dict[str, str], mapping: dict[str, str], logical: str) -> str:
    header = mapping.get(logical)
    if not header:
        return ""
    return (row.get(header) or "").strip()


def build_rows(
    csv_path: str,
) -> tuple[list[dict[str, Any]], list[dict[str, str]], list[dict[str, str]], list[dict[str, str]]]:
    """
    Returns:
      inserts — PostgREST payloads
      email_issues — university email not UMD
      uid_nulls — non-9-digit UIDs
      chosen_email_warnings — inserted email still non-UMD
    """
    inserts: list[dict[str, Any]] = []
    email_issues: list[dict[str, str]] = []
    uid_nulls: list[dict[str, str]] = []
    chosen_email_warnings: list[dict[str, str]] = []
    skipped = 0

    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        mapping = map_headers(list(reader.fieldnames or []))

        for row in reader:
            first = get_field(row, mapping, "first_name")
            last = get_field(row, mapping, "last_name")
            raw_uid = get_field(row, mapping, "uid")
            phone = get_field(row, mapping, "phone")
            university = get_field(row, mapping, "university_email")
            primary = get_field(row, mapping, "primary_email")
            major = get_field(row, mapping, "major")

            if not first and not last and not university and not primary and not raw_uid:
                continue

            if university and is_umd_email(university):
                email = university
            else:
                email = primary
                # Report only when a university value was provided but is not UMD/terpmail.
                if university and not is_umd_email(university):
                    email_issues.append(
                        {
                            "first_name": first,
                            "last_name": last,
                            "preferred_email": primary,
                            "phone_number": phone,
                            "university_email_input": university,
                            "expected": EXPECTED_UNIVERSITY_EMAIL,
                        }
                    )

            if not email:
                skipped += 1
                print(
                    f"skip: no usable email for {first} {last} "
                    f"(university={university!r}, primary={primary!r})",
                    file=sys.stderr,
                )
                continue

            if UID_RE.fullmatch(raw_uid):
                uid: str | None = raw_uid
            else:
                uid = None
                uid_nulls.append(
                    {
                        "first_name": first,
                        "last_name": last,
                        "raw_uid": raw_uid,
                        "chosen_email": email,
                    }
                )

            if not is_umd_email(email):
                chosen_email_warnings.append(
                    {
                        "first_name": first,
                        "last_name": last,
                        "chosen_email": email,
                        "note": "chosen email is not @umd.edu / @terpmail.umd.edu — invite/sign-up may fail",
                    }
                )

            majors = [major] if major else []

            inserts.append(
                {
                    "uid": uid,
                    "first_name": first or None,
                    "last_name": last or None,
                    "phone_number": phone or None,
                    "email": email,
                    "program_role": "Scholar",
                    "status": "enrolled",
                    "majors": majors,
                    "minors": [],
                    "teams": [],
                    "mentee_uids": [],
                }
            )

    if skipped:
        print(f"skipped {skipped} row(s) with no usable email", file=sys.stderr)

    return inserts, email_issues, uid_nulls, chosen_email_warnings


def print_tsv(title: str, rows: list[dict[str, str]], columns: list[str]) -> None:
    print()
    print(f"=== {title} ({len(rows)}) ===")
    if not rows:
        print("(none)")
        return
    print("\t".join(columns))
    for r in rows:
        print("\t".join(r.get(c, "") for c in columns))


def post_batch(
    url: str,
    service_role: str,
    batch: list[dict[str, Any]],
) -> None:
    endpoint = url.rstrip("/") + "/rest/v1/user_roster"
    body = json.dumps(batch).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "apikey": service_role,
            "Authorization": f"Bearer {service_role}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            if resp.status not in (200, 201):
                raise SystemExit(f"error: PostgREST returned HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"error: PostgREST HTTP {e.code}: {detail}") from e
    except urllib.error.URLError as e:
        raise SystemExit(f"error: request failed: {e.reason}") from e


def main() -> int:
    parser = argparse.ArgumentParser(description="Ingest roster CSV into user_roster")
    parser.add_argument("csv_path", help="Path to roster CSV (not copied or rewritten)")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and print reports only; do not POST",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE_DEFAULT,
        help=f"PostgREST batch size (default {BATCH_SIZE_DEFAULT})",
    )
    args = parser.parse_args()

    if not os.path.isfile(args.csv_path):
        print(f"error: CSV not found: {args.csv_path}", file=sys.stderr)
        return 1

    inserts, email_issues, uid_nulls, chosen_warnings = build_rows(args.csv_path)

    print_tsv(
        "Email issues (university email not UMD/terpmail — used Primary Email)",
        email_issues,
        [
            "first_name",
            "last_name",
            "preferred_email",
            "phone_number",
            "university_email_input",
            "expected",
        ],
    )
    print_tsv(
        "UID set to NULL (not exactly 9 digits)",
        uid_nulls,
        ["first_name", "last_name", "raw_uid", "chosen_email"],
    )
    print_tsv(
        "Chosen email still non-UMD (invite/sign-up risk)",
        chosen_warnings,
        ["first_name", "last_name", "chosen_email", "note"],
    )

    print()
    print(f"Rows ready to insert: {len(inserts)}")

    if args.dry_run:
        print("Dry run — no data sent to Supabase.")
        if inserts:
            sample = {k: inserts[0][k] for k in inserts[0]}
            # Redact nothing required for dry-run preview of shape; operator already has CSV.
            print("Sample mapped row (first):")
            print(json.dumps(sample, indent=2))
        return 0

    url = (os.environ.get("SUPABASE_URL") or "").strip()
    key = (os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
    if not url:
        print("error: SUPABASE_URL is required for insert", file=sys.stderr)
        return 1
    if not key:
        print(
            "error: SUPABASE_SERVICE_ROLE_KEY is required for insert "
            "(prompted by the shell wrapper; never loaded from repo .env files)",
            file=sys.stderr,
        )
        return 1

    if not inserts:
        print("Nothing to insert.", file=sys.stderr)
        return 0

    batch_size = max(1, args.batch_size)
    total = 0
    for i in range(0, len(inserts), batch_size):
        batch = inserts[i : i + batch_size]
        post_batch(url, key, batch)
        total += len(batch)
        print(f"Inserted batch {i // batch_size + 1}: {len(batch)} row(s) (running total {total})")

    print(f"Done. Inserted {total} row(s) into user_roster.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
