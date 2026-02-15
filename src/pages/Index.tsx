import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, ShoppingBag, Shield, FlaskConical, Heart, Award, Truck, Globe } from "lucide-react";
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
import asperLogo from "@/assets/asper-logo.png";

const Index = () => {
  const { t, toggle, dir, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Gold scroll progress bar */}
      <ScrollProgress />

      {/* Glassmorphism Navigation */}
      <nav className="sticky top-0 z-50 border-b border-accent/10 glass-nav">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={asperLogo} alt="Asper" className="h-8 w-auto" />
              <span className="text-xs font-body uppercase tracking-[0.25em] text-muted-foreground mt-1">
                Beauty Shop
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.shop")}</Link>
              <Link to="/intelligence" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.intelligence")}</Link>
              <a href="#experts" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.concierge")}</a>
              <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.about")}</a>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-3 py-1.5"
                title="Switch language"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className={locale === "ar" ? "font-body" : "font-arabic"}>{t("lang.switch")}</span>
              </button>
              <SearchBar />
              <Link to="/products">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t("nav.shop_now")}
                </Button>
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <Hero />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Search, title: "Analyze", description: "AI analyzes your skin concerns, type, and goals using clinical knowledge.", color: "text-primary" },
              { step: "02", icon: FlaskConical, title: "Recommend", description: "Receive a personalized regimen curated from 5,000+ products by your AI pharmacist.", color: "text-accent" },
              { step: "03", icon: ShoppingBag, title: "Cart", description: "One click adds your complete routine. Quick, elegant, and beautifully simple.", color: "text-primary" },
            ].map((item, i) => (
              <Card key={i} className="group relative border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
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

            <Card className="border-accent/20 hover:border-accent/40 transition-colors">
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

      {/* Trust Banner */}
      <section id="about" className="py-24 sm:py-32 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-12">
            Why <span className="text-primary">Asper</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Award, title: "Guaranteed Authentic", desc: "The Gold Standard. Sourced directly from authorized distributors." },
              { icon: FlaskConical, title: "Pharmacist Verified", desc: "Vetted by experts. Safe for pregnancy and sensitive skin." },
              { icon: Truck, title: "Amman Concierge Delivery", desc: "Temperature-controlled local delivery. Free over 50 JOD." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
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

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={asperLogo} alt="Asper" className="h-6 w-auto" />
              <span className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">Beauty Shop</span>
            </div>
            <p className={`text-sm text-muted-foreground italic ${locale === "ar" ? "font-arabic" : "font-body"}`}>
              {t("footer.tagline")}
            </p>
          </div>
          <div className="gold-divider mt-8" />
          <p className={`text-xs text-muted-foreground text-center mt-6 ${locale === "ar" ? "font-arabic" : "font-body"}`}>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;