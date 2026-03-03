/**
 * Dr. Bot — Dual-Persona routing & safety layer.
 * Persona A: Dr. Sami (Clinical). Persona B: Ms. Zain (Beauty Advisor).
 * Preserves Medical Luxury brand and guardrails.
 */

export type PersonaId = "dr_sami" | "ms_zain";

/** Keywords that trigger Dr. Sami (Clinical Authority) */
const CLINICAL_TRIGGERS = [
  "ingredient", "ingredients", "pregnancy", "pregnant", "nursing", "breastfeeding",
  "rosacea", "acne", "eczema", "psoriasis", "dermatitis", "allergy", "allergic",
  "dosage", "dose", "contraindication", "side effect", "medical condition",
  "retinol", "retinoid", "hydroquinone", "acids", "aha", "bha", "prescription",
  "doctor", "dermatologist", "diagnosis", "treatment", "medicine", "medication",
  "safe for", "is it safe", "can i use", "interaction", "react with",
  "حمل", "رضاعة", "مكونات", "جرعة", "حساسية", "طبي", "وصفة", "آمن",
];

/** Keywords that trigger Ms. Zain (Beauty Advisor) */
const BEAUTY_TRIGGERS = [
  "routine", "glow", "radiant", "makeup", "application", "how to apply",
  "gift", "present", "best for", "recommend", "luxury", "experience",
  "serum", "moisturizer", "cleanser", "regimen", "skincare routine",
  "روتين", "تألق", "ماكياج", "هدية", "أنصح", "ترطيب", "عناية",
];

/** Serious medical intent → show safety disclaimer and do not diagnose */
const SAFETY_TRIGGERS = [
  "diagnose", "diagnosis", "disease", "cancer", "infection", "virus",
  "emergency", "chest pain", "allergic reaction", "swelling", "can't breathe",
  "تشافي", "تشخيص", "مرض", "طوارئ", "حساسية شديدة",
];

/**
 * Detect which persona should handle the user message (client-side hint).
 * Backend may still override via X-Persona.
 */
export function detectPersonaFromIntent(message: string): PersonaId {
  const lower = message.toLowerCase().trim();
  const clinicalScore = CLINICAL_TRIGGERS.filter((w) => lower.includes(w)).length;
  const beautyScore = BEAUTY_TRIGGERS.filter((w) => lower.includes(w)).length;
  return clinicalScore >= beautyScore ? "dr_sami" : "ms_zain";
}

/**
 * Safety layer: if the user message suggests seeking medical diagnosis,
 * return the disclaimer. Otherwise return null (proceed with chat).
 */
export const SAFETY_DISCLAIMER_EN =
  "I am an AI assistant. Please consult a doctor for medical diagnosis.";
export const SAFETY_DISCLAIMER_AR =
  "أنا مساعد ذكي. يرجى استشارة الطبيب للتشخيص الطبي.";

export function getSafetyDisclaimerIfNeeded(
  message: string,
  language: "en" | "ar" = "en"
): string | null {
  const lower = message.toLowerCase().trim();
  const hasSerious = SAFETY_TRIGGERS.some((w) => lower.includes(w));
  if (!hasSerious) return null;
  return language === "ar" ? SAFETY_DISCLAIMER_AR : SAFETY_DISCLAIMER_EN;
}

/** Alias for detectPersonaFromIntent (used by ChatBot). */
export const detectPersonaFromInput = detectPersonaFromIntent;

/** Alias for getSafetyDisclaimerIfNeeded (used by ChatBot). */
export function getSafetyDisclaimer(
  message: string,
  language: "en" | "ar" = "en"
): string | null {
  return getSafetyDisclaimerIfNeeded(message, language);
}

/** UI config for Dr. Sami (Burgundy) and Ms. Zain (Gold). Medical Luxury brand. */
export const PERSONA_CONFIG: Record<
  PersonaId,
  {
    nameEn: string;
    nameAr: string;
    subtitleEn: string;
    subtitleAr: string;
    accentColor: string;
    borderColor: string;
  }
> = {
  dr_sami: {
    nameEn: "Dr. Sami",
    nameAr: "د. سامي",
    subtitleEn: "Clinical Authority",
    subtitleAr: "السلطة السريرية",
    accentColor: "#6A1E2A",
    borderColor: "#6A1E2A",
  },
  ms_zain: {
    nameEn: "Ms. Zain",
    nameAr: "السيدة زين",
    subtitleEn: "Beauty Advisor",
    subtitleAr: "مستشارة الجمال",
    accentColor: "#C5A028",
    borderColor: "#C5A028",
  },
};

/**
 * Classify a product as Clinical (Dr. Sami) vs Cosmetic (Ms. Zain) for knowledge base.
 * Uses category, skin_concerns, and tags from Supabase products table.
 */
export type ProductRecord = {
  category?: string | null;
  skin_concerns?: string[] | null;
  tags?: string[] | null;
  title?: string | null;
  subcategory?: string | null;
};

export function classifyProductAsClinical(product: ProductRecord): boolean {
  const cat = (product.category ?? "").toLowerCase();
  const sub = (product.subcategory ?? "").toLowerCase();
  const concerns = product.skin_concerns ?? [];
  const tags = (product.tags ?? []).map((t) => String(t).toLowerCase());
  const title = (product.title ?? "").toLowerCase();

  const clinicalCategories = ["skincare", "treatment", "clinical", "medical"];
  const clinicalConcerns = ["acne", "rosacea", "sensitivity", "pigmentation", "aging", "hydration", "redness"];
  const clinicalTags = ["clinical", "treatment", "pharma", "derm", "retinol", "acid", "active"];

  if (clinicalCategories.some((c) => cat.includes(c) || sub.includes(c))) {
    if (concerns.some((c) => clinicalConcerns.some((cc) => String(c).toLowerCase().includes(cc)))) return true;
    if (tags.some((t) => clinicalTags.some((ct) => t.includes(ct)))) return true;
  }
  if (tags.some((t) => clinicalTags.some((ct) => t.includes(ct)))) return true;
  if (title.includes("treatment") || title.includes("serum") || title.includes("active")) return true;
  return false;
}
