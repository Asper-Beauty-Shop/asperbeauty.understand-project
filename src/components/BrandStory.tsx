import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Sparkles } from "lucide-react";
import asperLogo from "@/assets/asper-logo-badge.png";

const content = {
  en: {
    title: "Science Meets Luxury",
    subtitle: "The Dual-Voice Philosophy of Asper Beauty",
    drSami: {
      name: "Dr. Sami",
      role: "The Clinical Voice",
      quote: "I provide clinical wellness guidance, grounded in pharmaceutical precision.",
      description:
        "Led by expert pharmacists, every product in our collection is rigorously vetted for safety, efficacy, and active ingredient integrity. We don't just sell skincare; we prescribe solutions for acne, rosacea, and barrier repair.",
      badges: ["JFDA Authorized", "Pharmacist-Vetted", "Clinical Efficacy"],
    },
    msZain: {
      name: "Ms. Zain",
      role: "The Aesthetic Voice",
      quote: "Welcome to your personal beauty ritual. True luxury is in the details.",
      description:
        "Beauty is an experience. From the scent of a premium serum to the glow of a bridal routine, we curate high-end aesthetics that transform your daily skincare into a moment of pure, unapologetic indulgence.",
      badges: ["Bridal Radiance", "Sensorial Textures", "Editorial Glow"],
    },
  },
  ar: {
    title: "Ø­ÙŠØ« ÙŠÙ„ØªÙ‚ÙŠ Ø§Ù„Ø¹Ù„Ù… Ø¨Ø§Ù„Ø±ÙØ§Ù‡ÙŠØ©",
    subtitle: "ÙÙ„Ø³ÙØ© Ø§Ù„ØµÙˆØª Ø§Ù„Ù…Ø²Ø¯ÙˆØ¬ Ù„Ø¬Ù…Ø§Ù„ Ø£Ø³Ø¨Ø±",
    drSami: {
      name: "Ø¯. Ø³Ø§Ù…ÙŠ",
      role: "ØµÙˆØª Ø§Ù„Ø¹Ù„Ù…",
      quote: "Ø£Ù‚Ø¯Ù… Ø¥Ø±Ø´Ø§Ø¯Ø§Øª ØµØ­ÙŠØ© ÙˆØ³Ø±ÙŠØ±ÙŠØ©ØŒ Ù…Ø¨Ù†ÙŠØ© Ø¹Ù„Ù‰ Ø§Ù„Ø¯Ù‚Ø© Ø§Ù„ØµÙŠØ¯Ù„Ø§Ù†ÙŠØ©.",
      description:
        "Ø¨Ø¥Ø´Ø±Ø§Ù ØµÙŠØ§Ø¯Ù„Ø© Ø®Ø¨Ø±Ø§Ø¡ØŒ ÙŠØªÙ… ÙØ­Øµ ÙƒÙ„ Ù…Ù†ØªØ¬ ÙÙŠ Ù…Ø¬Ù…ÙˆØ¹ØªÙ†Ø§ Ø¨Ø¯Ù‚Ø© Ù„Ø¶Ù…Ø§Ù† Ø§Ù„Ø£Ù…Ø§Ù† ÙˆØ§Ù„ÙØ¹Ø§Ù„ÙŠØ© ÙˆØ³Ù„Ø§Ù…Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„ÙØ¹Ø§Ù„Ø©. Ù†Ø­Ù† Ù„Ø§ Ù†Ø¨ÙŠØ¹ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙØ­Ø³Ø¨Ø› Ø¨Ù„ Ù†ØµÙ Ø­Ù„ÙˆÙ„Ø§Ù‹ Ù„Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨ ÙˆØ§Ù„ÙˆØ±Ø¯ÙŠØ© ÙˆØ¥ØµÙ„Ø§Ø­ Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø©.",
      badges: ["Ù…Ø¹ØªÙ…Ø¯ Ù…Ù† Ø§Ù„ØºØ°Ø§Ø¡ ÙˆØ§Ù„Ø¯ÙˆØ§Ø¡", "Ù…ÙØ­ÙˆØµ Ù…Ù† Ø§Ù„ØµÙŠØ§Ø¯Ù„Ø©", "ÙØ¹Ø§Ù„ÙŠØ© Ø³Ø±ÙŠØ±ÙŠØ©"],
    },
    msZain: {
      name: "Ø§Ù„Ø¢Ù†Ø³Ø© Ø²ÙŠÙ†",
      role: "ØµÙˆØª Ø§Ù„Ø±ÙØ§Ù‡ÙŠØ©",
      quote: "Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Ø·Ù‚ÙˆØ³ Ø¬Ù…Ø§Ù„Ùƒ Ø§Ù„Ø®Ø§ØµØ©. Ø§Ù„Ø±ÙØ§Ù‡ÙŠØ© Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© ØªÙƒÙ…Ù† ÙÙŠ Ø§Ù„ØªÙØ§ØµÙŠÙ„.",
      description:
        "Ø§Ù„Ø¬Ù…Ø§Ù„ Ù‡Ùˆ ØªØ¬Ø±Ø¨Ø© Ù…ØªÙƒØ§Ù…Ù„Ø©. Ù…Ù† Ø±Ø§Ø¦Ø­Ø© Ø§Ù„Ø³ÙŠØ±ÙˆÙ… Ø§Ù„ÙØ§Ø®Ø± Ø¥Ù„Ù‰ Ø¥Ø´Ø±Ø§Ù‚Ø© Ø±ÙˆØªÙŠÙ† Ø§Ù„Ø¹Ø±ÙˆØ³ØŒ Ù†Ù†Ø³Ù‚ Ù„ÙƒÙ Ø¬Ù…Ø§Ù„ÙŠØ§Øª Ø±Ø§Ù‚ÙŠØ© ØªØ­ÙˆÙ„ Ø±ÙˆØªÙŠÙ†Ùƒ Ø§Ù„ÙŠÙˆÙ…ÙŠ Ù„Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø¥Ù„Ù‰ Ù„Ø­Ø¸Ø© Ù…Ù† Ø§Ù„Ø¯Ù„Ø§Ù„ Ø§Ù„Ø®Ø§Ù„Øµ.",
      badges: ["Ø¥Ø´Ø±Ø§Ù‚Ø© Ø§Ù„Ø¹Ø±ÙˆØ³", "Ù‚ÙˆØ§Ù… Ø­Ø³ÙŠ", "ØªÙˆÙ‡Ø¬ Ø³Ø§Ø­Ø±"],
    },
  },
};

