import { useLanguage } from "@/contexts/LanguageContext";
import type { LifecyclePhase } from "@/pages/MomBaby";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Baby, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { normalizePrice, type ShopifyProduct } from "@/lib/shopify";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface PhaseConfig {
  id: LifecyclePhase;
  en: string;
  ar: string;
  icon: typeof Heart;
  color: string;
  /** Search keywords to find products in Supabase */
  searchTerms: string[];
  categories: { en: string; ar: string; searchQuery: string }[];
}

const phasesConfig: PhaseConfig[] = [
  {
    id: "before-birth",
    en: "Before Birth",
    ar: "قبل الولادة",
    icon: Heart,
    color: "text-rose-clay",
    searchTerms: ["stretch mark", "prenatal", "pregnancy", "supplements"],
    categories: [
      { en: "Stretch Mark Prevention", ar: "الوقاية من التمدد", searchQuery: "stretch mark" },
      { en: "Pregnancy-Safe Skincare", ar: "عناية آمنة للحمل", searchQuery: "pregnancy skincare" },
      { en: "Hair & Scalp Care", ar: "العناية بالشعر", searchQuery: "hair scalp" },
      { en: "Supplements & Fertility", ar: "المكملات والخصوبة", searchQuery: "supplements prenatal" },
    ],
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "بعد الولادة",
    icon: Sparkles,
    color: "text-accent",
    searchTerms: ["breast pump", "breastfeeding", "nursing", "postpartum"],
    categories: [
      { en: "Breast Pumps & Accessories", ar: "مضخات الثدي والإكسسوارات", searchQuery: "breast pump" },
      { en: "Nursing Accessories", ar: "ملحقات الرضاعة", searchQuery: "nursing" },
      { en: "Nipple Care", ar: "العناية بالحلمات", searchQuery: "nipple care" },
      { en: "Body Recovery", ar: "استعادة الجسم", searchQuery: "postpartum recovery" },
    ],
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "السنوات الأولى",
    icon: Baby,
    color: "text-primary",
    searchTerms: ["baby", "infant", "toddler"],
    categories: [
      { en: "Bath & Hygiene", ar: "الاستحمام والنظافة", searchQuery: "baby bath wash" },
      { en: "Skin Care", ar: "العناية بالبشرة", searchQuery: "baby cream lotion" },
      { en: "Diaper Changing", ar: "تغيير الحفاض", searchQuery: "baby diaper powder" },
      { en: "Clothing", ar: "الملابس", searchQuery: "baby clothes" },
    ],
  },
  {
    id: "essentials",
    en: "Maternity Essentials",
    ar: "أساسيات الأمومة",
    icon: ShoppingBag,
    color: "text-burgundy",
    searchTerms: ["baby carrier", "stroller", "gift set", "maternity"],
    categories: [
      { en: "Carriers & Strollers", ar: "الحاملات والعربات", searchQuery: "carrier stroller" },
      { en: "Gift Sets & Bundles", ar: "أطقم الهدايا", searchQuery: "gift set bundle" },
      { en: "Bags & Travel", ar: "حقائب السفر", searchQuery: "baby bag travel" },
      { en: "Thermometers & Monitors", ar: "موازين الحرارة والمراقبة", searchQuery: "thermometer monitor" },
    ],
  },
];

function supabaseToShopify(row: Record<string, unknown>): ShopifyProduct {
  const title = (row.title as string) || (row.name as string) || "";
  return {
    node: {
      id: row.id as string,
      title,
      handle: (row.handle as string) || (row.id as string),
      description: (row.description as string) || "",
      vendor: (row.brand as string) || "",
      productType: (row.category as string) || "",
      images: {
        edges: row.image_url
          ? [{ node: { url: row.image_url as string, altText: title } }]
          : [],
      },
      priceRange: {
        minVariantPrice: { amount: String(row.price), currencyCode: "JOD" },
      },
      variants: {
        edges: [{
          node: {
            id: `${row.id}-default`,
            title: "Default",
            price: { amount: String(row.price), currencyCode: "JOD" },
            availableForSale: true,
            selectedOptions: [],
          },
        }],
      },
      options: [],
    },
  };
}

function usePhaseProducts(phase: PhaseConfig, enabled: boolean) {
  return useQuery({
    queryKey: ["mom-baby-phase", phase.id],
    queryFn: async () => {
      const orFilter = phase.searchTerms.map(t => `name.ilike.%${t}%`).join(",");
      const { data } = await supabase
        .from("products")
        .select("id, name, title, handle, description, brand, category, price, image_url")
        .or(orFilter)
        .limit(6);
      return (data || []).map(supabaseToShopify);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

interface Props {
  activePhase: LifecyclePhase;
  activeConcern: string | null;
}

function PhaseSection({ phase, isAr }: { phase: PhaseConfig; isAr: boolean }) {
  const { data, isLoading } = usePhaseProducts(phase, true);
  const products = data || [];

  return (
    <div>
      {/* Phase header */}
      <div className="flex items-center gap-3 mb-6">
        <phase.icon className={cn("w-6 h-6", phase.color)} />
        <h2 className="font-heading text-2xl md:text-3xl text-foreground">
          {isAr ? phase.ar : phase.en}
        </h2>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {phase.categories.map((cat) => (
          <Link
            key={cat.en}
            to={`/products?q=${encodeURIComponent(cat.searchQuery)}`}
            className="group rounded-xl border border-border bg-card p-4 text-start hover:border-accent/50 hover:shadow-warm transition-all duration-300"
          >
            <span className="block text-sm font-body font-medium text-foreground group-hover:text-primary transition-colors">
              {isAr ? cat.ar : cat.en}
            </span>
          </Link>
        ))}
      </div>

      {/* Featured products — real Shopify data */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {isAr ? "لا توجد منتجات حالياً" : "No products available yet"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.slice(0, 3).map((p: ShopifyProduct) => {
            const product = p.node;
            const imageUrl = product.images.edges[0]?.node.url;
            const price = normalizePrice(product.priceRange.minVariantPrice.amount);
            const currency = product.priceRange.minVariantPrice.currencyCode;

            return (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className="product-card-hover group rounded-xl border border-border bg-card p-5 cursor-pointer"
              >
                {/* Product image */}
                <div className="w-full aspect-square rounded-lg bg-muted/50 mb-4 overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <phase.icon className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </div>
                <p className="text-[10px] font-body uppercase tracking-widest text-accent mb-1">
                  {product.vendor}
                </p>
                <h3 className="text-sm font-body font-medium text-foreground mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-base font-heading font-bold text-primary">
                    {price.toFixed(2)} {currency === "JOD" ? "JD" : currency}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAr ? "عرض" : "View"}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LifecycleSection({ activePhase, activeConcern }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const visible =
    activePhase === "all"
      ? phasesConfig
      : phasesConfig.filter((p) => p.id === activePhase);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-16"
          >
            {visible.map((phase) => (
              <PhaseSection key={phase.id} phase={phase} isAr={isAr} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

