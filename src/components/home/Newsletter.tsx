import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Mail } from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address").max(254, "Email is too long");

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const validatedEmail = emailSchema.parse(email.trim().toLowerCase());
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: validatedEmail },
      });

      if (error) {
        if (error.message?.includes("429") || error.message?.includes("Too many")) {
          toast.error("Too many attempts. Please try again in a minute.");
        } else {
          throw error;
        }
      } else if (data?.status === "duplicate") {
        toast.info("You're already in the Inner Circle!", {
          description: "This email is already subscribed.",
        });
      } else if (data?.status === "subscribed") {
        toast.success("Welcome to the Inner Circle!", {
          description: "Your first curated regimen is on its way.",
        });
      }
      setEmail("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-asper-stone relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--rose-clay-light)/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Icon badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full
          bg-gradient-to-br from-polished-gold/20 via-polished-gold/10 to-transparent
          border-2 border-polished-gold/30 mb-6
          shadow-[0_2px_10px_rgba(201,169,98,0.2)]">
          <Mail className="w-6 h-6 text-polished-gold" />
        </div>

        <p className="font-body text-xs uppercase tracking-[0.25em] text-rose-clay-dark mb-3">
          Stay Connected
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-asper-ink mb-4">
          Join the <span className="text-burgundy">Inner Circle</span>
        </h2>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
          <div className="w-2 h-2 rounded-full bg-polished-gold/60 shadow-[0_0_8px_rgba(201,169,98,0.5)]" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
        </div>

        <p className="font-body text-asper-ink/70 mb-8 leading-relaxed">
          Receive pharmacist-curated regimens and exclusive wellness advice delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email for a prescription of beauty..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/80 backdrop-blur-sm border-rose-clay-light/60
              focus:border-polished-gold focus:ring-polished-gold/30
              text-asper-ink placeholder:text-rose-clay/60
              rounded-lg"
            required
          />
          <Button
            type="submit"
            disabled={submitting}
            className="bg-polished-gold text-white hover:bg-polished-gold/90
              uppercase tracking-widest text-sm px-6 rounded-lg
              shadow-[0_2px_10px_rgba(201,169,98,0.3)]
              hover:shadow-[0_4px_20px_rgba(201,169,98,0.4)]
              transition-all duration-300"
          >
            {submitting ? "Subscribingâ€¦" : "Subscribe"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-rose-clay-dark/60 font-body">
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
        </p>
      </div>

      {/* Bottom gold accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />
    </section>
  );
}

