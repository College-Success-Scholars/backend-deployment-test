-- Allow TL+ to insert/update scholar_week_excuses via the Express JWT client.
-- The original migration only granted SELECT to authenticated; upserts were RLS-blocked.

CREATE OR REPLACE FUNCTION public.is_team_leader_or_above()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
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
  );
$$;

ALTER FUNCTION public.is_team_leader_or_above() OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.is_team_leader_or_above() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_leader_or_above() TO service_role;

CREATE POLICY "authenticated_insert_scholar_week_excuses"
  ON public.scholar_week_excuses
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_team_leader_or_above());

CREATE POLICY "authenticated_update_scholar_week_excuses"
  ON public.scholar_week_excuses
  FOR UPDATE
  TO authenticated
  USING (public.is_team_leader_or_above())
  WITH CHECK (public.is_team_leader_or_above());
