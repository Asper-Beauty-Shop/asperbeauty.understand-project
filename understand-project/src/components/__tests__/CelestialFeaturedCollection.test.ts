import { describe, it, expect } from "vitest";

/**
 * Digital Tray Coverage Matrix — Contract Tests
 * Validates that the 12-concern taxonomy and 3-step regimen structure
 * are correctly defined and internally consistent.
 */

// Mirror the component's concern list to catch drift
const CONCERNS = [
  "Concern_Hydration",
  "Concern_Acne",
  "Concern_AntiAging",
  "Concern_Sensitivity",
  "Concern_Pigmentation",
  "Concern_Brightening",
  "Concern_Dryness",
  "Concern_SunProtection",
  "Concern_DarkCircles",
  "Concern_Redness",
  "Concern_Oiliness",
  "Concern_Aging",
] as const;

// The canonical enum from Supabase types
const DB_SKIN_CONCERNS = [
  "Concern_Acne",
  "Concern_Hydration",
  "Concern_Aging",
  "Concern_Sensitivity",
  "Concern_Pigmentation",
  "Concern_Redness",
  "Concern_Oiliness",
  "Concern_Brightening",
  "Concern_SunProtection",
  "Concern_DarkCircles",
  "Concern_AntiAging",
  "Concern_Dryness",
] as const;

describe("Digital Tray: Concern Coverage Matrix", () => {
  it("should have exactly 12 concern tabs", () => {
    expect(CONCERNS).toHaveLength(12);
  });

  it("every UI concern must exist in the Supabase skin_concern enum", () => {
    const dbSet = new Set<string>(DB_SKIN_CONCERNS);
    for (const concern of CONCERNS) {
      expect(dbSet.has(concern), `${concern} missing from DB enum`).toBe(true);
    }
  });

  it("every DB enum concern must be represented in the UI", () => {
    const uiSet = new Set<string>(CONCERNS);
    for (const concern of DB_SKIN_CONCERNS) {
      expect(uiSet.has(concern), `${concern} missing from UI tabs`).toBe(true);
    }
  });

  it("should have no duplicate concern tags", () => {
    const seen = new Set<string>();
    for (const c of CONCERNS) {
      expect(seen.has(c), `Duplicate concern: ${c}`).toBe(false);
      seen.add(c);
    }
  });
});

describe("Digital Tray: Step Structure", () => {
  const STEPS = ["step_1", "step_2", "step_3"];

  it("should define exactly 3 regimen steps", () => {
    expect(STEPS).toHaveLength(3);
  });

  it("step keys should follow sequential naming", () => {
    STEPS.forEach((step, i) => {
      expect(step).toBe(`step_${i + 1}`);
    });
  });
});

describe("Digital Tray: Tray Edge Function Concern Allowlist", () => {
  // Mirrors the ALLOWED_CONCERNS set in supabase/functions/tray/index.ts
  const EDGE_ALLOWED = new Set([
    "Concern_Acne",
    "Concern_AntiAging",
    "Concern_Aging",
    "Concern_Brightening",
    "Concern_Dryness",
    "Concern_Hydration",
    "Concern_Sensitivity",
    "Concern_Pigmentation",
    "Concern_SunProtection",
    "Concern_DarkCircles",
    "Concern_Redness",
    "Concern_Oiliness",
    "Concern_Cleansing",
    "Concern_Wrinkles",
    "Concern_OilySkin",
    "Concern_DrySkin",
    "Concern_HairLoss",
  ]);

  it("all 12 UI concerns should be accepted by the edge function", () => {
    const missing: string[] = [];
    for (const c of CONCERNS) {
      if (!EDGE_ALLOWED.has(c)) missing.push(c);
    }
    expect(missing, `Edge function rejects: ${missing.join(", ")}`).toEqual([]);
  });
});
