# cohort-based-roster-hours

**Date:** 2026-09-04T204529Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by `---`._

```
which scripts touch scholars required hours

---

does that script consider the cohort of the scholar?

---

alright, in that case modify the script to consider the cohort as well. 2025 cohort should get 3 hours of study session, and 2 hours of front desk, and the 2026 cohort should get 5 hours of studey sesions and 3 hours of fd. If they are a team leader (not a scholar) they should have 0
```

---

## Purpose

Map roster required hours by scholar cohort and zero team-leader requirements

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Updated backfill-user-roster-defaults so scholar weekly minutes come from cohort (2025: 120 FD / 180 SS; 2026: 180 FD / 300 SS), team leaders get 0/0, and scholars in unmapped cohorts are listed without invented hours. Default role filter is now Scholar and Team Leader. --overwrite forces hours only and no longer replaces an existing cohort year. Dropped the global --fd-required/--ss-required flags. Documented the mapping in docs/dev/scripts/README.md.

---

## Code Changes

- `docs/dev/scripts/README.md`
- `scripts/backfill-user-roster-defaults.py`
- `scripts/backfill-user-roster-defaults.sh`
