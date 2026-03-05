/**
 * Asper Beauty Shop — JSON schema validation for Gemini audit output.
 * Ensures only approved skin concerns and skin types are accepted.
 */

import {
  APPROVED_SKIN_CONCERNS,
  APPROVED_SKIN_TYPES,
  type SkinConcern,
  type SkinType,
} from "./types.js";

const CONCERNS_SET = new Set<string>(APPROVED_SKIN_CONCERNS);
const TYPES_SET = new Set<string>(APPROVED_SKIN_TYPES);

export function validateSkinConcerns(raw: unknown): SkinConcern[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((c): c is SkinConcern => typeof c === "string" && CONCERNS_SET.has(c));
}

export function validateSkinTypes(raw: unknown): SkinType[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is SkinType => typeof t === "string" && TYPES_SET.has(t));
}

export function validateKeyIngredients(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i): i is string => typeof i === "string")
    .slice(0, 5);
}

export function validateConfidenceScore(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}
