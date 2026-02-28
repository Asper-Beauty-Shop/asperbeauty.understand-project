"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { LuxurySearch } from "./LuxurySearch";
import { AccountDropdown } from "./AccountDropdown";
export const GlobalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    language,
  } = useLanguage();
  const isAr = language === "ar";
  const cartItems = useCartStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Effect to handle scroll-driven glass transparency
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const navItems = [{
    name: "Skin",
    nameAr: "البشرة",
    href: "/shop?category=Skin%20Care",
  }, {
    name: "Hair",
    nameAr: "الشعر",
    href: "/shop?category=Hair%20Care",
  }, {
    name: "Makeup",
    nameAr: "المكياج",
    href: "/shop?category=Makeup",
  }, {
    name: "Brands",
    nameAr: "العلامات",
    href: "/brands",
  }, {
    name: "Offers",
    nameAr: "العروض",
    href: "/offers",
  }];
  const mobileNavItems = [{
    name: "Skin Care",
    nameAr: "العناية بالبشرة",
    href: "/shop?category=Skin%20Care",
  }, {
    name: "Hair Care",
    nameAr: "العناية بالشعر",
    href: "/shop?category=Hair%20Care",
  }, {
    name: "Makeup",
    nameAr: "المكياج",
    href: "/shop?category=Makeup",
  }, {
    name: "New Arrivals",
    nameAr: "وصل حديثاً",
    href: "/shop",
  }, {
    name: "Special Offers",
    nameAr: "عروض خاصة",
    href: "/offers",
  }];
  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-muted"
            : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 text-gold">
          <div className="flex h-20 items-center justify-between text-yellow-600">
            {/* LEFT: Mobile Menu & Search Trigger */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-foreground hover:text-primary transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* CENTER: The Luxury Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link to="/" className="block">
                <h1 className="font-serif text-2xl font-light tracking-wider text-foreground md:text-3xl">
                  <span className="font-normal text-gold">ASPER</span>
                  <span className="text-primary ml-1 text-sm font-sans tracking-widest uppercase">
                    Beauty
                  </span>
                </h1>
              </Link>
            </div>

            {/* MIDDLE: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center gap-1 font-sans text-sm font-medium uppercase tracking-widest transition-colors text-rose-50"
                >
                  {isAr ? item.nameAr : item.name}
                </Link>
              ))}
            </nav>

            {/* RIGHT: Tools (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-3 md:gap-4 text-gold">
              {/* Desktop Search Trigger */}
              <div
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center cursor-pointer group"
              >
                <span
                  className={cn(
                    "border-b px-2 py-1 text-xs transition-all w-32 text-rose-800",
                    isScrolled
                      ? "text-muted-foreground border-border group-hover:border-primary"
                      : "text-foreground/60 border-foreground/20 group-hover:border-primary",
                  )}
                >
                  {isAr ? "بحث..." : "Search products..."}
                </span>
                <Search
                  className={cn(
                    "h-4 w-4 ml-[-20px]",
                    isScrolled ? "text-muted-foreground" : "text-foreground/50",
                  )}
                />
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden text-foreground hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Account Dropdown */}
              <AccountDropdown isScrolled={isScrolled} />

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-foreground hover:text-primary transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </div>
                {isScrolled && (
                  <span className="hidden md:inline text-sm font-medium">
                    {isAr ? "السلة" : "Bag"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background transition-all duration-500",
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <nav className="flex h-full flex-col items-center justify-center gap-8">
            {mobileNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-3xl font-light text-foreground transition-colors hover:text-primary"
              >
                {isAr ? item.nameAr : item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Luxury Search Dialog */}
      <LuxurySearch open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
};
export default GlobalHeader;
