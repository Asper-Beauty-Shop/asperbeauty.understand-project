/**
 * ProductCard — General-purpose product card for Asper Beauty Shop.
 *
 * Features: discount/compare price, star rating, wishlist button, in/out-of-stock badge.
 * Design: Medical Luxury — Tailwind tokens only, RTL logical properties throughout.
 * Pricing: JOD (Jordanian Dinar) via formatJOD().
 *
 * Use SupabaseProductCard when rendering directly from the Supabase catalog hook.
 * Use this card when you have a shaped product object (Shopify, AI results, manual data).
 */

import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/prefetchRoute";
import { ShoppingBag, Heart, FlaskConical } from "lucide-react";
import { formatJOD } from "@/lib/productImageUtils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductCardData {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  /** Original price — shown struck-through when present and higher than price */
  compareAtPrice?: number | null;
  image?: string | null;
  /** URL handle: /product/{handle} */
  handle?: string | null;
  inStock?: boolean;
  /** Integer 1–5 */
  rating?: number | null;
  reviewsCount?: number | null;
  isBestseller?: boolean;
  /** Pharmacist-verified product — shows gold "Pharmacist Vetted" badge */
  isVetted?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
  /** Whether the item is in the user's wishlist (fills the heart) */
  wishlisted?: boolean;
  className?: string;
}

// ── Star Rating ────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count?: number | null }) {
  const full  = Math.min(Math.max(Math.round(rating), 0), 5);
  const empty = 5 - full;
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-polished-gold text-sm leading-none" aria-hidden>
        {"★".repeat(full)}{"☆".repeat(empty)}
      </span>
      {count != null && (
        <span className="font-body text-[11px] text-muted-foreground">
          ({count.toLocaleString(isAr ? "ar-JO" : "en-JO")} {isAr ? "تقييم" : "reviews"})
        </span>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  wishlisted = false,
  className,
}: ProductCardProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const inStock = product.inStock !== false; // default true if not set
  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const productPath = product.handle ? `/product/${product.handle}` : "#";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    onAddToCart?.(product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onWishlist?.(product.id);
  };

  return (
    <div
      className={cn(
        "group flex flex-col bg-white rounded-xl shadow-sm h-full",
        "border border-transparent hover:border-polished-gold/40 transition-all duration-300",
        !inStock && "opacity-70",
        className,
      )}
    >
      {/* ── Image ─────────────────────────────────────────────────── */}
      <Link
        to={productPath}
        onMouseEnter={() => prefetchRoute(productPath)}
        className="relative aspect-square w-full overflow-hidden bg-background rounded-t-xl block"
        tabIndex={!inStock ? -1 : 0}
        aria-label={isAr ? `عرض ${product.name}` : `View ${product.name}`}
      >
        {product.image ? (
          <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <FlaskConical className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Pharmacist Vetted badge */}
        {product.isVetted && (
          <div className="absolute top-3 start-3 z-10 flex items-center gap-1 bg-polished-gold/10 border border-polished-gold/30 px-2 py-0.5 rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-polished-gold" aria-hidden>
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            <span className="font-body text-[9px] uppercase tracking-wider text-foreground font-medium">
              {isAr ? "فحص صيدلاني" : "Pharmacist Vetted"}
            </span>
          </div>
        )}

        {/* Bestseller badge */}
        {product.isBestseller && !product.isVetted && (
          <div className="absolute top-3 start-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-body tracking-wider uppercase">
            {isAr ? "الأكثر مبيعاً" : "Best Seller"}
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 end-3 bg-polished-gold text-white px-2.5 py-1 rounded-full text-[10px] font-body font-semibold tracking-wider">
            {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% OFF
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-t-xl">
            <span className="text-xs font-body uppercase tracking-widest text-muted-foreground border border-muted-foreground/30 px-3 py-1 rounded-full">
              {isAr ? "غير متوفر" : "Out of Stock"}
            </span>
          </div>
        )}
      </Link>

      {/* ── Details ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-grow p-4 text-start gap-2">
        {/* Title */}
        <Link to={productPath}>
          <h3 className="font-heading text-foreground text-base font-semibold leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="font-body text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating != null && (
          <StarRating rating={product.rating} count={product.reviewsCount} />
        )}

        <div className="flex-grow" />

        {/* Price row + actions */}
        <div className="mt-1 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col leading-none">
            {hasDiscount && (
              <span className="font-body text-[11px] text-muted-foreground line-through">
                {formatJOD(product.compareAtPrice!)}
              </span>
            )}
            <span
              className={cn(
                "font-body font-semibold text-base",
                hasDiscount ? "text-primary" : "text-foreground",
              )}
            >
              {formatJOD(product.price)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist */}
            {onWishlist && (
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={isAr ? `أضف ${product.name} للمفضلة` : `Wishlist ${product.name}`}
                className={cn(
                  "flex items-center justify-center rounded-full w-9 h-9 shrink-0",
                  "border transition-colors duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-polished-gold focus:ring-offset-2",
                  wishlisted
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
              </button>
            )}

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={isAr ? `أضف ${product.name} إلى السلة` : `Add ${product.name} to cart`}
              className={cn(
                "flex items-center justify-center rounded-full w-9 h-9 shrink-0",
                "border border-primary text-primary",
                "hover:bg-primary hover:text-primary-foreground",
                "group-hover:border-polished-gold",
                "transition-colors duration-300",
                "focus:outline-none focus:ring-2 focus:ring-polished-gold focus:ring-offset-2",
                "disabled:opacity-40 disabled:pointer-events-none",
              )}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* In-stock inline indicator */}
        <span
          className={cn(
            "font-body text-[10px] uppercase tracking-widest",
            inStock ? "text-emerald-600" : "text-muted-foreground",
          )}
        >
          {inStock
            ? (isAr ? "متوفر في المخزون" : "In Stock")
            : (isAr ? "غير متوفر" : "Out of Stock")}
        </span>
      </div>
    </div>
  );
}
