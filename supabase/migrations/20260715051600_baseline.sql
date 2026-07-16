-- Baseline schema dump from linked cloud project (css-atlas / public).
-- Captured: 2026-07-15 via `supabase db dump --linked --schema public`
--
-- Migration history (2026-07-15 Step 2): orphan remote versions reverted;
-- this version marked applied on the linked project. Do NOT `supabase db push`
-- this file onto production — schema already exists; history only was updated.
--
-- Source of truth for public DDL/RLS/RPCs going forward: this directory.
-- Legacy Dashboard runbooks remain under docs/dev/supabase/ until folded in.



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."check_break_within_semester"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  sem record;
begin
  select start_date, end_date into sem
  from public.semesters
  where id = new.semester_id;

  if new.start_date < sem.start_date or new.end_date > sem.end_date then
    raise exception 'Break dates (% to %) must fall within semester bounds (% to %)',
      new.start_date, new.end_date, sem.start_date, sem.end_date;
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."check_break_within_semester"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."compute_grade_trend"("scores" numeric[]) RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  n      int     := array_length(scores, 1);
  x_mean numeric;
  y_mean numeric := 0;
  num    numeric := 0;
  den    numeric := 0;
  slope  numeric;
  i      int;
BEGIN
  IF n IS NULL OR n < 2 THEN RETURN NULL; END IF;

  x_mean := (n - 1)::numeric / 2;
  FOR i IN 1..n LOOP y_mean := y_mean + scores[i]; END LOOP;
  y_mean := y_mean / n;

  FOR i IN 1..n LOOP
    num := num + ((i - 1) - x_mean) * (scores[i] - y_mean);
    den := den + ((i - 1) - x_mean) ^ 2;
  END LOOP;

  IF den = 0 THEN RETURN 'flat'; END IF;
  slope := num / den;

  IF    slope >  2.0 THEN RETURN 'improving';
  ELSIF slope < -2.0 THEN RETURN 'declining';
  ELSE                    RETURN 'flat';
  END IF;
END;
$$;


