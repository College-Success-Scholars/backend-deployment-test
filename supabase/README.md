# Supabase (CLI)

Versioned SQL for the cloud project lives here.

| Path | Purpose |
|------|---------|
| `config.toml` | Local CLI config (`project_id` only; secrets stay in env / Dashboard) |
| `migrations/` | Public schema baseline + future DDL / RLS / RPC changes |
| `.temp/` | Linked project metadata (gitignored) |

**No Edge Functions.** This stack does not use `supabase/functions/` or invoke Supabase Edge Functions. Domain access is Express services → Postgres (tables / RPCs). See [`docs/dev/supabase/README.md`](../docs/dev/supabase/README.md#access-pattern).

## Status

- [`migrations/20260715051600_baseline.sql`](migrations/20260715051600_baseline.sql) — schema-only dump of `public` (Phase 1).
- [`migrations/20260903033000_form_log_rls_own_or_leaders.sql`](migrations/20260903033000_form_log_rls_own_or_leaders.sql) — MCF/WPL/WAHF SELECT: own roster uid or `team_leader`/`developer` (replaces `USING (true)` / stale WAHF role names).
- Linked remote migration history repaired (Step 2): orphans reverted; baseline marked **applied**. Local and remote agree on `20260715051600`.
- Backend typed client + generated types: [`backend/src/supabase/`](../backend/src/supabase/) (Step 3). Regen: `npm run db:types --prefix backend`, then run backend tests (includes model↔`Database` align checks).
- Do **not** `db push` the baseline onto prod — it is already applied as history only. Use new migration files for future DDL.
- [`migrations/20260825003343_reconcile_production_drift.sql`](migrations/20260825003343_reconcile_production_drift.sql) — captures a migration applied directly to production (outside git) that renamed `front_desk_records`/`study_session_records` to `*_legacy`, added `hypopg`/`index_advisor`/`pg_cron`/`pgjwt`, scheduled the nightly `full_resync_daily_scholar_activity` cron job, and broadened two RLS policies. Filed under its **original** production timestamp (2026-09-07) so `migration list --linked` recognizes it as already-applied on prod and only runs it fresh on environments that don't have it yet (local, or a rebuilt staging).
- [`migrations/20260821010000_freeze_session_records.sql`](migrations/20260821010000_freeze_session_records.sql) is now a documented no-op — it targeted the same `front_desk_records`/`study_session_records` rename via a different (safer, data-preserving `ALTER TABLE RENAME`) mechanism, but was never actually applied to production; the drift file above captures what production really did (`DROP TABLE` + recreate) instead. Both live in `_legacy` tables that currently hold 1,401 rows each on production, so there's no live data-loss concern from the drop+recreate — just be aware the historical migration record itself doesn't show how that data got there.
- **Known drift as of 2026-09-07**: `supabase migration list --linked` (against production) shows `20260903033000_form_log_rls_own_or_leaders.sql` was never applied to production — the MCF/WPL RLS tightening it does is not live there. Needs a deliberate `db push` once confirmed safe.
- **`staging` is not currently a usable mirror.** Its migration history (`base_schema`, `add_new_column`) doesn't correspond to any file here, and it has zero tables in `public`. Treat it as needing a full rebuild (apply every migration in order, including the drift file above) before using it for anything, rather than assuming it tracks production.

## Day-to-day

```bash
supabase link --project-ref <ref>   # once per machine
supabase migration new <name>
# edit migrations/…
supabase db push                    # staging first, then prod
supabase migration list --linked    # confirm local/remote match
npm run db:types --prefix backend   # after schema changes
```

See also: [`docs/dev/supabase/README.md`](../docs/dev/supabase/README.md) (access pattern, Google Form intake tables, schema↔app types, test-profile runbooks).
