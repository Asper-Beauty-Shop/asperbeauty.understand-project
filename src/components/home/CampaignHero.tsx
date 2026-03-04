import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CampaignHeroProps {
  campaignTitle: string;
  campaignTitleAr?: string;
  subtitle: string;
  subtitleAr?: string;
  description?: string;
  descriptionAr?: string;
  imageUrl: string;
  ctaText: string;
  ctaTextAr?: string;
  ctaLink: string;
  badge?: string;
  badgeAr?: string;
  overlayOpacity?: number;
  className?: string;
}

export const CampaignHero = ({
  campaignTitle,
  campaignTitleAr,
  subtitle,
  subtitleAr,
  description,
  descriptionAr,
  imageUrl,
  ctaText,
  ctaTextAr,
  ctaLink,
  badge,
  badgeAr,
  overlayOpacity = 0.4,
  className,
}: CampaignHeroProps) => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className={cn("relative min-h-[70vh] md:min-h-[85vh] overflow-hidden", className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={isArabic ? campaignTitleAr || campaignTitle : campaignTitle}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-asper-ink via-asper-ink/60 to-transparent"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 luxury-container h-full min-h-[70vh] md:min-h-[85vh] flex items-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          {badge && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-polished-gold/90 backdrop-blur-sm border border-polished-gold text-burgundy font-medium text-xs md:text-sm uppercase tracking-wider">
                {isArabic ? badgeAr || badge : badge}
              </span>
            </motion.div>
          )}

          {/* Subtitle */}
          <motion.p
            className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-polished-gold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isArabic ? subtitleAr || subtitle : subtitle}
          </motion.p>

          {/* Campaign Title */}
          <motion.h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-asper-stone-light font-bold leading-[0.95] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isArabic ? campaignTitleAr || campaignTitle : campaignTitle}
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            className="w-20 h-px bg-gradient-to-r from-polished-gold to-transparent mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          {/* Description */}
          {description && (
            <motion.p
              className="font-body text-base md:text-lg text-asper-stone-light/90 leading-relaxed mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {isArabic ? descriptionAr || description : description}
            </motion.p>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to={ctaLink}>
              <Button
                size="lg"
                className={cn(
                  "group bg-polished-gold text-burgundy hover:bg-polished-gold-light",
                  "border-2 border-polished-gold hover:border-polished-gold-light",
                  "hover:shadow-2xl hover:shadow-polished-gold/30",
                  "text-sm md:text-base uppercase tracking-widest px-10 h-14 font-bold",
                  "transition-all duration-400"
                )}
              >
                {isArabic ? ctaTextAr || ctaText : ctaText}
                <ArrowRight
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:translate-x-1",
                    dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )}
                />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
