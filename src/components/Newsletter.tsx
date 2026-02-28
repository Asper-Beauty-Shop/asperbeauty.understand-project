import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatedSection } from "./AnimatedSection";
import { Mail, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(
        isArabic ? "مرحباً بك في آسبر بيوتي" : "Welcome to Asper Beauty",
        {
          description: isArabic
            ? "ستصلك آخر العروض الحصرية قريباً."
            : "You'll receive our exclusive updates soon.",
          position: "top-center",
        },
      );
      setEmail("");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-gradient-to-b from-cream via-cream to-cream-dark relative overflow-hidden"
    >
      {/* Decorative Gold Accent Line - Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="luxury-container relative">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-2 border-gold/40 mb-6 shadow-[0_4px_20px_rgba(212,175,55,0.25)] group hover:shadow-[0_6px_30px_rgba(212,175,55,0.35)] transition-shadow duration-500">
            <Mail className="w-7 h-7 text-gold" />
          </div>

          <p className="font-script text-xl lg:text-2xl text-gold mb-4">
            {isArabic ? "ابقي على تواصل" : "Stay Connected"}
          </p>
          <h2
            style={{
              background:
                "linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            className="font-display text-4xl md:text-5xl mb-6 drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
          >
            {isArabic ? "انضمي إلى عالمنا" : "Join Our World"}
          </h2>

          {/* Luxury Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <p className="font-body text-charcoal/70 mb-10 leading-relaxed text-lg">
            {isArabic
              ? "اشتركي لتحصلي على عروض حصرية، وصول مبكر للمنتجات الجديدة، ونصائح خبراء الجمال مباشرة إلى بريدك."
              : "Subscribe to receive exclusive offers, early access to new arrivals, and expert beauty insights delivered to your inbox."}
          </p>

          <AnimatedSection animation="fade-up" delay={200}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              {/* Premium Input with focus effects */}
              <div
                className={`relative flex-1 transition-all duration-500 ${
                  isFocused ? "scale-[1.02]" : ""
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isArabic
                    ? "أدخلي بريدك الإلكتروني"
                    : "Enter your email"}
                  className={`w-full px-6 py-4 bg-white border-2 rounded-full text-charcoal placeholder:text-charcoal/40 font-body text-sm 
                    focus:outline-none transition-all duration-500 shadow-gold-sm
                    ${
                    isFocused
                      ? "border-gold shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                      : "border-gold/30 hover:border-gold/50"
                  }`}
                  required
                />
                {/* Subtle glow on focus */}
                {isFocused && (
                  <div className="absolute inset-0 rounded-full bg-gold/5 pointer-events-none animate-pulse" />
                )}
              </div>

              {/* Premium Button */}
              <Button
                type="submit"
                className="relative overflow-hidden bg-gradient-to-r from-gold via-gold to-gold-light text-burgundy font-display text-sm tracking-widest uppercase px-8 py-4 rounded-full
                  shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] 
                  hover:scale-105 transition-all duration-500 whitespace-nowrap group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isArabic ? "اشتركي" : "Subscribe"}
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Button>
            </form>
          </AnimatedSection>

          <p className="text-xs text-charcoal/50 font-body mt-8">
            {isArabic
              ? "بالاشتراك، أنتِ توافقين على سياسة الخصوصية. يمكنك إلغاء الاشتراك في أي وقت."
              : "By subscribing, you agree to our Privacy Policy. Unsubscribe anytime."}
          </p>
        </AnimatedSection>
      </div>

      {/* Decorative Gold Accent Line - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
};
