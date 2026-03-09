/**
 * Summarizes a product description to a concise, useful format
 * Extracts key benefits and creates a clean summary
 */
export function summarizeDescription(
  description: string,
  maxLength: number = 150,
): string {
  if (!description) return "";

  // Remove HTML tags if any
  const cleanText = description.replace(/<[^>]*>/g, "").trim();

  // Split into sentences
  const sentences = cleanText.split(/[.!?]+/).filter((s) =>
    s.trim().length > 0
  );

  if (sentences.length === 0) return cleanText.slice(0, maxLength);

  // Take first 1-2 meaningful sentences
  let summary = sentences[0].trim();
  if (sentences.length > 1 && summary.length < 80) {
    summary += ". " + sentences[1].trim();
  }

  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.slice(0, maxLength - 3).trim() + "...";
  }

  return summary;
}

/**
 * Arabic translations for common beauty product terms
 */
const arabicTranslations: Record<string, string> = {
  // Brand names (keep as-is but can add Arabic if needed)
  "vichy": "ÙÙŠØ´ÙŠ",
  "eucerin": "ÙŠÙˆØ³ÙŠØ±ÙŠÙ†",
  "cetaphil": "Ø³ÙŠØªØ§ÙÙŠÙ„",
  "bioten": "Ø¨ÙŠÙˆØªÙŠÙ†",
  "bourjois": "Ø¨ÙˆØ±Ø¬ÙˆØ§",
  "isadora": "Ø¥ÙŠØ²Ø§Ø¯ÙˆØ±Ø§",
  "essence": "Ø¥Ø³Ù†Ø³",
  "svr": "Ø¥Ø³ ÙÙŠ Ø¢Ø±",
  "bepanthen": "Ø¨ÙŠØ¨Ø§Ù†Ø«ÙŠÙ†",
  "mavala": "Ù…Ø§ÙØ§Ù„Ø§",
  "smilest": "Ø³Ù…Ø§ÙŠÙ„Ø³Øª",
  "raghad": "Ø±ØºØ¯",
  "bio balance": "Ø¨ÙŠÙˆ Ø¨Ø§Ù„Ø§Ù†Ø³",

  // Product types
  "mascara": "Ù…Ø§Ø³ÙƒØ§Ø±Ø§",
  "lipstick": "Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡",
  "lip tint": "ØµØ¨ØºØ© Ø´ÙØ§Ù‡",
  "lip gloss": "Ù…Ù„Ù…Ø¹ Ø´ÙØ§Ù‡",
  "cream": "ÙƒØ±ÙŠÙ…",
  "lotion": "Ù„ÙˆØ´Ù†",
  "serum": "Ø³ÙŠØ±ÙˆÙ…",
  "cleanser": "Ù…Ù†Ø¸Ù",
  "cleansing": "ØªÙ†Ø¸ÙŠÙ",
  "toner": "ØªÙˆÙ†Ø±",
  "sunscreen": "ÙˆØ§Ù‚ÙŠ Ø´Ù…Ø³",
  "moisturizer": "Ù…Ø±Ø·Ø¨",
  "eye cream": "ÙƒØ±ÙŠÙ… Ø§Ù„Ø¹ÙŠÙ†",
  "day cream": "ÙƒØ±ÙŠÙ… Ù†Ù‡Ø§Ø±ÙŠ",
  "night cream": "ÙƒØ±ÙŠÙ… Ù„ÙŠÙ„ÙŠ",
  "hair treatment": "Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø´Ø¹Ø±",
  "hair oil": "Ø²ÙŠØª Ø§Ù„Ø´Ø¹Ø±",
  "shampoo": "Ø´Ø§Ù…Ø¨Ùˆ",
  "conditioner": "Ø¨Ù„Ø³Ù…",
  "foundation": "ÙƒØ±ÙŠÙ… Ø£Ø³Ø§Ø³",
  "concealer": "ÙƒÙˆÙ†Ø³ÙŠÙ„Ø±",
  "powder": "Ø¨ÙˆØ¯Ø±Ø©",
  "blush": "Ø£Ø­Ù…Ø± Ø®Ø¯ÙˆØ¯",
  "eyeshadow": "Ø¸Ù„Ø§Ù„ Ø§Ù„Ø¹ÙŠÙˆÙ†",
  "eyeliner": "Ù…Ø­Ø¯Ø¯ Ø§Ù„Ø¹ÙŠÙˆÙ†",
  "hand cream": "ÙƒØ±ÙŠÙ… Ø§Ù„ÙŠØ¯ÙŠÙ†",
  "body lotion": "Ù„ÙˆØ´Ù† Ø§Ù„Ø¬Ø³Ù…",
  "face wash": "ØºØ³ÙˆÙ„ Ø§Ù„ÙˆØ¬Ù‡",
  "whitening": "ØªØ¨ÙŠÙŠØ¶",
  "anti-aging": "Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø´ÙŠØ®ÙˆØ®Ø©",
  "hydrating": "Ù…Ø±Ø·Ø¨",
  "nourishing": "Ù…ØºØ°ÙŠ",
  "gel": "Ø¬Ù„",
  "oil": "Ø²ÙŠØª",
  "mask": "Ù‚Ù†Ø§Ø¹",
  "spray": "Ø¨Ø®Ø§Ø®",
  "balm": "Ø¨Ù„Ø³Ù…",
  "mist": "Ø±Ø°Ø§Ø°",
  "essence product": "Ù…Ù†ØªØ¬ Ø¥Ø³Ù†Ø³",
  "ampoule": "Ø£Ù…Ø¨ÙˆÙ„",
  "treatment": "Ø¹Ù„Ø§Ø¬",
  "scrub": "Ù…Ù‚Ø´Ø±",
  "exfoliant": "Ù…Ù‚Ø´Ø±",
  "primer": "Ø¨Ø±Ø§ÙŠÙ…Ø±",
  "setting": "Ù…Ø«Ø¨Øª",
  "bronzer": "Ø¨Ø±ÙˆÙ†Ø²Ø±",
  "highlighter": "Ù‡Ø§ÙŠÙ„Ø§ÙŠØªØ±",
  "contour": "ÙƒÙˆÙ†ØªÙˆØ±",
  "brow": "Ø­Ø§Ø¬Ø¨",
  "liner": "Ù…Ø­Ø¯Ø¯",
  "palette": "Ø¨Ø§Ù„ÙŠØª",
  "kit": "Ù…Ø¬Ù…ÙˆØ¹Ø©",
  "set": "Ø·Ù‚Ù…",

  // Descriptive words
  "volume": "ÙƒØ«Ø§ÙØ©",
  "extreme": "ÙØ§Ø¦Ù‚",
  "bold": "Ø¬Ø±ÙŠØ¡",
  "big": "ÙƒØ¨ÙŠØ±",
  "black": "Ø£Ø³ÙˆØ¯",
  "brown": "Ø¨Ù†ÙŠ",
  "nude": "Ù†ÙˆØ¯",
  "pink": "ÙˆØ±Ø¯ÙŠ",
  "red": "Ø£Ø­Ù…Ø±",
  "gold": "Ø°Ù‡Ø¨ÙŠ",
  "natural": "Ø·Ø¨ÙŠØ¹ÙŠ",
  "organic": "Ø¹Ø¶ÙˆÙŠ",
  "vitamin": "ÙÙŠØªØ§Ù…ÙŠÙ†",
  "skin": "Ø¨Ø´Ø±Ø©",
  "face": "ÙˆØ¬Ù‡",
  "facial": "Ù„Ù„ÙˆØ¬Ù‡",
  "body": "Ø¬Ø³Ù…",
  "hair": "Ø´Ø¹Ø±",
  "lash": "Ø±Ù…ÙˆØ´",
  "lashes": "Ø±Ù…ÙˆØ´",
  "double": "Ù…Ø¶Ø§Ø¹Ù",
  "long": "Ø·ÙˆÙŠÙ„",
  "lasting": "Ø«Ø§Ø¨Øª",
  "care": "Ø¹Ù†Ø§ÙŠØ©",
  "beauty": "Ø¬Ù…Ø§Ù„",
  "premium": "ÙØ§Ø®Ø±",
  "luxury": "ÙØ®Ù…",
  "gentle": "Ù„Ø·ÙŠÙ",
  "sensitive": "Ø­Ø³Ø§Ø³",
  "dry": "Ø¬Ø§Ù",
  "oily": "Ø¯Ù‡Ù†ÙŠ",
  "combination": "Ù…Ø®ØªÙ„Ø·",
  "normal": "Ø¹Ø§Ø¯ÙŠ",
  "all skin types": "Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø©",
  "protection": "Ø­Ù…Ø§ÙŠØ©",
  "repair": "Ø¥ØµÙ„Ø§Ø­",
  "strengthen": "ØªÙ‚ÙˆÙŠØ©",
  "smooth": "Ù†Ø§Ø¹Ù…",
  "soft": "Ø±Ù‚ÙŠÙ‚",
  "bright": "Ù…Ø´Ø±Ù‚",
  "brightening": "ØªÙØªÙŠØ­",
  "glow": "ØªÙˆÙ‡Ø¬",
  "glowing": "Ù…ØªÙˆÙ‡Ø¬",
  "radiant": "Ù…Ø´Ø¹",
  "clear": "ØµØ§ÙÙŠ",
  "fresh": "Ù…Ù†Ø¹Ø´",
  "lightweight": "Ø®ÙÙŠÙ",
  "intensive": "Ù…ÙƒØ«Ù",
  "intense": "Ù…ÙƒØ«Ù",
  "daily": "ÙŠÙˆÙ…ÙŠ",
  "night": "Ù„ÙŠÙ„ÙŠ",
  "day": "Ù†Ù‡Ø§Ø±ÙŠ",
  "deep": "Ø¹Ù…ÙŠÙ‚",
  "ultra": "ÙØ§Ø¦Ù‚",
  "super": "Ø³ÙˆØ¨Ø±",
  "pro": "Ø¨Ø±Ùˆ",
  "professional": "Ø§Ø­ØªØ±Ø§ÙÙŠ",
  "advanced": "Ù…ØªÙ‚Ø¯Ù…",
  "original": "Ø£ØµÙ„ÙŠ",
  "classic": "ÙƒÙ„Ø§Ø³ÙŠÙƒÙŠ",
  "new": "Ø¬Ø¯ÙŠØ¯",
  "mini": "Ù…ÙŠÙ†ÙŠ",
  "travel": "Ù„Ù„Ø³ÙØ±",
  "size": "Ø­Ø¬Ù…",
  "ml": "Ù…Ù„",
  "spf": "Ø¹Ø§Ù…Ù„ Ø­Ù…Ø§ÙŠØ©",
  "sun": "Ø´Ù…Ø³",
  "uv": "Ø£Ø´Ø¹Ø©",
  "waterproof": "Ù…Ù‚Ø§ÙˆÙ… Ù„Ù„Ù…Ø§Ø¡",
  "long-lasting": "Ø·ÙˆÙŠÙ„ Ø§Ù„Ø£Ù…Ø¯",
  "matte": "Ù…Ø§Øª",
  "glossy": "Ù„Ø§Ù…Ø¹",
  "shiny": "Ù„Ø§Ù…Ø¹",
  "dewy": "Ù†Ø¯ÙŠ",
  "satin": "Ø³Ø§ØªØ§Ù†",
  "velvet": "Ù…Ø®Ù…Ù„ÙŠ",
  "silk": "Ø­Ø±ÙŠØ±ÙŠ",
  "silky smooth": "Ù†Ø§Ø¹Ù… Ø­Ø±ÙŠØ±ÙŠ",
  "rich": "ØºÙ†ÙŠ",
  "creamy": "ÙƒØ±ÙŠÙ…ÙŠ",
  "light": "Ø®ÙÙŠÙ",
  "full": "ÙƒØ§Ù…Ù„",
  "coverage": "ØªØºØ·ÙŠØ©",
  "sheer": "Ø´ÙØ§Ù",
  "formula": "ØªØ±ÙƒÙŠØ¨Ø©",
  "infused": "Ù…Ø´Ø¨Ø¹",
  "enriched": "Ù…Ø¹Ø²Ø²",
  "extract": "Ù…Ø³ØªØ®Ù„Øµ",
  "complex": "Ù…Ø±ÙƒØ¨",
  "technology": "ØªÙ‚Ù†ÙŠØ©",
  "innovation": "Ø§Ø¨ØªÙƒØ§Ø±",
  "solution": "Ø­Ù„",
  "system": "Ù†Ø¸Ø§Ù…",
  "routine": "Ø±ÙˆØªÙŠÙ†",
  "step": "Ø®Ø·ÙˆØ©",
  "normaderm": "Ù†ÙˆØ±Ù…Ø§Ø¯ÙŠØ±Ù…",
  "phytosolution": "ÙÙŠØªÙˆØ³ÙˆÙ„ÙŠÙˆØ´Ù†",

  // Connectors
  "for": "Ù„Ù€",
  "with": "Ù…Ø¹",
  "and": "Ùˆ",
  "the": "",
  "a": "",
  "an": "",
  "of": "Ù…Ù†",
  "in": "ÙÙŠ",
  "by": "Ù…Ù†",
  "to": "Ø¥Ù„Ù‰",
  "on": "Ø¹Ù„Ù‰",
};

