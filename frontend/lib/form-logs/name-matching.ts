/**
 * Name normalization and fuzzy matching for team leader lookup (e.g. matching
 * form log rows to TLs when scholar_uid is not yet available). Client-safe.
 */

export function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[,.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** If name looks like "Last, First", return also "First Last" for matching. */
export function nameVariants(s: string): string[] {
  const n = normalizeName(s);
  const out = [n];
  const parts = n.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2) {
    const reversed = [parts[1], parts[0]].join(" ");
    if (reversed !== n) out.push(reversed);
  }
  return out;
}

/** Tokenize normalized name for fuzzy comparison. */
export function nameTokens(s: string): Set<string> {
  return new Set(normalizeName(s).split(" ").filter(Boolean));
}

export type TeamLeaderNameRecord = {
  uid: string;
  first_name: string | null;
  last_name: string | null;
};

/**
 * Find team leader uid by fuzzy match on full name.
 * Prefer exact normalized match; otherwise pick TL whose name has best token overlap.
 * Used as backup when scholar_uid is not yet available on form rows.
 */
export function findTeamLeaderUidByFuzzyName(
  name: string,
  teamLeaders: TeamLeaderNameRecord[]
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const inputTokens = nameTokens(trimmed);
  let bestUid: string | null = null;
  let bestScore = 0;
  for (const u of teamLeaders) {
    const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    if (!full) continue;
    const fullNorm = normalizeName(full);
    for (const variant of nameVariants(trimmed)) {
      if (fullNorm === variant) return u.uid;
    }
    const tlTokens = nameTokens(full);
    const intersection = [...inputTokens].filter((t) => tlTokens.has(t)).length;
    const union = new Set([...inputTokens, ...tlTokens]).size;
    const score = union > 0 ? intersection / union : 0;
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestUid = u.uid;
    }
  }
  return bestUid;
}
