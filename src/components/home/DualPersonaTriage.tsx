import { useNavigate } from "react-router-dom";
import { Stethoscope, Sparkles, ArrowRight, Shield, Flower2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export default function DualPersonaTriage() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";
  const navigate = useNavigate();

  return (
    <section className="w-full bg-asper-stone-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
        >
          <span className="font-body text-xs uppercase tracking-[0.4em] text-polished-gold mb-4 block font-bold">
            {isAr ? "Ø§Ø³ØªØ´Ø§Ø±Ø© Ø°ÙƒÙŠØ©" : "Digital Consultation"}
          </span>
          <h2 className={cn(
            "font-heading text-3xl md:text-6xl text-asper-ink mb-8 font-light tracking-tight",
            isAr && "font-arabic"
          )}>
            {isAr ? "Ø§Ø®ØªØ§Ø±ÙŠ Ù…Ø³Ø§Ø± Ø¬Ù…Ø§Ù„Ùƒ" : "Select Your Path."}
          </h2>
          <div className="w-24 h-[2px] bg-polished-gold mx-auto" />
        </motion.div>

        {/* The Dual-Persona Split â”€â”€ Large Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Card A: Dr. Sami (Clinical / Repair) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            <button
              onClick={() => navigate("/skin-concerns")}
              className="group relative w-full text-left overflow-hidden transition-all duration-700 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/editorial-showcase-1.jpg"
                  alt="Clinical Path"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-asper-ink/40 group-hover:bg-asper-ink/20 transition-colors duration-700" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="w-16 h-16 border-2 border-polished-white flex items-center justify-center mb-8 group-hover:bg-polished-white transition-all duration-500">
                    <Stethoscope size={28} strokeWidth={1} className="text-polished-white group-hover:text-asper-ink transition-colors" />
                  </div>
                  <h3 className={cn("text-3xl lg:text-4xl text-polished-white mb-4 font-light tracking-tighter", isAr && "font-arabic")}>
                    {isAr ? "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø·Ø¨ÙŠ" : "The Clinical Path"}
                  </h3>
                  <p className={cn("text-polished-white/80 text-sm uppercase tracking-[0.2em] mb-8 font-semibold", isAr && "font-arabic")}>
                    {isAr ? "Ø¹Ù„Ø§Ø¬Ø§Øª Ù…ØªÙ‚Ø¯Ù…Ø© Ù„Ù„Ø¨Ø´Ø±Ø©" : "Advanced Dermo-Solutions"}
                  </p>
                  <div className="h-px w-full bg-polished-white/20 group-hover:bg-polished-gold transition-colors duration-500" />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Card B: Ms. Zain (Aesthetic / Ritual) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            <button
              onClick={() => navigate("/shop")}
              className="group relative w-full text-left overflow-hidden transition-all duration-700 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/editorial-showcase-2.jpg"
                  alt="Luxury Path"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-asper-ink/40 group-hover:bg-asper-ink/20 transition-colors duration-700" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="w-16 h-16 border-2 border-polished-white flex items-center justify-center mb-8 group-hover:bg-polished-white transition-all duration-500">
                    <Sparkles size={28} strokeWidth={1} className="text-polished-white group-hover:text-asper-ink transition-colors" />
                  </div>
                  <h3 className={cn("text-3xl lg:text-4xl text-polished-white mb-4 font-light tracking-tighter", isAr && "font-arabic")}>
                    {isAr ? "Ù…Ø³Ø§Ø± Ø§Ù„Ø£Ù†Ø§Ù‚Ø©" : "The Aesthetic Path"}
                  </h3>
                  <p className={cn("text-polished-white/80 text-sm uppercase tracking-[0.2em] mb-8 font-semibold", isAr && "font-arabic")}>
                    {isAr ? "Ø·Ù‚ÙˆØ³ Ø§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„ÙŠÙˆÙ…ÙŠØ©" : "Luxury Daily Rituals"}
                  </p>
                  <div className="h-px w-full bg-polished-white/20 group-hover:bg-polished-gold transition-colors duration-500" />
                </div>
              </div>
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
