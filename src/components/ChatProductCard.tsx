import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ShoppingBag, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD } from "@/lib/productImageUtils";

export interface ChatProduct {
  id: string;
  title?: string;
  brand?: string | null;
  price?: number | null;
  original_price?: number | null;
  is_on_sale?: boolean | null;
  discount_percent?: number | null;
  image_url?: string | null;
  category?: string | null;
  skin_concerns?: string[] | null;
}

interface ChatProductCardProps {
  product: ChatProduct;
  onAddToCart?: (product: ChatProduct) => void;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onAddToCart }) => {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-2.5 transition-all hover:border-accent/40 hover:shadow-sm">
      {/* Image */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted/30">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title || ""} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-5 w-5 text-muted-foreground/40" />
          </div>
        )}
        {product.is_on_sale && (
          <div className="absolute -right-1 -top-1 rounded-full bg-destructive px-1 py-0.5 text-[8px] font-bold text-destructive-foreground">
            {product.discount_percent ? `-${product.discount_percent}%` : "SALE"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {product.brand || product.category || ""}
        </p>
        <p className="text-xs font-medium text-foreground line-clamp-1">{product.title || "Product"}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-semibold text-primary">{formatJOD(product.price ?? 0)}</span>
          {product.original_price && (
            <span className="text-[10px] text-muted-foreground line-through">{formatJOD(product.original_price)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1">
        <Link
          to={`/product/${product.id}`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <ExternalLink className="h-3 w-3" />
        </Link>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatProductCard;
