/**
 * Asper Beauty Shop — Catalog Enrichment config.
 * Approved taxonomies and ingredient→concern signals for Gemini grounding.
 */

import type { SkinConcern, SkinType } from "./types.js";

export { APPROVED_SKIN_CONCERNS, APPROVED_SKIN_TYPES } from "./types.js";

export const INGREDIENT_CONCERN_SIGNALS: Record<string, SkinConcern[]> = {
  "vitamin c": ["brightening", "anti-aging", "hyperpigmentation"],
  niacinamide: ["brightening", "acne", "hyperpigmentation"],
  "hyaluronic acid": ["dryness"],
  spf: ["sun-protection"],
  "zinc oxide": ["sun-protection", "sensitivity"],
  "titanium dioxide": ["sun-protection"],
  retinol: ["anti-aging", "acne"],
  retinaldehyde: ["anti-aging"],
  peptides: ["anti-aging", "dark-circles", "firmness"],
  caffeine: ["dark-circles"],
  "vitamin k": ["dark-circles"],
  ceramides: ["dryness", "sensitivity"],
  squalane: ["dryness"],
  "salicylic acid": ["acne", "pores"],
  "glycolic acid": ["brightening", "anti-aging", "pores"],
  "kojic acid": ["brightening", "hyperpigmentation"],
  "azelaic acid": ["acne", "hyperpigmentation", "sensitivity"],
  "centella asiatica": ["sensitivity", "acne"],
  allantoin: ["sensitivity"],
};

export const ENRICHMENT_VERSION = "2025.01-gemini-2.5";
/** Confidence below this (0–100) triggers requires_human_review. */
export const CONFIDENCE_THRESHOLD = 60;
export const BATCH_SIZE = 10;
export const RATE_LIMIT_DELAY_MS = 1000;
export const GEMINI_BATCH_DELAY_MS = 500;
export const MAX_RETRIES = 3;