ALTER FUNCTION "public"."compute_grade_trend"("scores" numeric[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."count_break_days"("p_start" "date", "p_end" "date", "p_semester_id" integer) RETURNS integer
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select count(*)::int
  from generate_series(p_start, p_end, interval '1 day') as d(day)
  where extract(dow from d.day) between 1 and 5
    and exists (
      select 1 from public.semester_breaks b
      where b.semester_id = p_semester_id
        and d.day between b.start_date and b.end_date
    );
$$;


ALTER FUNCTION "public"."count_break_days"("p_start" "date", "p_end" "date", "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."extract_avg_grade_pct"("grades" "jsonb") RETURNS numeric
    LANGUAGE "plpgsql" IMMUTABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  course_key  text;
  course_obj  jsonb;
  assign_key  text;
  assign_val  text;
  pct_num     numeric;
  total       numeric := 0;
  cnt         int     := 0;
BEGIN
  IF grades IS NULL OR grades = '{}'::jsonb THEN
    RETURN NULL;
  END IF;

  FOR course_key, course_obj IN SELECT * FROM jsonb_each(grades) LOOP
    FOR assign_key, assign_val IN
      SELECT k, v #>> '{}'
      FROM jsonb_each(course_obj) AS t(k, v)
    LOOP
      BEGIN
        pct_num := trim(replace(assign_val, '%', ''))::numeric;
        total   := total + pct_num;
        cnt     := cnt + 1;
      EXCEPTION WHEN others THEN
        CONTINUE;
      END;
    END LOOP;
  END LOOP;

  IF cnt = 0 THEN RETURN NULL; END IF;
  RETURN round(total / cnt, 2);
END;
$$;


ALTER FUNCTION "public"."extract_avg_grade_pct"("grades" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."full_resync_daily_scholar_activity"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.daily_scholar_activity
    (scholar_uid, activity_date, week_num, log_source, duration_minutes)

  -- Study session pairs
  SELECT
    e.scholar_uid,
    e.created_at::date                              AS activity_date,
    EXTRACT(WEEK FROM e.created_at)::integer        AS week_num,
    'study_session_logs'                            AS log_source,
    COALESCE(SUM(
      EXTRACT(EPOCH FROM (x.created_at - e.created_at)) / 60
    )::integer, 0)                                  AS duration_minutes
  FROM public.study_session_logs e
  LEFT JOIN LATERAL (
    SELECT created_at
    FROM   public.study_session_logs x
    WHERE  x.scholar_uid    = e.scholar_uid
      AND  x.action_type    = 'Exit'
      AND  x.created_at     > e.created_at
      AND  x.created_at::date = e.created_at::date
    ORDER BY x.created_at ASC
    LIMIT 1
  ) x ON true
  WHERE e.action_type = 'Entry'
    AND e.scholar_uid IS NOT NULL
  GROUP BY e.scholar_uid, e.created_at::date, EXTRACT(WEEK FROM e.created_at)

  UNION ALL

  -- Front desk pairs
  SELECT
    e.scholar_uid,
    e.created_at::date                              AS activity_date,
    EXTRACT(WEEK FROM e.created_at)::integer        AS week_num,
    'front_desk_logs'                               AS log_source,
    COALESCE(SUM(
      EXTRACT(EPOCH FROM (x.created_at - e.created_at)) / 60
    )::integer, 0)                                  AS duration_minutes
  FROM public.front_desk_logs e
  LEFT JOIN LATERAL (
    SELECT created_at
    FROM   public.front_desk_logs x
    WHERE  x.scholar_uid    = e.scholar_uid
      AND  x.action_type    = 'Exit'
      AND  x.created_at     > e.created_at
      AND  x.created_at::date = e.created_at::date
    ORDER BY x.created_at ASC
    LIMIT 1
  ) x ON true
  WHERE e.action_type = 'Entry'
    AND e.scholar_uid IS NOT NULL
  GROUP BY e.scholar_uid, e.created_at::date, EXTRACT(WEEK FROM e.created_at)

  ON CONFLICT (scholar_uid, activity_date, log_source)
  DO UPDATE SET
    week_num         = EXCLUDED.week_num,
    duration_minutes = EXCLUDED.duration_minutes;
END;
$$;


ALTER FUNCTION "public"."full_resync_daily_scholar_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_effective_requirement"("p_week_start" "date", "p_base_required" numeric, "p_semester_id" integer) RETURNS numeric
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select round(
    (
      (5 - count_break_days(p_week_start, p_week_start + 4, p_semester_id))::numeric
      / 5.0
    ) * p_base_required,
    1
  );
$$;


ALTER FUNCTION "public"."get_effective_requirement"("p_week_start" "date", "p_base_required" numeric, "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_mentee_activity"("p_week_num" integer, "p_semester_id" integer) RETURNS TABLE("scholar_uid" "text", "activity_date" "date", "log_source" "text", "duration_minutes" integer)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  v_semester_id    int;
  v_semester_start date;
  v_week_start     date;
begin
  select coalesce(p_semester_id, (
    select id from public.semesters where is_active = true limit 1
  )) into v_semester_id;

  select start_date into v_semester_start
  from public.semesters where id = v_semester_id;

  v_week_start := date_trunc('week',
    make_date(extract(year from v_semester_start)::int, 1, 4)
    + ((p_week_num - 1) * 7)
  )::date;

  return query
  select
    dsa.scholar_uid,
    dsa.activity_date,
    dsa.log_source,
    dsa.duration_minutes
  from public.daily_scholar_activity dsa
  where dsa.week_num = p_week_num
    and dsa.scholar_uid in (
      select mm.mentee_uid
      from public.mentor_mentee mm
      where mm.mentor_id = (
        select id from public.profiles
        where emails @> array[auth.email()]
        limit 1
      )
    )
  order by dsa.scholar_uid, dsa.activity_date, dsa.log_source;
end;
$$;


ALTER FUNCTION "public"."get_mentee_activity"("p_week_num" integer, "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_mentees"() RETURNS TABLE("scholar_uid" "text", "first_name" "text", "last_name" "text", "fd_required" numeric, "ss_required" numeric)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$select
    u.uid,
    u.first_name,
    u.last_name,
    u.fd_required::float4,
    u.ss_required::float4
  from public.mentor_mentee mm
  join public.user_roster u on u.uid = mm.mentee_uid
  where mm.mentor_id = (
    select id from public.profiles
    where emails @> array[auth.email()]
    limit 1
  );$$;


ALTER FUNCTION "public"."get_my_mentees"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_week_breaks"("p_week_num" integer, "p_semester_id" integer) RETURNS TABLE("break_days" integer, "is_break_week" boolean, "breaks" "json")
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  v_semester_id    int;
  v_semester_start date;
  v_week_start     date;
  v_week_end       date;
  v_break_days     int;
begin
  select coalesce(p_semester_id, (
    select id from public.semesters where is_active = true limit 1
  )) into v_semester_id;

  select start_date into v_semester_start
  from public.semesters where id = v_semester_id;

  v_week_start := date_trunc('week',
    make_date(extract(year from v_semester_start)::int, 1, 4)
    + ((p_week_num - 1) * 7)
  )::date;

  v_week_end := v_week_start + 4;

  v_break_days := count_break_days(v_week_start, v_week_end, v_semester_id);

  return query
  select
    v_break_days,
    (v_break_days = 5),
    coalesce(
      (
        select json_agg(json_build_object(
          'name',       b.name,
          'start_date', b.start_date,
          'end_date',   b.end_date
        ))
        from public.semester_breaks b
        where b.semester_id = v_semester_id
          and b.start_date <= v_week_end
          and b.end_date   >= v_week_start
      ),
      '[]'::json
    );
end;
$$;


ALTER FUNCTION "public"."get_week_breaks"("p_week_num" integer, "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_memo"("p_week_num" integer, "p_semester_id" integer) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT jsonb_build_object(

    -- ── Scholars + TLs ────────────────────────────────────────────────────────
    -- All enrolled non-staff from user_roster.
    -- fd_required / ss_required sourced directly from user_roster (profiles not
    -- yet fully populated via invite acceptance).
    'scholars', (
      SELECT jsonb_agg(jsonb_build_object(
        'uid',          ur.uid,
        'full_name',    ur.first_name || ' ' || ur.last_name,
        'cohort',       ur.cohort,
        'program_role', ur.program_role,
        'fd_required',  COALESCE(ur.fd_required, 0),
        'ss_required',  COALESCE(ur.ss_required, 0)
      ) ORDER BY ur.last_name, ur.first_name)
      FROM user_roster ur
      WHERE ur.status = 'enrolled'
        AND COALESCE(ur.program_role, '') NOT IN ('GA', 'Admin', 'Program Coordinator')
    ),

    -- ── TL → mentee map ───────────────────────────────────────────────────────
    -- Resolves mentor_mentee.mentor_id (UUID → profiles.id) through to
    -- user_roster.uid (text) so the frontend works in a single uid space.
    'tl_mentee_map', (
      SELECT jsonb_agg(jsonb_build_object(
        'mentor_uid', ur.uid,
        'mentee_uid', mm.mentee_uid
      ))
      FROM mentor_mentee mm
      JOIN profiles      p  ON p.id         = mm.mentor_id
      JOIN user_roster   ur ON ur.uid        = p.student_id
    ),

    -- ── Current week stats ────────────────────────────────────────────────────
    -- One row per scholar: attendance, form submission status, flags.
    -- Sourced entirely from scholar_weekly_stats — no raw log reads.
    'current_week', (
      SELECT jsonb_agg(jsonb_build_object(
        'scholar_uid',    sws.scholar_uid,
        'fd_minutes',     sws.fd_minutes,
        'ss_minutes',     sws.ss_minutes,
        'fd_completion',  sws.fd_completion,
        'ss_completion',  sws.ss_completion,
        'wahf_submitted', sws.wahf_submitted,
        'mcf_submitted',  sws.mcf_submitted,
        'wpl_submitted',  sws.wpl_submitted,
        'missed_tutoring',sws.missed_tutoring,
        'is_flagged',     sws.is_flagged,
        'weeks_flagged',  sws.weeks_flagged,
        'grade_trend',    sws.grade_trend
      ) ORDER BY sws.scholar_uid)
      FROM scholar_weekly_stats sws
      WHERE sws.semester_id = p_semester_id
        AND sws.week_num    = p_week_num
    ),

    -- ── Trend window: last 4 weeks including current ───────────────────────────
    -- Used by the frontend to render grade trends, flag history, and
    -- attendance sparklines. Returned as a flat array; the frontend groups
    -- by scholar_uid and week_num as needed.
    'trend_weeks', (
      SELECT jsonb_agg(jsonb_build_object(
        'scholar_uid',   sws.scholar_uid,
        'week_num',      sws.week_num,
        'fd_completion', sws.fd_completion,
        'ss_completion', sws.ss_completion,
        'is_flagged',    sws.is_flagged,
        'weeks_flagged', sws.weeks_flagged,
        'grade_trend',   sws.grade_trend
      ) ORDER BY sws.scholar_uid, sws.week_num)
      FROM scholar_weekly_stats sws
      WHERE sws.semester_id = p_semester_id
        AND sws.week_num BETWEEN (p_week_num - 3) AND p_week_num
    ),

    -- ── Traffic ───────────────────────────────────────────────────────────────
    -- current_week: the single row for p_week_num (total_entries, tutoring_sessions).
    -- semester_to_date: cumulative totals from week 1 up to and including p_week_num.
    -- Sourced from traffic_weekly_summary — no raw traffic table reads.
    'traffic', (
      SELECT jsonb_build_object(
        'current_week', jsonb_build_object(
          'total_entries',      COALESCE(SUM(tws.total_entries)      FILTER (WHERE tws.week_num = p_week_num), 0),
          'tutoring_sessions',  COALESCE(SUM(tws.tutoring_sessions)  FILTER (WHERE tws.week_num = p_week_num), 0)
        ),
        'semester_to_date', jsonb_build_object(
          'total_entries',      COALESCE(SUM(tws.total_entries),     0),
          'tutoring_sessions',  COALESCE(SUM(tws.tutoring_sessions), 0)
        )
      )
      FROM traffic_weekly_summary tws
      WHERE tws.semester_id = p_semester_id
        AND tws.week_num   <= p_week_num
    )

  );
$$;


ALTER FUNCTION "public"."get_weekly_memo"("p_week_num" integer, "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  roster_row    public.user_roster%ROWTYPE;
  m_uid         text;
BEGIN
  SELECT * INTO roster_row
  FROM public.user_roster
  WHERE email = NEW.email
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE WARNING 'handle_new_user: no user_roster row found for email %', NEW.email;
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (
    id, first_name, last_name, student_id, phone_number,
    cohort, status, app_role, program_role,
    fd_required, ss_required, mentee_count,
    emails, majors, minors, teams
  ) VALUES (
    NEW.id,
    COALESCE(roster_row.first_name, ''),
    COALESCE(roster_row.last_name, ''),
    roster_row.uid,
    roster_row.phone_number,
    roster_row.cohort::integer,
    roster_row.status,
    COALESCE(roster_row.app_role, 'scholar'),
    roster_row.program_role,
    COALESCE(roster_row.fd_required, 0)::integer,
    COALESCE(roster_row.ss_required, 0)::integer,
    COALESCE(roster_row.mentee_count, 0)::integer,
    ARRAY[NEW.email],
    roster_row.majors,
    roster_row.minors,
    roster_row.teams
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name   = EXCLUDED.first_name,
    last_name    = EXCLUDED.last_name,
    student_id   = EXCLUDED.student_id,
    phone_number = EXCLUDED.phone_number,
    cohort       = EXCLUDED.cohort,
    status       = EXCLUDED.status,
    app_role     = EXCLUDED.app_role,
    program_role = EXCLUDED.program_role,
    fd_required  = EXCLUDED.fd_required,
    ss_required  = EXCLUDED.ss_required,
    mentee_count = EXCLUDED.mentee_count,
    emails       = EXCLUDED.emails,
    majors       = EXCLUDED.majors,
    minors       = EXCLUDED.minors,
    teams        = EXCLUDED.teams;

  IF roster_row.mentee_uids IS NOT NULL THEN
    FOREACH m_uid IN ARRAY roster_row.mentee_uids
    LOOP
      INSERT INTO public.mentor_mentee (mentor_id, mentee_uid)
      VALUES (NEW.id, m_uid)
      ON CONFLICT (mentor_id, mentee_uid) DO NOTHING;
    END LOOP;
  END IF;

  UPDATE public.user_roster
  SET invite_accepted_at = now()
  WHERE email = NEW.email;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_break_day"("p_date" "date", "p_semester_id" integer) RETURNS boolean
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select exists (
    select 1 from public.semester_breaks b
    where b.semester_id = p_semester_id
      and p_date between b.start_date and b.end_date
  );
$$;


ALTER FUNCTION "public"."is_break_day"("p_date" "date", "p_semester_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_developer"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND app_role = 'developer'
  );
$$;


ALTER FUNCTION "public"."is_developer"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."safe_text_array"("val" "jsonb") RETURNS "text"[]
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  IF val IS NULL OR jsonb_typeof(val) = 'null' THEN
    RETURN ARRAY[]::text[];
  ELSIF jsonb_typeof(val) = 'array' THEN
    RETURN ARRAY(SELECT jsonb_array_elements_text(val));
  ELSE
    -- Scalar string like "{\"foo\",\"bar\"}" — treat as Postgres array literal
    RETURN (val #>> '{}')::text[];
  END IF;
END;
$$;


ALTER FUNCTION "public"."safe_text_array"("val" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_daily_scholar_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$DECLARE
  v_log_source     text;
  v_activity_date  date;
  v_week_num       integer;
  v_duration       integer;
BEGIN
  -- Derive log_source from which table fired the trigger
  v_log_source    := TG_TABLE_NAME;           -- 'study_session_logs' | 'front_desk_logs'
  v_activity_date := NEW.created_at::date;
  v_week_num      := EXTRACT(WEEK FROM NEW.created_at)::integer;

  IF NEW.action_type = 'Entry' THEN
    -- --------------------------------------------------------
    -- Entry: upsert a row with duration = 0 (no exit yet)
    -- --------------------------------------------------------
    INSERT INTO public.daily_scholar_activity
      (scholar_uid, activity_date, week_num, log_source, duration_minutes)
    VALUES
      (NEW.scholar_uid, v_activity_date, v_week_num, v_log_source, 0)
    ON CONFLICT (scholar_uid, activity_date, log_source)
    DO UPDATE SET
      week_num         = EXCLUDED.week_num;
      -- leave duration_minutes untouched — the Exit trigger will set it

  ELSIF NEW.action_type = 'Exit' THEN
   
    -- Branch by table using dynamic SQL to keep a single function
    IF v_log_source = 'study_session_logs' THEN
      SELECT COALESCE(SUM(pair_min), 0)::integer
      INTO v_duration
      FROM (
        SELECT
          (
            SELECT EXTRACT(EPOCH FROM (xi.created_at - ei.created_at)) / 60
            FROM   public.study_session_logs xi
            WHERE  xi.scholar_uid  = ei.scholar_uid
              AND  xi.action_type  = 'Exit'
              AND  xi.created_at   > ei.created_at
              AND  xi.created_at::date = ei.created_at::date
            ORDER BY xi.created_at ASC
            LIMIT 1
          ) AS pair_min
        FROM public.study_session_logs ei
        WHERE ei.scholar_uid   = NEW.scholar_uid
          AND ei.action_type   = 'Entry'
          AND ei.created_at::date = v_activity_date
      ) sub;
    ELSE
      SELECT COALESCE(SUM(pair_min), 0)::integer
      INTO v_duration
      FROM (
        SELECT
          (
            SELECT EXTRACT(EPOCH FROM (xi.created_at - ei.created_at)) / 60
            FROM   public.front_desk_logs xi
            WHERE  xi.scholar_uid  = ei.scholar_uid
              AND  xi.action_type  = 'Exit'
              AND  xi.created_at   > ei.created_at
              AND  xi.created_at::date = ei.created_at::date
            ORDER BY xi.created_at ASC
            LIMIT 1
          ) AS pair_min
        FROM public.front_desk_logs ei
        WHERE ei.scholar_uid   = NEW.scholar_uid
          AND ei.action_type   = 'Entry'
          AND ei.created_at::date = v_activity_date
      ) sub;
    END IF;

    -- Upsert with fresh duration (Entry row should already exist, but guard anyway)
    INSERT INTO public.daily_scholar_activity
      (scholar_uid, activity_date, week_num, log_source, duration_minutes)
    VALUES
      (NEW.scholar_uid, v_activity_date, v_week_num, v_log_source, v_duration)
    ON CONFLICT (scholar_uid, activity_date, log_source)
    DO UPDATE SET
      week_num         = EXCLUDED.week_num,
      duration_minutes = EXCLUDED.duration_minutes;

  END IF;

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."sync_daily_scholar_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_scholar_summary"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
DECLARE
    last_entry_time TIMESTAMPTZ;
    session_minutes INT;
    entry_date DATE;
    current_week_num INT;
BEGIN
    -- We only care if the new log is an 'Exit'
    IF NEW.action_type = 'Exit' THEN
        
        -- Find the most recent 'Entry' for this scholar before this Exit
        SELECT created_at INTO last_entry_time
        FROM logs
        WHERE scholar_uid = NEW.scholar_uid
          AND action_type = 'Entry'
          AND created_at < NEW.created_at
        ORDER BY created_at DESC
        LIMIT 1;

        -- If we found a matching Entry, let's calculate the duration
        IF last_entry_time IS NOT NULL THEN
            
            -- Calculate minutes difference
            session_minutes := EXTRACT(EPOCH FROM (NEW.created_at - last_entry_time)) / 60;
            
            -- Get the date and week number from the ENTRY time (more accurate for attendance)
            entry_date := DATE(last_entry_time);
            current_week_num := EXTRACT(WEEK FROM last_entry_time);

            -- PERFORM THE UPSERT (Update or Insert)
            INSERT INTO daily_scholar_summary (scholar_uid, activity_date, week_num, duration_minutes)
            VALUES (NEW.scholar_uid, entry_date, current_week_num, session_minutes)
            ON CONFLICT (scholar_uid, activity_date)
            DO UPDATE SET
                -- Add new session minutes to the existing daily total
                duration_minutes = daily_scholar_summary.duration_minutes + EXCLUDED.duration_minutes;
                
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_scholar_summary"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."am_pm_form_logs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "uid" "text",
    "shift" "text",
    "leader_name" "text",
    "task_completion" "jsonb"
);


ALTER TABLE "public"."am_pm_form_logs" OWNER TO "postgres";


ALTER TABLE "public"."am_pm_form_logs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."am/pm_form_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."daily_scholar_activity" (
    "scholar_uid" "text" NOT NULL,
    "activity_date" "date" NOT NULL,
    "week_num" integer,
    "log_source" "text" NOT NULL,
    "duration_minutes" integer DEFAULT 0
);


ALTER TABLE "public"."daily_scholar_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dev_test_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "label" "text" NOT NULL,
    "roster_uid" "text" NOT NULL,
    "program_role" "text",
    "app_role" "text",
    "first_name" "text",
    "last_name" "text",
    "cohort" integer,
    "fd_required" integer,
    "ss_required" integer,
    "teams" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "mentee_uids" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "mentee_count" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."dev_test_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."front_desk_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "rep_name" "text",
    "scholar_name" "text",
    "scholar_uid" "text",
    "action_type" "text",
    "submitted_by_email" "text"
);


ALTER TABLE "public"."front_desk_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."front_desk_records" (
    "id" bigint NOT NULL,
    "uid" integer,
    "week_num" smallint,
    "mon_min" smallint,
    "tues_min" smallint,
    "wed_min" smallint,
    "thurs_min" smallint,
    "fri_min" smallint,
    "excuse_min" smallint,
    "excuse" "text"
);


ALTER TABLE "public"."front_desk_records" OWNER TO "postgres";


ALTER TABLE "public"."front_desk_records" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."front_desk_records_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mcf_form_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mentor_name" "text",
    "mentor_uid" "text",
    "mentee_name" "text",
    "mentee_uid" "text",
    "meeting_date" "text",
    "meeting_time" "text",
    "met_in_person" "text",
    "reason_no_meeting" "text",
    "tasks_completed" "text",
    "meeting_notes" "text",
    "tutoring_status" "text",
    "needs_tutor" "text",
    "support_rank" "text",
    "submitted_by_email" "text"
);


ALTER TABLE "public"."mcf_form_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mentor_mentee" (
    "id" bigint NOT NULL,
    "mentor_id" "uuid" NOT NULL,
    "mentee_uid" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mentor_mentee" OWNER TO "postgres";


ALTER TABLE "public"."mentor_mentee" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."mentor_mentee_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "student_id" "text",
    "cohort" integer,
    "status" "text",
    "app_role" "text" DEFAULT 'scholar'::"text",
    "program_role" "text",
    "fd_required" integer DEFAULT 0,
    "ss_required" integer DEFAULT 0,
    "mentee_count" integer DEFAULT 0,
    "phone_number" "text",
    "full_name" "text" GENERATED ALWAYS AS ((("first_name" || ' '::"text") || "last_name")) STORED,
    "emails" "text"[],
    "majors" "text"[],
    "minors" "text"[],
    "teams" "text"[]
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scholar_weekly_stats" (
    "scholar_uid" "text" NOT NULL,
    "semester_id" integer NOT NULL,
    "week_num" integer NOT NULL,
    "fd_minutes" integer DEFAULT 0 NOT NULL,
    "ss_minutes" integer DEFAULT 0 NOT NULL,
    "fd_completion" numeric(5,2) DEFAULT 0 NOT NULL,
    "ss_completion" numeric(5,2) DEFAULT 0 NOT NULL,
    "wahf_submitted" boolean DEFAULT false NOT NULL,
    "mcf_submitted" boolean DEFAULT false NOT NULL,
    "wpl_submitted" boolean DEFAULT false NOT NULL,
    "weeks_flagged" integer DEFAULT 0 NOT NULL,
    "grade_trend" "text",
    "missed_tutoring" boolean DEFAULT false NOT NULL,
    "is_flagged" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."scholar_weekly_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."semester_breaks" (
    "id" integer NOT NULL,
    "semester_id" integer NOT NULL,
    "name" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "break_dates_valid" CHECK (("end_date" >= "start_date"))
);


ALTER TABLE "public"."semester_breaks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."semester_breaks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."semester_breaks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."semester_breaks_id_seq" OWNED BY "public"."semester_breaks"."id";



CREATE TABLE IF NOT EXISTS "public"."semesters" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "iso_week_offset" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "semesters_dates_valid" CHECK (("end_date" > "start_date"))
);


ALTER TABLE "public"."semesters" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."semesters_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."semesters_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."semesters_id_seq" OWNED BY "public"."semesters"."id";



CREATE TABLE IF NOT EXISTS "public"."study_session_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "rep_name" "text",
    "scholar_name" "text",
    "scholar_uid" "text",
    "action_type" "text",
    "session_type" "text" DEFAULT 'Study Session'::"text",
    "submitted_by_email" "text"
);


ALTER TABLE "public"."study_session_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."study_session_records" (
    "id" bigint NOT NULL,
    "uid" integer,
    "week_num" smallint,
    "mon_min" smallint,
    "tues_min" smallint,
    "wed_min" smallint,
    "thurs_min" smallint,
    "fri_min" smallint,
    "excuse_min" smallint,
    "excuse" "text"
);


ALTER TABLE "public"."study_session_records" OWNER TO "postgres";


COMMENT ON TABLE "public"."study_session_records" IS 'This is a duplicate of front_desk_records';



ALTER TABLE "public"."study_session_records" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."study_session_records_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."traffic" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uid" "text",
    "traffic_type" "text",
    "duration_min" "text"
);


ALTER TABLE "public"."traffic" OWNER TO "postgres";


ALTER TABLE "public"."traffic" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."traffic_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."traffic_weekly_summary" (
    "semester_id" integer NOT NULL,
    "week_num" integer NOT NULL,
    "total_entries" integer DEFAULT 0 NOT NULL,
    "tutoring_sessions" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."traffic_weekly_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tutor_report_logs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tutor_name" "text" NOT NULL,
    "scholar_uid" "text",
    "end_time" "text" NOT NULL,
    "start_time" "text" NOT NULL,
    "courses" "text"[] NOT NULL,
    "date" "text"
);


ALTER TABLE "public"."tutor_report_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."tutor_report_logs" IS 'Tutoring form';



ALTER TABLE "public"."tutor_report_logs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."tutor_report_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_roster" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uid" "text",
    "first_name" "text",
    "last_name" "text",
    "phone_number" "text",
    "email" "text",
    "cohort" bigint,
    "status" "text",
    "app_role" "text",
    "program_role" "text",
    "fd_required" bigint,
    "ss_required" bigint,
    "mentee_count" bigint,
    "majors" "text"[],
    "minors" "text"[],
    "mentee_uids" "text"[],
    "teams" "text"[],
    "invite_accepted_at" timestamp with time zone,
    "invite_sent_at" timestamp with time zone
);


ALTER TABLE "public"."user_roster" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_roster" IS 'Pre-invite staging table. Holds student records before Supabase Auth invites are sent. Once a student accepts their invite, a profiles row is auto-created via handle_new_user trigger. This table is the source of truth for roster management ONLY. After invite acceptance, public.profiles is canonical.';



ALTER TABLE "public"."user_roster" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."whaf_form_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "scholar_name" "text",
    "team_leader_contact" "text",
    "tl_meeting_in_person" "text",
    "course_changes" "text",
    "assignment_grades" "jsonb",
    "missed_classes" "text",
    "missed_assignments" "text",
    "submitted_by_email" "text",
    "course_change_details" "text",
    "scholar_uid" "text"
);


