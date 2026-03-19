import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Loader2, Mail, Sparkles } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

interface SaleSignupFormProps {
  isAr: boolean;
}

export function SaleSignupForm({ isAr }: SaleSignupFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(isAr ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("sale_subscribers")
        .insert({ email: result.data });

      if (error) {
        if (error.code === "23505") {
          toast.info(isAr ? "أنتِ مشتركة بالفعل!" : "You're already subscribed!");
          setIsSubscribed(true);
        } else {
          throw error;
        }
      } else {
        toast.success(isAr ? "تم الاشتراك بنجاح! 🎉" : "Subscribed successfully! 🎉");
        setIsSubscribed(true);
        setEmail("");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(isAr ? "حدث خطأ، حاولي مجدداً" : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="luxury-container py-12 md:py-16"
    >
      <div className="relative rounded-xl border border-accent/20 bg-card/80 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
        {/* Top gold shimmer */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="px-6 py-10 md:py-12 flex flex-col items-center text-center max-w-lg mx-auto">
          {isSubscribed ? (
            /* Success state */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Sparkles className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl text-foreground">
                {isAr ? "أنتِ في القائمة! 🎉" : "You're on the list! 🎉"}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {isAr
                  ? "سنرسل لكِ إشعاراً عند إطلاق عروض جديدة."
                  : "We'll notify you when new deals drop."}
              </p>
            </motion.div>
          ) : (
            /* Form state */
            <>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">
                {isAr ? "لا تفوّتي أي عرض" : "Never Miss a Deal"}
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-6">
                {isAr
                  ? "اشتركي ليصلكِ إشعار فوري عند إطلاق عروض وتخفيضات جديدة."
                  : "Subscribe to get notified instantly when we launch new sales and exclusive offers."}
              </p>

              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? "بريدك الإلكتروني" : "Enter your email"}
                    required
                    maxLength={255}
                    className="pl-9 bg-background border-border/50"
                    dir="ltr"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 uppercase tracking-wide text-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isAr ? (
                    "اشتركي"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>

              <p className="text-[10px] text-muted-foreground/60 font-body mt-3">
                {isAr
                  ? "لا رسائل مزعجة — فقط إشعارات العروض الحصرية."
                  : "No spam — only exclusive deal alerts."}
              </p>
            </>
          )}
        </div>

        {/* Bottom gold shimmer */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>
    </motion.section>
  );
}
