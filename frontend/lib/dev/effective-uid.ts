/**
 * @file effective-uid.ts
 * @module frontend/lib/dev
 *
 * Resolves the effective scholar/roster uid from a profile (real or test overlay).
 */
import { getEffectiveScholarId } from "../../../shared/dist/auth.js";

export { getEffectiveScholarId };

/** Alias matching plan naming. */
export const effectiveScholarId = getEffectiveScholarId;
