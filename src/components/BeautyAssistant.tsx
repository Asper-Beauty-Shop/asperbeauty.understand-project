import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Send, Stethoscope, X, Sparkles, HeartPulse, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ASPER_PROTOCOL } from "@/lib/asperProtocol";
import { DigitalTray } from "./chat/DigitalTray";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export const BeautyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<"dr_sami" | "ms_zain">("dr_sami");
  const [messages, setMessages] = useState<Record<string, any>[]>([]);
  const [inputValue, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { language, locale } = useLanguage();
  const isAr = locale === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.persona) {
        setActivePersona(e.detail.persona);
      }
    };
    window.addEventListener("open-beauty-assistant", handleOpen);
    return () => window.removeEventListener("open-beauty-assistant", handleOpen);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (val?: string) => {
    const messageContent = val || inputValue;
    if (!messageContent.trim()) return;
    const userMsg = { role: "user", content: messageContent };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('beauty-assistant', {
        body: { messages: [...messages, userMsg], language, persona: activePersona }
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data.reply, trayProducts: data.products }]);
    } catch (err) {
      console.error(err);
      toast.error(ASPER_PROTOCOL.errorShort[language === 'ar' ? 'ar' : 'en']);
    } finally {
      setIsLoading(false);
    }
  };

  const personaTheme = activePersona === "dr_sami" 
    ? { bg: "bg-asper-ink", text: "text-polished-white", icon: "/dr-sami-head.png", accent: "text-polished-gold" }
    : { bg: "bg-polished-gold", text: "text-burgundy", icon: "/dr-bot-character.png", accent: "text-burgundy" };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 1 }}
            className="fixed bottom-6 right-4 sm:right-8 z-[100] cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-3 bg-background/90 backdrop-blur-xl border border-polished-gold/25 rounded-full pl-2 pr-5 py-2 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:shadow-[0_12px_50px_-8px_rgba(197,160,40,0.3)] group-hover:border-polished-gold/50 group-hover:scale-105">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-polished-gold/40">
                  <img 
                    src={personaTheme.icon} 
                    alt={activePersona} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
              </div>

              <div className="flex flex-col">
                <span className="font-display text-sm font-semibold tracking-wide text-foreground leading-tight">
                  {activePersona === "dr_sami" 
                    ? (isAr ? "د. سامي" : "Dr. Sami")
                    : (isAr ? "مس زين" : "Ms. Zain")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-polished-gold/80 font-body">
                  {isAr ? "استشارة مباشرة" : "Beauty Consultant"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[101] w-full sm:w-[420px] h-[100dvh] sm:h-[650px] bg-asper-stone-light sm:rounded-2xl border border-polished-gold/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={cn(personaTheme.bg, "p-5 flex items-center justify-between border-b border-polished-gold/20 shrink-0 relative overflow-hidden")}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-polished-gold/60 shadow-lg bg-white">
                  <img src={personaTheme.icon} className="w-full h-full object-cover object-top" alt={activePersona} />
                </div>
                <div>
                  <h3 className={cn(personaTheme.text, "text-sm uppercase tracking-[0.15em] font-bold")}>
                    {activePersona === "dr_sami" 
                      ? (isAr ? "الدكتور سامي" : "Dr. Sami")
                      : (isAr ? "المستشارة زين" : "Consultant Zain")}
                  </h3>
                  <span className={cn(personaTheme.accent, "text-[10px] uppercase tracking-widest flex items-center gap-1.5 mt-0.5 opacity-90")}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {isAr ? "متصل الآن" : "Online & Ready"}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={cn(personaTheme.text, "opacity-60 hover:opacity-100 transition-opacity relative z-10 p-2 rounded-full hover:bg-white/10")}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <ScrollArea ref={scrollRef} className="flex-1 p-5 space-y-5 bg-white/50 backdrop-blur-md">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-polished-gold/20 to-transparent flex items-center justify-center border border-polished-gold/30 shadow-[0_4px_20px_-5px_rgba(212,175,55,0.3)]">
                    <img src={personaTheme.icon} className="w-16 h-16 object-contain" alt="Icon" />
                  </div>
                  <h4 className="text-asper-ink font-heading text-xl font-bold mb-2">
                    {activePersona === "dr_sami" 
                      ? (isAr ? "استشارة طبية" : "Clinical Consultation")
                      : (isAr ? "روتين الجمال" : "Beauty Rituals")}
                  </h4>
                  <p className="text-asper-ink/70 text-sm max-w-xs mx-auto leading-relaxed mb-6">
                    {activePersona === "dr_sami"
                      ? (isAr ? "أنا هنا لمساعدتك في اختيار الروتين الطبي الأمثل لبشرتك." : "I am here to guide you through medical-grade skincare protocols.")
                      : (isAr ? "أهلاً بكِ. دعينا نكتشف أفضل منتجات المكياج والعناية اليومية." : "Welcome. Let's find your perfect daily style and glow essentials.")}
                  </p>
                  
                  <div className="flex flex-col gap-2 px-4">
                    {(activePersona === "dr_sami" 
                      ? ['Routine for acne-prone skin', 'Best anti-aging protocol', 'Barrier repair for sensitive skin']
                      : ['Natural everyday makeup', 'Long-lasting lipstick shades', 'Morning spa routine steps']
                    ).map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="text-left px-4 py-3 text-sm bg-white border border-polished-gold/20 rounded-xl text-asper-ink/80 hover:bg-polished-gold/5 hover:border-polished-gold/40 hover:text-asper-ink transition-all shadow-sm active:scale-95"
                      >
                        {isAr && activePersona === "dr_sami" && idx === 0 ? "روتين للبشرة المعرضة لحب الشباب" : 
                         isAr && activePersona === "dr_sami" && idx === 1 ? "أفضل بروتوكول لمقاومة التجاعيد" : 
                         isAr && activePersona === "dr_sami" && idx === 2 ? "إصلاح حاجز البشرة الحساسة" : 
                         isAr && activePersona === "ms_zain" && idx === 0 ? "مكياج يومي طبيعي" : 
                         isAr && activePersona === "ms_zain" && idx === 1 ? "ألوان أحمر شفاه تدوم طويلاً" : 
                         isAr && activePersona === "ms_zain" && idx === 2 ? "خطوات روتين السبا الصباحي" : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn("flex w-full mb-4", m.role === 'user' ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 text-[15px] leading-relaxed relative shadow-sm",
                    m.role === 'user' 
                      ? cn(personaTheme.bg, personaTheme.text, "font-medium rounded-2xl rounded-br-sm") 
                      : "bg-white border border-polished-gold/20 text-asper-ink rounded-2xl rounded-bl-sm"
                  )}>
                    {m.content}
                    {m.trayProducts && <div className="mt-4"><DigitalTray products={m.trayProducts} /></div>}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-polished-gold/20 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-polished-gold" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{isAr ? "يحلل البيانات..." : "Analyzing..."}</span>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-polished-gold/10 shrink-0">
              <div className="flex gap-3 relative">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isAr ? "اكتبي رسالتك هنا..." : "Type your message..."}
                  className="rounded-full border-polished-gold/30 focus:border-polished-gold focus:ring-1 focus:ring-polished-gold/50 transition-all h-12 pr-14 pl-5 shadow-inner bg-asper-stone-light/30"
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={isLoading || !inputValue.trim()}
                  className={cn("absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full text-white transition-all shadow-md flex items-center justify-center p-0", personaTheme.bg, "hover:opacity-90")}
                >
                  <Send className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


