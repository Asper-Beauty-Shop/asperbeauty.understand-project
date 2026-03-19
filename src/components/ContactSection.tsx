import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

const INFO = [
  {
    icon: Phone,
    titleEn: "Phone",
    titleAr: "الهاتف",
    valueEn: "+962 79 065 6666",
    valueAr: "+962 79 065 6666",
    href: "tel:+962790656666",
  },
  {
    icon: Mail,
    titleEn: "Email",
    titleAr: "البريد الإلكتروني",
    valueEn: "asperpharma@gmail.com",
    valueAr: "asperpharma@gmail.com",
    href: "mailto:asperpharma@gmail.com",
  },
  {
    icon: MapPin,
    titleEn: "Location",
    titleAr: "الموقع",
    valueEn: "Amman, Jordan",
    valueAr: "عمان، الأردن",
    href: null,
  },
  {
    icon: Clock,
    titleEn: "Store Hours",
    titleAr: "ساعات العمل",
    valueEn: "Mon–Sat: 9AM – 8PM\nSunday: 11AM – 6PM",
    valueAr: "الاثنين – السبت: ٩ص – ٨م\nالأحد: ١١ص – ٦م",
    href: null,
  },
];

const ContactSection = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      className={cn(
        "py-24 px-6 bg-[#0a0505] relative overflow-hidden",
        isAr && "text-right"
      )}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(128,0,32,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-[10px] uppercase tracking-[0.4em] text-polished-gold mb-4">
            {isAr ? "نحن هنا لخدمتك" : "We're Here for You"}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-medium mb-4">
            {isAr ? (
              <>
                تواصلي{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                  معنا
                </span>
              </>
            ) : (
              <>
                Get in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                  Touch
                </span>
              </>
            )}
          </h2>
          <div className="h-px w-20 bg-gradient-to-r from-polished-gold/80 to-transparent mx-auto mb-5" />
          <p className="font-body text-white/55 max-w-xl mx-auto text-base leading-relaxed">
            {isAr
              ? "يسعدنا سماع رأيك. أرسلي لنا رسالة وسنرد عليك في أقرب وقت ممكن."
              : "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ── Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="bg-white/[0.04] border border-white/10 backdrop-blur-sm p-8"
          >
            <h3 className="font-display text-xl text-white mb-6">
              {isAr ? "أرسلي رسالة" : "Send us a Message"}
            </h3>

            {submitted ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-polished-gold/20 border border-polished-gold/50 flex items-center justify-center">
                  <Send className="w-5 h-5 text-polished-gold" />
                </div>
                <p className="font-display text-white text-lg">
                  {isAr ? "شكراً لتواصلك!" : "Message Sent!"}
                </p>
                <p className="font-body text-white/50 text-sm">
                  {isAr ? "سنرد عليك قريباً." : "We'll get back to you shortly."}
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-widest text-white/40 mb-2">
                      {isAr ? "الاسم" : "Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "اسمك" : "Your name"}
                      dir={isAr ? "rtl" : "ltr"}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/25 focus:outline-none focus:border-polished-gold/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-widest text-white/40 mb-2">
                      {isAr ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      dir="ltr"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/25 focus:outline-none focus:border-polished-gold/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[11px] uppercase tracking-widest text-white/40 mb-2">
                    {isAr ? "الموضوع" : "Subject"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "How can we help?"}
                    dir={isAr ? "rtl" : "ltr"}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/25 focus:outline-none focus:border-polished-gold/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-[11px] uppercase tracking-widest text-white/40 mb-2">
                    {isAr ? "الرسالة" : "Message"}
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={isAr ? "اكتبي رسالتك هنا..." : "Write your message here..."}
                    dir={isAr ? "rtl" : "ltr"}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/25 focus:outline-none focus:border-polished-gold/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className={cn(
                    "group w-full inline-flex items-center justify-center gap-2.5 px-8 py-4",
                    "bg-burgundy border-2 border-burgundy text-white",
                    "font-body text-[11px] uppercase tracking-[0.3em]",
                    "transition-all duration-500",
                    "hover:bg-transparent hover:border-polished-gold hover:text-polished-gold",
                    isAr && "flex-row-reverse"
                  )}
                >
                  <Send className="w-4 h-4" />
                  {isAr ? "إرسال الرسالة" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Contact Info Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="space-y-4"
          >
            {INFO.map((item, i) => {
              const Icon = item.icon;
              const value = isAr ? item.valueAr : item.valueEn;
              const title = isAr ? item.titleAr : item.titleEn;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 * i }}
                  className={cn(
                    "flex items-start gap-4 p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm",
                    isAr && "flex-row-reverse"
                  )}
                >
                  <div className="p-3 bg-polished-gold/10 border border-polished-gold/30 rounded-full flex-shrink-0">
                    <Icon className="w-5 h-5 text-polished-gold" />
                  </div>
                  <div className={cn(isAr && "text-right")}>
                    <h4 className="font-body text-[11px] uppercase tracking-widest text-white/40 mb-1">
                      {title}
                    </h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        dir={item.icon === Phone || item.icon === Mail ? "ltr" : undefined}
                        className="font-display text-white hover:text-polished-gold transition-colors text-base whitespace-pre-line"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-display text-white text-base whitespace-pre-line">
                        {value}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/962790656666"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 p-5 w-full",
                "bg-[#25D366]/10 border border-[#25D366]/30",
                "hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-300 group",
                isAr && "flex-row-reverse"
              )}
            >
              <div className="p-2.5 bg-[#25D366]/20 rounded-full flex-shrink-0">
                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className={cn("flex-1", isAr && "text-right")}>
                <p className="font-body text-[11px] uppercase tracking-widest text-white/40 mb-0.5">
                  {isAr ? "واتساب" : "WhatsApp"}
                </p>
                <p className="font-display text-white text-sm group-hover:text-[#25D366] transition-colors">
                  {isAr ? "تحدثي معنا مباشرة" : "Chat with us directly"}
                </p>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