ALTER TABLE "public"."whaf_form_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wpl_form_logs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "full_name" "text",
    "scholar_uid" "text",
    "hours_worked" numeric,
    "projects" "jsonb",
    "met_with_all" "text",
    "explanation" "text",
    "submitted_by_email" "text"
);


ALTER TABLE "public"."wpl_form_logs" OWNER TO "postgres";


ALTER TABLE "public"."wpl_form_logs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."wpl_form_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."semester_breaks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."semester_breaks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."semesters" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."semesters_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."whaf_form_logs"
    ADD CONSTRAINT "WHAF_form_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."am_pm_form_logs"
    ADD CONSTRAINT "am/pm_form_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_scholar_activity"
    ADD CONSTRAINT "daily_scholar_activity_pkey" PRIMARY KEY ("scholar_uid", "activity_date", "log_source");



ALTER TABLE ONLY "public"."dev_test_profiles"
    ADD CONSTRAINT "dev_test_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."front_desk_logs"
    ADD CONSTRAINT "front_desk_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."front_desk_records"
    ADD CONSTRAINT "front_desk_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentor_mentee"
    ADD CONSTRAINT "mentor_mentee_mentor_id_mentee_uid_key" UNIQUE ("mentor_id", "mentee_uid");



ALTER TABLE ONLY "public"."mentor_mentee"
    ADD CONSTRAINT "mentor_mentee_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mcf_form_logs"
    ADD CONSTRAINT "mf_form_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scholar_weekly_stats"
    ADD CONSTRAINT "scholar_weekly_stats_pkey" PRIMARY KEY ("scholar_uid", "semester_id", "week_num");



