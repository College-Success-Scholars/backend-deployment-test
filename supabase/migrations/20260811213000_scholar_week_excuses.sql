-- Stage 2 lite: dedicated weekly excuse store (minutes + description).
-- Attendance minutes stay derived from tickets; this table holds TL-entered excuses only.
-- See GitHub issue #31.

CREATE TABLE IF NOT EXISTS public.scholar_week_excuses (
  scholar_uid text NOT NULL,
  week_num integer NOT NULL,
  kind text NOT NULL,
  excuse_min smallint,
  description text,
  updated_by text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scholar_week_excuses_pkey PRIMARY KEY (scholar_uid, week_num, kind),
  CONSTRAINT scholar_week_excuses_kind_check CHECK (kind = ANY (ARRAY['front_desk'::text, 'study_session'::text])),
  CONSTRAINT scholar_week_excuses_week_num_check CHECK (week_num >= 1),
  CONSTRAINT scholar_week_excuses_excuse_min_check CHECK (excuse_min IS NULL OR excuse_min >= 0)
);

COMMENT ON TABLE public.scholar_week_excuses IS
  'Weekly FD/SS excuses (minutes + description). Source of truth for excuses outside *_records.';

COMMENT ON COLUMN public.scholar_week_excuses.description IS
  'Reason / note for the excuse (replaces front_desk_records.excuse / study_session_records.excuse).';

ALTER TABLE public.scholar_week_excuses OWNER TO postgres;

CREATE INDEX IF NOT EXISTS idx_scholar_week_excuses_week_kind
  ON public.scholar_week_excuses USING btree (week_num, kind);

ALTER TABLE public.scholar_week_excuses ENABLE ROW LEVEL SECURITY;

-- Backend uses service_role for writes; authenticated TL+ can read for product UI.
CREATE POLICY "service_role_full_access_scholar_week_excuses"
  ON public.scholar_week_excuses
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_select_scholar_week_excuses"
  ON public.scholar_week_excuses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.app_role = ANY (
          ARRAY[
            'admin'::text,
            'staff'::text,
            'teamleader'::text,
            'team_leader'::text,
            'developer'::text,
            'exec'::text
          ]
        )
    )
  );

CREATE POLICY "developer_read_scholar_week_excuses"
  ON public.scholar_week_excuses
  FOR SELECT
  TO authenticated
  USING (public.is_developer());

GRANT ALL ON TABLE public.scholar_week_excuses TO anon;
GRANT ALL ON TABLE public.scholar_week_excuses TO authenticated;
GRANT ALL ON TABLE public.scholar_week_excuses TO service_role;
