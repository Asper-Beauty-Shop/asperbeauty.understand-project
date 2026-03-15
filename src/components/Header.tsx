import { useEffect, useRef, useState } from "react";
import asperLogoHorizontal from "@/assets/asper-logo-horizontal.png";
import { AsperWordmark } from "@/components/ui/AsperWordmark";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
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

const megaMenus = {
  brands: [
    { name: "Vichy", href: "/brands/vichy", label: "Dermocosmetic" },
    { name: "La Roche-Posay", href: "/brands/laroche", label: "Dermocosmetic" },
    { name: "CeraVe", href: "/brands/cerave", label: "Daily Care" },
    { name: "Maybelline", href: "/brands/maybelline", label: "Makeup" },
    { name: "L'OrÃ©al Paris", href: "/brands/loreal", label: "Hair & Skin" },
    { name: "Garnier", href: "/brands/garnier", label: "Natural" },
  ],
  concerns: [
    { name: "Acne & Blemishes", href: "/concerns/acne", icon: "âœ¨" },
    { name: "Anti-Aging & Wrinkles", href: "/concerns/anti-aging", icon: "â³" },
    { name: "Dryness & Hydration", href: "/concerns/dryness", icon: "ðŸ’§" },
    { name: "Sensitivity & Redness", href: "/concerns/sensitivity", icon: "ðŸ›¡ï¸" },
    { name: "Pigmentation", href: "/concerns/pigmentation", icon: "â˜€ï¸" },
    { name: "Hair Loss", href: "/concerns/hair-loss", icon: "ðŸ’†â€â™€ï¸" },
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
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
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

  // Always solid ivory background â€” text always visible
  const isTransparent = false;

  // Dynamic text color class â€” always dark on ivory
  const textColor = "text-burgundy";
  const textColorHover = "hover:text-polished-gold";
  const iconColor = "text-burgundy";

  return (
    <header className={cn("fixed top-0 z-50 w-full", isHomepage && "")}>
      {/* 1. TOP ANNOUNCEMENT BAR */}
                  <div className="bg-burgundy text-polished-white py-2 text-center text-[10px] uppercase tracking-[0.3em] font-bold">
        {language === "ar" 
          ? "الافتتاح الكبير اليوم الساعة 6:00 مساءً — اختبري الرفاهية الطبية" 
          : "Grand Opening Today at 6:00 PM — Experience Medical Luxury"}
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={cn(
          "w-full transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          isScrolled
            ? "bg-[#F8F8FF]/80 backdrop-blur-md border-b border-[#C5A028]/30 shadow-sm"
            : "bg-[#F8F8FF]/95 backdrop-blur-xl border-b border-[#C5A028]/20"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20">

            {/* 1. LEFT UTILITY ZONE â€” flex-1 balances the right zone */}
            <div className="flex-1 flex items-center justify-start gap-2 md:gap-4">
              <button
                type="button"
                className={cn("lg:hidden p-2 transition-colors", iconColor, textColorHover)}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8 h-full">
                {/* Brands Mega Menu */}
                <div
                  className="group relative h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu("brands")}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to="/brands"
                    className={cn(
                      "flex items-center gap-1 font-body text-sm font-medium transition-colors py-8",
                      textColor, textColorHover
                    )}
                  >
                    {language === "ar" ? "Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª" : "Brands"}{" "}
                    <ChevronDown className="h-3 w-3" />
                  </Link>
                  {activeMegaMenu === "brands" && (
                    <div className="absolute top-full left-0 w-[600px] bg-polished-white shadow-xl border-t-2 border-polished-gold p-6 grid grid-cols-2 gap-4 animate-fade-in rounded-b-sm z-50">
                      {megaMenus.brands.map((brand) => (
                        <Link
                          key={brand.name}
                          to={brand.href}
                          className="flex items-center justify-between p-3 rounded-md hover:bg-asper-stone group/item transition-colors"
                        >
                          <span className="font-display font-medium text-burgundy group-hover/item:text-polished-gold">
                            {brand.name}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {brand.label}
                          </span>
                        </Link>
                      ))}
                      <div className="col-span-2 mt-2 pt-4 border-t border-rose-clay-light/30 text-center">
                        <Link
                          to="/brands"
                          className="text-xs font-bold text-burgundy hover:underline uppercase tracking-widest"
                        >
                          {language === "ar" ? "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª 50+" : "View All 50+ Brands"}
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
                    className={cn(
                      "flex items-center gap-1 font-body text-sm font-medium transition-colors py-8",
                      textColor, textColorHover
                    )}
                  >
                    {language === "ar" ? "Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "Skin Concerns"}{" "}
                    <ChevronDown className="h-3 w-3" />
                  </Link>
                  {activeMegaMenu === "concerns" && (
                    <div className="absolute top-full left-0 min-w-[320px] w-[500px] bg-polished-white shadow-xl border-t-2 border-polished-gold p-6 grid grid-cols-1 gap-2 animate-fade-in rounded-b-sm z-50">
                      <div className="mb-2 pb-2 border-b border-rose-clay-light/30">
                        <span className="text-xs font-bold text-burgundy uppercase tracking-widest">
                          {language === "ar" ? "ÙˆØ¶Ø¹ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©" : "Consultation Mode"}
                        </span>
                      </div>
                      {megaMenus.concerns.map((concern) => (
                        <Link
                          key={concern.name}
                          to={concern.href}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-asper-stone group/item transition-colors"
                        >
                          <span className="text-lg">{concern.icon}</span>
                          <span className="font-display font-medium text-burgundy group-hover/item:text-polished-gold">
                            {concern.name}
                          </span>
                        </Link>
                      ))}
                      <div className="mt-2 pt-2 text-center">
                        <Link
                          to="/skin-concerns"
                          className="text-xs font-bold text-polished-gold hover:text-burgundy transition-colors"
                        >
                          {language === "ar" ? "Ø§Ø¨Ø¯Ø£ ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨Ø´Ø±Ø© â†" : "Start AI Skin Analysis â†’"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/best-sellers"
                  className={cn(
                    "font-body text-sm font-medium transition-colors",
                    textColor, textColorHover
                  )}
                >
                  {language === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
                </Link>
                <Link
                  to="/dermocosmetics"
                  className={cn(
                    "font-body text-sm font-medium transition-colors",
                    textColor, textColorHover
                  )}
                >
                  {language === "ar" ? "التجميل الطبي" : "Dermocosmetics"}
                </Link>
                <Link
                  to="/offers"
                  className={cn(
                    "font-body text-sm font-medium transition-colors",
                    textColor, textColorHover
                  )}
                >
                  {language === "ar" ? "العروض" : "Offers"}
                </Link>
              </nav>
            </div>

            {/* 2. CENTER BRAND ZONE â€” flex-shrink-0 keeps logo untouchable */}
            <div className="flex-shrink-0 flex items-center justify-center px-2 md:px-4">
              <Link to="/" className="block transition-transform duration-300 hover:scale-105" dir="ltr">
                <AsperWordmark
                  className={isTransparent ? "text-white after:bg-white" : "text-burgundy"}
                />
              </Link>
            </div>

            {/* 3. RIGHT UTILITY ZONE â€” flex-1 balances the left zone */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              {/* Desktop Search */}
              <div
                className={cn(
                  "hidden md:flex items-center rounded-full px-3 py-1.5 transition-all w-48 focus-within:w-64",
                  isTransparent
                    ? "bg-polished-white/10 border border-polished-white/20 focus-within:border-polished-gold focus-within:ring-1 focus-within:ring-polished-gold"
                    : "bg-polished-white/50 border border-rose-clay-light/40 focus-within:border-polished-gold focus-within:ring-1 focus-within:ring-polished-gold"
                )}
              >
                <Search className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={language === "ar" ? "Ø§Ø¨Ø­Ø« ÙÙŠ Ø¢Ù„Ø§Ù Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª..." : "Search 5,000+ items..."}
                  className={cn(
                    "bg-transparent border-none outline-none text-xs ml-2 w-full font-body",
                    isTransparent
                      ? "text-polished-white placeholder:text-polished-white/50"
                      : "text-foreground placeholder:text-muted-foreground"
                  )}
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
                className={cn("md:hidden p-2 transition-colors", iconColor, textColorHover)}
                onClick={() => setMobileSearchFocused(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Desktop Dual-Persona Consultation CTA */}
              <div className="hidden lg:flex items-center">
                <div className="flex items-center rounded-full border border-polished-gold/30 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant", { detail: { persona: "dr_sami" } }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-burgundy hover:bg-polished-gold/10 transition-all duration-300"
                    aria-label="Consult Dr. Sami"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-polished-gold" />
                    <span className="hidden xl:inline">{language === "ar" ? "د. سامي" : "Dr. Sami"}</span>
                    <span className="text-[9px] text-polished-gold/70 hidden xl:inline">{language === "ar" ? "عافية" : "Wellness"}</span>
                  </button>
                  <div className="w-px h-5 bg-polished-gold/20" />
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant", { detail: { persona: "ms_zain" } }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-burgundy hover:bg-polished-gold/10 transition-all duration-300"
                    aria-label="Chat with Ms. Zain"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-polished-gold" />
                    <span className="hidden xl:inline">{language === "ar" ? "مس زين" : "Ms. Zain"}</span>
                    <span className="text-[9px] text-polished-gold/70 hidden xl:inline">{language === "ar" ? "جمال" : "Beauty"}</span>
                  </button>
                </div>
              </div>
              {/* Mobile chat icon */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant"))}
                className={cn("lg:hidden p-2 transition-colors", iconColor, textColorHover)}
                aria-label="Dr.Bot"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <Link
                to={user ? "/account" : "/auth"}
                className={cn("hidden md:block p-2 transition-colors", iconColor, textColorHover)}
                aria-label={user ? "Account" : "Sign in"}
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className={cn("hidden md:block relative p-2 transition-colors", iconColor, textColorHover)}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-polished-white ring-2 ring-polished-white">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={cn("relative p-2 transition-colors group", iconColor, textColorHover)}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-polished-white ring-2 ring-polished-white group-hover:bg-polished-gold transition-colors">
                  {totalItems}
                </span>
              </button>
              <LanguageSwitcher variant="header" />
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchFocused && (
        <div className="md:hidden border-t border-rose-clay-light/30 bg-polished-white p-3">
          <div className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {}}
              placeholder={language === "ar" ? "Ø§Ø¨Ø­Ø« ÙÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª..." : "Search 5,000+ items..."}
              className="w-full px-4 py-2 pl-10 rounded-full border border-rose-clay-light/40 text-foreground font-body text-sm"
              dir={isRTL ? "rtl" : "ltr"}
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
        <div className="lg:hidden fixed inset-0 z-40" aria-hidden>
          <div
            className="absolute inset-0 bg-asper-ink/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={cn(
              "absolute top-0 h-[calc(100vh-80px)] w-full max-w-sm bg-polished-white border-t border-rose-clay-light/30 shadow-xl overflow-y-auto p-4 animate-fade-in",
              isRTL ? "right-0" : "left-0",
            )}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-burgundy">
                  {language === "ar" ? "ØªØ³ÙˆÙ‚ Ø­Ø³Ø¨ Ø§Ù„Ø¹Ù„Ø§Ù…Ø©" : "Shop by Brand"}
                </h3>
                {megaMenus.brands.slice(0, 4).map((b) => (
                  <Link
                    key={b.name}
                    to={b.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-burgundy border-b border-rose-clay-light/20 font-body"
                  >
                    {b.name}
                  </Link>
                ))}
                <Link
                  to="/brands"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-burgundy font-bold text-sm"
                >
                  {language === "ar" ? "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª" : "View All Brands"}
                </Link>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-burgundy">
                  {language === "ar" ? "Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "Skin Concerns"}
                </h3>
                {megaMenus.concerns.map((c) => (
                  <Link
                    key={c.name}
                    to={c.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-burgundy border-b border-rose-clay-light/20 font-body"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              {/* Dual-Persona Consultation Buttons — Mobile */}
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-burgundy">
                  {language === "ar" ? "استشارة ذكية" : "Smart Consultation"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-beauty-assistant", { detail: { persona: "dr_sami" } }));
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full py-3 px-3 rounded-lg bg-polished-gold/5 border border-polished-gold/20 hover:border-polished-gold/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-polished-gold/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-polished-gold" />
                  </div>
                  <div className="text-left">
                    <span className="block font-body text-sm font-semibold text-burgundy">
                      {language === "ar" ? "استشر د. سامي" : "Consult Dr. Sami"}
                    </span>
                    <span className="block font-body text-[10px] text-polished-gold uppercase tracking-wider">
                      {language === "ar" ? "عافية · مكملات · استشارة طبية" : "Wellness · Supplements · Clinical"}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-beauty-assistant", { detail: { persona: "ms_zain" } }));
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full py-3 px-3 rounded-lg bg-polished-gold/5 border border-polished-gold/20 hover:border-polished-gold/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-polished-gold/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-polished-gold" />
                  </div>
                  <div className="text-left">
                    <span className="block font-body text-sm font-semibold text-burgundy">
                      {language === "ar" ? "تحدثي مع مس زين" : "Chat with Ms. Zain"}
                    </span>
                    <span className="block font-body text-[10px] text-polished-gold uppercase tracking-wider">
                      {language === "ar" ? "جمال · مكياج · روتين يومي" : "Beauty · Makeup · Routines"}
                    </span>
                  </div>
                </button>
              </div>
              <div className="pt-4 border-t border-rose-clay-light/30 flex flex-wrap gap-4">
                <Link
                  to="/best-sellers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-burgundy font-medium"
                >
                  {language === "ar" ? "Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹" : "Best Sellers"}
                </Link>
                <Link
                  to="/offers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-burgundy font-medium"
                >
                  {language === "ar" ? "Ø§Ù„Ø¹Ø±ÙˆØ¶" : "Offers"}
                </Link>
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-burgundy"
                >
                  {user
                    ? (language === "ar" ? "Ø­Ø³Ø§Ø¨ÙŠ" : "My Account")
                    : (language === "ar" ? "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„" : "Sign In")}
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



