import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export function MorningSpaRitualBanner() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Full-width ritual image */}
        <motion.div
          className="w-full overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <img
            src="/images/vichy-mineral89-ritual.png"
            alt="Morning Spa — Clinical Precision. Eternal Elegance. Vichy Minéral 89"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Text block below image */}
        <motion.div
          className="bg-background pt-10 md:pt-14 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.2 }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-4 block font-semibold">
            {isAr ? "طقوس سبا الصباح" : "The Morning Spa Ritual"}
          </span>

          <p
            className={cn(
              "font-display text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-8",
              isAr && "font-arabic"
            )}
          >
            {isAr
              ? "أعمق أبحاثنا الجلدية توفر ترطيباً مكثفاً. اكتشفي توازنك المعدني المثالي."
              : "Our deepest dermatological research provides intensive hydration. Discover your ideal mineral balance."}
          </p>

          <Link
            to="/shop?brand=Vichy"
            className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-foreground
                       border-b border-accent pb-1 hover:text-primary
                       transition-colors duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
          >
            {isAr ? "اكتشفي الآن" : "Discover Now"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
