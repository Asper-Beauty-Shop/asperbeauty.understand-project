import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar, BadgePercent, Star } from "lucide-react";
import { motion } from "framer-motion";

const advisors = [
  {
    name: "Dr. Lina",
    nameAr: "Ø¯. Ù„ÙŠÙ†Ø§",
    specialty: { en: "Dermocosmetics", ar: "Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ Ø§Ù„Ø·Ø¨ÙŠØ©" },
    discount: 25,
    experience: "8+ yrs",
    availability: { en: "Thursday", ar: "Ø§Ù„Ø®Ù…ÙŠØ³" },
  },
  {
    name: "Rawan",
    nameAr: "Ø±ÙˆØ§Ù†",
    specialty: { en: "Clinical Supplementation", ar: "Ø§Ù„Ù…ÙƒÙ…Ù„Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©" },
    discount: 20,
    experience: "5+ yrs",
    availability: { en: "Tuesday", ar: "Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡" },
  },
  {
    name: "Sarah",
    nameAr: "Ø³Ø§Ø±Ø©",
    specialty: { en: "Maternal Wellness", ar: "ØµØ­Ø© Ø§Ù„Ø£Ù…" },
    discount: 15,
    experience: "6+ yrs",
    availability: { en: "Friday", ar: "Ø§Ù„Ø¬Ù…Ø¹Ø©" },
  },
  {
    name: "Nour",
    nameAr: "Ù†ÙˆØ±",
    specialty: { en: "Pediatric Skincare", ar: "Ø¹Ù†Ø§ÙŠØ© Ø¨Ø´Ø±Ø© Ø§Ù„Ø£Ø·ÙØ§Ù„" },
    discount: 20,
    experience: "10+ yrs",
    availability: { en: "On Demand", ar: "Ø¹Ù†Ø¯ Ø§Ù„Ø·Ù„Ø¨" },
  },
];

export default function BeautyAdvisors() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="py-16 bg-primary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-body uppercase tracking-widest text-accent mb-4">
            <Star className="w-3.5 h-3.5" />
            {isAr ? "Ø§Ø³ØªØ´Ø§Ø±Ø© Ø´Ø®ØµÙŠØ©" : "Personal Consultation"}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
            {isAr ? "Ù…Ø³ØªØ´Ø§Ø±Ø§ØªÙ†Ø§ Ø§Ù„Ù…ØªØ®ØµØµØ§Øª" : "Our Expert Advisors"}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            {isAr
              ? "Ø§Ø­Ø¬Ø²ÙŠ Ù…ÙˆØ¹Ø¯Ø§Ù‹ Ù…Ø¬Ø§Ù†ÙŠØ§Ù‹ Ù…Ø¹ Ù…Ø³ØªØ´Ø§Ø±ØªÙ†Ø§ Ø§Ù„Ù…ØªØ®ØµØµØ© ÙˆØ§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ Ø®ØµÙ… Ø­ØµØ±ÙŠ Ø¹Ù„Ù‰ Ù…Ø´ØªØ±ÙŠØ§ØªÙƒ."
              : "Book a free session with our specialist and receive an exclusive discount on your purchases."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {advisors.map((advisor, i) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="product-card-hover group rounded-xl border border-border bg-card p-6 text-center"
            >
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-heading font-bold text-primary">
                  {advisor.name.charAt(0)}
                </span>
              </div>

              <h3 className="font-heading text-lg text-foreground mb-1">
                {isAr ? advisor.nameAr : advisor.name}
              </h3>
              <p className="text-xs font-body text-accent uppercase tracking-wider mb-2">
                {isAr ? advisor.specialty.ar : advisor.specialty.en}
              </p>
              <p className="text-[10px] font-body text-muted-foreground mb-4">
                {advisor.experience}
              </p>

              {/* Discount badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-body font-medium mb-4">
                <BadgePercent className="w-3.5 h-3.5" />
                -{advisor.discount}% {isAr ? "Ø®ØµÙ…" : "off"}
              </div>

              {/* Availability */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Calendar className="w-3 h-3" />
                {isAr ? advisor.availability.ar : advisor.availability.en}
              </div>

              <Button
                size="sm"
                className="w-full btn-ripple"
              >
                {isAr ? "Ø§Ø­Ø¬Ø²ÙŠ Ø§Ù„Ø¢Ù†" : "Book Now"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

