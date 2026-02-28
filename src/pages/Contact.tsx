import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { socialLinks } from "@/components/brand/SocialLinks";
import { cn } from "@/lib/utils";
import asperLogo from "@/assets/asper-lotus-logo.png";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Brand-color hover classes per platform */
const brandHover: Record<string, string> = {
  whatsapp: "hover:border-[#25D366]/50 hover:shadow-[0_6px_24px_rgba(37,211,102,0.15)] [&_.platform-icon]:group-hover:text-[#25D366]",
  instagram: "hover:border-[#E1306C]/50 hover:shadow-[0_6px_24px_rgba(225,48,108,0.15)] [&_.platform-icon]:group-hover:text-[#E1306C]",
  facebook: "hover:border-[#1877F2]/50 hover:shadow-[0_6px_24px_rgba(24,119,242,0.15)] [&_.platform-icon]:group-hover:text-[#1877F2]",
  tiktok: "hover:border-[#000000]/40 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] [&_.platform-icon]:group-hover:text-foreground",
  youtube: "hover:border-[#FF0000]/50 hover:shadow-[0_6px_24px_rgba(255,0,0,0.12)] [&_.platform-icon]:group-hover:text-[#FF0000]",
  snapchat: "hover:border-[#FFFC00]/60 hover:shadow-[0_6px_24px_rgba(255,252,0,0.18)] [&_.platform-icon]:group-hover:text-[#FFFC00]",
  linkedin: "hover:border-[#0A66C2]/50 hover:shadow-[0_6px_24px_rgba(10,102,194,0.15)] [&_.platform-icon]:group-hover:text-[#0A66C2]",
  pinterest: "hover:border-[#E60023]/50 hover:shadow-[0_6px_24px_rgba(230,0,35,0.12)] [&_.platform-icon]:group-hover:text-[#E60023]",
  x: "hover:border-foreground/40 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] [&_.platform-icon]:group-hover:text-foreground",
};

/** Bilingual descriptions */
const platformContent: Record<string, { en: { tagline: string; cta: string }; ar: { tagline: string; cta: string } }> = {
  whatsapp: {
    en: { tagline: "VIP consultations, order tracking & Dr. Sami AI Chat", cta: "Chat Now" },
    ar: { tagline: "استشارات VIP، تتبع الطلبات ودردشة د. سامي الذكية", cta: "تواصل الآن" },
  },
  instagram: {
    en: { tagline: "Brand aesthetics, Reels & DM automation", cta: "Follow Us" },
    ar: { tagline: "جماليات العلامة، ريلز ورسائل مباشرة ذكية", cta: "تابعنا" },
  },
  facebook: {
    en: { tagline: "Community, social commerce & exclusive offers", cta: "Join Community" },
    ar: { tagline: "مجتمعنا، التسوق الاجتماعي وعروض حصرية", cta: "انضم للمجتمع" },
  },
  tiktok: {
    en: { tagline: "Morning Routine videos & Ms. Zain beauty content", cta: "Watch Now" },
    ar: { tagline: "فيديوهات الروتين الصباحي ومحتوى الجمال مع مس زين", cta: "شاهد الآن" },
  },
  youtube: {
    en: { tagline: "Long-form educational content & pharmacist guides", cta: "Subscribe" },
    ar: { tagline: "محتوى تعليمي مفصّل وأدلة الصيدلاني", cta: "اشترك" },
  },
  snapchat: {
    en: { tagline: "Quick regional content & behind-the-scenes", cta: "Add Us" },
    ar: { tagline: "محتوى سريع وكواليس حصرية", cta: "أضفنا" },
  },
  linkedin: {
    en: { tagline: "Corporate credibility & pharmacist network", cta: "Connect" },
    ar: { tagline: "المصداقية المهنية وشبكة الصيادلة", cta: "تواصل" },
  },
  pinterest: {
    en: { tagline: "Morning Spa aesthetic boards & routine inspiration", cta: "Explore" },
    ar: { tagline: "لوحات جمالية وإلهام الروتين الصباحي", cta: "استكشف" },
  },
  x: {
    en: { tagline: "Customer service updates & wellness news", cta: "Follow" },
    ar: { tagline: "تحديثات خدمة العملاء وأخبار العناية", cta: "تابع" },
  },
};

const coreKeys = ["whatsapp", "instagram", "facebook", "tiktok"];

