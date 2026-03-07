import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface StickyAddToCartProps {
  productTitle: string;
  price: number;
  onAddToCart: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export const StickyAddToCart = ({ productTitle, price, onAddToCart, triggerRef }: StickyAddToCartProps) => {
  const [visible, setVisible] = useState(false);
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px or past the trigger element
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setVisible(rect.bottom < 0);
      } else {
        setVisible(window.scrollY > 500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerRef]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--background))] border-t border-border/50 shadow-[0_-4px_20px_-4px_hsl(var(--foreground)/0.08)] backdrop-blur-sm transition-transform duration-300 animate-in slide-in-from-bottom-4">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-semibold text-foreground truncate">{productTitle}</p>
          <p className="text-xs font-body text-burgundy font-medium">
            {price.toFixed(3)} JD
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onAddToCart}
          variant="luxury"
          size="sm"
          className="shrink-0 px-6"
        >
          <ShoppingBag className="w-4 h-4 me-2" />
          {isArabic ? "أضف للحقيبة" : "Add to Bag"}
        </Button>
      </div>
    </div>
  );
};
