-- Run after 001 and 002 in Supabase Dashboard → SQL Editor.
-- Replace placeholder roster_uid values with real user_roster.uid values from your project.
-- See docs/dev/supabase/README.md for selection criteria per persona.

INSERT INTO public.dev_test_profiles (
  label,
  roster_uid,
  program_role,
  app_role,
  first_name,
  last_name,
  cohort,
  fd_required,
  ss_required,
  teams,
  mentee_uids,
  mentee_count
) VALUES
  (
    'Scholar — on track',
    'REPLACE_SCHOLAR_ON_TRACK_UID',
    'Scholar',
    NULL,
    'Test',
    'Scholar On Track',
    2025,
    3,
    5,
    '{}',
    '{}',
    0
  ),
  (
    'Scholar — at risk',
    'REPLACE_SCHOLAR_AT_RISK_UID',
    'Scholar',
    NULL,
    'Test',
    'Scholar At Risk',
    2025,
    3,
    5,
    '{}',
    '{}',
    0
  ),
  (
    'Team leader — with mentees',
    'REPLACE_TL_WITH_MENTEES_UID',
    'team_leader',
    'team_leader',
    'Test',
    'TL With Mentees',
    NULL,
    NULL,
    NULL,
    '{}',
    ARRAY['REPLACE_MENTEE_UID_1']::text[],
    1
  ),
  (
    'Team leader — no mentees',
    'REPLACE_TL_NO_MENTEES_UID',
    'team_leader',
    'team_leader',
    'Test',
    'TL No Mentees',
    NULL,
    NULL,
    NULL,
    '{}',
    '{}',
    0
  ),
  (
    'Team leader — with team',
    'REPLACE_TL_WITH_TEAM_UID',
    'team_leader',
    'team_leader',
    'Test',
    'TL With Team',
    NULL,
    NULL,
    NULL,
    ARRAY['Team Alpha']::text[],
    ARRAY['REPLACE_MENTEE_UID_2']::text[],
    1
  )
ON CONFLICT DO NOTHING;
