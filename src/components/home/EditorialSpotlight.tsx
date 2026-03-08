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
            {/* Image ── Left side, Editorial Showcase 1 */}
            <div className="lg:col-span-3 relative group">
              <div className="relative overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-2xl">
                <img
                  src={alchemistHero}
                  alt="The Alchemist's Touch — Gold serum on marble"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-asper-ink/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              {/* Gold Frame Decorative Element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-polished-gold/40 z-0" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-polished-gold/40 z-0" />
            </div>

            {/* Content ── Right side */}
            <div className={cn("lg:col-span-2", isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.4em] text-polished-gold mb-6 block">
                {isArabic ? "إصدار محدود" : "The Editorial Edit"}
              </span>
              <h2 className={cn(
                "font-heading text-3xl lg:text-5xl font-light text-asper-ink mb-8 leading-[1.1]",
                isArabic && "font-arabic"
              )}>
                {isArabic 
                  ? "فن العناية بالبشرة: لقاء العلم بالجمال" 
                  : "The Science of Radiance, Reimagined."}
              </h2>

              <p className={cn(
                "font-body text-lg text-muted-foreground leading-relaxed mb-10",
                isArabic && "font-arabic mr-0 ml-auto"
              )}>
                {isArabic
                  ? "نحن نؤمن أن الجمال يبدأ من الفهم العميق لاحتياجات بشرتك. برعاية خبرائنا، نقدم لكِ خلاصة الأبحاث الطبية في قوالب من الفخامة العصرية."
                  : "We believe beauty begins with a profound understanding of your skin's unique needs. Curated by experts, Asper bridges the gap between medical precision and modern ritual."}
              </p>

              <Link to="/skin-concerns">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-polished-gold text-asper-ink hover:bg-polished-gold hover:text-polished-white text-xs uppercase tracking-[0.3em] px-12 h-14 rounded-none transition-all duration-500"
                >
                  {isArabic ? "اكتشفي المزيد" : "Explore More"}
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
