import { useState, useEffect, useRef } from "react";
import { X, FlaskConical, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "asper_exit_popup_dismissed";
const DISMISS_DAYS = 14;

export function ExitIntentPopup() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Check if already dismissed recently
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ts = Number(raw);
      if (Date.now() - ts < DISMISS_DAYS * 86400000) return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered.current || e.clientY > 20) return;
      triggered.current = true;
      // Delay slightly so it feels natural
      setTimeout(() => setVisible(true), 400);
    };

    // Also trigger on mobile after 30s of scroll
    const mobileTimer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        setVisible(true);
      }
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await supabase.from("newsletter_subscribers").upsert({ email: email.trim().toLowerCase() });
      setDone(true);
      toast.success(isAr ? "تم الاشتراك! تحقق من بريدك." : "Subscribed! Check your inbox for your guide.");
      setTimeout(dismiss, 3000);
    } catch {
      toast.error(isAr ? "حدث خطأ، حاول مجدداً." : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={dismiss}
        aria-hidden
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md",
          "rounded-2xl border border-primary/30 bg-card shadow-2xl p-6 flex flex-col gap-5",
          "animate-in zoom-in-95 duration-300",
          isAr && "rtl",
        )}
        role="dialog"
        aria-labelledby="exit-popup-title"
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FlaskConical className="h-7 w-7 text-primary" />
          </div>
        </div>

        {/* Content */}
        {!done ? (
          <>
            <div className="text-center">
              <h2 id="exit-popup-title" className="font-heading text-lg font-bold text-foreground mb-2">
                {isAr ? "لا تفوتك دليلك المجاني!" : "Before You Go — Free Skincare Guide!"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? "احصل على دليل العناية السريرية بالبشرة — اختيارات صيدلانيينا لأفضل روتين يومي."
                  : "Get our Clinical Skincare Guide — pharmacist picks for your best daily routine. Free, no spam."}
              </p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                  className="pl-9"
                  required
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting
                  ? (isAr ? "جارٍ الإرسال..." : "Sending...")
                  : (isAr ? "أرسل لي الدليل مجاناً" : "Send Me the Free Guide")}
              </Button>
            </form>
            <p className="text-center text-[10px] text-muted-foreground">
              {isAr ? "لن نرسل لك بريداً مزعجاً. إلغاء الاشتراك في أي وقت." : "No spam ever. Unsubscribe anytime."}
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <h3 className="font-heading font-semibold text-foreground mb-1">
              {isAr ? "أهلاً بك في عائلة Asper!" : "Welcome to the Asper Family!"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isAr ? "تحقق من بريدك للحصول على دليلك." : "Check your inbox for your clinical skincare guide."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