ALTER TABLE ONLY "public"."semester_breaks"
    ADD CONSTRAINT "semester_breaks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."semesters"
    ADD CONSTRAINT "semesters_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."semesters"
    ADD CONSTRAINT "semesters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."study_session_logs"
    ADD CONSTRAINT "study_session_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."study_session_records"
    ADD CONSTRAINT "study_session_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."traffic"
    ADD CONSTRAINT "traffic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."traffic_weekly_summary"
    ADD CONSTRAINT "traffic_weekly_summary_pkey" PRIMARY KEY ("semester_id", "week_num");



ALTER TABLE ONLY "public"."tutor_report_logs"
    ADD CONSTRAINT "tutor_report_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roster"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roster"
    ADD CONSTRAINT "users_uid_unique" UNIQUE ("uid");



ALTER TABLE ONLY "public"."wpl_form_logs"
    ADD CONSTRAINT "wpl_form_log_pkey" PRIMARY KEY ("id");



CREATE INDEX "daily_scholar_activity_log_source_idx" ON "public"."daily_scholar_activity" USING "btree" ("log_source");



CREATE INDEX "front_desk_logs_scholar_uid_idx" ON "public"."front_desk_logs" USING "btree" ("scholar_uid");



CREATE INDEX "idx_activity_week" ON "public"."daily_scholar_activity" USING "btree" ("week_num");



