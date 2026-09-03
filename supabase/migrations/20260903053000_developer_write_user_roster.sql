-- Developers can update roster rows from /dev/profiles (JWT + is_developer()).
-- mentor_mentee write policies are required so mentee_uids patches can sync
-- the runtime assignment table (SELECT-only developer_read_mentor_mentee today).

DROP POLICY IF EXISTS developer_update_user_roster ON public.user_roster;
CREATE POLICY developer_update_user_roster ON public.user_roster
  FOR UPDATE
  TO authenticated
  USING (public.is_developer())
  WITH CHECK (public.is_developer());

DROP POLICY IF EXISTS developer_insert_mentor_mentee ON public.mentor_mentee;
CREATE POLICY developer_insert_mentor_mentee ON public.mentor_mentee
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_developer());

DROP POLICY IF EXISTS developer_update_mentor_mentee ON public.mentor_mentee;
CREATE POLICY developer_update_mentor_mentee ON public.mentor_mentee
  FOR UPDATE
  TO authenticated
  USING (public.is_developer())
  WITH CHECK (public.is_developer());

DROP POLICY IF EXISTS developer_delete_mentor_mentee ON public.mentor_mentee;
CREATE POLICY developer_delete_mentor_mentee ON public.mentor_mentee
  FOR DELETE
  TO authenticated
  USING (public.is_developer());
