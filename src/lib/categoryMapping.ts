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
    titleAr: "العناية بالبشرة",
    description:
      "Premium skincare solutions for radiant, healthy-looking skin. From gentle cleansers to powerful serums, discover products that transform your daily routine into a ritual of self-care.",
    descriptionAr:
      "حلول متميزة للعناية بالبشرة للحصول على بشرة مشرقة وصحية. من المنظفات اللطيفة إلى الأمصال القوية، اكتشفي المنتجات التي تحول روتينك اليومي إلى طقس من الاعتناء بالذات.",
    editorialTagline:
      "The foundation of your glow: curated cleansers, serums, and masks for every skin story.",
    editorialTaglineAr: "أساس توهجك: منظفات وأمصال وأقنعة مختارة لكل قصة بشرة.",
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
    titleAr: "العناية بالشعر",
    description:
      "Luxurious treatments and products for every hair type, from nourishing shampoos to revitalizing treatments that restore shine and strength.",
    descriptionAr:
      "علاجات ومنتجات فاخرة لجميع أنواع الشعر، من الشامبو المغذي إلى العلاجات المنشطة التي تستعيد اللمعان والقوة.",
    editorialTagline:
      "From root to tip: transformative treatments for hair that moves with you.",
    editorialTaglineAr: "من الجذور إلى الأطراف: علاجات تحويلية لشعر يتحرك معك.",
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
    titleAr: "المكياج",
    description:
      "Enhance your natural beauty with our curated selection of premium makeup products that celebrate individuality and artistry.",
    descriptionAr:
      "عززي جمالك الطبيعي مع مجموعتنا المختارة من منتجات المكياج المتميزة التي تحتفي بالفردية والفن.",
    editorialTagline:
      "Define, enhance, express: artistry meets elegance in every shade.",
    editorialTaglineAr: "حددي، عززي، عبري: الفن يلتقي بالأناقة في كل درجة.",
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
    titleAr: "العناية بالجسم",
    description:
      "Pamper your skin with our premium body care collection, featuring luxurious moisturizers, scrubs, and treatments for silky-smooth skin.",
    descriptionAr:
      "دللي بشرتك مع مجموعة العناية بالجسم المتميزة لدينا، والتي تتضمن مرطبات فاخرة ومقشرات وعلاجات للحصول على بشرة ناعمة كالحرير.",
    editorialTagline:
      "Indulgence for every inch: nourishing rituals for skin that glows.",
    editorialTaglineAr: "انغماس لكل بوصة: طقوس مغذية لبشرة متوهجة.",
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
    titleAr: "العطور",
    description:
      "Captivating scents for every occasion, from signature perfumes to subtle body mists that leave a lasting impression.",
    descriptionAr:
      "روائح آسرة لكل مناسبة، من العطور المميزة إلى رذاذ الجسم الرقيق الذي يترك انطباعًا دائمًا.",
    editorialTagline:
      "Your signature awaits: discover scents that tell your story.",
    editorialTaglineAr: "توقيعك ينتظر: اكتشفي الروائح التي تروي قصتك.",
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
    titleAr: "الأدوات والأجهزة",
    description:
      "Professional-grade beauty tools and devices for salon-quality results at home. Elevate your beauty routine with precision instruments.",
    descriptionAr:
      "أدوات وأجهزة تجميل احترافية للحصول على نتائج بجودة الصالون في المنزل. ارتقي بروتينك الجمالي مع أدوات دقيقة.",
    editorialTagline:
      "Precision in your hands: professional tools for flawless results.",
    editorialTaglineAr:
      "الدقة بين يديك: أدوات احترافية لنتائج خالية من العيوب.",
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
