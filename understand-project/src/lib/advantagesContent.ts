/**
 * Single source of truth for "Our Advantages" / "Why shop with us".
 * Used on: Home (TrustBanner), docs (ADVANTAGES_AND_PLATFORMS.md), README.
 * Keep in sync across website and all platforms.
 */
export const ADVANTAGES = [
  {
    id: "authentic",
    iconKey: "shield",
    title: "Guaranteed Authentic",
    titleAr: "أصالة مضمونة",
    description: "We compete against fakes",
    descriptionAr: "نحارب المنتجات المقلدة",
  },
  {
    id: "pharmacist",
    iconKey: "stethoscope",
    title: "Pharmacist Verified",
    titleAr: "معتمد من الصيدلي",
    description: "We are experts",
    descriptionAr: "خبراء متخصصون",
  },
  {
    id: "delivery",
    iconKey: "truck",
    title: "Amman Concierge Delivery",
    titleAr: "توصيل سريع في عمّان",
    description: "We are fast",
    descriptionAr: "سرعة فائقة",
  },
] as const;

export type AdvantageId = (typeof ADVANTAGES)[number]["id"];