const BrandStory = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = content[language];

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-accent opacity-50" />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Dual-persona columns */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
          {/* Dr. Sami â€” Clinical */}
          <div
            className={`rounded-2xl border border-primary/20 bg-primary/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {t.drSami.name}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {t.drSami.role}
                </p>
              </div>
            </div>

            <blockquote
              className={`font-body text-muted-foreground leading-relaxed italic ps-4 ${isRTL ? "border-e-2 border-primary/30 pe-4 ps-0" : "border-s-2 border-primary/30"}`}
            >
              "{t.drSami.quote}"
            </blockquote>

            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t.drSami.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
              {t.drSami.badges.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-body rounded-full bg-primary/10 text-primary border border-primary/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Ms. Zain â€” Aesthetic */}
          <div
            className={`rounded-2xl border border-accent/30 bg-accent/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {t.msZain.name}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {t.msZain.role}
                </p>
              </div>
            </div>

            <blockquote
              className={`font-body text-muted-foreground leading-relaxed italic ps-4 ${isRTL ? "border-e-2 border-accent/40 pe-4 ps-0" : "border-s-2 border-accent/40"}`}
            >
              "{t.msZain.quote}"
            </blockquote>

            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t.msZain.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
              {t.msZain.badges.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-body rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Central logo emblem */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-accent/15 rounded-full animate-spin-slow" />
            <img
              src={asperLogo}
              alt={isRTL ? "Ø´Ø¹Ø§Ø± Ø£Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠ" : "Asper Beauty emblem"}
              className="w-28 h-28 rounded-full object-cover border-2 border-accent/30 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-transparent to-accent opacity-50" />
    </section>
  );
};

export default BrandStory;

