import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import alchemistHero from "@/assets/alchemist-touch-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export const EditorialSpotlight = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-20 lg:py-28 bg-asper-stone-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 items-center">
            {/* Image â”€â”€ Left side, Editorial Showcase 1 */}
            <div className="lg:col-span-3 relative group">
              <div className="relative overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-2xl border-2 border-transparent group-hover:border-polished-gold/60 transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }}>
                <img
                  src={alchemistHero}
                  alt="The Alchemist's Touch â€” Gold serum on marble"
                  className="h-full w-full object-cover brightness-[1.02] transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }}
                  loading="lazy"
                />
                {/* Clinical Shimmer Beam */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(197, 160, 40, 0.12) 45%, rgba(255, 255, 255, 0.18) 50%, rgba(197, 160, 40, 0.12) 55%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmerBeam 1.5s ease-in-out infinite',
                  }}
                />
                {/* Inner Gold Border Frame */}
                <div className="absolute inset-4 border border-polished-gold/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Subtle tint overlay */}
                <div className="absolute inset-0 bg-asper-ink/5 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              {/* Gold Frame Decorative Element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-polished-gold/40 z-0" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-polished-gold/40 z-0" />
            </div>

            {/* Content â”€â”€ Right side */}
            <div className={cn("lg:col-span-2", isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.4em] text-polished-gold mb-6 block">
                {isArabic ? "Ø¥ØµØ¯Ø§Ø± Ù…Ø­Ø¯ÙˆØ¯" : "The Editorial Edit"}
              </span>
              <h2 className={cn(
                "font-heading text-3xl lg:text-5xl font-light text-asper-ink mb-8 leading-[1.1]",
                isArabic && "font-arabic"
              )}>
                {isArabic 
                  ? "ÙÙ† Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©: Ù„Ù‚Ø§Ø¡ Ø§Ù„Ø¹Ù„Ù… Ø¨Ø§Ù„Ø¬Ù…Ø§Ù„" 
                  : "The Science of Radiance, Reimagined."}
              </h2>

              <p className={cn(
                "font-body text-lg text-muted-foreground leading-relaxed mb-10",
                isArabic && "font-arabic mr-0 ml-auto"
              )}>
                {isArabic
                  ? "Ù†Ø­Ù† Ù†Ø¤Ù…Ù† Ø£Ù† Ø§Ù„Ø¬Ù…Ø§Ù„ ÙŠØ¨Ø¯Ø£ Ù…Ù† Ø§Ù„ÙÙ‡Ù… Ø§Ù„Ø¹Ù…ÙŠÙ‚ Ù„Ø§Ø­ØªÙŠØ§Ø¬Ø§Øª Ø¨Ø´Ø±ØªÙƒ. Ø¨Ø±Ø¹Ø§ÙŠØ© Ø®Ø¨Ø±Ø§Ø¦Ù†Ø§ØŒ Ù†Ù‚Ø¯Ù… Ù„ÙƒÙ Ø®Ù„Ø§ØµØ© Ø§Ù„Ø£Ø¨Ø­Ø§Ø« Ø§Ù„Ø·Ø¨ÙŠØ© ÙÙŠ Ù‚ÙˆØ§Ù„Ø¨ Ù…Ù† Ø§Ù„ÙØ®Ø§Ù…Ø© Ø§Ù„Ø¹ØµØ±ÙŠØ©."
                  : "We believe beauty begins with a profound understanding of your skin's unique needs. Curated by experts, Asper bridges the gap between medical precision and modern ritual."}
              </p>

              <Link to="/skin-concerns">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-polished-gold text-asper-ink hover:bg-polished-gold hover:text-polished-white text-xs uppercase tracking-[0.3em] px-12 h-14 rounded-none transition-all duration-500"
                >
                  {isArabic ? "Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„Ù…Ø²ÙŠØ¯" : "Explore More"}
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-2",
                    dir === "rtl" && "mr-2 rotate-180 group-hover:-translate-x-2"
                  )} />
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
