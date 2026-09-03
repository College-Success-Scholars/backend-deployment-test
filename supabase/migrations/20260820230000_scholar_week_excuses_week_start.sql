-- Key scholar_week_excuses by campus-week range start so week_num can repeat across years.
-- Idempotent: also covers DBs that already applied the original (scholar_uid, week_num, kind) PK.
-- Rows with no week_start cannot be keyed and are dropped (unreleased table / test data only).

ALTER TABLE public.scholar_week_excuses
  ADD COLUMN IF NOT EXISTS week_start date;

DELETE FROM public.scholar_week_excuses
  WHERE week_start IS NULL;

ALTER TABLE public.scholar_week_excuses
  DROP CONSTRAINT IF EXISTS scholar_week_excuses_pkey;

ALTER TABLE public.scholar_week_excuses
  ALTER COLUMN week_start SET NOT NULL;

ALTER TABLE public.scholar_week_excuses
  ADD CONSTRAINT scholar_week_excuses_pkey
  PRIMARY KEY (scholar_uid, week_start, kind);

DROP INDEX IF EXISTS public.idx_scholar_week_excuses_week_kind;

CREATE INDEX IF NOT EXISTS idx_scholar_week_excuses_week_start_kind
  ON public.scholar_week_excuses USING btree (week_start, kind);

COMMENT ON COLUMN public.scholar_week_excuses.week_start IS
  'Campus-week range start (Eastern date from campusWeekToDateRange). Identity with scholar_uid+kind so week_num can repeat across years. Monday for most weeks; winter-break week uses WINTER_BREAK_FIRST_DAY.';

COMMENT ON COLUMN public.scholar_week_excuses.week_num IS
  'Denormalized campus week number for the current time-config; not unique across collection years.';
