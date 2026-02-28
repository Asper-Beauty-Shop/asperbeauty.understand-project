import { useLanguage } from "@/contexts/LanguageContext";
import type { LifecyclePhase } from "@/pages/MomBaby";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Baby, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, normalizePrice, type ShopifyProduct } from "@/lib/shopify";
import { Link } from "react-router-dom";

interface PhaseConfig {
  id: LifecyclePhase;
  en: string;
  ar: string;
  icon: typeof Heart;
  color: string;
  /** Shopify search query to fetch products for this phase */
  shopifyQuery: string;
  categories: { en: string; ar: string; shopifyQuery: string }[];
}

const phasesConfig: PhaseConfig[] = [
  {
    id: "before-birth",
    en: "Before Birth",
    ar: "قبل الولادة",
    icon: Heart,
    color: "text-rose-clay",
    shopifyQuery: "product_type:Stretch Mark OR product_type:Supplements OR tag:pregnancy OR tag:prenatal OR (tag:baby AND tag:skincare)",
    categories: [
      { en: "Stretch Mark Prevention", ar: "الوقاية من التمدد", shopifyQuery: "product_type:Stretch Mark" },
      { en: "Pregnancy-Safe Skincare", ar: "عناية آمنة للحمل", shopifyQuery: "tag:pregnancy AND tag:skincare" },
      { en: "Hair & Scalp Care", ar: "العناية بالشعر", shopifyQuery: "tag:pregnancy AND product_type:Shampoo" },
      { en: "Supplements & Fertility", ar: "المكملات والخصوبة", shopifyQuery: "product_type:Supplements OR tag:prenatal" },
    ],
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "بعد الولادة",
    icon: Sparkles,
    color: "text-accent",
    shopifyQuery: "product_type:Breast Pump OR tag:breastfeeding OR tag:nursing OR product_type:Nursing",
    categories: [
      { en: "Breast Pumps & Accessories", ar: "مضخات الثدي والإكسسوارات", shopifyQuery: "product_type:Breast Pump" },
      { en: "Nursing Accessories", ar: "ملحقات الرضاعة", shopifyQuery: "tag:nursing" },
      { en: "Nipple Care", ar: "العناية بالحلمات", shopifyQuery: "tag:nipple" },
      { en: "Body Recovery", ar: "استعادة الجسم", shopifyQuery: "tag:postpartum" },
    ],
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "السنوات الأولى",
    icon: Baby,
    color: "text-primary",
    shopifyQuery: "product_type:Baby Powder OR product_type:Baby Oil OR product_type:Baby Shampoo OR product_type:Baby Cream OR product_type:Baby Lotion OR product_type:Baby Wash OR product_type:Baby Towel OR product_type:Baby Clothes",
    categories: [
      { en: "Bath & Hygiene", ar: "الاستحمام والنظافة", shopifyQuery: "product_type:Baby Shampoo OR product_type:Baby Wash OR product_type:Baby Towel" },
      { en: "Skin Care", ar: "العناية بالبشرة", shopifyQuery: "product_type:Baby Cream OR product_type:Baby Lotion OR product_type:Baby Oil" },
      { en: "Diaper Changing", ar: "تغيير الحفاض", shopifyQuery: "product_type:Baby Powder" },
      { en: "Clothing", ar: "الملابس", shopifyQuery: "product_type:Baby Clothes" },
    ],
  },
  {
    id: "essentials",
    en: "Maternity Essentials",
    ar: "أساسيات الأمومة",
    icon: ShoppingBag,
    color: "text-burgundy",
    shopifyQuery: "product_type:Baby Carrier OR product_type:Baby Stroller OR product_type:Baby Gift Set OR product_type:Baby Bag OR tag:maternity",
    categories: [
      { en: "Carriers & Strollers", ar: "الحاملات والعربات", shopifyQuery: "product_type:Baby Carrier OR product_type:Baby Stroller" },
      { en: "Gift Sets & Bundles", ar: "أطقم الهدايا", shopifyQuery: "product_type:Baby Gift Set" },
      { en: "Bags & Travel", ar: "حقائب السفر", shopifyQuery: "product_type:Baby Bag" },
      { en: "Thermometers & Monitors", ar: "موازين الحرارة والمراقبة", shopifyQuery: "tag:thermometer OR tag:monitor" },
    ],
  },
];

function usePhaseProducts(phase: PhaseConfig, enabled: boolean) {
  return useQuery({
    queryKey: ["mom-baby-phase", phase.id],
    queryFn: () => fetchProducts(6, phase.shopifyQuery),
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
  const products = data?.products || [];

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
            to={`/products?q=${encodeURIComponent(cat.shopifyQuery)}`}
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
