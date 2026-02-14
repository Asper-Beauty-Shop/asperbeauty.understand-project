import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Typing animation hook
function useTypingEffect(text: string, speed = 50, startDelay = 0, active = false) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, active]);
  return displayed;
}

type Phase = "typing" | "interlock" | "swap" | "regimen";

const regimenProducts = [
  { step: "Step 1 · Cleanser", name: "CeraVe Hydrating Cleanser", safe: true },
  { step: "Step 2 · Treatment", name: "Vichy LiftActiv Vitamin C", safe: true },
  { step: "Step 3 · Protection", name: "La Roche-Posay SPF 50+", safe: true },
];

export default function ConciergeShowcase() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const typedText = useTypingEffect(
    "I want a glow, but I'm pregnant.",
    45,
    400,
    phase === "typing"
  );

  // Intersection observer to trigger animation on scroll
  useEffect(() => {
    if (hasPlayed) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasPlayed(true);
          setPhase("typing");
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasPlayed]);

  // Phase sequencer
  useEffect(() => {
    if (!hasPlayed) return;
    const timers = [
      setTimeout(() => setPhase("interlock"), 2200),
      setTimeout(() => setPhase("swap"), 4000),
      setTimeout(() => setPhase("regimen"), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [hasPlayed]);

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 text-primary font-body text-xs tracking-[0.2em] px-4 py-1.5"
          >
            <Shield className="h-3 w-3 mr-2" />
            SAFETY INTERLOCK · DUAL PERSONA
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Intelligence That <span className="text-primary">Protects</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Our AI automatically detects contraindications and swaps unsafe
            ingredients — keeping your glow safe.
          </p>
        </div>

        {/* Split-screen Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* LEFT — Chat simulation */}
          <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden flex flex-col">
            {/* Chat header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs font-body text-muted-foreground tracking-wider uppercase">
                AI Concierge
              </span>
            </div>

            <div className="flex-1 p-5 space-y-4 min-h-[320px]">
              {/* User message (typing) */}
              <AnimatePresence>
                {(phase === "typing" || phase === "interlock" || phase === "swap" || phase === "regimen") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                      <p className="font-body text-sm">
                        {typedText}
                        {phase === "typing" && (
                          <span className="inline-block w-0.5 h-4 bg-primary-foreground/70 ml-0.5 animate-pulse align-middle" />
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Safety Interlock Banner */}
              <AnimatePresence>
                {(phase === "interlock" || phase === "swap" || phase === "regimen") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="border border-destructive/30 bg-destructive/5 rounded-lg px-4 py-3 flex items-start gap-3"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={
                        phase === "swap" || phase === "regimen"
                          ? { rotate: 360, scale: [1, 1.2, 1] }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {phase === "interlock" ? (
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                    </motion.div>
                    <div className="text-xs font-body">
                      <p className="font-semibold text-foreground">
                        {phase === "interlock"
                          ? "⚠️ Safety Interlock Triggered"
                          : "✅ Safety Check Passed"}
                      </p>
                      <p className="text-muted-foreground mt-0.5">
                        {phase === "interlock"
                          ? "Retinol flagged — contraindicated during pregnancy."
                          : "Regimen cleared. All ingredients pregnancy-safe."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dr. Sami response */}
              <AnimatePresence>
                {(phase === "swap" || phase === "regimen") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">🔬</span>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-xs font-semibold text-primary font-body mb-1">Dr. Sami</p>
                      <p className="font-body text-sm text-foreground">
                        Safety Check: <span className="line-through text-muted-foreground">Retinol</span> removed.
                        Replaced with Vitamin C — equally effective for radiance, fully pregnancy-safe.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ms. Zain follow-up */}
              <AnimatePresence>
                {phase === "regimen" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">✨</span>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-xs font-semibold text-accent font-body mb-1">Ms. Zain</p>
                      <p className="font-body text-sm text-foreground">
                        Radiance unlocked safely. ✨ Your glow regimen is ready!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — Product swap + Regimen result */}
          <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-body text-muted-foreground tracking-wider uppercase">
                Your Regimen
              </span>
              <Badge variant="secondary" className="text-[10px] font-body">
                3-Click Solution
              </Badge>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-center space-y-4 min-h-[320px]">
              {/* Product swap animation */}
              <AnimatePresence mode="wait">
                {(phase === "typing" || phase === "interlock") && (
                  <motion.div
                    key="unsafe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -60, rotate: -5 }}
                    transition={{ duration: 0.4 }}
                    className="border border-destructive/20 bg-destructive/5 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-md bg-destructive/10 flex items-center justify-center shrink-0">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground line-through">
                        Retinol Night Serum
                      </p>
                      <p className="font-body text-xs text-destructive">
                        ⚠ Contraindicated — Pregnancy
                      </p>
                    </div>
                  </motion.div>
                )}

                {(phase === "swap" || phase === "regimen") && (
                  <motion.div
                    key="safe"
                    initial={{ opacity: 0, x: 60, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="border border-green-500/20 bg-green-500/5 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">
                        Vichy LiftActiv Vitamin C
                      </p>
                      <p className="font-body text-xs text-green-700">
                        ✓ Pregnancy-safe alternative
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3-product regimen */}
              <AnimatePresence>
                {phase === "regimen" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-3"
                  >
                    <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                    {regimenProducts.map((p, i) => (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.15 }}
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/40"
                      >
                        <div>
                          <p className="text-[10px] font-body uppercase tracking-wider text-accent">
                            {p.step}
                          </p>
                          <p className="font-body text-sm text-foreground font-medium">
                            {p.name}
                          </p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link to="/intelligence">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 group">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          The 3-Click Solution
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
