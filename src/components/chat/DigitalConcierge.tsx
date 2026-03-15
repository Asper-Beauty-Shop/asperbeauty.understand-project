/**
 * DigitalConcierge — The primary chat widget for Asper Beauty Shop.
 *
 * Persona-aware: renders Dr. Sami (clinical) or Ms. Zain (luxury) styling
 * based on the active persona returned by the edge function.
 *
 * State:  Zustand (useChatStore) — persisted across page reloads
 * Fetch:  useBeautyChat (TanStack Query useMutation) — stable loading/error states
 * Tray:   DigitalTray — product recommendation cards injected into chat stream
 * RTL:    Tailwind logical properties throughout (ms/me/ps/pe/start/end)
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, Loader2, X, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChatStore, newMessageId, type PersonaId } from "@/stores/chatStore";
import { useBeautyChat } from "@/hooks/useBeautyChat";
import { DigitalTray, type DigitalTrayProduct } from "./DigitalTray";
import type { ChatMessage, RecommendedProduct } from "@/lib/chat-api";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona?: PersonaId;
  trayProducts?: DigitalTrayProduct[];
}

// ── Persona Config ────────────────────────────────────────────────────────────

const PERSONA_CONFIG = {
  ms_zain: {
    name: { en: "Ms. Zain", ar: "الآنسة زين" },
    subtitle: { en: "Beauty Concierge", ar: "مستشارة الجمال" },
    welcome: {
      en: "Welcome to your personal beauty ritual. I am Ms. Zain, your luxury beauty concierge. How may I curate your experience today?",
      ar: "أهلاً بكِ في طقوس جمالكِ الخاصة. أنا الآنسة زين، مستشارتكِ في عالم الجمال الراقي. كيف يمكنني أن أُنسّق تجربتكِ اليوم؟",
    },
    avatar: "/dr-bot-character.png",
  },
  dr_sami: {
    name: { en: "Dr. Sami", ar: "د. سامي" },
    subtitle: { en: "Clinical Pharmacist", ar: "الصيدلاني الإكلينيكي" },
    welcome: {
      en: "As your clinical pharmacist, I am here to provide evidence-based skincare guidance. Please describe your skin concern.",
      ar: "بوصفي صيدلانيكِ الإكلينيكي، أنا هنا لتقديم إرشادات مدعومة علمياً. صفي لي مشكلة بشرتكِ.",
    },
    avatar: "/dr-sami-head.png",
  },
  dr_rose: {
    name: { en: "Dr. Rose", ar: "د. روز" },
    subtitle: { en: "Beauty Specialist", ar: "متخصصة الجمال" },
    welcome: {
      en: "Hello! I'm Dr. Rose, your beauty guide at Asper. Tell me about your skin or wellness goals and I'll find the perfect match.",
      ar: "أهلاً! أنا دكتورة روز، مرشدتكِ في Asper. أخبريني عن أهداف بشرتكِ وسأجد لكِ ما يناسبها.",
    },
    avatar: "/dr-bot-character.png",
  },
} as const;

// ── Helper ────────────────────────────────────────────────────────────────────

function toDigitalTray(products: RecommendedProduct[]): DigitalTrayProduct[] {
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: p.price ?? 0,
    image_url: p.image_url ?? null,
    variantId: p.handle, // fallback until full Shopify variant mapping
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DigitalConciergeProps {
  /** Which persona this widget represents */
  persona?: PersonaId;
  /** Controlled open state (optional — widget manages its own state if omitted) */
  defaultOpen?: boolean;
}

