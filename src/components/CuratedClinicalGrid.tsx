/**
 * CuratedClinicalGrid
 * "Frosted Clinical Glass" architecture — Morning Spa × Authentic Quality
 *
 * Brand tokens (strict):
 *   Soft Ivory   #F8F8FF   — glass base
 *   Shiny Gold   #C5A028   — validation / interactive borders
 *   Deep Maroon  #800020   — primary action
 *   Dark Charcoal #333333  — readability
 *
 * RTL: all spacing/borders use Tailwind logical properties (ps-, pe-, ms-, me-, border-s-, text-start…)
 * Grid: flex flex-col h-full + mt-auto → buttons always pin to bottom regardless of title length
 */

import { Link } from "react-router-dom";
import { BlurUpImage } from "@/components/BlurUpImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface ClinicalProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  category?: string;
  price: number;
  original_price?: number;
  image_url: string;
  tag?: string;
}

interface CuratedClinicalGridProps {
  products: ClinicalProduct[];
  title?: { en: string; ar: string };
}

function formatPrice(price: number) {
  return `JOD ${price.toFixed(2)}`;
}

function ClinicalCard({ product }: { product: ClinicalProduct }) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <article
      className={cn(
        // Base structure — flex column so mt-auto pins price+button to bottom
        "relative flex flex-col h-full overflow-hidden rounded-xl p-4 md:p-5 z-10 group",
        // Glassmorphism engine
        "bg-[#F8F8FF]/60 border border-[#C5A028]/30",
        "backdrop-blur-sm md:backdrop-blur-md",
        // Shadow & transition
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]",
        "transition-all duration-[400ms] ease-out",
        // Desktop hover — Midas Touch
        "md:hover:border-[#C5A028] md:hover:-translate-y-1 md:hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]",
        // Mobile tactile tap — physical weight
        "active:border-[#C5A028] active:scale-[0.98] active:bg-[#F8F8FF]/80"
      )}
    >
      {/* Discount badge */}
      {discount && discount > 0 && (
        <span className="absolute top-3 end-3 z-20 px-2 py-0.5 bg-[#800020] text-white font-montserrat text-[9px] font-semibold rounded-sm uppercase tracking-wide">
          -{discount}%
        </span>
      )}
      {product.tag && !discount && (
        <span className="absolute top-3 start-3 z-20 px-2 py-0.5 bg-[#C5A028] text-white font-montserrat text-[9px] font-semibold rounded-sm uppercase tracking-wide">
          {product.tag}
        </span>
      )}

      {/* Image — strict 4:5 aspect for uniform grid lines */}
      <Link to={`/product/${product.handle}`} tabIndex={-1} aria-hidden="true">
        <div className="relative w-full aspect-[4/5] mb-4 bg-white/50 rounded-lg overflow-hidden mix-blend-multiply">
          <BlurUpImage
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-[500ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      {/* Metadata — brand / category */}
      <p className={cn(
        "text-xs font-montserrat text-[#333333]/60 uppercase tracking-wider mb-1",
        isAr ? "text-end" : "text-start"
      )}>
        {product.brand}{product.category ? ` · ${product.category}` : ""}
      </p>

      {/* Title — 2-line clamp enforces uniform row height */}
      <Link to={`/product/${product.handle}`}>
        <h3 className={cn(
          "font-montserrat text-[#333333] font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2",
          "hover:text-[#800020] transition-colors duration-200",
          isAr ? "text-end" : "text-start"
        )}>
          {product.title}
        </h3>
      </Link>

      {/* Spacer — pushes price + button to bottom of every card */}
      <div className="mt-auto">
        {/* Price */}
        <div className={cn("flex items-baseline gap-2 pb-3", isAr ? "flex-row-reverse justify-end" : "")}>
          <span className="font-montserrat text-[#800020] font-bold text-lg leading-none">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="font-montserrat text-[#333333]/40 text-sm line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Quick Add button */}
        <Link to={`/product/${product.handle}`}>
          <button className="w-full py-3 bg-[#800020] text-white font-montserrat font-semibold text-sm rounded transition-all duration-[400ms] group-hover:bg-[#5a0016] active:scale-[0.98]">
            {locale === "ar" ? "إضافة سريعة" : "Quick Add"}
          </button>
        </Link>
      </div>
    </article>
  );
}

export function CuratedClinicalGrid({
  products,
  title = { en: "Curated Clinical Solutions", ar: "حلول سريرية مختارة" },
}: CuratedClinicalGridProps) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  if (!products.length) return null;

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-br from-[#F8F8FF] to-white overflow-hidden">

      {/* Optical depth blob — gives the glass something to refract */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[60vw] h-[60vw] max-w-3xl max-h-3xl rounded-full bg-[#F8F8FF] blur-[100px] opacity-40 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">

        {/* Section header */}
        <h2 className={cn(
          "font-playfair text-[#800020] text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight",
          isAr && "font-arabic"
        )}>
          {isAr ? title.ar : title.en}
        </h2>

        {/* Precision grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {products.map((product) => (
            <ClinicalCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
