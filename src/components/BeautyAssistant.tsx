import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ASPER_PROTOCOL } from "@/lib/asperProtocol";
import { DigitalTray } from "./chat/DigitalTray";
import { cn } from "@/lib/utils";
import { sendConsultationSummaryEmail } from "@/lib/sendConsultationEmail";
import ReactMarkdown from "react-markdown";

type Persona = "rose" | "sami";

const PERSONA_META: Record<Persona, { label: string; labelAr: string; sub: string; subAr: string; greeting: string; greetingAr: string; avatar: string }> = {
  rose: {
    label: "Dr. Rose",
    labelAr: "د. روز",
    sub: "Beauty & Skincare",
    subAr: "الجمال والعناية بالبشرة",
    greeting: "Welcome to your sanctuary. I'm Dr. Rose. How can we elevate your skincare regimen today?",
    greetingAr: "أهلاً بكِ في واحتكِ. أنا د. روز. كيف يمكنني الارتقاء بروتين العناية ببشرتكِ اليوم؟",
    avatar: "/dr-bot-character.png",
  },
  sami: {
    label: "Dr. Sami",
    labelAr: "د. سامي",
    sub: "Health & Wellness",
    subAr: "الصحة والعافية",
    greeting: "Hello, I'm Dr. Sami. I'm here to provide clinical guidance for your health and dermatological needs.",
    greetingAr: "مرحباً، أنا الدكتور سامي. أنا هنا لتقديم الإرشاد السريري لاحتياجاتكِ الصحية والجلدية.",
    avatar: "/dr-sami-head.webp",
  },
};

const LUXURY_EASE = [0.25, 0.1, 0.25, 1] as const;

const overlayVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0, y: 10, scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export const BeautyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona>("rose");
  const [messages, setMessages] = useState<Record<string, any>[]>([]);
  const [inputValue, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { language, locale } = useLanguage();
  const isAr = locale === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const emailSentRef = useRef(false);
  const [productContext, setProductContext] = useState<Record<string, unknown> | null>(null);
  const prefersReduced = useReducedMotion();

  // Listen for FAB event (optionally with product context)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.productContext) {
        setProductContext(detail.productContext);
      }
      setIsOpen(true);
    };
    window.addEventListener("open-beauty-assistant", handler);
    return () => window.removeEventListener("open-beauty-assistant", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      });
    }
  }, [messages]);

  // Reset messages when switching persona
  const switchPersona = (p: Persona) => {
    if (p !== activePersona) {
      setActivePersona(p);
      setMessages([]);
      emailSentRef.current = false;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("beauty-assistant", {
        body: { messages: [...messages, userMsg], language, persona: activePersona },
      });
      if (error) throw error;
      const reply = data.reply || "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, trayProducts: data.products }]);

      // Send consultation summary email once per session
      if (!emailSentRef.current && reply.length > 200) {
        emailSentRef.current = true;
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name")
              .eq("user_id", user.id)
              .maybeSingle();
            await sendConsultationSummaryEmail({
              to: user.email,
              customer_name: profile?.display_name || undefined,
              ai_summary: reply.slice(0, 800),
              regimen: data.products?.map((p: any) => ({
                title: p.title || p.name,
                brand: p.brand,
                price: p.price,
              })),
            });
          }
        } catch (emailErr) {
          console.warn("Failed to send consultation email:", emailErr);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(ASPER_PROTOCOL.errorShort[language === "ar" ? "ar" : "en"]);
    } finally {
      setIsLoading(false);
    }
  };

  const meta = PERSONA_META[activePersona];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={prefersReduced ? undefined : overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[101] w-full sm:w-[400px] h-[100dvh] sm:h-[600px] clinical-glass sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-white/50"
        >
          {/* ── Header: Persona Toggle ── */}
          <div className="p-2 bg-white/40 border-b border-white/50 backdrop-blur-md shrink-0">
            <div className="flex bg-background/80 rounded-2xl p-1 relative">
              {/* Sliding pill */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card rounded-xl shadow-sm border border-border"
                animate={{ left: activePersona === "rose" ? "4px" : "calc(50%)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {(["rose", "sami"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => switchPersona(p)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold z-10 transition-colors",
                    activePersona === p
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isAr ? PERSONA_META[p].labelAr : PERSONA_META[p].label}
                  <span className="text-xs font-normal block text-muted-foreground">
                    {isAr ? PERSONA_META[p].subAr : PERSONA_META[p].sub}
                  </span>
                </button>
              ))}
            </div>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full hover:bg-white/60 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Chat Body ── */}
          <ScrollArea ref={scrollRef} className="flex-1 p-5 bg-white/30">
            <div className="flex flex-col gap-4">
              {/* Empty state greeting */}
              {messages.length === 0 && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-display shrink-0 shadow-sm overflow-hidden">
                    <img src={meta.avatar} alt={meta.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-card/80 border border-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-foreground leading-relaxed">
                    {isAr ? meta.greetingAr : meta.greeting}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-display shrink-0 shadow-sm mr-3 self-start overflow-hidden">
                      <img src={meta.avatar} alt={meta.label} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] p-4 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none shadow-md"
                        : "bg-card/80 border border-white p-4 rounded-2xl rounded-tl-none shadow-sm text-foreground"
                    )}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.trayProducts && (
                      <div className="mt-4">
                        <DigitalTray products={m.trayProducts} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card/80 border border-white p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {isAr ? "يحلل البيانات..." : "Analyzing..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ── Input Area ── */}
          <div className="p-4 bg-white/40 border-t border-white/50 backdrop-blur-md shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isAr ? "اسألي عن المكونات، البروتوكولات..." : "Ask about ingredients, protocols..."}
                className="w-full bg-background border border-border text-foreground text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 w-9 h-9 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
