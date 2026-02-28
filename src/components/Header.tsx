import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchDropdown } from "./SearchDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { User as UserType } from "@supabase/supabase-js";

// 3-Click Solution: Hover Brands/Concerns → Select item → Collection page. Mega Menu = "Morning Spa" nav for 5,000 SKUs.
const megaMenus = {
  brands: [
    { name: "Vichy", href: "/brands/vichy", label: "Dermocosmetic" },
    { name: "La Roche-Posay", href: "/brands/laroche", label: "Dermocosmetic" },
    { name: "CeraVe", href: "/brands/cerave", label: "Daily Care" },
    { name: "Maybelline", href: "/brands/maybelline", label: "Makeup" },
    { name: "L'Oréal Paris", href: "/brands/loreal", label: "Hair & Skin" },
    { name: "Garnier", href: "/brands/garnier", label: "Natural" },
  ],
  concerns: [
    { name: "Acne & Blemishes", href: "/concerns/acne", icon: "✨" },
    { name: "Anti-Aging & Wrinkles", href: "/concerns/anti-aging", icon: "⏳" },
    { name: "Dryness & Hydration", href: "/concerns/dryness", icon: "💧" },
    {
      name: "Sensitivity & Redness",
      href: "/concerns/sensitivity",
      icon: "🛡️",
    },
    { name: "Pigmentation", href: "/concerns/pigmentation", icon: "☀️" },
    { name: "Hair Loss", href: "/concerns/hair-loss", icon: "💆‍♀️" },
  ],
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlistItems = useWishlistStore((s) => s.items);
  const setWishlistOpen = useWishlistStore((s) => s.setOpen);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      },
    );
    supabase.auth.getSession().then(({ data: { session } }) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. TOP ANNOUNCEMENT BAR: "The Promise" */}
      <div className="bg-maroon text-white text-xs font-body font-medium py-2 text-center tracking-wide">
        <p>
          {language === "ar"
            ? "توصيل مجاني للطلبات فوق 50 د.أ • أصالة معتمدة من الصيدلي"
            : "Free Delivery on Orders Over 50.00 JOD • Pharmacist Verified Authentic"}
        </p>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={cn(
          "w-full transition-all duration-300 border-b border-gray-100",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-soft-ivory",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* LEFT: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="lg:hidden p-2 text-dark-charcoal hover:text-maroon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen
                  ? <X className="h-5 w-5" />
                  : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/" className="flex flex-col" dir="ltr">
                <span className="font-display text-2xl font-bold text-maroon tracking-tight">
                  ASPER
                </span>
                <span className="text-[10px] font-body tracking-[0.2em] text-dark-charcoal uppercase">
                  {language === "ar" ? "متجر الجمال" : "Beauty Shop"}
                </span>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation (3-Click Solution) */}
            <nav className="hidden lg:flex items-center gap-8 h-full">
              {/* Brands Mega Menu */}
              <div
                className="group relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu("brands")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  to="/brands"
                  className="flex items-center gap-1 font-body text-sm font-medium text-dark-charcoal hover:text-maroon transition-colors py-8"
                >
                  {language === "ar" ? "العلامات" : "Brands"}{" "}
                  <ChevronDown className="h-3 w-3" />
                </Link>
                {activeMegaMenu === "brands" && (
                  <div className="absolute top-full left-0 w-[600px] bg-white shadow-xl border-t-2 border-shiny-gold p-6 grid grid-cols-2 gap-4 animate-fade-in rounded-b-sm z-50">
                    {megaMenus.brands.map((brand) => (
                      <Link
                        key={brand.name}
                        to={brand.href}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-soft-ivory group/item transition-colors"
                      >
                        <span className="font-display font-medium text-dark-charcoal group-hover/item:text-maroon">
                          {brand.name}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {brand.label}
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-2 pt-4 border-t border-gray-100 text-center">
                      <Link
                        to="/brands"
                        className="text-xs font-bold text-maroon hover:underline uppercase tracking-widest"
                      >
                        {language === "ar"
                          ? "عرض كل العلامات 50+"
                          : "View All 50+ Brands"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Concerns Mega Menu */}
              <div
                className="group relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu("concerns")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  to="/skin-concerns"
                  className="flex items-center gap-1 font-body text-sm font-medium text-dark-charcoal hover:text-maroon transition-colors py-8"
                >
                  {language === "ar" ? "مشاكل البشرة" : "Skin Concerns"}{" "}
                  <ChevronDown className="h-3 w-3" />
                </Link>
                {activeMegaMenu === "concerns" && (
                  <div className="absolute top-full left-0 min-w-[320px] w-[500px] bg-white shadow-xl border-t-2 border-shiny-gold p-6 grid grid-cols-1 gap-2 animate-fade-in rounded-b-sm z-50">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-maroon uppercase tracking-widest">
                        {language === "ar"
                          ? "وضع الاستشارة"
                          : "Consultation Mode"}
                      </span>
                    </div>
                    {megaMenus.concerns.map((concern) => (
                      <Link
                        key={concern.name}
                        to={concern.href}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-soft-ivory group/item transition-colors"
                      >
                        <span className="text-lg">{concern.icon}</span>
                        <span className="font-display font-medium text-dark-charcoal group-hover/item:text-maroon">
                          {concern.name}
                        </span>
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 text-center">
                      <Link
                        to="/skin-concerns"
                        className="text-xs font-bold text-shiny-gold hover:text-maroon transition-colors"
                      >
                        {language === "ar"
                          ? "ابدأ تحليل البشرة ←"
                          : "Start AI Skin Analysis →"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/best-sellers"
                className="font-body text-sm font-medium text-dark-charcoal hover:text-maroon transition-colors"
              >
                {language === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
              </Link>
              <Link
                to="/offers"
                className="font-body text-sm font-medium text-maroon hover:text-shiny-gold transition-colors"
              >
                {language === "ar" ? "العروض" : "Offers"}
              </Link>
            </nav>

            {/* RIGHT: Search, Account, Wishlist, Cart, Language */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search (expandable, wired to SearchDropdown) */}
              <div className="hidden md:flex items-center bg-white/50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-shiny-gold focus-within:ring-1 focus-within:ring-shiny-gold transition-all w-48 focus-within:w-64">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={language === "ar"
                    ? "ابحث في آلاف المنتجات..."
                    : "Search 5,000+ items..."}
                  className="bg-transparent border-none outline-none text-xs ml-2 w-full placeholder:text-gray-400 text-dark-charcoal font-body"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
              <SearchDropdown
                isOpen={searchFocused}
                onClose={() => setSearchFocused(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <button
                type="button"
                className="md:hidden p-2 text-dark-charcoal hover:text-maroon"
                onClick={() => setMobileSearchFocused(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant"))}
                className="hidden md:block p-2 text-dark-charcoal hover:text-maroon transition-colors"
                aria-label={language === "ar" ? "استشارة الصيدلي" : "Ask the Pharmacist"}
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <Link
                to={user ? "/account" : "/auth"}
                className="hidden md:block p-2 text-dark-charcoal hover:text-maroon transition-colors"
                aria-label={user ? "Account" : "Sign in"}
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="hidden md:block relative p-2 text-dark-charcoal hover:text-maroon transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white ring-2 ring-white">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-dark-charcoal hover:text-maroon transition-colors group"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white ring-2 ring-white group-hover:bg-shiny-gold transition-colors">
                  {totalItems}
                </span>
              </button>
              <LanguageSwitcher variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search (full width, when opened via SearchDropdown) */}
      {mobileSearchFocused && (
        <div className="md:hidden border-t border-gray-100 bg-white p-3">
          <div className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {}}
              placeholder={language === "ar"
                ? "ابحث في المنتجات..."
                : "Search 5,000+ items..."}
              className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 text-dark-charcoal font-body text-sm"
              dir={isRTL ? "rtl" : "ltr"}
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <SearchDropdown
            isOpen={mobileSearchFocused}
            onClose={() => setMobileSearchFocused(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isMobile
          />
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={cn(
              "absolute top-0 h-[calc(100vh-80px)] w-full max-w-sm bg-white border-t border-gray-100 shadow-xl overflow-y-auto p-4 animate-fade-in",
              isRTL ? "right-0" : "left-0",
            )}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-maroon">
                  {language === "ar" ? "تسوق حسب العلامة" : "Shop by Brand"}
                </h3>
                {megaMenus.brands.slice(0, 4).map((b) => (
                  <Link
                    key={b.name}
                    to={b.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-dark-charcoal border-b border-gray-50 font-body"
                  >
                    {b.name}
                  </Link>
                ))}
                <Link
                  to="/brands"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-maroon font-bold text-sm"
                >
                  {language === "ar" ? "عرض كل العلامات" : "View All Brands"}
                </Link>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-maroon">
                  {language === "ar" ? "مشاكل البشرة" : "Skin Concerns"}
                </h3>
                {megaMenus.concerns.map((c) => (
                  <Link
                    key={c.name}
                    to={c.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-dark-charcoal border-b border-gray-50 font-body"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-beauty-assistant"));
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full py-2 text-dark-charcoal font-body border-b border-gray-50 text-left"
              >
                <MessageCircle className="h-4 w-4 text-maroon" />
                {language === "ar" ? "اسأل الصيدلي" : "Ask the Pharmacist"}
              </button>
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                <Link
                  to="/best-sellers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-maroon font-medium"
                >
                  {language === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
                </Link>
                <Link
                  to="/offers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-maroon font-medium"
                >
                  {language === "ar" ? "العروض" : "Offers"}
                </Link>
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-dark-charcoal"
                >
                  {user
                    ? (language === "ar" ? "حسابي" : "My Account")
                    : (language === "ar" ? "تسجيل الدخول" : "Sign In")}
                </Link>
              </div>
              <div className="pt-4">
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
      <WishlistDrawer />
    </header>
  );
};
