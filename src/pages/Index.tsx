import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, ShoppingBag, Shield, FlaskConical, Heart, Award, Truck, Globe, ArrowRight } from "lucide-react";
import { IconNewArrivals, IconBestSellers, IconGiftSets } from "@/components/brand/ClinicalIcons";
import { useLanguage } from "@/contexts/LanguageContext";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import ConciergeShowcase from "@/components/home/ConciergeShowcase";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import ShopByConcern from "@/components/home/ShopByConcern";
import PharmacistPicks from "@/components/home/PharmacistPicks";
import SocialGallery from "@/components/home/SocialGallery";
import SearchBar from "@/components/home/SearchBar";
import ExpertTips from "@/components/home/ExpertTips";
import ScrollProgress from "@/components/ScrollProgress";
import AuthButton from "@/components/AuthButton";
import MobileBottomNav from "@/components/MobileBottomNav";
import MegaMenu from "@/components/MegaMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { IncognitoToggle } from "@/components/IncognitoToggle";
import TrustBadges from "@/components/brand/TrustBadges";
import BrandIcon from "@/components/brand/BrandIcon";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import asperLogo from "@/assets/asper-lotus-logo.png";

const Index = () => {
  const { t, toggle, dir, locale } = useLanguage();
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((t, i) => t + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background mobile-bottom-pad" dir={dir}>
      {/* Gold scroll progress bar */}
      <ScrollProgress />

      {/* Glassmorphism Navigation */}
      <nav className="sticky top-0 z-50 border-b border-accent/10 glass-nav">
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
            <div className="hidden md:flex items-center gap-8">
              <MegaMenu label={t("nav.shop")} />
              <Link to="/intelligence" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.intelligence")}</Link>
              <a href="#experts" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.concierge")}</a>
              <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.about")}</a>
            </div>
            <div className="flex items-center gap-1">
              {/* Language Toggle — BrandIcon */}
              <BrandIcon icon="globe" onClick={toggle} ariaLabel="Switch language" />
              <SearchBar />
              {/* Tote Bag Cart Icon */}
              <BrandIcon
                icon="cart"
                notificationCount={cartCount}
                onClick={() => setCartOpen(true)}
                ariaLabel="Open cart"
              />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <Hero />

      {/* Featured Navigation Badges */}
      <section className="py-8 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {[
              { Icon: IconNewArrivals, label: "New Arrivals", to: "/products?sort=newest" },
              { Icon: IconBestSellers, label: "Best Sellers", to: "/products?sort=bestseller" },
              { Icon: IconGiftSets, label: "Gift Sets", to: "/products?q=gift+set" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-card hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <item.Icon
                  size={20}
                  className="text-primary group-hover:text-accent transition-colors duration-300"
                />
                <span className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* 2a. Shop by Concern */}
      <ShopByConcern />

      <div className="gold-divider" />

      {/* 2b. AI Concierge Showcase */}
      <ConciergeShowcase />

      {/* 3-Click Solution */}
      <section id="experts" className="py-24 sm:py-32 lab-zone">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 font-body text-xs tracking-wider">
              THE 3-CLICK SOLUTION
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Beauty Through <span className="text-primary">Intelligence</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              Our AI Concierge analyzes your skin, recommends a personalized regimen, and adds it to your cart — in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Search, title: "Analyze", description: "AI analyzes your skin concerns, type, and goals using clinical knowledge.", color: "text-primary" },
              { step: "02", icon: FlaskConical, title: "Recommend", description: "Receive a personalized regimen curated from 5,000+ products by your AI pharmacist.", color: "text-accent" },
              { step: "03", icon: ShoppingBag, title: "Cart", description: "One click adds your complete routine. Quick, elegant, and beautifully simple.", color: "text-primary" },
            ].map((item, i) => (
              <Card key={i} className="group relative border-border/50 hover:border-accent/50 transition-all duration-300 shadow-maroon-glow hover:shadow-maroon-deep overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-5xl font-heading font-bold text-border/80">{item.step}</span>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Dual Persona */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5">
              CONSULT WITH OUR EXPERTS
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              One Brain, <span className="text-primary">Two Voices</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              Our centralized AI seamlessly switches between clinical authority and aesthetic warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20 hover:border-primary/40 transition-all shadow-maroon-glow hover:shadow-maroon-deep">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">Dr. Sami</h3>
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">The Clinical Authority</p>
                  </div>
                </div>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  Authoritative wellness guidance on supplements, dosage, and safety with a clinical, precise tone.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Medical Queries</Badge>
                  <Badge variant="outline" className="text-xs">Supplements</Badge>
                  <Badge variant="outline" className="text-xs">Dosage & Safety</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:border-accent/40 transition-all shadow-maroon-glow hover:shadow-maroon-deep">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">Ms. Zain</h3>
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">The Beauty Concierge</p>
                  </div>
                </div>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  Warm, editorial advice on makeup, luxury fragrances, and aesthetic trends with enthusiastic elegance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Skincare Routines</Badge>
                  <Badge variant="outline" className="text-xs">Makeup</Badge>
                  <Badge variant="outline" className="text-xs">Gift Ideas</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      <PharmacistPicks />

      <div className="gold-divider" />

      <BrandStory />

      <div className="gold-divider" />

      {/* Expert Weekly Tips */}
      <ExpertTips />

      <div className="gold-divider" />

      {/* Science Behind the Beauty */}
      <section id="about" className="py-24 sm:py-32 lab-zone">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5">
            THE SCIENCE BEHIND THE BEAUTY
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why <span className="text-primary">Asper</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body mb-16">
            More than a marketplace — a pharmacist-led sanctuary where every product is vetted, verified, and stored with clinical care.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FlaskConical, title: "Clinical Formulas", desc: "Every product is evaluated for active ingredient efficacy by our in-house pharmacists." },
              { icon: Award, title: "Authenticity Guaranteed", desc: "The Gold Standard. Direct sourcing from authorized distributors — zero grey market." },
              { icon: Truck, title: "Cold-Chain Storage", desc: "Temperature-controlled warehousing and last-mile delivery. Free over 50 JOD in Amman." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-card border border-accent/20 flex items-center justify-center mb-5 group-hover:border-accent/50 transition-colors shadow-sm">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      <PromoBanner campaign="Summer Hydration" subtitle="Shield. Glow. Repeat." />

      <div className="gold-divider" />

      <SocialGallery />

      <div className="gold-divider" />

      <Newsletter />

      {/* Footer — Deep Maroon */}
      <footer className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={asperLogo} alt="Asper" className="h-8 w-auto brightness-0 invert opacity-90" />
                <span className="text-xs font-body uppercase tracking-[0.25em] text-primary-foreground/70">Beauty Shop</span>
              </div>
              <p className={`text-sm text-primary-foreground/70 leading-relaxed ${locale === "ar" ? "font-arabic" : "font-body"}`}>
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <Link to="/products" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Shop All</Link>
                <Link to="/intelligence" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">AI Intelligence</Link>
                <Link to="/brand" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Our Story</Link>
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Connect</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Instagram</a>
                <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">WhatsApp</a>
                <IncognitoToggle className="mt-2 border-primary-foreground/20 text-primary-foreground/60 hover:text-primary-foreground hover:border-primary-foreground/40" />
              </div>
            </div>
          </div>

          {/* Trust Badges — Hexagonal Gold Stamps */}
          <div className="mb-8">
            <TrustBadges />
          </div>

          <div className="h-px bg-primary-foreground/10" />
          <div className="flex items-center justify-between mt-6">
            <p className={`text-xs text-primary-foreground/50 ${locale === "ar" ? "font-arabic" : "font-body"}`}>
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            {/* Gold Authenticity Seal */}
            <div className="gold-seal-rotate cursor-pointer" title="Guaranteed Authentic">
              <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10 text-accent">
                <path d="M20 2L24.5 8.5L32 7L29 14.5L35 20L29 25.5L32 33L24.5 31.5L20 38L15.5 31.5L8 33L11 25.5L5 20L11 14.5L8 7L15.5 8.5L20 2Z" fill="currentColor" fillOpacity="0.9"/>
                <path d="M20 12L22 16.5L27 17L23 20.5L24 25.5L20 23L16 25.5L17 20.5L13 17L18 16.5L20 12Z" fill="hsl(var(--primary))" fillOpacity="0.8"/>
              </svg>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer (controlled) */}
      <CartDrawer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenConcierge={() => setConciergeOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />
    </div>
  );
};

export default Index;