import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import asperLogo from "@/assets/asper-lotus-logo-optimized.webp";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="splash"
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onAnimationComplete={() => { if (phase === "exit") onComplete(); }}
      >
        {/* Decorative gold rings */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full border border-accent/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full border border-accent/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: [0, 0.2, 0] }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={asperLogo}
            alt="Asper"
            className="h-24 w-auto drop-shadow-[0_0_30px_hsl(43_69%_46%/0.4)]"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === "text" || phase === "exit" ? 1 : 0, y: phase === "text" || phase === "exit" ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-heading text-lg sm:text-xl text-primary-foreground/90 tracking-wide">
            The Sanctuary of Science
          </p>
          <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="absolute bottom-12 w-40 h-0.5 bg-primary-foreground/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}