CREATE INDEX "idx_mentor_mentee_mentee_uid" ON "public"."mentor_mentee" USING "btree" ("mentee_uid");



CREATE INDEX "idx_sws_scholar_semester_week" ON "public"."scholar_weekly_stats" USING "btree" ("scholar_uid", "semester_id", "week_num");



CREATE INDEX "idx_sws_semester_week" ON "public"."scholar_weekly_stats" USING "btree" ("semester_id", "week_num");



CREATE INDEX "idx_tws_semester_week" ON "public"."traffic_weekly_summary" USING "btree" ("semester_id", "week_num");



CREATE INDEX "mcf_form_logs_mentor_uid_idx" ON "public"."mcf_form_logs" USING "btree" ("mentor_uid");



CREATE INDEX "mentor_mentee_mentor_id_idx" ON "public"."mentor_mentee" USING "btree" ("mentor_id");



CREATE UNIQUE INDEX "one_active_semester" ON "public"."semesters" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "profiles_student_id_idx" ON "public"."profiles" USING "hash" ("student_id");



CREATE INDEX "semester_breaks_semester_id_idx" ON "public"."semester_breaks" USING "btree" ("semester_id");



CREATE INDEX "study_session_logs_scholar_uid_idx" ON "public"."study_session_logs" USING "btree" ("scholar_uid");