/**
 * Translates product description to Arabic
 */
export function translateToArabic(text: string): string {
  if (!text) return "";

  let translated = text.toLowerCase();

  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(arabicTranslations).sort((a, b) =>
    b.length - a.length
  );

  for (const english of sortedKeys) {
    const arabic = arabicTranslations[english];
    const regex = new RegExp(`\\b${english}\\b`, "gi");
    translated = translated.replace(regex, arabic);
  }

  // Capitalize first letter of remaining English words (that weren't translated)
  // and clean up spacing
  translated = translated.replace(/\s+/g, " ").trim();

  return translated;
}

/**
 * Translates product title to Arabic
 */
export function translateTitle(title: string, language: "en" | "ar"): string {
  if (!title || language === "en") return title;
  return translateToArabic(title);
}

/**
 * Gets localized description based on language
 */
export function getLocalizedDescription(
  description: string,
  language: "en" | "ar",
  maxLength?: number,
): string {
  const summarized = summarizeDescription(description, maxLength);

  if (language === "ar" && summarized) {
    return translateToArabic(summarized);
  }

  return summarized;
}

/**
 * Category translations
 */
const categoryTranslations: Record<string, string> = {
  "Skin Care": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
  "Hair Care": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±",
  "Make Up": "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
  "Body Care": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù…",
  "Fragrances": "Ø§Ù„Ø¹Ø·ÙˆØ±",
  "Tools & Devices": "Ø§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„Ø£Ø¬Ù‡Ø²Ø©",
  "Beauty": "Ø§Ù„Ø¬Ù…Ø§Ù„",
  "Skincare": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
  "Makeup": "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
  "Cosmetics": "Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„",
  "Face": "Ø§Ù„ÙˆØ¬Ù‡",
  "Eyes": "Ø§Ù„Ø¹ÙŠÙˆÙ†",
  "Lips": "Ø§Ù„Ø´ÙØ§Ù‡",
  "Nails": "Ø§Ù„Ø£Ø¸Ø§ÙØ±",
  "Hair": "Ø§Ù„Ø´Ø¹Ø±",
  "Body": "Ø§Ù„Ø¬Ø³Ù…",
  "Sun Care": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³",
  "Anti-Aging": "Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø´ÙŠØ®ÙˆØ®Ø©",
  "Acne": "Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨",
  "Moisturizers": "Ø§Ù„Ù…Ø±Ø·Ø¨Ø§Øª",
  "Cleansers": "Ø§Ù„Ù…Ù†Ø¸ÙØ§Øª",
  "Serums": "Ø§Ù„Ø£Ù…ØµØ§Ù„",
  "Masks": "Ø§Ù„Ø£Ù‚Ù†Ø¹Ø©",
  "Treatments": "Ø§Ù„Ø¹Ù„Ø§Ø¬Ø§Øª",
};

