/**
 * ElegantProductGrid
 * Editorial masonry-style grid with a hero feature card + responsive tile grid.
 * Supports bilingual EN/AR, hover overlays, staggered animations, and category filter pills.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Heart, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BlurUpImage } from "@/components/BlurUpImage";

// Shared ease — cast to satisfy framer-motion's EasingDefinition
const LUXURY_EASE = [0.19, 1, 0.22, 1] as unknown as number[];

export interface ElegantProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  price: number;
  original_price?: number;
  image_url: string;
  tag?: string;
  category?: string;
  is_new?: boolean;
}

interface ElegantProductGridProps {
  products: ElegantProduct[];
  title?: { en: string; ar: string };
  subtitle?: { en: string; ar: string };
  showCategoryFilter?: boolean;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: LUXURY_EASE, delay: i * 0.07 },
  }),
};

function formatPrice(price: number) {
  return `JOD ${price.toFixed(2)}`;
}

function ProductTile({
  product,
  index,
  featured = false,
}: {
  product: ElegantProduct;
  index: number;
  featured?: boolean;
}) {
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const isAr = locale === "ar";
  const [wishlist, setWishlist] = useState(false);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <motion.div
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "group relative overflow-hidden bg-asper-stone border border-border/50",
        "hover:border-polished-gold/30 transition-all duration-500",
        "hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image */}
      <Link to={`/product/${product.handle}`} className="block">
        <div className={cn(
          "relative overflow-hidden bg-asper-stone-dark",
          featured ? "aspect-[3/2] md:aspect-[16/10]" : "aspect-[4/5]"
        )}>
          <BlurUpImage
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Quick actions */}
          <div className={cn(
            "absolute bottom-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400",
            isAr ? "right-4 flex-row-reverse" : "left-4"
          )}>
            {/* View button — navigates to PDP */}
            <button
              onClick={(e) => { e.preventDefault(); navigate(`/product/${product.handle}`); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-dark-charcoal font-body text-[11px] uppercase tracking-[0.2em] hover:bg-polished-gold hover:text-white transition-colors duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              {isAr ? "عرضي" : "View"}
            </button>
          </div>

          {/* Wishlist — positioned left in AR to avoid badge overlap */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist((v) => !v); }}
            className={cn(
              "absolute top-3 w-8 h-8 flex items-center justify-center",
              "bg-white/10 backdrop-blur-sm border border-white/20",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-white hover:border-transparent hover:text-burgundy",
              isAr ? "left-3" : "right-3"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={cn("w-4 h-4 transition-colors duration-200", wishlist ? "fill-burgundy text-burgundy" : "text-white")}
            />
          </button>

          {/* Badges — always on the opposite side from wishlist */}
          <div className={cn("absolute top-3 flex flex-col gap-1.5", isAr ? "right-3" : "left-3")}>
            {product.is_new && (
              <span className="px-2.5 py-1 bg-burgundy text-white font-body text-[9px] uppercase tracking-[0.25em]">
                {isAr ? "جديد" : "New"}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="px-2.5 py-1 bg-polished-gold text-white font-body text-[9px] font-semibold">
                -{discount}%
              </span>
            )}
            {product.tag && !product.is_new && (
              <span className="px-2.5 py-1 bg-white/90 text-dark-charcoal font-body text-[9px] uppercase tracking-[0.2em]">
                {product.tag}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className={cn("p-4 md:p-5", isAr && "text-right")}>
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-polished-gold mb-1">
          {product.brand}
        </p>
        <h3 className={cn(
          "font-display text-dark-charcoal leading-tight mb-3 line-clamp-2",
          featured ? "text-lg md:text-xl" : "text-[14px] md:text-[15px]"
        )}>
          {product.title}
        </h3>
        <div className={cn("flex items-center gap-2", isAr && "flex-row-reverse")}>
          <span className="font-body text-[13px] font-semibold text-dark-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="font-body text-[11px] text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ElegantProductGrid({
  products,
  title = { en: "Featured Products", ar: "المنتجات المميزة" },
  subtitle = { en: "Shop Our Collection", ar: "تسوقي مجموعتنا" },
  showCategoryFilter = true,
}: ElegantProductGridProps) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  // Derive unique categories with proper type narrowing
  const categories: string[] = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))),
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <section className="py-20 md:py-28 bg-soft-ivory">
      <div className="luxury-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
          className="mb-12 text-center"
        >
          <p className="luxury-subheading text-polished-gold mb-3">
            {isAr ? subtitle.ar : subtitle.en}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-dark-charcoal mb-5">
            {isAr ? title.ar : title.en}
          </h2>
          <div className="luxury-divider" />
        </motion.div>

        {/* Category Filter Pills */}
        {showCategoryFilter && categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 font-body text-[11px] uppercase tracking-[0.25em] border transition-all duration-300",
                  activeCategory === cat
                    ? "bg-burgundy border-burgundy text-white"
                    : "bg-transparent border-border/50 text-muted-foreground hover:border-polished-gold hover:text-dark-charcoal"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-auto"
          >
            {filtered.length === 0 ? (
              <div className="col-span-4 py-20 text-center">
                <p className="font-body text-sm text-muted-foreground">
                  {isAr ? "لا توجد منتجات في هذه الفئة" : "No products in this category."}
                </p>
              </div>
            ) : (
              <>
                {featured && (
                  <ProductTile key={featured.id} product={featured} index={0} featured />
                )}
                {rest.map((product, i) => (
                  <ProductTile key={product.id} product={product} index={i + 1} />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: LUXURY_EASE, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-dark-charcoal/30 text-dark-charcoal font-body text-[11px] uppercase tracking-[0.3em] hover:bg-dark-charcoal hover:text-white transition-all duration-400"
          >
            {isAr ? "عرض جميع المنتجات" : "View All Products"}
            <ArrowRight className={cn("w-4 h-4 transition-transform duration-300 group-hover:translate-x-1", isAr && "rotate-180")} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