CREATE INDEX "traffic_created_at_idx" ON "public"."traffic" USING "btree" ("created_at");



CREATE INDEX "user_roster_email_idx" ON "public"."user_roster" USING "btree" ("email");



CREATE INDEX "whaf_form_logs_scholar_name_idx" ON "public"."whaf_form_logs" USING "btree" ("scholar_name");



CREATE INDEX "whaf_form_logs_scholar_uid_idx" ON "public"."whaf_form_logs" USING "btree" ("scholar_uid");



CREATE INDEX "wpl_form_logs_scholar_uid_idx" ON "public"."wpl_form_logs" USING "btree" ("scholar_uid");



CREATE OR REPLACE TRIGGER "enforce_break_semester_bounds" BEFORE INSERT OR UPDATE ON "public"."semester_breaks" FOR EACH ROW EXECUTE FUNCTION "public"."check_break_within_semester"();



CREATE OR REPLACE TRIGGER "trg_sync_daily_activity_fd" AFTER INSERT ON "public"."front_desk_logs" FOR EACH ROW EXECUTE FUNCTION "public"."sync_daily_scholar_activity"();



CREATE OR REPLACE TRIGGER "trg_sync_daily_activity_ss" AFTER INSERT ON "public"."study_session_logs" FOR EACH ROW EXECUTE FUNCTION "public"."sync_daily_scholar_activity"();