const Contact = () => {
  const { locale, dir, t, toggle } = useLanguage();
  const isAr = locale === "ar";
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background mobile-bottom-pad" dir={dir}>
      <ScrollProgress />
      <Header />

      {/* Hero Header — Bilingual */}
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5">
            {isAr ? "تواصل معنا" : "GET IN TOUCH"}
          </Badge>
          <h1 className={cn("font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4", isAr && "font-arabic")}>
            {isAr ? (
              <>تواصل مع <span className="text-primary">صيدلاني</span></>
            ) : (
              <>Connect with a <span className="text-primary">Pharmacist</span></>
            )}
          </h1>
          <p className={cn("text-muted-foreground text-lg max-w-2xl mx-auto", isAr ? "font-arabic" : "font-body")}>
            {isAr
              ? "تواصل معنا عبر أي منصة. فريقنا من الصيادلة ومساعدنا الذكي جاهزون لخدمتك."
              : "Reach us on any platform. Our AI-powered concierge and pharmacist team are ready to guide your beauty & wellness journey."}
          </p>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Contact Info Bar */}
      <section className="py-10 bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: isAr ? "واتساب كونسيرج" : "WhatsApp Concierge", value: "+962 79 065 6666", href: "https://wa.me/962790656666" },
              { icon: MapPin, label: isAr ? "عمّان، الأردن" : "Amman, Jordan", value: isAr ? "توصيل مجاني فوق ٥٠ دينار" : "Free delivery over 50 JOD" },
              { icon: Clock, label: isAr ? "وقت الاستجابة" : "Response Time", value: isAr ? "أقل من ٥ دقائق عبر الذكاء الاصطناعي" : "Under 5 minutes via AI" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-primary/5 border border-border group-hover:border-accent/40 flex items-center justify-center transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className={cn("text-xs uppercase tracking-wider text-muted-foreground", isAr ? "font-arabic" : "font-body")}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm font-heading font-semibold text-foreground hover:text-accent transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className={cn("text-sm font-semibold text-foreground", isAr ? "font-arabic" : "font-heading")}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Follow Us — Bilingual heading */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className={cn("font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2", isAr && "font-arabic")}>
              {isAr ? (
                <>قنواتنا <span className="text-accent">الرئيسية</span></>
              ) : (
                <>Our <span className="text-accent">Core Channels</span></>
              )}
            </h2>
            <p className={cn("text-muted-foreground", isAr ? "font-arabic" : "font-body")}>
              {isAr ? "خطك المباشر لذكاء الجمال الشخصي" : "Your direct line to personalized beauty intelligence"}
            </p>
          </div>

          {/* Core 4 — Large cards with brand-color hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
            {socialLinks.filter(l => coreKeys.includes(l.key)).map(({ key, href, label, Icon }) => {
              const content = platformContent[key]?.[locale] || platformContent[key]?.en;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative flex items-start gap-5 p-6 rounded-2xl border border-border bg-card transition-all duration-500 overflow-hidden",
                    brandHover[key]
                  )}
                >
                  {/* Gold top bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <div className="w-14 h-14 rounded-xl bg-primary/5 border border-border group-hover:border-current/30 flex items-center justify-center shrink-0 transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="platform-icon w-6 h-6 text-primary transition-colors duration-300">
                      <Icon />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors", isAr && "font-arabic")}>{label}</h3>
                    <p className={cn("text-sm text-muted-foreground mt-1 leading-relaxed", isAr ? "font-arabic" : "font-body")}>{content?.tagline}</p>
                    <span className={cn("inline-block mt-3 text-xs font-semibold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300", isAr ? "font-arabic" : "font-body")}>
                      {content?.cta} →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Extended Network heading */}
          <div className="text-center mb-10">
            <h2 className={cn("font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2", isAr && "font-arabic")}>
              {isAr ? (
                <>الشبكة <span className="text-primary">الموسّعة</span></>
              ) : (
                <>Extended <span className="text-primary">Network</span></>
              )}
            </h2>
            <p className={cn("text-muted-foreground", isAr ? "font-arabic" : "font-body")}>
              {isAr ? "تجدنا على جميع المنصات" : "Find us across all platforms"}
            </p>
          </div>

          {/* Extended 5 — smaller cards with brand-color hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {socialLinks.filter(l => !coreKeys.includes(l.key)).map(({ key, href, label, Icon }) => {
              const content = platformContent[key]?.[locale] || platformContent[key]?.en;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center gap-4 p-5 rounded-xl border border-border bg-card transition-all duration-300",
                    brandHover[key]
                  )}
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/5 border border-border group-hover:border-current/30 flex items-center justify-center shrink-0 transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="platform-icon w-5 h-5 text-primary transition-colors duration-300">
                      <Icon />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors", isAr && "font-arabic")}>{label}</h3>
                    <p className={cn("text-xs text-muted-foreground mt-0.5 truncate", isAr ? "font-arabic" : "font-body")}>{content?.tagline}</p>
                  </div>
                  <span className={cn("text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity font-semibold shrink-0", isAr ? "font-arabic" : "font-body")}>
                    {content?.cta} →
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* WhatsApp CTA */}
      <section className="py-20 lab-zone">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className={cn("font-heading text-3xl font-bold text-foreground mb-4", isAr && "font-arabic")}>
            {isAr ? (
              <>تفضل <span className="text-accent">اللمسة الشخصية</span>؟</>
            ) : (
              <>Prefer a <span className="text-accent">Personal Touch</span>?</>
            )}
          </h2>
          <p className={cn("text-muted-foreground mb-8", isAr ? "font-arabic" : "font-body")}>
            {isAr
              ? "مساعدنا الذكي متاح ٢٤/٧ عبر واتساب. احصل على نصائح صيدلانية فورية وتوصيات مخصصة."
              : "Our AI Concierge is available 24/7 on WhatsApp. Get instant pharmacist-grade advice, product recommendations, and order tracking."}
          </p>
          <a
            href="https://wa.me/962790656666"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-lg hover:bg-primary/90 hover:shadow-maroon-deep transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2a10 10 0 0 0-8.535 15.15L2 22l4.985-1.408A10 10 0 1 0 12 2z" />
            </svg>
            {isAr ? "تحدث مع د. سامي عبر واتساب" : "Chat with Dr. Sami on WhatsApp"}
          </a>
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <MobileBottomNav onOpenConcierge={() => {}} onOpenCart={() => setCartOpen(true)} />
    </div>
  );
};

export default Contact;
