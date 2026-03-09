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
    ar: "Ù‚Ø¨Ù„ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©",
    icon: Heart,
    color: "text-rose-clay",
    shopifyQuery: "product_type:Stretch Mark OR product_type:Supplements OR tag:pregnancy OR tag:prenatal OR (tag:baby AND tag:skincare)",
    categories: [
      { en: "Stretch Mark Prevention", ar: "Ø§Ù„ÙˆÙ‚Ø§ÙŠØ© Ù…Ù† Ø§Ù„ØªÙ…Ø¯Ø¯", shopifyQuery: "product_type:Stretch Mark" },
      { en: "Pregnancy-Safe Skincare", ar: "Ø¹Ù†Ø§ÙŠØ© Ø¢Ù…Ù†Ø© Ù„Ù„Ø­Ù…Ù„", shopifyQuery: "tag:pregnancy AND tag:skincare" },
      { en: "Hair & Scalp Care", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±", shopifyQuery: "tag:pregnancy AND product_type:Shampoo" },
      { en: "Supplements & Fertility", ar: "Ø§Ù„Ù…ÙƒÙ…Ù„Ø§Øª ÙˆØ§Ù„Ø®ØµÙˆØ¨Ø©", shopifyQuery: "product_type:Supplements OR tag:prenatal" },
    ],
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "Ø¨Ø¹Ø¯ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©",
    icon: Sparkles,
    color: "text-accent",
    shopifyQuery: "product_type:Breast Pump OR tag:breastfeeding OR tag:nursing OR product_type:Nursing",
    categories: [
      { en: "Breast Pumps & Accessories", ar: "Ù…Ø¶Ø®Ø§Øª Ø§Ù„Ø«Ø¯ÙŠ ÙˆØ§Ù„Ø¥ÙƒØ³Ø³ÙˆØ§Ø±Ø§Øª", shopifyQuery: "product_type:Breast Pump" },
      { en: "Nursing Accessories", ar: "Ù…Ù„Ø­Ù‚Ø§Øª Ø§Ù„Ø±Ø¶Ø§Ø¹Ø©", shopifyQuery: "tag:nursing" },
      { en: "Nipple Care", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø­Ù„Ù…Ø§Øª", shopifyQuery: "tag:nipple" },
      { en: "Body Recovery", ar: "Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ø¬Ø³Ù…", shopifyQuery: "tag:postpartum" },
    ],
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "Ø§Ù„Ø³Ù†ÙˆØ§Øª Ø§Ù„Ø£ÙˆÙ„Ù‰",
    icon: Baby,
    color: "text-primary",
    shopifyQuery: "product_type:Baby Powder OR product_type:Baby Oil OR product_type:Baby Shampoo OR product_type:Baby Cream OR product_type:Baby Lotion OR product_type:Baby Wash OR product_type:Baby Towel OR product_type:Baby Clothes",
    categories: [
      { en: "Bath & Hygiene", ar: "Ø§Ù„Ø§Ø³ØªØ­Ù…Ø§Ù… ÙˆØ§Ù„Ù†Ø¸Ø§ÙØ©", shopifyQuery: "product_type:Baby Shampoo OR product_type:Baby Wash OR product_type:Baby Towel" },
      { en: "Skin Care", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©", shopifyQuery: "product_type:Baby Cream OR product_type:Baby Lotion OR product_type:Baby Oil" },
      { en: "Diaper Changing", ar: "ØªØºÙŠÙŠØ± Ø§Ù„Ø­ÙØ§Ø¶", shopifyQuery: "product_type:Baby Powder" },
      { en: "Clothing", ar: "Ø§Ù„Ù…Ù„Ø§Ø¨Ø³", shopifyQuery: "product_type:Baby Clothes" },
    ],
  },
  {
    id: "essentials",
    en: "Maternity Essentials",
    ar: "Ø£Ø³Ø§Ø³ÙŠØ§Øª Ø§Ù„Ø£Ù…ÙˆÙ…Ø©",
    icon: ShoppingBag,
    color: "text-burgundy",
    shopifyQuery: "product_type:Baby Carrier OR product_type:Baby Stroller OR product_type:Baby Gift Set OR product_type:Baby Bag OR tag:maternity",
    categories: [
      { en: "Carriers & Strollers", ar: "Ø§Ù„Ø­Ø§Ù…Ù„Ø§Øª ÙˆØ§Ù„Ø¹Ø±Ø¨Ø§Øª", shopifyQuery: "product_type:Baby Carrier OR product_type:Baby Stroller" },
      { en: "Gift Sets & Bundles", ar: "Ø£Ø·Ù‚Ù… Ø§Ù„Ù‡Ø¯Ø§ÙŠØ§", shopifyQuery: "product_type:Baby Gift Set" },
      { en: "Bags & Travel", ar: "Ø­Ù‚Ø§Ø¦Ø¨ Ø§Ù„Ø³ÙØ±", shopifyQuery: "product_type:Baby Bag" },
      { en: "Thermometers & Monitors", ar: "Ù…ÙˆØ§Ø²ÙŠÙ† Ø§Ù„Ø­Ø±Ø§Ø±Ø© ÙˆØ§Ù„Ù…Ø±Ø§Ù‚Ø¨Ø©", shopifyQuery: "tag:thermometer OR tag:monitor" },
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
            to={`/products?q=${encodeURIComponent(cat.shopifyQuery)}`}
            className="group rounded-xl border border-border bg-card p-4 text-start hover:border-accent/50 hover:shadow-warm transition-all duration-300"
          >
            <span className="block text-sm font-body font-medium text-foreground group-hover:text-primary transition-colors">
              {isAr ? cat.ar : cat.en}
            </span>
          </Link>
        ))}
      </div>

      {/* Featured products â€” real Shopify data */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {isAr ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ø­Ø§Ù„ÙŠØ§Ù‹" : "No products available yet"}
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
                    {isAr ? "Ø¹Ø±Ø¶" : "View"}
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