ALTER TABLE ONLY "public"."mentor_mentee"
    ADD CONSTRAINT "mentor_mentee_mentee_uid_fkey" FOREIGN KEY ("mentee_uid") REFERENCES "public"."user_roster"("uid");



ALTER TABLE ONLY "public"."mentor_mentee"
    ADD CONSTRAINT "mentor_mentee_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."user_roster"("uid");



ALTER TABLE ONLY "public"."scholar_weekly_stats"
    ADD CONSTRAINT "scholar_weekly_stats_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id");



ALTER TABLE ONLY "public"."semester_breaks"
    ADD CONSTRAINT "semester_breaks_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."traffic_weekly_summary"
    ADD CONSTRAINT "traffic_weekly_summary_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id");



CREATE POLICY "Enable read access for all users" ON "public"."am_pm_form_logs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."front_desk_logs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."front_desk_records" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."mcf_form_logs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."semesters" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."study_session_logs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."study_session_records" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."traffic" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."user_roster" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."wpl_form_logs" FOR SELECT USING (true);



CREATE POLICY "Mentors can read their own mentee relationships" ON "public"."mentor_mentee" FOR SELECT USING (("mentor_id" = "auth"."uid"()));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "admin_delete_fdr" ON "public"."front_desk_records" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_delete_ssr" ON "public"."study_session_records" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_delete_traffic" ON "public"."traffic" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_delete_tutor_logs" ON "public"."tutor_report_logs" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_full_access_roster" ON "public"."user_roster" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_manage_breaks" ON "public"."semester_breaks" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_manage_semesters" ON "public"."semesters" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_update_delete_tutor_logs" ON "public"."tutor_report_logs" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_update_fdr" ON "public"."front_desk_records" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admin_update_ssr" ON "public"."study_session_records" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text"]))))));



CREATE POLICY "admins can update any profile" ON "public"."profiles" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "profiles_1"
  WHERE (("profiles_1"."id" = "auth"."uid"()) AND ("profiles_1"."app_role" = ANY (ARRAY['admin'::"text", 'developer'::"text"]))))));



ALTER TABLE "public"."am_pm_form_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "anon_insert_traffic" ON "public"."traffic" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "authenticated read" ON "public"."traffic_weekly_summary" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_insert_fdr" ON "public"."front_desk_records" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "authenticated_insert_ssr" ON "public"."study_session_records" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "authenticated_insert_tutor_logs" ON "public"."tutor_report_logs" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "authenticated_select_activity" ON "public"."daily_scholar_activity" FOR SELECT TO "authenticated" USING ((("scholar_uid" = (( SELECT "auth"."uid"() AS "uid"))::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text", 'teamleader'::"text", 'developer'::"text"])))))));



CREATE POLICY "authenticated_select_breaks" ON "public"."semester_breaks" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_select_semesters" ON "public"."semesters" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_select_tutor_logs" ON "public"."tutor_report_logs" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."daily_scholar_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."dev_test_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "dev_test_profiles_delete" ON "public"."dev_test_profiles" FOR DELETE TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "dev_test_profiles_insert" ON "public"."dev_test_profiles" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_developer"());



CREATE POLICY "dev_test_profiles_select" ON "public"."dev_test_profiles" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "dev_test_profiles_update" ON "public"."dev_test_profiles" FOR UPDATE TO "authenticated" USING ("public"."is_developer"()) WITH CHECK ("public"."is_developer"());



CREATE POLICY "developer_read_daily_scholar_activity" ON "public"."daily_scholar_activity" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_front_desk_logs" ON "public"."front_desk_logs" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_front_desk_records" ON "public"."front_desk_records" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_mcf_form_logs" ON "public"."mcf_form_logs" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_mentor_mentee" ON "public"."mentor_mentee" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_study_session_logs" ON "public"."study_session_logs" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_study_session_records" ON "public"."study_session_records" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_user_roster" ON "public"."user_roster" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_whaf_form_logs" ON "public"."whaf_form_logs" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



CREATE POLICY "developer_read_wpl_form_logs" ON "public"."wpl_form_logs" FOR SELECT TO "authenticated" USING ("public"."is_developer"());



ALTER TABLE "public"."front_desk_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."front_desk_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mcf_form_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mentor_mentee" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."scholar_weekly_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."semester_breaks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."semesters" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "service role write" ON "public"."traffic_weekly_summary" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_full_access" ON "public"."daily_scholar_activity" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_full_access" ON "public"."tutor_report_logs" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."study_session_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."study_session_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."traffic" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."traffic_weekly_summary" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tutor_report_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roster" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can update own basic info" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK ((("auth"."uid"() = "id") AND ("app_role" = ( SELECT "profiles_1"."app_role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"()))) AND ("status" = ( SELECT "profiles_1"."status"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"()))) AND ("program_role" = ( SELECT "profiles_1"."program_role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())))));



ALTER TABLE "public"."whaf_form_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "whaf_select_policy" ON "public"."whaf_form_logs" TO "authenticated" USING ((("scholar_uid" = (( SELECT "auth"."uid"() AS "uid"))::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profiles"."app_role" = ANY (ARRAY['admin'::"text", 'staff'::"text", 'teamleader'::"text", 'developer'::"text"])))))));



