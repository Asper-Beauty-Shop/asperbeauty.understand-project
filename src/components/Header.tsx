import { Link } from "react-router-dom";
import { ShoppingBag, Search, User, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";

export const Header = () => {
  const { locale, toggle, t } = useLanguage();
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-bold text-primary tracking-wide">
          ASPER
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/shop" className="text-foreground/80 hover:text-primary transition-colors">{t("nav.shop")}</Link>
          <Link to="/lab" className="text-foreground/80 hover:text-primary transition-colors">{t("nav.intelligence")}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 text-foreground/60 hover:text-accent transition-colors" aria-label="Toggle language">
            <Globe className="w-5 h-5" />
          </button>
          <Link to="/auth" className="p-2 text-foreground/60 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/shop" className="p-2 text-foreground/60 hover:text-primary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
