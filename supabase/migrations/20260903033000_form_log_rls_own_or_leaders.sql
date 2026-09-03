-- Restrict MCF / WPL / WAHF SELECT so scholars only see their own roster-uid
-- rows. Team leaders and developers keep program-wide read.
--
-- Form-log tables store user_roster.uid (profiles.student_id), not auth.uid().
-- Own-row checks therefore use roster_uid(), not auth.uid()::text.
--
-- Drops the baseline "Enable read access for all users" policies (USING true)
-- and the WAHF policy that listed stale app_role values (teamleader / admin / staff).

CREATE OR REPLACE FUNCTION public.roster_uid()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT student_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_team_leader_or_above()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND app_role IN ('team_leader', 'developer')
  );
$$;

GRANT EXECUTE ON FUNCTION public.roster_uid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.roster_uid() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_team_leader_or_above() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_leader_or_above() TO service_role;

-- MCF
DROP POLICY IF EXISTS "Enable read access for all users" ON public.mcf_form_logs;
DROP POLICY IF EXISTS mcf_select_own_or_leaders ON public.mcf_form_logs;
CREATE POLICY mcf_select_own_or_leaders ON public.mcf_form_logs
  FOR SELECT TO authenticated
  USING (
    public.is_team_leader_or_above()
    OR mentor_uid = public.roster_uid()
    OR mentee_uid = public.roster_uid()
  );

-- WPL
DROP POLICY IF EXISTS "Enable read access for all users" ON public.wpl_form_logs;
DROP POLICY IF EXISTS wpl_select_own_or_leaders ON public.wpl_form_logs;
CREATE POLICY wpl_select_own_or_leaders ON public.wpl_form_logs
  FOR SELECT TO authenticated
  USING (
    public.is_team_leader_or_above()
    OR scholar_uid = public.roster_uid()
  );

-- WAHF (table name whaf_form_logs)
DROP POLICY IF EXISTS whaf_select_policy ON public.whaf_form_logs;
DROP POLICY IF EXISTS whaf_select_own_or_leaders ON public.whaf_form_logs;
CREATE POLICY whaf_select_own_or_leaders ON public.whaf_form_logs
  FOR SELECT TO authenticated
  USING (
    public.is_team_leader_or_above()
    OR scholar_uid = public.roster_uid()
  );
