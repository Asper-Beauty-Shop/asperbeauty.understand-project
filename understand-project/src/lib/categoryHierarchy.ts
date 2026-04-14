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
    labelAr: "العناية بالبشرة",
    icon: "Sparkles",
    subcategories: [
      { id: "face", labelEn: "Face", labelAr: "الوجه" },
      { id: "body", labelEn: "Body", labelAr: "الجسم" },
      { id: "eye-care", labelEn: "Eye Care", labelAr: "العناية بالعين" },
      {
        id: "sun-protection",
        labelEn: "Sun Protection",
        labelAr: "الحماية من الشمس",
      },
      { id: "lip-care", labelEn: "Lip Care", labelAr: "العناية بالشفاه" },
      { id: "cleansers", labelEn: "Cleansers", labelAr: "المنظفات" },
      { id: "serums", labelEn: "Serums", labelAr: "السيرومات" },
      { id: "moisturizers", labelEn: "Moisturizers", labelAr: "المرطبات" },
    ],
  },
  {
    id: "makeup",
    labelEn: "Makeup",
    labelAr: "المكياج",
    icon: "Palette",
    subcategories: [
      { id: "face-makeup", labelEn: "Face", labelAr: "الوجه" },
      { id: "eye-makeup", labelEn: "Eye", labelAr: "العين" },
      { id: "lip-makeup", labelEn: "Lip", labelAr: "الشفاه" },
      { id: "nails", labelEn: "Nails", labelAr: "الأظافر" },
      {
        id: "brushes-tools",
        labelEn: "Brushes & Tools",
        labelAr: "الفرش والأدوات",
      },
    ],
  },
  {
    id: "hair-care",
    labelEn: "Hair Care",
    labelAr: "العناية بالشعر",
    icon: "Scissors",
    subcategories: [
      { id: "shampoo", labelEn: "Shampoo", labelAr: "الشامبو" },
      { id: "conditioner", labelEn: "Conditioner", labelAr: "البلسم" },
      { id: "treatments", labelEn: "Treatments", labelAr: "العلاجات" },
      { id: "styling", labelEn: "Styling", labelAr: "التصفيف" },
      { id: "hair-color", labelEn: "Hair Color", labelAr: "صبغات الشعر" },
    ],
  },
  {
    id: "fragrance",
    labelEn: "Fragrance",
    labelAr: "العطور",
    icon: "Wind",
    subcategories: [
      { id: "women", labelEn: "Women", labelAr: "نسائي" },
      { id: "men", labelEn: "Men", labelAr: "رجالي" },
      { id: "unisex", labelEn: "Unisex", labelAr: "للجنسين" },
      { id: "body-mist", labelEn: "Body Mist", labelAr: "بخاخ الجسم" },
    ],
  },
  {
    id: "body-care",
    labelEn: "Body Care",
    labelAr: "العناية بالجسم",
    icon: "Heart",
    subcategories: [
      { id: "body-lotion", labelEn: "Body Lotion", labelAr: "لوشن الجسم" },
      { id: "body-wash", labelEn: "Body Wash", labelAr: "غسول الجسم" },
      { id: "hand-care", labelEn: "Hand Care", labelAr: "العناية باليدين" },
      { id: "foot-care", labelEn: "Foot Care", labelAr: "العناية بالقدمين" },
      { id: "deodorant", labelEn: "Deodorant", labelAr: "مزيل العرق" },
    ],
  },
];

// Skin concerns for filtering (iHerb-style)
export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: "acne",
    labelEn: "Acne & Blemishes",
    labelAr: "حب الشباب",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "anti-aging",
    labelEn: "Anti-Aging",
    labelAr: "مكافحة الشيخوخة",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "hydration",
    labelEn: "Hydration",
    labelAr: "الترطيب",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "oily-skin",
    labelEn: "Oily Skin",
    labelAr: "البشرة الدهنية",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "dry-skin",
    labelEn: "Dry Skin",
    labelAr: "البشرة الجافة",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "sensitivity",
    labelEn: "Sensitivity",
    labelAr: "الحساسية",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "dark-spots",
    labelEn: "Dark Spots",
    labelAr: "البقع الداكنة",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "wrinkles",
    labelEn: "Wrinkles",
    labelAr: "التجاعيد",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "sun-protection",
    labelEn: "Sun Protection",
    labelAr: "الحماية من الشمس",
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: "redness",
    labelEn: "Redness",
    labelAr: "الاحمرار",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "cleansing",
    labelEn: "Cleansing",
    labelAr: "التنظيف",
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: "pregnancy-safe",
    labelEn: "Pregnancy Safe",
    labelAr: "آمن للحمل",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "rosacea-safe",
    labelEn: "Rosacea Safe",
    labelAr: "آمن للوردية",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "glass-skin",
    labelEn: "Glass Skin",
    labelAr: "بشرة زجاجية",
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: "barrier-repair",
    labelEn: "Barrier Repair",
    labelAr: "إصلاح الحاجز",
    color: "bg-amber-100 text-amber-700",
  },
];

// Popular brands available in Jordan
export const BRANDS: Brand[] = [
  { id: "vichy", name: "Vichy", country: "France" },
  { id: "eucerin", name: "Eucerin", country: "Germany" },
  { id: "la-roche-posay", name: "La Roche-Posay", country: "France" },
  { id: "bioderma", name: "Bioderma", country: "France" },
  { id: "avene", name: "Avène", country: "France" },
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
    labelAr: "أقل من 10 دينار",
  },
  {
    id: "10-25",
    min: 10,
    max: 25,
    labelEn: "10 - 25 JD",
    labelAr: "10 - 25 دينار",
  },
  {
    id: "25-50",
    min: 25,
    max: 50,
    labelEn: "25 - 50 JD",
    labelAr: "25 - 50 دينار",
  },
  {
    id: "50-100",
    min: 50,
    max: 100,
    labelEn: "50 - 100 JD",
    labelAr: "50 - 100 دينار",
  },
  {
    id: "over-100",
    min: 100,
    max: 999999,
    labelEn: "Over 100 JD",
    labelAr: "أكثر من 100 دينار",
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
