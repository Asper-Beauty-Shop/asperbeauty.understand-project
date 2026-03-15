/**
 * SupabaseProductCard — "Digital Tray" product card for Supabase catalog products.
 *
 * Distinct from ProductCard.tsx (which renders Shopify Storefront API products).
 * This card is used wherever products come directly from the Supabase `products` table:
 *  - AI concierge recommendations (DigitalTray)
 *  - Supabase-driven catalog grids
 *  - search_products_for_ai RAG results
 *
 * Design: Medical Luxury — Tailwind tokens only, no raw hex codes.
 * RTL: Tailwind logical properties throughout (ps/pe/ms/me/start/end/text-start).
 */

import { Link } from "react-router-dom";
import { ShoppingBag, Star, FlaskConical } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD } from "@/lib/productImageUtils";
import { cn } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

interface SupabaseProductCardProps {
  product: CatalogProduct;
  /** Show concern badge over image (default: true) */
  showConcernBadge?: boolean;
}

/** Map raw primary_concern enum values to display labels */
function formatConcern(concern: string): string {
  return concern.replace(/^Concern_/, "").replace(/_/g, " ");
}

export function SupabaseProductCard({
  product,
  showConcernBadge = true,
}: SupabaseProductCardProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);

  const isOutOfStock =
    (product.inventory_total ?? 0) <= 0 ||
    product.availability_status === "Pending_Purge";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || !product.handle) return;
    addItem({
      product: {
        node: {
          id: product.id,
          title: product.title ?? product.brand,
          handle: product.handle ?? "",
          vendor: product.brand,
          productType: product.asper_category ?? "",
          images: { edges: product.image_url ? [{ node: { url: product.image_url, altText: product.title ?? product.brand } }] : [] },
          priceRange: { minVariantPrice: { amount: String(product.price), currencyCode: "JOD" } },
          variants: { edges: [] },
          options: [],
          description: "",
        },
      },
      variantId: product.id,
      variantTitle: product.title ?? product.brand,
      price: { amount: String(product.price), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: [],
    });
    setCartOpen(true);
  };

  const productPath = product.handle ? `/product/${product.handle}` : "#";
  const displayTitle = product.title ?? product.brand;
  const priceLabel = formatJOD(product.price);

  return (
    <div
      className={cn(
        // Digital Tray base
        "group flex flex-col bg-white rounded-xl shadow-sm h-full",
        "border border-transparent hover:border-polished-gold/40 transition-all duration-300",
        // Gold Stitch tier gets permanent gold border
        product.gold_stitch_tier && "border-polished-gold/30",
        isOutOfStock && "opacity-70",
      )}
    >
      {/* ── Image ──────────────────────────────────────────────────── */}
      <Link
        to={productPath}
        className="relative aspect-square w-full overflow-hidden bg-background rounded-t-xl block"
        tabIndex={isOutOfStock ? -1 : 0}
        aria-label={isAr ? `عرض ${displayTitle}` : `View ${displayTitle}`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={displayTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FlaskConical className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Concern badge */}
        {showConcernBadge && product.primary_concern && (
          <div className="absolute top-3 start-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-polished-gold/30">
            <span className="text-[10px] font-body tracking-widest uppercase text-primary">
              {formatConcern(product.primary_concern)}
            </span>
          </div>
        )}

        {/* Best Seller badge */}
        {product.is_bestseller && (
          <div className="absolute top-3 end-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="h-2.5 w-2.5 fill-current" />
            <span className="text-[10px] font-body tracking-wider uppercase">
              {isAr ? "الأكثر مبيعاً" : "Best Seller"}
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-t-xl">
            <span className="text-xs font-body uppercase tracking-widest text-muted-foreground border border-muted-foreground/30 px-3 py-1 rounded-full">
              {isAr ? "غير متوفر" : "Out of Stock"}
            </span>
          </div>
        )}
      </Link>

      {/* ── Details ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-grow p-4 text-start">
        {/* Brand / Category */}
        <span className="text-[11px] font-body uppercase tracking-wider text-muted-foreground mb-1.5 block">
          {product.brand}
          {product.asper_category && (
            <span className="text-polished-gold/70"> · {product.asper_category}</span>
          )}
        </span>

        {/* Title */}
        <Link to={productPath} className="mb-1">
          <h3 className="font-heading text-foreground text-base font-semibold leading-snug line-clamp-2 hover:text-primary transition-colors">
            {displayTitle}
          </h3>
        </Link>

        {/* Pharmacist note */}
        {product.pharmacist_note && (
          <p className="text-[11px] font-body text-muted-foreground italic line-clamp-1 mb-2">
            {product.pharmacist_note}
          </p>
        )}

        {/* Clinical badge */}
        {product.clinical_badge && (
          <span className="inline-flex items-center gap-1 text-[10px] font-body uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 rounded-full px-2 py-0.5 w-fit mb-2">
            <FlaskConical className="h-2.5 w-2.5" />
            {product.clinical_badge}
          </span>
        )}

        <div className="flex-grow" />

        {/* Price & Add to Cart */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-body text-foreground font-semibold text-base">
            {priceLabel}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isAr
                ? `أضف ${displayTitle} إلى السلة`
                : `Add ${displayTitle} to cart`
            }
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
    </div>
  );
}
