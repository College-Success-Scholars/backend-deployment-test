#!/usr/bin/env node
/**
 * Light smoke test for Supabase RPCs: get_mentee_activity, get_week_breaks.
 *
 * Usage:
 *   pnpm test:mentee-rpc
 *   node scripts/test-mentee-rpcs.mjs [week_num] [semester_uuid_or_null]
 *
 * Loads env files from the project root (directory above this script) and from
 * `process.cwd()`, trying `.env.local` then `.env`. Vars already set in the
 * shell are not overwritten.
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL — required
 *   SUPABASE_SERVICE_ROLE_KEY — recommended (RPCs often need elevated access)
 *   or anon/publishable key as fallback
 *
 * Optional: TEST_WITH_MY_MENTEES=1 also calls get_my_mentees and prints the first
 * JSON line (compliance shape: fd_effective, ss_actual, etc.).
 */

import { createClient } from "@supabase/supabase-js"
import { existsSync, readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, "..")

function parseEnvFile(raw) {
  for (const line of raw.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq <= 0) continue
    const name = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[name] === undefined) process.env[name] = val
  }
}

function loadDotEnvFiles() {
  const candidates = [
    join(projectRoot, ".env.local"),
    join(projectRoot, ".env"),
    join(process.cwd(), ".env.local"),
    join(process.cwd(), ".env"),
  ]
  const seen = new Set()
  for (const p of candidates) {
    if (seen.has(p)) continue
    seen.add(p)
    if (!existsSync(p)) continue
    try {
      parseEnvFile(readFileSync(p, "utf8"))
    } catch {
      /* ignore unreadable file */
    }
  }
}

loadDotEnvFiles()

function resolveSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    null
  )
}

function resolveKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    null
  )
}

function assertActivityRow(r, i) {
  const p = `activity[${i}]`
  if (r == null || typeof r !== "object") return `${p}: not an object`
  if (typeof r.scholar_uid !== "string") return `${p}.scholar_uid must be string`
  if (typeof r.activity_date !== "string") return `${p}.activity_date must be string`
  if (typeof r.log_source !== "string") return `${p}.log_source must be string`
  if (typeof r.duration_minutes !== "number") return `${p}.duration_minutes must be number`
  return null
}

function assertWeekBreakRow(r, i) {
  const p = `week_breaks[${i}]`
  if (r == null || typeof r !== "object") return `${p}: not an object`
  if (r.break_days != null && typeof r.break_days !== "number")
    return `${p}.break_days must be number or null`
  if (r.is_break_week != null && typeof r.is_break_week !== "boolean")
    return `${p}.is_break_week must be boolean or null`
  if (r.breaks != null && !Array.isArray(r.breaks)) return `${p}.breaks must be array or null`
  return null
}

/** Shape like your first example (from get_my_mentees + effective/actual math). */
function assertComplianceRow(r, i) {
  const p = `compliance[${i}]`
  if (r == null || typeof r !== "object") return `${p}: not an object`
  const keys = [
    "scholar_uid",
    "first_name",
    "last_name",
    "fd_required",
    "ss_required",
    "fd_effective",
    "ss_effective",
    "fd_actual",
    "ss_actual",
  ]
  for (const k of keys) {
    if (!(k in r)) return `${p}: missing ${k}`
  }
  return null
}

async function main() {
  const url = resolveSupabaseUrl()
  const key = resolveKey()
  const weekNum = Number(process.argv[2] ?? process.env.TEST_WEEK_NUM ?? 10)
  const semesterArg = process.argv[3]
  const pSemesterId =
    semesterArg === "null" || semesterArg === undefined
      ? null
      : semesterArg ?? process.env.TEST_SEMESTER_ID ?? null

  if (!url || !key) {
    console.error(
      "Missing Supabase URL or API key. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and a key:",
    )
    console.error(
      "  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY",
    )
    console.error(
      `Tried loading: ${join(projectRoot, ".env.local")}, ${join(projectRoot, ".env")} (and cwd). Project root: ${projectRoot}`,
    )
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const [{ data: activity, error: e1 }, { data: weekBreaks, error: e2 }] =
    await Promise.all([
      supabase.rpc("get_mentee_activity", {
        p_week_num: weekNum,
        p_semester_id: pSemesterId,
      }),
      supabase.rpc("get_week_breaks", {
        p_week_num: weekNum,
        p_semester_id: pSemesterId,
      }),
    ])

  if (e1) {
    console.error("get_mentee_activity error:", e1.message)
    process.exit(1)
  }
  if (e2) {
    console.error("get_week_breaks error:", e2.message)
    process.exit(1)
  }

  const act = activity ?? []
  const wb = weekBreaks ?? []

  for (let i = 0; i < act.length; i++) {
    const err = assertActivityRow(act[i], i)
    if (err) {
      console.error("Shape validation failed:", err)
      console.error("Row:", JSON.stringify(act[i]))
      process.exit(1)
    }
  }

  for (let i = 0; i < wb.length; i++) {
    const err = assertWeekBreakRow(wb[i], i)
    if (err) {
      console.error("Shape validation failed:", err)
      console.error("Row:", JSON.stringify(wb[i]))
      process.exit(1)
    }
  }

  let complianceLine = null
  if (process.env.TEST_WITH_MY_MENTEES === "1") {
    const { data: mentees, error: e3 } = await supabase.rpc("get_my_mentees")
    if (e3) {
      console.error("get_my_mentees error:", e3.message)
      process.exit(1)
    }
    const breakDays = wb[0]?.break_days ?? 0
    const factor = (5 - breakDays) / 5
    complianceLine = (mentees ?? []).map((m) => {
      const uid = m.scholar_uid
      const fdActual = act
        .filter((r) => r.scholar_uid === uid && r.log_source === "front_desk")
        .reduce((s, r) => s + r.duration_minutes, 0)
      const ssActual = act
        .filter((r) => r.scholar_uid === uid && r.log_source === "study_session")
        .reduce((s, r) => s + r.duration_minutes, 0)
      return {
        scholar_uid: uid,
        first_name: m.first_name,
        last_name: m.last_name,
        fd_required: m.fd_required,
        ss_required: m.ss_required,
        fd_effective: (m.fd_required ?? 0) * factor,
        ss_effective: (m.ss_required ?? 0) * factor,
        fd_actual: fdActual,
        ss_actual: ssActual,
      }
    })
    for (let i = 0; i < complianceLine.length; i++) {
      const err = assertComplianceRow(complianceLine[i], i)
      if (err) {
        console.error("Compliance shape validation failed:", err)
        process.exit(1)
      }
    }
  }

  // Three lines: optional compliance (get_my_mentees + same math as app/mentee/page.tsx), activity, week_breaks.
  console.log(JSON.stringify(complianceLine ?? []))
  console.log(JSON.stringify(act))
  console.log(JSON.stringify(wb))

  console.error(
    `\nOK: week=${weekNum} semester=${pSemesterId ?? "null"} — ${act.length} activity row(s), ${wb.length} week_break row(s)`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
