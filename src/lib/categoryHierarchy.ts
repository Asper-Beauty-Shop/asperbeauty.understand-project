// BeautyBox-style granular category hierarchy
// Structured like beautyboxjo.com and jo.iherb.com

export interface SubCategory {
  id: string;
  labelEn: string;
  labelAr: string;
}

export interface Category {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface SkinConcern {
  id: string;
  labelEn: string;
  labelAr: string;
  color: string;
}

export interface Brand {
  id: string;
  name: string;
  country?: string;
}

// Main category hierarchy
export const CATEGORIES: Category[] = [
  {
    id: "skin-care",
    labelEn: "Skin Care",
    labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    icon: "Sparkles",
    subcategories: [
      { id: "face", labelEn: "Face", labelAr: "Ø§Ù„ÙˆØ¬Ù‡" },
      { id: "body", labelEn: "Body", labelAr: "Ø§Ù„Ø¬Ø³Ù…" },
      { id: "eye-care", labelEn: "Eye Care", labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¹ÙŠÙ†" },
      {
        id: "sun-protection",
        labelEn: "Sun Protection",
        labelAr: "Ø§Ù„Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³",
      },
      { id: "lip-care", labelEn: "Lip Care", labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´ÙØ§Ù‡" },
      { id: "cleansers", labelEn: "Cleansers", labelAr: "Ø§Ù„Ù…Ù†Ø¸ÙØ§Øª" },
      { id: "serums", labelEn: "Serums", labelAr: "Ø§Ù„Ø³ÙŠØ±ÙˆÙ…Ø§Øª" },
      { id: "moisturizers", labelEn: "Moisturizers", labelAr: "Ø§Ù„Ù…Ø±Ø·Ø¨Ø§Øª" },
    ],
  },
  {
    id: "makeup",
    labelEn: "Makeup",
    labelAr: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    icon: "Palette",
    subcategories: [
      { id: "face-makeup", labelEn: "Face", labelAr: "Ø§Ù„ÙˆØ¬Ù‡" },
      { id: "eye-makeup", labelEn: "Eye", labelAr: "Ø§Ù„Ø¹ÙŠÙ†" },
      { id: "lip-makeup", labelEn: "Lip", labelAr: "Ø§Ù„Ø´ÙØ§Ù‡" },
      { id: "nails", labelEn: "Nails", labelAr: "Ø§Ù„Ø£Ø¸Ø§ÙØ±" },
      {
        id: "brushes-tools",
        labelEn: "Brushes & Tools",
        labelAr: "Ø§Ù„ÙØ±Ø´ ÙˆØ§Ù„Ø£Ø¯ÙˆØ§Øª",
      },
    ],
  },
  {
    id: "hair-care",
    labelEn: "Hair Care",
    labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±",
    icon: "Scissors",
    subcategories: [
      { id: "shampoo", labelEn: "Shampoo", labelAr: "Ø§Ù„Ø´Ø§Ù…Ø¨Ùˆ" },
      { id: "conditioner", labelEn: "Conditioner", labelAr: "Ø§Ù„Ø¨Ù„Ø³Ù…" },
      { id: "treatments", labelEn: "Treatments", labelAr: "Ø§Ù„Ø¹Ù„Ø§Ø¬Ø§Øª" },
      { id: "styling", labelEn: "Styling", labelAr: "Ø§Ù„ØªØµÙÙŠÙ" },
      { id: "hair-color", labelEn: "Hair Color", labelAr: "ØµØ¨ØºØ§Øª Ø§Ù„Ø´Ø¹Ø±" },
    ],
  },
  {
    id: "fragrance",
    labelEn: "Fragrance",
    labelAr: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    icon: "Wind",
    subcategories: [
      { id: "women", labelEn: "Women", labelAr: "Ù†Ø³Ø§Ø¦ÙŠ" },
      { id: "men", labelEn: "Men", labelAr: "Ø±Ø¬Ø§Ù„ÙŠ" },
      { id: "unisex", labelEn: "Unisex", labelAr: "Ù„Ù„Ø¬Ù†Ø³ÙŠÙ†" },
      { id: "body-mist", labelEn: "Body Mist", labelAr: "Ø¨Ø®Ø§Ø® Ø§Ù„Ø¬Ø³Ù…" },
    ],
  },
  {
    id: "body-care",
    labelEn: "Body Care",
    labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù…",
    icon: "Heart",
    subcategories: [
      { id: "body-lotion", labelEn: "Body Lotion", labelAr: "Ù„ÙˆØ´Ù† Ø§Ù„Ø¬Ø³Ù…" },
      { id: "body-wash", labelEn: "Body Wash", labelAr: "ØºØ³ÙˆÙ„ Ø§Ù„Ø¬Ø³Ù…" },
      { id: "hand-care", labelEn: "Hand Care", labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„ÙŠØ¯ÙŠÙ†" },
      { id: "foot-care", labelEn: "Foot Care", labelAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ù‚Ø¯Ù…ÙŠÙ†" },
      { id: "deodorant", labelEn: "Deodorant", labelAr: "Ù…Ø²ÙŠÙ„ Ø§Ù„Ø¹Ø±Ù‚" },
    ],
  },
];

// Skin concerns for filtering (iHerb-style)
export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: "acne",
    labelEn: "Acne & Blemishes",
    labelAr: "Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "anti-aging",
    labelEn: "Anti-Aging",
    labelAr: "Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø©",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "hydration",
    labelEn: "Hydration",
    labelAr: "Ø§Ù„ØªØ±Ø·ÙŠØ¨",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "oily-skin",
    labelEn: "Oily Skin",
    labelAr: "Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¯Ù‡Ù†ÙŠØ©",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "dry-skin",
    labelEn: "Dry Skin",
    labelAr: "Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¬Ø§ÙØ©",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "sensitivity",
    labelEn: "Sensitivity",
    labelAr: "Ø§Ù„Ø­Ø³Ø§Ø³ÙŠØ©",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "dark-spots",
    labelEn: "Dark Spots",
    labelAr: "Ø§Ù„Ø¨Ù‚Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†Ø©",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "wrinkles",
    labelEn: "Wrinkles",
    labelAr: "Ø§Ù„ØªØ¬Ø§Ø¹ÙŠØ¯",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "sun-protection",
    labelEn: "Sun Protection",
    labelAr: "Ø§Ù„Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³",
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: "redness",
    labelEn: "Redness",
    labelAr: "Ø§Ù„Ø§Ø­Ù…Ø±Ø§Ø±",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "cleansing",
    labelEn: "Cleansing",
    labelAr: "Ø§Ù„ØªÙ†Ø¸ÙŠÙ",
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: "pregnancy-safe",
    labelEn: "Pregnancy Safe",
    labelAr: "Ø¢Ù…Ù† Ù„Ù„Ø­Ù…Ù„",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "rosacea-safe",
    labelEn: "Rosacea Safe",
    labelAr: "Ø¢Ù…Ù† Ù„Ù„ÙˆØ±Ø¯ÙŠØ©",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "glass-skin",
    labelEn: "Glass Skin",
    labelAr: "Ø¨Ø´Ø±Ø© Ø²Ø¬Ø§Ø¬ÙŠØ©",
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: "barrier-repair",
    labelEn: "Barrier Repair",
    labelAr: "Ø¥ØµÙ„Ø§Ø­ Ø§Ù„Ø­Ø§Ø¬Ø²",
    color: "bg-amber-100 text-amber-700",
  },
];

// Popular brands available in Jordan
export const BRANDS: Brand[] = [
  { id: "vichy", name: "Vichy", country: "France" },
  { id: "eucerin", name: "Eucerin", country: "Germany" },
  { id: "la-roche-posay", name: "La Roche-Posay", country: "France" },
  { id: "bioderma", name: "Bioderma", country: "France" },
  { id: "avene", name: "AvÃ¨ne", country: "France" },
  { id: "cetaphil", name: "Cetaphil", country: "USA" },
  { id: "cerave", name: "CeraVe", country: "USA" },
  { id: "neutrogena", name: "Neutrogena", country: "USA" },
  { id: "the-ordinary", name: "The Ordinary", country: "Canada" },
  { id: "svr", name: "SVR", country: "France" },
  { id: "uriage", name: "Uriage", country: "France" },
  { id: "nuxe", name: "NUXE", country: "France" },
  { id: "filorga", name: "Filorga", country: "France" },
  { id: "isdin", name: "ISDIN", country: "Spain" },
];

// Price ranges in JOD
export const PRICE_RANGES = [
  {
    id: "under-10",
    min: 0,
    max: 10,
    labelEn: "Under 10 JD",
    labelAr: "Ø£Ù‚Ù„ Ù…Ù† 10 Ø¯ÙŠÙ†Ø§Ø±",
  },
  {
    id: "10-25",
    min: 10,
    max: 25,
    labelEn: "10 - 25 JD",
    labelAr: "10 - 25 Ø¯ÙŠÙ†Ø§Ø±",
  },
  {
    id: "25-50",
    min: 25,
    max: 50,
    labelEn: "25 - 50 JD",
    labelAr: "25 - 50 Ø¯ÙŠÙ†Ø§Ø±",
  },
  {
    id: "50-100",
    min: 50,
    max: 100,
    labelEn: "50 - 100 JD",
    labelAr: "50 - 100 Ø¯ÙŠÙ†Ø§Ø±",
  },
  {
    id: "over-100",
    min: 100,
    max: 999999,
    labelEn: "Over 100 JD",
    labelAr: "Ø£ÙƒØ«Ø± Ù…Ù† 100 Ø¯ÙŠÙ†Ø§Ø±",
  },
];

// Helper function to get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

// Helper function to get subcategory label
export const getSubcategoryLabel = (
  categoryId: string,
  subcategoryId: string,
  language: "en" | "ar",
): string => {
  const category = getCategoryById(categoryId);
  const subcategory = category?.subcategories.find((sub) =>
    sub.id === subcategoryId
  );
  return language === "ar"
    ? subcategory?.labelAr || ""
    : subcategory?.labelEn || "";
};

// Helper function to get skin concern by ID
export const getSkinConcernById = (id: string): SkinConcern | undefined => {
  return SKIN_CONCERNS.find((concern) => concern.id === id);
};


/** Maps a global category ID to its primary concern tags for database filtering */
export const mapCategoryToConcerns = (categoryId: string): string[] => {
  const map: Record<string, string[]> = {
    'skin-care': ['Concern_Acne', 'Concern_AntiAging', 'Concern_Hydration', 'Concern_Sensitivity', 'Concern_Pigmentation', 'Concern_Dryness', 'Concern_SunProtection'],
    'makeup': ['Concern_Brightening', 'Concern_Oiliness'],
    'body-care': ['Concern_Dryness', 'Concern_Sensitivity'],
    'hair-care': ['Concern_HairLoss'],
  };
  return map[categoryId] || [];
};
