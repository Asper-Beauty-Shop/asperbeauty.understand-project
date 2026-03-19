import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export const FloatingConciergeWidget = () => {
  const { isRTL, locale } = useLanguage();
  const isAr = locale === "ar";
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Track overlay state to hide FAB when chat is open
  useEffect(() => {
    const onOpen = () => setIsAssistantOpen(true);
    const onClose = () => setIsAssistantOpen(false);
    // The BeautyAssistant dispatches open-beauty-assistant; we listen for unmount via AnimatePresence
    window.addEventListener("open-beauty-assistant", onOpen);
    // We also poll the overlay presence
    const observer = new MutationObserver(() => {
      const overlay = document.querySelector('[data-concierge-overlay]');
      setIsAssistantOpen(!!overlay);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("open-beauty-assistant", onOpen);
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-beauty-assistant"));
  };

  return (
    <AnimatePresence>
      {!isAssistantOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, transition: { duration: 0.3 } }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 1 }}
          onClick={handleClick}
          className={`fixed bottom-6 z-[100] group clinical-glass w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-[0.95] border border-white hover:border-accent/40 ${isRTL ? "left-6" : "right-6"}`}
          aria-label={isAr ? "افتح المستشار الرقمي" : "Open Digital Concierge"}
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-50 pointer-events-none" />

          {/* Sparkle icon */}
          <span className="text-2xl text-primary group-hover:scale-110 transition-transform">✨</span>

          {/* Hover label */}
          <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-display text-primary bg-card/90 px-3 py-1 rounded-full shadow-sm pointer-events-none whitespace-nowrap">
            {isAr ? "استشارة خبير" : "Consult an Expert"}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
