import { Link } from "react-router-dom";
import { Globe, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import asperLogo from "@/assets/asper-lotus-logo.png";
import BrandIcon from "@/components/brand/BrandIcon";
import SearchBar from "@/components/home/SearchBar";
import AuthButton from "@/components/AuthButton";

export const Header = () => {
  const { locale, toggle, t, dir } = useLanguage();
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-accent/10 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with scroll shrink */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={asperLogo}
              alt="Asper"
              className={cn(
                "w-auto transition-all duration-500 ease-luxury",
                scrolled ? "h-6" : "h-8"
              )}
            />
            <span
              className={cn(
                "text-xs font-body uppercase tracking-[0.25em] text-muted-foreground mt-1 transition-all duration-500",
                scrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              Beauty Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors font-body">
              {t("nav.shop")}
            </Link>
            <Link to="/mom-baby" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors font-body">
              {locale === "ar" ? "الأم والطفل" : "Mom & Baby"}
            </Link>
            <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors font-body">
              Products
            </Link>
            <Link to="/intelligence" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors font-body">
              {t("nav.intelligence")}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <BrandIcon icon="globe" onClick={toggle} ariaLabel="Switch language" />
            <SearchBar />
            <BrandIcon
              icon="cart"
              notificationCount={itemCount}
              onClick={() => {}}
              ariaLabel="Open cart"
            />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
