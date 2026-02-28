import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles, Leaf, Sun, Moon, CloudSun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimeContext } from "@/hooks/useTimeContext";
import heroVideo from "@/assets/hero-video.mp4";
import { cn } from "@/lib/utils";

const timeIcons = { morning: Sun, afternoon: CloudSun, evening: Moon };

export default function Hero() {
  const { t, dir, locale } = useLanguage();
  const { timeOfDay, greeting, tagline, moodClass } = useTimeContext();
  const TimeIcon = timeIcons[timeOfDay];
  const isAr = locale === "ar";

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Emerald + marble gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20" />

      {/* Gold border frame */}
      <div className="absolute inset-4 sm:inset-8 border border-accent/30 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 w-full">
          <div className={`max-w-2xl space-y-6 ${dir === "rtl" ? "mr-0 ml-auto text-right" : ""}`}>
            {/* Time-aware greeting pill */}
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-body tracking-wide backdrop-blur-sm",
              "bg-primary-foreground/10 text-primary-foreground/90 border border-primary-foreground/20"
            )}>
              <TimeIcon className="h-3.5 w-3.5" />
              <span>{greeting}</span>
            </div>

            <h1 className={cn(
              "font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] tracking-tight",
              dir === "rtl" && "font-arabic"
            )}>
              {isAr ? "الطبيعة" : "Nature"}
              <br />
              <span className="text-accent">{isAr ? "تلتقي بالعلم" : "Meets Science"}</span>
            </h1>

            <p className={cn(
              "text-base sm:text-lg text-primary-foreground/80 max-w-lg leading-relaxed",
              dir === "rtl" ? "font-arabic" : "font-body"
            )}>
              {isAr
                ? "منتجات فاخرة للعناية بالبشرة والجمال — مُعتمدة صيدلانياً من أرقى العلامات التجارية العالمية"
                : "Curated luxury skincare & beauty from the world's most prestigious brands — pharmacist verified"}
            </p>

            {/* Trust micro-badges */}
            <div className={`flex flex-wrap gap-3 ${dir === "rtl" ? "justify-end" : ""}`}>
              {[
                { icon: Shield, label: t("hero.authentic"), color: "text-accent" },
                { icon: Leaf, label: isAr ? "طبيعي ونقي" : "Natural & Pure", color: "text-accent" },
                { icon: Sparkles, label: t("hero.pharmacist_led"), color: "text-accent" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-primary-foreground/70 border border-primary-foreground/15 backdrop-blur-sm rounded-full px-3 py-1"
                >
                  <item.icon className={`h-3 w-3 ${item.color}`} />
                  {item.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-2 ${dir === "rtl" ? "justify-end" : ""}`}>
              <Link to="/products">
                <Button
                  size="lg"
                  className="group bg-accent text-primary-foreground hover:bg-accent/90 text-sm uppercase tracking-widest px-8 h-12 font-semibold shadow-lg shadow-accent/20"
                >
                  {t("hero.cta_primary")}
                  <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${dir === "rtl" ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-sm uppercase tracking-widest px-8 h-12"
                >
                  {t("hero.cta_secondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom "Nature Meets Science" label */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 z-20">
        <p className="text-primary-foreground/50 font-body text-[10px] sm:text-xs uppercase tracking-[0.3em]">
          {isAr ? "الطبيعة تلتقي بالعلم" : "Nature Meets Science"}
        </p>
      </div>
    </section>
  );
}