export const DigitalConcierge: React.FC<DigitalConciergeProps> = ({
  persona: personaProp = "ms_zain",
  defaultOpen = false,
}) => {
  const { locale } = useLanguage();
  const lang = locale === "ar" ? "ar" : "en";
  const isAr = lang === "ar";

  const config = PERSONA_CONFIG[personaProp];
  const { sessions, addMessage } = useChatStore();

  // Build initial display messages from persisted store
  const [messages, setMessages] = useState<DisplayMessage[]>(() => {
    const persisted = sessions[personaProp];
    if (persisted.length > 0) {
      return persisted.map((m) => ({ id: m.id, role: m.role, content: m.content, persona: m.persona }));
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        content: config.welcome[lang],
        persona: personaProp,
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useBeautyChat({
    showErrorToast: false,
    onSuccess: (data) => {
      if (!data.reply) return;
      const tray = data.products?.length ? toDigitalTray(data.products) : undefined;
      const aiMsg: DisplayMessage = {
        id: newMessageId(),
        role: "assistant",
        content: data.reply,
        persona: data.persona ?? personaProp,
        trayProducts: tray,
      };
      setMessages((prev) => [...prev, aiMsg]);
      addMessage(personaProp, {
        id: aiMsg.id,
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
        persona: data.persona ?? personaProp,
        recommendedProducts: data.products?.map((p) => p.handle),
      });
    },
    onError: () => {
      // On-brand fallback message instead of a generic toast
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId(),
          role: "assistant",
          content: isAr
            ? "أعتذر، أواجه تأخيراً مؤقتاً. يرجى إعادة المحاولة خلال لحظات."
            : "I apologize — I'm experiencing a brief delay. Please try your question again in a moment.",
          persona: personaProp,
        },
      ]);
    },
  });

  // Auto-scroll on new messages
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isPending) return;

    const userMsg: DisplayMessage = { id: newMessageId(), role: "user", content: inputValue };
    const outgoing: ChatMessage[] = [
      ...messages.filter((m) => m.role !== "assistant" || m.id !== "welcome").map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: inputValue },
    ];

    setMessages((prev) => [...prev, userMsg]);
    addMessage(personaProp, { id: userMsg.id, role: "user", content: inputValue, timestamp: Date.now() });
    setInput("");
    sendMessage({ messages: outgoing, forcePersona: personaProp, language: lang });
  };

  // Allow external open trigger
  useEffect(() => {
    const key = `open-concierge-${personaProp}`;
    const handler = () => setIsOpen(true);
    window.addEventListener(key, handler);
    return () => window.removeEventListener(key, handler);
  }, [personaProp]);

  const setInput = (v: string) => setInputValue(v);

  return (
    <>
      {/* ── Floating Trigger ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 end-4 sm:end-8 z-[100] flex items-center gap-3 bg-background/90 backdrop-blur-xl border border-polished-gold/25 rounded-full ps-2 pe-5 py-2 shadow-lg hover:shadow-[0_12px_50px_-8px_rgba(197,160,40,0.3)] hover:border-polished-gold/50 hover:scale-105 transition-all duration-500 cursor-pointer group"
            aria-label={isAr ? "افتح المستشار الرقمي" : "Open digital concierge"}
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-polished-gold/40">
                <img src={config.avatar} alt={config.name[lang]} className="w-full h-full object-cover object-top" />
              </div>
              <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-heading text-sm font-semibold text-foreground leading-tight">
                {config.name[lang]}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-polished-gold/80 font-body">
                {config.subtitle[lang]}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className={cn(
              "fixed bottom-0 end-0 sm:bottom-6 sm:end-6 z-[101]",
              "w-full sm:w-[420px] h-[100dvh] sm:h-[650px]",
              "bg-background sm:rounded-2xl border border-polished-gold/20",
              "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden",
            )}
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="bg-asper-ink p-5 flex items-center justify-between border-b border-polished-gold/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-polished-gold/60 shadow-lg bg-white shrink-0">
                  <img src={config.avatar} className="w-full h-full object-cover object-top" alt={config.name[lang]} />
                </div>
                <div>
                  <h2 className="text-polished-white text-sm uppercase tracking-[0.15em] font-heading font-bold">
                    {config.name[lang]}
                  </h2>
                  <span className="text-polished-gold/80 text-[10px] uppercase tracking-widest flex items-center gap-1.5 mt-0.5 font-body">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    {isAr ? "متصل الآن" : "Online & Ready"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-polished-gold/60" aria-hidden />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-polished-gold/60 hover:text-polished-white transition-colors p-2 rounded-full hover:bg-white/10"
                  aria-label={isAr ? "إغلاق" : "Close"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-5 bg-white/50 backdrop-blur-md">
              <div className="space-y-5">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-4 text-[15px] leading-relaxed font-body rounded-2xl",
                        msg.role === "user"
                          ? "bg-asper-ink text-polished-white rounded-ee-sm shadow-md"
                          : "bg-white border border-polished-gold/20 text-foreground rounded-es-sm shadow-sm",
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.trayProducts && msg.trayProducts.length > 0 && (
                        <div className="mt-4 -mx-1">
                          <DigitalTray products={msg.trayProducts} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-polished-gold/20 p-4 rounded-2xl rounded-es-sm flex items-center gap-2 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-polished-gold" />
                      <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">
                        {isAr ? "يحلل البيانات السريرية..." : "Consulting clinical database..."}
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-polished-gold/10 shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isPending}
                  placeholder={isAr ? "صفي مشكلة بشرتكِ..." : "Describe your skin concern..."}
                  dir="auto"
                  className={cn(
                    "w-full bg-background text-foreground font-body text-sm rounded-full",
                    "py-3 ps-5 pe-14 border border-transparent",
                    "focus:outline-none focus:border-polished-gold/60 focus:ring-1 focus:ring-polished-gold/30",
                    "transition-all duration-300 placeholder:text-muted-foreground/50",
                    "disabled:opacity-50",
                  )}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isPending}
                  className={cn(
                    "absolute end-1 p-2.5 bg-primary text-primary-foreground rounded-full",
                    "hover:bg-primary/80 transition-colors duration-300",
                    "focus:ring-2 focus:ring-polished-gold focus:ring-offset-2 focus:ring-offset-white",
                    "disabled:opacity-50 disabled:pointer-events-none",
                  )}
                  aria-label={isAr ? "إرسال" : "Send"}
                >
                  <Send className="h-4 w-4 ms-0.5" />
                </button>
              </form>
              <p className="text-center mt-3 font-body text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                {isAr
                  ? "أقدم إرشادات مهنية، وليس تشخيصاً طبياً."
                  : "I provide wellness guidance, not medical diagnosis."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
