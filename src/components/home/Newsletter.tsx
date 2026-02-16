import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim().toLowerCase() },
      });

      if (error) {
        // Check for rate limiting
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Join the <span className="text-primary">Inner Circle</span>
        </h2>
        <p className="font-body text-muted-foreground mb-8 leading-relaxed">
          Receive pharmacist-curated regimens and exclusive wellness advice delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email for a prescription of beauty..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm px-6">
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
