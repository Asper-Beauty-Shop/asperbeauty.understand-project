import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Sparkles, Thermometer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-sanctuary.jpg";

export default function Hero() {
  const { t, dir } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      {/* Subtle decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-8 text-center ${dir === "rtl" ? "lg:text-right" : "lg:text-left"}`}>
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5"
              >
                {t("hero.badge")}
              </Badge>

              <h1 className={`font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight ${dir === "rtl" ? "font-arabic" : ""}`}>
                {t("hero.title_1")}
                <br />
                <span className="text-foreground">{t("hero.title_2")}</span>
              </h1>
            </div>

            <p className={`text-lg text-muted-foreground max-w-xl leading-relaxed ${dir === "rtl" ? "font-arabic mx-auto lg:mr-0 lg:ml-auto" : "font-body mx-auto lg:mx-0"}`}>
              {t("hero.subtitle")}
            </p>

            {/* Trust micro-badges */}
            <div className={`flex flex-wrap gap-3 ${dir === "rtl" ? "justify-center lg:justify-end" : "justify-center lg:justify-start"}`}>
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground border border-border rounded-full px-3 py-1">
                <Shield className="h-3 w-3 text-accent" />
                {t("hero.authentic")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground border border-border rounded-full px-3 py-1">
                <Thermometer className="h-3 w-3 text-primary" />
                {t("hero.temperature")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground border border-border rounded-full px-3 py-1">
                <Sparkles className="h-3 w-3 text-accent" />
                {t("hero.pharmacist_led")}
              </span>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 ${dir === "rtl" ? "justify-center lg:justify-end" : "justify-center lg:justify-start"}`}>
              <Link to="/products">
                <Button
                  size="lg"
                  className="group bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-widest px-8 h-12 shadow-lg shadow-primary/20"
                >
                  {t("hero.cta_primary")}
                  <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${dir === "rtl" ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-accent text-accent hover:bg-accent/10 text-sm uppercase tracking-widest px-8 h-12"
                >
                  {t("hero.cta_secondary")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image with Gold Stitch Frame */}
          <div className={`relative h-[400px] sm:h-[500px] lg:h-[600px] group ${dir === "rtl" ? "lg:-translate-x-8" : "lg:translate-x-8"}`}>
            {/* Gold Stitch animated border */}
            <div className="absolute -inset-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 rounded-lg border-2 border-accent/60 animate-[fade-in_0.6s_ease-out_forwards]" />
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/40" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/40" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/40" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/40" />
            </div>

            <div className="relative h-full rounded-lg overflow-hidden shadow-xl">
              <img
                src={heroImage}
                alt="Pristine white marble countertop with Vichy and CeraVe products in morning spa lighting"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-4 border border-accent/30 pointer-events-none rounded-sm" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/60 to-transparent px-6 py-5">
                <p className="text-primary-foreground/90 font-body text-xs uppercase tracking-[0.2em]">
                  {t("hero.sanctuary")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 gold-divider" />
    </section>
  );
}