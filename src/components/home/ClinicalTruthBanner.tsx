import { ShieldCheck, FlaskConical, Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Zone 5 â€” Clinical Truth Banner
 * Deep Burgundy banner with gold-seal trust pillars, ambient glow blobs,
 * and responsive gold dividers between pillars.
 */
export default function ClinicalTruthBanner() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const pillars = [
    {
      icon: ShieldCheck,
      title: isAr ? "Ø¬ÙˆØ¯Ø© Ø£ØµÙŠÙ„Ø©" : "Authentic Quality",
      description: isAr
        ? "Ø³Ù„Ø³Ù„Ø© ØªÙˆØ±ÙŠØ¯ Ù…ÙˆØ«Ù‘Ù‚Ø© Ù¡Ù Ù Ùª. Ù†Ø¶Ù…Ù† Ø´ÙØ§ÙÙŠØ© ÙƒØ§Ù…Ù„Ø© ÙÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ÙˆÙ…ØµØ§Ø¯Ø± Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† Ø£Ø±Ù‚Ù‰ Ø§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ©."
        : "100% verified supply chain. We guarantee full ingredient transparency and direct sourcing from leading dermatological laboratories.",
    },
    {
      icon: FlaskConical,
      title: isAr ? "Ù…ÙØ«Ø¨Øª Ø³Ø±ÙŠØ±ÙŠØ§Ù‹" : "Clinically Proven",
      description: isAr
        ? "ÙƒÙ„ ØªØ±ÙƒÙŠØ¨Ø© Ù…ÙØ®ØªØ¨Ø±Ø© Ø¨Ø¯Ù‚Ø© Ù„Ù„ÙØ¹Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ø³Ù„Ø§Ù…Ø©ØŒ Ù„Ø¶Ù…Ø§Ù† Ù†ØªØ§Ø¦Ø¬ Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø­ØªÙ‰ Ù„Ø£ÙƒØ«Ø± Ø­ÙˆØ§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø© Ø­Ø³Ø§Ø³ÙŠØ©."
        : "Every formula is rigorously tested for efficacy and safety, ensuring high-performance results even for the most sensitive skin barriers.",
    },
    {
      icon: Droplets,
      title: isAr ? "ÙØ®Ø§Ù…Ø© ÙØ¹Ù‘Ø§Ù„Ø©" : "Luxurious Efficacy",
      description: isAr
        ? "Ø¬Ø³Ø± Ø¨ÙŠÙ† Ø§Ù„Ø¹Ù„Ù… Ø§Ù„Ø·Ø¨ÙŠ ÙˆØ§Ù„ÙØ®Ø§Ù…Ø© Ø§Ù„Ù…Ù„Ù…ÙˆØ³Ø©. Ø§Ø³ØªÙ…ØªØ¹ÙŠ Ø¨Ù„Ù…Ø³Ø§Øª Ù…Ø´Ø±Ù‚Ø© ÙˆØ±ÙˆØªÙŠÙ† ØµØ¨Ø§Ø­ÙŠ Ø±Ø§Ù‚Ù."
        : "Bridging the gap between medical science and tactile luxury. Experience radiant finishes and elevated morning routines.",
    },
  ];

  return (
    <section className="w-full bg-burgundy py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient glow texture to prevent flat appearance */}
      <div className="absolute inset-0 bg-gradient-to-b from-burgundy-light/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-polished-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-polished-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-polished-gold/20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="flex flex-col items-center pt-8 md:pt-0 md:px-8 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: LUXURY_EASE }}
            >
              {/* Gold seal icon */}
              <div className="w-16 h-16 rounded-full border border-polished-gold/40 flex items-center justify-center mb-5 bg-burgundy group-hover:bg-polished-gold/10 transition-colors duration-500 shadow-[0_0_15px_hsl(var(--polished-gold)/0.2)]">
                <pillar.icon size={32} className="text-polished-gold" strokeWidth={1.2} />
              </div>

              <h3 className={cn(
                "font-heading text-xl text-primary-foreground mb-3 tracking-wide",
                isAr && "font-arabic"
              )}>
                {pillar.title}
              </h3>

              <p className={cn(
                "font-body text-sm text-primary-foreground/80 leading-relaxed font-light",
                isAr && "font-arabic"
              )}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

