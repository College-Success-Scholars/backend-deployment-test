-- Run in Supabase Dashboard → SQL Editor (cloud project).
-- Creates is_developer(), dev_test_profiles table, and RLS policies.

CREATE OR REPLACE FUNCTION public.is_developer() RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  STABLE
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND app_role = 'developer'
  );
$$;

CREATE TABLE IF NOT EXISTS public.dev_test_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  roster_uid text NOT NULL,
  program_role text,
  app_role text,
  first_name text,
  last_name text,
  cohort integer,
  fd_required integer,
  ss_required integer,
  teams text[] NOT NULL DEFAULT '{}',
  mentee_uids text[] NOT NULL DEFAULT '{}',
  mentee_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dev_test_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dev_test_profiles_select ON public.dev_test_profiles;
CREATE POLICY dev_test_profiles_select ON public.dev_test_profiles
  FOR SELECT TO authenticated
  USING (public.is_developer());

DROP POLICY IF EXISTS dev_test_profiles_insert ON public.dev_test_profiles;
CREATE POLICY dev_test_profiles_insert ON public.dev_test_profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_developer());

DROP POLICY IF EXISTS dev_test_profiles_update ON public.dev_test_profiles;
CREATE POLICY dev_test_profiles_update ON public.dev_test_profiles
  FOR UPDATE TO authenticated
  USING (public.is_developer())
  WITH CHECK (public.is_developer());

DROP POLICY IF EXISTS dev_test_profiles_delete ON public.dev_test_profiles;
CREATE POLICY dev_test_profiles_delete ON public.dev_test_profiles
  FOR DELETE TO authenticated
  USING (public.is_developer());
