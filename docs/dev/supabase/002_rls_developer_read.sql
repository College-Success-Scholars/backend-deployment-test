-- Run after 001_dev_test_profiles.sql in Supabase Dashboard → SQL Editor.
-- SELECT-only policies so developers can read cross-user rows when debugging (JWT stays developer auth.uid).

-- front_desk_records
DROP POLICY IF EXISTS developer_read_front_desk_records ON public.front_desk_records;
CREATE POLICY developer_read_front_desk_records ON public.front_desk_records
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- study_session_records
DROP POLICY IF EXISTS developer_read_study_session_records ON public.study_session_records;
CREATE POLICY developer_read_study_session_records ON public.study_session_records
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- form log tables
DROP POLICY IF EXISTS developer_read_mcf_form_logs ON public.mcf_form_logs;
CREATE POLICY developer_read_mcf_form_logs ON public.mcf_form_logs
  FOR SELECT TO authenticated
  USING (public.is_developer());

DROP POLICY IF EXISTS developer_read_whaf_form_logs ON public.whaf_form_logs;
CREATE POLICY developer_read_whaf_form_logs ON public.whaf_form_logs
  FOR SELECT TO authenticated
  USING (public.is_developer());

DROP POLICY IF EXISTS developer_read_wpl_form_logs ON public.wpl_form_logs;
CREATE POLICY developer_read_wpl_form_logs ON public.wpl_form_logs
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- session logs
DROP POLICY IF EXISTS developer_read_front_desk_logs ON public.front_desk_logs;
CREATE POLICY developer_read_front_desk_logs ON public.front_desk_logs
  FOR SELECT TO authenticated
  USING (public.is_developer());

DROP POLICY IF EXISTS developer_read_study_session_logs ON public.study_session_logs;
CREATE POLICY developer_read_study_session_logs ON public.study_session_logs
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- mentor relationships
DROP POLICY IF EXISTS developer_read_mentor_mentee ON public.mentor_mentee;
CREATE POLICY developer_read_mentor_mentee ON public.mentor_mentee
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- daily activity
DROP POLICY IF EXISTS developer_read_daily_scholar_activity ON public.daily_scholar_activity;
CREATE POLICY developer_read_daily_scholar_activity ON public.daily_scholar_activity
  FOR SELECT TO authenticated
  USING (public.is_developer());

-- user_roster (for dev profile resolution / directory debugging)
DROP POLICY IF EXISTS developer_read_user_roster ON public.user_roster;
CREATE POLICY developer_read_user_roster ON public.user_roster
  FOR SELECT TO authenticated
  USING (public.is_developer());
