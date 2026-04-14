import { Baby, Leaf, ShieldCheck, Sparkles, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Tables } from "@/integrations/supabase/types";

type DbProduct = Tables<"products">;

interface SafetyBadge {
  key: string;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
  colorClass: string;
}

const ALL_BADGES: SafetyBadge[] = [
  {
    key: "jfda_certified",
    labelEn: "JFDA Certified",
    labelAr: "معتمد من الغذاء والدواء",
    icon: <ShieldCheck className="w-4 h-4" />,
    colorClass: "text-primary border-primary/30 bg-primary/5",
  },
  {
    key: "cruelty_free",
    labelEn: "Cruelty-Free",
    labelAr: "خالٍ من القسوة",
    icon: <Leaf className="w-4 h-4" />,
    colorClass: "text-emerald-700 border-emerald-300 bg-emerald-50",
  },
  {
    key: "pregnancy_safe",
    labelEn: "Pregnancy Safe",
    labelAr: "آمن للحوامل",
    icon: <Baby className="w-4 h-4" />,
    colorClass: "text-pink-700 border-pink-300 bg-pink-50",
  },
  {
    key: "dermatologist_tested",
    labelEn: "Derm Tested",
    labelAr: "مختبر من أطباء جلدية",
    icon: <FlaskConical className="w-4 h-4" />,
    colorClass: "text-sky-700 border-sky-300 bg-sky-50",
  },
  {
    key: "vegan",
    labelEn: "Vegan",
    labelAr: "نباتي",
    icon: <Sparkles className="w-4 h-4" />,
    colorClass: "text-green-700 border-green-300 bg-green-50",
  },
];

/** Keyword patterns that map to badge keys */
const TAG_MATCHERS: Record<string, RegExp> = {
  jfda_certified: /jfda|certified|fda/i,
  cruelty_free: /cruelty.?free|no.?animal/i,
  pregnancy_safe: /pregnan|maternity|mom.?safe/i,
  dermatologist_tested: /derm|dermatologist|clinically.?tested/i,
  vegan: /vegan/i,
};

function detectBadges(product: DbProduct): SafetyBadge[] {
  const matched = new Set<string>();

  // Check tags
  if (product.tags && product.tags.length > 0) {
    for (const tag of product.tags) {
      for (const [key, regex] of Object.entries(TAG_MATCHERS)) {
        if (regex.test(tag)) matched.add(key);
      }
    }
  }

  // Check clinical_badge field
  if (product.clinical_badge) {
    for (const [key, regex] of Object.entries(TAG_MATCHERS)) {
      if (regex.test(product.clinical_badge)) matched.add(key);
    }
  }

  // Default: all products get JFDA Certified (brand guarantee)
  matched.add("jfda_certified");

  // If brand is known cruelty-free (Petal Fresh, Beesline, etc.)
  const cfBrands = /petal fresh|beesline|garnier|bio balance/i;
  if (product.brand && cfBrands.test(product.brand)) {
    matched.add("cruelty_free");
  }

  return ALL_BADGES.filter((b) => matched.has(b.key));
}

export function SafetyBadges({ product, className }: { product: DbProduct; className?: string }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const badges = detectBadges(product);

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
            badge.colorClass
          )}
        >
          {badge.icon}
          {isArabic ? badge.labelAr : badge.labelEn}
        </span>
      ))}
    </div>
  );
}

