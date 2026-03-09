// Product Categorization Logic for Asper Beauty Shop
// Maps products to the six primary collections based on their use

export interface CategoryInfo {
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  editorialTagline: string;
  editorialTaglineAr: string;
  keywords: string[];
}

// The six primary product categories
export const CATEGORIES: Record<string, CategoryInfo> = {
  "skin-care": {
    slug: "skin-care",
    title: "Skin Care",
    titleAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    description:
      "Premium skincare solutions for radiant, healthy-looking skin. From gentle cleansers to powerful serums, discover products that transform your daily routine into a ritual of self-care.",
    descriptionAr:
      "Ø­Ù„ÙˆÙ„ Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ù…Ø´Ø±Ù‚Ø© ÙˆØµØ­ÙŠØ©. Ù…Ù† Ø§Ù„Ù…Ù†Ø¸ÙØ§Øª Ø§Ù„Ù„Ø·ÙŠÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø£Ù…ØµØ§Ù„ Ø§Ù„Ù‚ÙˆÙŠØ©ØŒ Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªÙŠ ØªØ­ÙˆÙ„ Ø±ÙˆØªÙŠÙ†Ùƒ Ø§Ù„ÙŠÙˆÙ…ÙŠ Ø¥Ù„Ù‰ Ø·Ù‚Ø³ Ù…Ù† Ø§Ù„Ø§Ø¹ØªÙ†Ø§Ø¡ Ø¨Ø§Ù„Ø°Ø§Øª.",
    editorialTagline:
      "The foundation of your glow: curated cleansers, serums, and masks for every skin story.",
    editorialTaglineAr: "Ø£Ø³Ø§Ø³ ØªÙˆÙ‡Ø¬Ùƒ: Ù…Ù†Ø¸ÙØ§Øª ÙˆØ£Ù…ØµØ§Ù„ ÙˆØ£Ù‚Ù†Ø¹Ø© Ù…Ø®ØªØ§Ø±Ø© Ù„ÙƒÙ„ Ù‚ØµØ© Ø¨Ø´Ø±Ø©.",
    keywords: [
      "cleanser",
      "toner",
      "serum",
      "moisturizer",
      "cream",
      "face",
      "facial",
      "skin",
      "acne",
      "anti-aging",
      "hydrating",
      "gel",
      "normaderm",
      "cetaphil",
      "svr",
      "vichy",
      "bioten",
      "bio balance",
    ],
  },
  "hair-care": {
    slug: "hair-care",
    title: "Hair Care",
    titleAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±",
    description:
      "Luxurious treatments and products for every hair type, from nourishing shampoos to revitalizing treatments that restore shine and strength.",
    descriptionAr:
      "Ø¹Ù„Ø§Ø¬Ø§Øª ÙˆÙ…Ù†ØªØ¬Ø§Øª ÙØ§Ø®Ø±Ø© Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø´Ø¹Ø±ØŒ Ù…Ù† Ø§Ù„Ø´Ø§Ù…Ø¨Ùˆ Ø§Ù„Ù…ØºØ°ÙŠ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù„Ø§Ø¬Ø§Øª Ø§Ù„Ù…Ù†Ø´Ø·Ø© Ø§Ù„ØªÙŠ ØªØ³ØªØ¹ÙŠØ¯ Ø§Ù„Ù„Ù…Ø¹Ø§Ù† ÙˆØ§Ù„Ù‚ÙˆØ©.",
    editorialTagline:
      "From root to tip: transformative treatments for hair that moves with you.",
    editorialTaglineAr: "Ù…Ù† Ø§Ù„Ø¬Ø°ÙˆØ± Ø¥Ù„Ù‰ Ø§Ù„Ø£Ø·Ø±Ø§Ù: Ø¹Ù„Ø§Ø¬Ø§Øª ØªØ­ÙˆÙŠÙ„ÙŠØ© Ù„Ø´Ø¹Ø± ÙŠØªØ­Ø±Ùƒ Ù…Ø¹Ùƒ.",
    keywords: [
      "hair",
      "shampoo",
      "conditioner",
      "treatment",
      "oil",
      "mask",
      "scalp",
      "amino",
      "raghad",
    ],
  },
  "make-up": {
    slug: "make-up",
    title: "Make Up",
    titleAr: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    description:
      "Enhance your natural beauty with our curated selection of premium makeup products that celebrate individuality and artistry.",
    descriptionAr:
      "Ø¹Ø²Ø²ÙŠ Ø¬Ù…Ø§Ù„Ùƒ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ Ù…Ø¹ Ù…Ø¬Ù…ÙˆØ¹ØªÙ†Ø§ Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ù…Ù† Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ Ø§Ù„Ù…ØªÙ…ÙŠØ²Ø© Ø§Ù„ØªÙŠ ØªØ­ØªÙÙŠ Ø¨Ø§Ù„ÙØ±Ø¯ÙŠØ© ÙˆØ§Ù„ÙÙ†.",
    editorialTagline:
      "Define, enhance, express: artistry meets elegance in every shade.",
    editorialTaglineAr: "Ø­Ø¯Ø¯ÙŠØŒ Ø¹Ø²Ø²ÙŠØŒ Ø¹Ø¨Ø±ÙŠ: Ø§Ù„ÙÙ† ÙŠÙ„ØªÙ‚ÙŠ Ø¨Ø§Ù„Ø£Ù†Ø§Ù‚Ø© ÙÙŠ ÙƒÙ„ Ø¯Ø±Ø¬Ø©.",
    keywords: [
      "mascara",
      "lipstick",
      "foundation",
      "eyeshadow",
      "blush",
      "concealer",
      "makeup",
      "make-up",
      "lip",
      "eye",
      "bourjois",
      "essence",
      "isadora",
      "lash",
    ],
  },
  "body-care": {
    slug: "body-care",
    title: "Body Care",
    titleAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù…",
    description:
      "Pamper your skin with our premium body care collection, featuring luxurious moisturizers, scrubs, and treatments for silky-smooth skin.",
    descriptionAr:
      "Ø¯Ù„Ù„ÙŠ Ø¨Ø´Ø±ØªÙƒ Ù…Ø¹ Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù… Ø§Ù„Ù…ØªÙ…ÙŠØ²Ø© Ù„Ø¯ÙŠÙ†Ø§ØŒ ÙˆØ§Ù„ØªÙŠ ØªØªØ¶Ù…Ù† Ù…Ø±Ø·Ø¨Ø§Øª ÙØ§Ø®Ø±Ø© ÙˆÙ…Ù‚Ø´Ø±Ø§Øª ÙˆØ¹Ù„Ø§Ø¬Ø§Øª Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ù†Ø§Ø¹Ù…Ø© ÙƒØ§Ù„Ø­Ø±ÙŠØ±.",
    editorialTagline:
      "Indulgence for every inch: nourishing rituals for skin that glows.",
    editorialTaglineAr: "Ø§Ù†ØºÙ…Ø§Ø³ Ù„ÙƒÙ„ Ø¨ÙˆØµØ©: Ø·Ù‚ÙˆØ³ Ù…ØºØ°ÙŠØ© Ù„Ø¨Ø´Ø±Ø© Ù…ØªÙˆÙ‡Ø¬Ø©.",
    keywords: [
      "body",
      "lotion",
      "scrub",
      "wash",
      "soap",
      "hand",
      "bepanthen",
      "eucerin",
      "sunscreen",
      "sun",
      "spf",
    ],
  },
  "fragrances": {
    slug: "fragrances",
    title: "Fragrances",
    titleAr: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    description:
      "Captivating scents for every occasion, from signature perfumes to subtle body mists that leave a lasting impression.",
    descriptionAr:
      "Ø±ÙˆØ§Ø¦Ø­ Ø¢Ø³Ø±Ø© Ù„ÙƒÙ„ Ù…Ù†Ø§Ø³Ø¨Ø©ØŒ Ù…Ù† Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ù…Ù…ÙŠØ²Ø© Ø¥Ù„Ù‰ Ø±Ø°Ø§Ø° Ø§Ù„Ø¬Ø³Ù… Ø§Ù„Ø±Ù‚ÙŠÙ‚ Ø§Ù„Ø°ÙŠ ÙŠØªØ±Ùƒ Ø§Ù†Ø·Ø¨Ø§Ø¹Ù‹Ø§ Ø¯Ø§Ø¦Ù…Ù‹Ø§.",
    editorialTagline:
      "Your signature awaits: discover scents that tell your story.",
    editorialTaglineAr: "ØªÙˆÙ‚ÙŠØ¹Ùƒ ÙŠÙ†ØªØ¸Ø±: Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„Ø±ÙˆØ§Ø¦Ø­ Ø§Ù„ØªÙŠ ØªØ±ÙˆÙŠ Ù‚ØµØªÙƒ.",
    keywords: [
      "perfume",
      "fragrance",
      "cologne",
      "mist",
      "eau de",
      "scent",
      "aroma",
    ],
  },
  "tools-devices": {
    slug: "tools-devices",
    title: "Tools & Devices",
    titleAr: "Ø§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„Ø£Ø¬Ù‡Ø²Ø©",
    description:
      "Professional-grade beauty tools and devices for salon-quality results at home. Elevate your beauty routine with precision instruments.",
    descriptionAr:
      "Ø£Ø¯ÙˆØ§Øª ÙˆØ£Ø¬Ù‡Ø²Ø© ØªØ¬Ù…ÙŠÙ„ Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ù†ØªØ§Ø¦Ø¬ Ø¨Ø¬ÙˆØ¯Ø© Ø§Ù„ØµØ§Ù„ÙˆÙ† ÙÙŠ Ø§Ù„Ù…Ù†Ø²Ù„. Ø§Ø±ØªÙ‚ÙŠ Ø¨Ø±ÙˆØªÙŠÙ†Ùƒ Ø§Ù„Ø¬Ù…Ø§Ù„ÙŠ Ù…Ø¹ Ø£Ø¯ÙˆØ§Øª Ø¯Ù‚ÙŠÙ‚Ø©.",
    editorialTagline:
      "Precision in your hands: professional tools for flawless results.",
    editorialTaglineAr:
      "Ø§Ù„Ø¯Ù‚Ø© Ø¨ÙŠÙ† ÙŠØ¯ÙŠÙƒ: Ø£Ø¯ÙˆØ§Øª Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ù„Ù†ØªØ§Ø¦Ø¬ Ø®Ø§Ù„ÙŠØ© Ù…Ù† Ø§Ù„Ø¹ÙŠÙˆØ¨.",
    keywords: [
      "tool",
      "device",
      "brush",
      "sponge",
      "applicator",
      "whitening",
      "smilest",
      "mavala",
      "double lash",
    ],
  },
};

// Get category slug from slug (handles legacy 'skincare' vs 'skin-care')
export function normalizeCategorySlug(slug: string): string {
  if (slug === "skincare") return "skin-care";
  return slug;
}

// Categorize a product based on its title, productType, and vendor
export function categorizeProduct(
  title: string,
  productType?: string,
  vendor?: string,
): string {
  const searchText = `${title} ${productType || ""} ${vendor || ""}`
    .toLowerCase();

  // Priority order for categorization
  const categoryPriority = [
    "hair-care", // Check hair care first (specific)
    "make-up", // Then makeup (specific)
    "fragrances", // Then fragrances (specific)
    "tools-devices", // Then tools (specific)
    "body-care", // Then body care
    "skin-care", // Default facial/skin products
  ];

  for (const categorySlug of categoryPriority) {
    const category = CATEGORIES[categorySlug];
    for (const keyword of category.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return categorySlug;
      }
    }
  }

  // Default to skin care if no match found
  return "skin-care";
}

// Get category info by slug
export function getCategoryInfo(slug: string): CategoryInfo | null {
  const normalizedSlug = normalizeCategorySlug(slug);
  return CATEGORIES[normalizedSlug] || null;
}

// Get all category slugs
export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORIES);
}
