-- Public /traffic kiosk check-in: INSERT-only for entry rows.
-- Apply in Supabase Dashboard → SQL Editor after reviewing existing traffic policies.
-- Analytics reads stay behind authenticated JWT + /api/traffic (or developer policies).

ALTER TABLE public.traffic ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS traffic_public_insert_entry ON public.traffic;
CREATE POLICY traffic_public_insert_entry ON public.traffic
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    traffic_type = 'entry'
    AND uid ~ '^\d{9}$'
    AND duration_min IS NOT NULL
    AND duration_min >= 1
    AND duration_min <= 720
  );

-- Intentionally no anon SELECT / UPDATE / DELETE on public.traffic.
-- If a broad "allow all" policy exists for anon, drop it so the kiosk cannot
-- enumerate or rewrite history.
