import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * ChatBot — Dr. Bot floating chat trigger.
 *
 * Renders a compact floating action button that opens the Dr. Bot chat panel.
 * Designed for pages where the full BeautyAssistant widget is not mounted.
 */
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  const label = language === "ar" ? "تحدث مع د. بوت" : "Chat with Dr. Bot";
  const placeholder = language === "ar" ? "اسألني عن العناية بالبشرة…" : "Ask me about skincare…";
  const closeLabel = language === "ar" ? "إغلاق" : "Close";

  return (
    <div className="dr-bot-root" aria-live="polite">
      {/* Floating trigger button */}
      {!open && (
        <button
          className="dr-bot-trigger"
          onClick={() => setOpen(true)}
          aria-label={label}
        >
          <MessageCircle className="dr-bot-trigger-icon" aria-hidden="true" />
          <span className="dr-bot-trigger-label">{label}</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="dr-bot-panel" role="dialog" aria-label={label}>
          <div className="dr-bot-header">
            <span className="dr-bot-title">{label}</span>
            <button
              className="dr-bot-close"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
            >
              <X className="dr-bot-close-icon" aria-hidden="true" />
            </button>
          </div>
          <div className="dr-bot-body">
            <p className="dr-bot-welcome">
              {language === "ar"
                ? "مرحباً! أنا د. بوت. كيف يمكنني مساعدتك اليوم؟"
                : "Hello! I'm Dr. Bot. How can I help you today?"}
            </p>
          </div>
          <div className="dr-bot-footer">
            <input
              className="dr-bot-input"
              type="text"
              placeholder={placeholder}
              aria-label={placeholder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
