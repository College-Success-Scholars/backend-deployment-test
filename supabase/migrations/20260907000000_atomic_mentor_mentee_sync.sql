-- Fixes: updateRosterByUid (backend/src/services/user.service.ts) used to write
-- mentee membership across four independent, non-transactional Supabase calls —
-- update user_roster (incl. mentee_count), look up the profile, update profiles
-- (incl. mentee_count), then delete+insert mentor_mentee rows. A failure between
-- any of those steps left mentor_mentee (canonical) and the two denormalized
-- mentee_count/mentee_uids copies permanently out of sync — and mentee_count
-- feeds the weekly-memo "how many MCFs is this team leader required to submit"
-- math directly (see countableFormRequired in form-log.service.ts), so drift
-- there silently corrupts compliance flagging.
--
-- Fix: mentor_mentee stays the only thing app code writes directly. A trigger
-- keeps profiles.mentee_count and user_roster.mentee_count/mentee_uids in sync
-- as part of the SAME transaction as any mentor_mentee change, and the
-- delete+insert replace is wrapped in one SECURITY DEFINER function so it
-- commits or rolls back atomically instead of as two separate REST calls.

CREATE OR REPLACE FUNCTION public.sync_mentee_denormalization(p_mentor_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id text;
  v_mentee_uids text[];
  v_count integer;
BEGIN
  SELECT student_id INTO v_student_id FROM public.profiles WHERE id = p_mentor_id;

  SELECT COALESCE(array_agg(mentee_uid ORDER BY mentee_uid), '{}'::text[]),
         COALESCE(count(*), 0)
    INTO v_mentee_uids, v_count
    FROM public.mentor_mentee
    WHERE mentor_id = p_mentor_id;

  UPDATE public.profiles SET mentee_count = v_count WHERE id = p_mentor_id;

  IF v_student_id IS NOT NULL THEN
    UPDATE public.user_roster
       SET mentee_count = v_count, mentee_uids = v_mentee_uids
     WHERE uid = v_student_id;
  END IF;
END;
$$;

ALTER FUNCTION public.sync_mentee_denormalization(uuid) OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.mentor_mentee_sync_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_mentee_denormalization(OLD.mentor_id);
    RETURN OLD;
  ELSE
    PERFORM public.sync_mentee_denormalization(NEW.mentor_id);
    RETURN NEW;
  END IF;
END;
$$;

ALTER FUNCTION public.mentor_mentee_sync_trigger() OWNER TO postgres;

DROP TRIGGER IF EXISTS mentor_mentee_sync ON public.mentor_mentee;

-- Row-level (not statement-level + transition tables) on purpose: mentor
-- rosters are small (single-digit to low tens of mentees), so recomputing
-- the count per affected row is cheap and keeps this migration simple.
CREATE TRIGGER mentor_mentee_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.mentor_mentee
  FOR EACH ROW
  EXECUTE FUNCTION public.mentor_mentee_sync_trigger();

-- Atomic replace: delete+insert commit together, and the trigger above keeps
-- the denormalized columns honest as part of the same transaction. Runs as
-- SECURITY DEFINER (bypasses RLS), so it re-checks is_developer() itself to
-- preserve the same boundary the direct-table RLS policies already enforce
-- (see 20260903053000_developer_write_user_roster.sql).
CREATE OR REPLACE FUNCTION public.replace_mentor_mentee_assignments(
  p_mentor_id uuid,
  p_mentee_uids text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_developer() THEN
    RAISE EXCEPTION 'Forbidden: developer access required' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.mentor_mentee WHERE mentor_id = p_mentor_id;

  IF p_mentee_uids IS NOT NULL AND array_length(p_mentee_uids, 1) > 0 THEN
    INSERT INTO public.mentor_mentee (mentor_id, mentee_uid)
    SELECT p_mentor_id, uid FROM unnest(p_mentee_uids) AS uid;
  END IF;
END;
$$;

ALTER FUNCTION public.replace_mentor_mentee_assignments(uuid, text[]) OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.replace_mentor_mentee_assignments(uuid, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.replace_mentor_mentee_assignments(uuid, text[]) TO service_role;