ALTER TABLE "public"."wpl_form_logs" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."check_break_within_semester"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_break_within_semester"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_break_within_semester"() TO "service_role";



GRANT ALL ON FUNCTION "public"."compute_grade_trend"("scores" numeric[]) TO "anon";
GRANT ALL ON FUNCTION "public"."compute_grade_trend"("scores" numeric[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."compute_grade_trend"("scores" numeric[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."count_break_days"("p_start" "date", "p_end" "date", "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."count_break_days"("p_start" "date", "p_end" "date", "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_break_days"("p_start" "date", "p_end" "date", "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_avg_grade_pct"("grades" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_avg_grade_pct"("grades" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_avg_grade_pct"("grades" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."full_resync_daily_scholar_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."full_resync_daily_scholar_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."full_resync_daily_scholar_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_effective_requirement"("p_week_start" "date", "p_base_required" numeric, "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_effective_requirement"("p_week_start" "date", "p_base_required" numeric, "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_effective_requirement"("p_week_start" "date", "p_base_required" numeric, "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_mentee_activity"("p_week_num" integer, "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_mentee_activity"("p_week_num" integer, "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_mentee_activity"("p_week_num" integer, "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_mentees"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_mentees"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_mentees"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_week_breaks"("p_week_num" integer, "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_week_breaks"("p_week_num" integer, "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_week_breaks"("p_week_num" integer, "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_memo"("p_week_num" integer, "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_memo"("p_week_num" integer, "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_memo"("p_week_num" integer, "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_break_day"("p_date" "date", "p_semester_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."is_break_day"("p_date" "date", "p_semester_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_break_day"("p_date" "date", "p_semester_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_developer"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_developer"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_developer"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."safe_text_array"("val" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."safe_text_array"("val" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."safe_text_array"("val" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_daily_scholar_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_daily_scholar_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_daily_scholar_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_scholar_summary"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_scholar_summary"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_scholar_summary"() TO "service_role";



GRANT ALL ON TABLE "public"."am_pm_form_logs" TO "anon";
GRANT ALL ON TABLE "public"."am_pm_form_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."am_pm_form_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."am/pm_form_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."am/pm_form_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."am/pm_form_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."daily_scholar_activity" TO "anon";
GRANT ALL ON TABLE "public"."daily_scholar_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_scholar_activity" TO "service_role";



GRANT ALL ON TABLE "public"."dev_test_profiles" TO "anon";
GRANT ALL ON TABLE "public"."dev_test_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."dev_test_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."front_desk_logs" TO "anon";
GRANT ALL ON TABLE "public"."front_desk_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."front_desk_logs" TO "service_role";



GRANT ALL ON TABLE "public"."front_desk_records" TO "anon";
GRANT ALL ON TABLE "public"."front_desk_records" TO "authenticated";
GRANT ALL ON TABLE "public"."front_desk_records" TO "service_role";



GRANT ALL ON SEQUENCE "public"."front_desk_records_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."front_desk_records_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."front_desk_records_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mcf_form_logs" TO "anon";
GRANT ALL ON TABLE "public"."mcf_form_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."mcf_form_logs" TO "service_role";



GRANT ALL ON TABLE "public"."mentor_mentee" TO "anon";
GRANT ALL ON TABLE "public"."mentor_mentee" TO "authenticated";
GRANT ALL ON TABLE "public"."mentor_mentee" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mentor_mentee_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mentor_mentee_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mentor_mentee_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."scholar_weekly_stats" TO "anon";
GRANT ALL ON TABLE "public"."scholar_weekly_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."scholar_weekly_stats" TO "service_role";



GRANT ALL ON TABLE "public"."semester_breaks" TO "anon";
GRANT ALL ON TABLE "public"."semester_breaks" TO "authenticated";
GRANT ALL ON TABLE "public"."semester_breaks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."semester_breaks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."semester_breaks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."semester_breaks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."semesters" TO "anon";
GRANT ALL ON TABLE "public"."semesters" TO "authenticated";
GRANT ALL ON TABLE "public"."semesters" TO "service_role";



GRANT ALL ON SEQUENCE "public"."semesters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."semesters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."semesters_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."study_session_logs" TO "anon";
GRANT ALL ON TABLE "public"."study_session_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."study_session_logs" TO "service_role";



GRANT ALL ON TABLE "public"."study_session_records" TO "anon";
GRANT ALL ON TABLE "public"."study_session_records" TO "authenticated";
GRANT ALL ON TABLE "public"."study_session_records" TO "service_role";



GRANT ALL ON SEQUENCE "public"."study_session_records_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."study_session_records_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."study_session_records_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."traffic" TO "anon";
GRANT ALL ON TABLE "public"."traffic" TO "authenticated";
GRANT ALL ON TABLE "public"."traffic" TO "service_role";



GRANT ALL ON SEQUENCE "public"."traffic_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."traffic_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."traffic_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."traffic_weekly_summary" TO "anon";
GRANT ALL ON TABLE "public"."traffic_weekly_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."traffic_weekly_summary" TO "service_role";



GRANT ALL ON TABLE "public"."tutor_report_logs" TO "anon";
GRANT ALL ON TABLE "public"."tutor_report_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."tutor_report_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tutor_report_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tutor_report_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tutor_report_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_roster" TO "anon";
GRANT ALL ON TABLE "public"."user_roster" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roster" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."whaf_form_logs" TO "anon";
GRANT ALL ON TABLE "public"."whaf_form_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."whaf_form_logs" TO "service_role";



GRANT ALL ON TABLE "public"."wpl_form_logs" TO "anon";
GRANT ALL ON TABLE "public"."wpl_form_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."wpl_form_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."wpl_form_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."wpl_form_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."wpl_form_log_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






