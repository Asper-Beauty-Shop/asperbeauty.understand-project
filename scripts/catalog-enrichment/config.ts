/**
 * Asper Beauty Shop — Catalog Enrichment config.
 * Approved taxonomies and ingredient→concern signals for Gemini grounding.
 */

import type { SkinConcern, SkinType } from "./types.js";

export { APPROVED_SKIN_CONCERNS, APPROVED_SKIN_TYPES } from "./types.js";

export const INGREDIENT_CONCERN_SIGNALS: Record<string, SkinConcern[]> = {
  "vitamin c": ["brightening", "anti_aging", "hyperpigmentation"],
  niacinamide: ["brightening", "acne", "hyperpigmentation"],
  "hyaluronic acid": ["dryness"],
  spf: ["sun_protection"],
  "zinc oxide": ["sun_protection", "sensitivity"],
  "titanium dioxide": ["sun_protection"],
  retinol: ["anti_aging", "acne"],
  retinaldehyde: ["anti_aging"],
  peptides: ["anti_aging", "dark_circles"],
  caffeine: ["dark_circles"],
  "vitamin k": ["dark_circles"],
  ceramides: ["dryness", "sensitivity"],
  squalane: ["dryness"],
  "salicylic acid": ["acne"],
  "glycolic acid": ["brightening", "anti_aging"],
  "kojic acid": ["brightening", "hyperpigmentation"],
  "azelaic acid": ["acne", "hyperpigmentation", "sensitivity"],
  "centella asiatica": ["sensitivity", "acne"],
  allantoin: ["sensitivity"],
};

export const ENRICHMENT_VERSION = "2025.01-gemini-2.5";
/** Confidence below this (0–100) triggers requires_human_review. */
export const CONFIDENCE_THRESHOLD = 60;
/** Products per Gemini batch (self-healing: one failed batch does not stop pipeline). */
export const BATCH_SIZE = 10;
export const RATE_LIMIT_DELAY_MS = 1000;
/** Delay between Gemini batch calls to avoid rate limits. */
export const GEMINI_BATCH_DELAY_MS = 500;
export const MAX_RETRIES = 3;
/** Gemini model: 2.5 Flash for Centralised Brain alignment. Override with GEMINI_MODEL env. */
export const GEMINI_MODEL =
  (typeof process !== "undefined" && process.env?.GEMINI_MODEL) ||
  "gemini-2.5-flash";
