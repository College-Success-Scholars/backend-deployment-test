-- Freeze weekly session-record rollups. Attendance minutes are computed on
-- read from tickets; excuses live in scholar_week_excuses.
-- Team choice for #29 Stage 5: rename + freeze (do not DROP) so SQL still
-- has a snapshot. No app runtime should write these tables.

ALTER TABLE IF EXISTS public.front_desk_records
  RENAME TO front_desk_records_legacy;

ALTER TABLE IF EXISTS public.study_session_records
  RENAME TO study_session_records_legacy;

COMMENT ON TABLE public.front_desk_records_legacy IS
  'Frozen snapshot. Do not use. Minutes are computed on read from front_desk_logs; excuses live in scholar_week_excuses.';

COMMENT ON TABLE public.study_session_records_legacy IS
  'Frozen snapshot. Do not use. Minutes are computed on read from study_session_logs; excuses live in scholar_week_excuses.';

DROP POLICY IF EXISTS admin_delete_fdr ON public.front_desk_records_legacy;
DROP POLICY IF EXISTS admin_update_fdr ON public.front_desk_records_legacy;
DROP POLICY IF EXISTS authenticated_insert_fdr ON public.front_desk_records_legacy;

DROP POLICY IF EXISTS admin_delete_ssr ON public.study_session_records_legacy;
DROP POLICY IF EXISTS admin_update_ssr ON public.study_session_records_legacy;
DROP POLICY IF EXISTS authenticated_insert_ssr ON public.study_session_records_legacy;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.front_desk_records_legacy FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.study_session_records_legacy FROM anon, authenticated;

GRANT SELECT ON TABLE public.front_desk_records_legacy TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.study_session_records_legacy TO anon, authenticated, service_role;