/**
 * Translates product category/type to Arabic
 */
export function getLocalizedCategory(
  category: string,
  language: "en" | "ar",
): string {
  if (!category || language === "en") return category;
  return categoryTranslations[category] || translateToArabic(category);
}

/**
 * Extracts key benefits/features from product description
 */
export function extractKeyBenefits(
  description: string,
  language: "en" | "ar" = "en",
): string[] {
  if (!description) return [];

  const benefits: string[] = [];
  const cleanText = description.replace(/<[^>]*>/g, "").toLowerCase();

  // Common benefit keywords in beauty products with Arabic translations
  const benefitPatterns = [
    { pattern: /hydrat/i, en: "Deep Hydration", ar: "ØªØ±Ø·ÙŠØ¨ Ø¹Ù…ÙŠÙ‚" },
    { pattern: /moistur/i, en: "Intense Moisture", ar: "ØªØ±Ø·ÙŠØ¨ Ù…ÙƒØ«Ù" },
    {
      pattern: /anti[- ]?aging|wrinkle/i,
      en: "Anti-Aging",
      ar: "Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø´ÙŠØ®ÙˆØ®Ø©",
    },
    { pattern: /vitamin\s*c|brightening/i, en: "Brightening", ar: "ØªÙØªÙŠØ­" },
    {
      pattern: /spf|sun\s*protect/i,
      en: "Sun Protection",
      ar: "Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³",
    },
    {
      pattern: /natural|organic/i,
      en: "Natural Ingredients",
      ar: "Ù…ÙƒÙˆÙ†Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ©",
    },
    { pattern: /gentle|sensitive/i, en: "Gentle Formula", ar: "ØªØ±ÙƒÙŠØ¨Ø© Ù„Ø·ÙŠÙØ©" },
    { pattern: /repair|restor/i, en: "Repair & Restore", ar: "Ø¥ØµÙ„Ø§Ø­ ÙˆØªØ¬Ø¯ÙŠØ¯" },
    { pattern: /firm|lift/i, en: "Firming & Lifting", ar: "Ø´Ø¯ ÙˆØ±ÙØ¹" },
    { pattern: /smooth|soft/i, en: "Smooth & Soft", ar: "Ù†Ø§Ø¹Ù… ÙˆØ±Ù‚ÙŠÙ‚" },
    { pattern: /volumiz|volume/i, en: "Volume Boost", ar: "Ø²ÙŠØ§Ø¯Ø© Ø§Ù„ÙƒØ«Ø§ÙØ©" },
    {
      pattern: /long[- ]?lasting|24[- ]?hour/i,
      en: "Long-Lasting",
      ar: "Ø·ÙˆÙŠÙ„ Ø§Ù„Ø£Ù…Ø¯",
    },
    { pattern: /nourish/i, en: "Nourishing", ar: "Ù…ØºØ°ÙŠ" },
    { pattern: /protect/i, en: "Protective", ar: "Ø­Ù…Ø§ÙŠØ©" },
    { pattern: /strength|strong/i, en: "Strengthening", ar: "ØªÙ‚ÙˆÙŠØ©" },
    { pattern: /clean|cleans/i, en: "Deep Cleansing", ar: "ØªÙ†Ø¸ÙŠÙ Ø¹Ù…ÙŠÙ‚" },
    { pattern: /sooth/i, en: "Soothing", ar: "Ù…Ù‡Ø¯Ø¦" },
    { pattern: /whiten|whitening/i, en: "Whitening", ar: "ØªØ¨ÙŠÙŠØ¶" },
    { pattern: /lash|mascara/i, en: "Lash Enhancement", ar: "ØªØ¹Ø²ÙŠØ² Ø§Ù„Ø±Ù…ÙˆØ´" },
    { pattern: /color|pigment/i, en: "Rich Color", ar: "Ù„ÙˆÙ† ØºÙ†ÙŠ" },
  ];

  for (const { pattern, en, ar } of benefitPatterns) {
    const benefit = language === "ar" ? ar : en;
    if (pattern.test(cleanText) && !benefits.includes(benefit)) {
      benefits.push(benefit);
    }
    if (benefits.length >= 4) break;
  }

  return benefits;
}

/**
 * Gets product category/type for display
 */
export function getProductCategory(
  productType?: string,
  vendor?: string,
): string {
  if (productType) return productType;
  if (vendor) return vendor;
  return "Beauty";
}
