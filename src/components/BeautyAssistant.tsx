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
  const [messages, setMessages] = useState<Record<string, any>[]>([]);
  const [inputValue, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<"dr_sami" | "ms_zain">("dr_sami");
  const { language, locale } = useLanguage();
  const isAr = locale === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for external persona switch events
  useEffect(() => {
    const handlePersonaChange = (e: any) => {
      if (e.detail?.persona) {
        setPersona(e.detail.persona);
        if (!isOpen) setIsOpen(true);
      }
    };
    window.addEventListener("open-beauty-assistant", handlePersonaChange);
    return () => window.removeEventListener("open-beauty-assistant", handlePersonaChange);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageOverride?: string) => {
    const text = (messageOverride ?? inputValue).trim();
    if (!text) return;
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    if (!messageOverride) setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('beauty-assistant', {
        body: { messages: [...messages, userMsg], language, persona }
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
                    src={persona === "ms_zain" ? "/ms-zain-avatar.png" : "/dr-sami-head.png"} 
                    alt={persona === "ms_zain" ? "Ms. Zain" : "Dr. Sami"} 
                    className="w-full h-full object-cover object-top transition-all duration-500"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
              </div>

              <div className="flex flex-col">
                <span className="font-display text-sm font-semibold tracking-wide text-foreground leading-tight">
                  {isAr 
                    ? (persona === "ms_zain" ? "مس زين" : "د. سامي") 
                    : (persona === "ms_zain" ? "Ms. Zain" : "Dr. Sami")}
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
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100%-2rem)] md:w-[400px] h-[600px] max-h-[80vh] bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(128,0,32,0.08)] flex flex-col overflow-hidden z-[101]"
          >
            {/* Header Area: Dynamic Color for Authority/Luxury */}
            <div 
              className={cn(
                "px-6 py-4 flex items-center justify-between shadow-sm shrink-0 relative overflow-hidden transition-colors duration-700",
                persona === "ms_zain" ? "bg-[#D4AF37]" : "bg-[#800020]"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                <h3 className="text-[#F8F8FF] font-semibold tracking-wide text-sm uppercase">
                  {isAr 
                    ? (persona === "ms_zain" ? "مس زين — خبيرة الجمال" : "د. سامي — استشارة طبية") 
                    : (persona === "ms_zain" ? "Ms. Zain — Beauty Advisor" : "Dr. Sami — Clinical Consultation")}
                </h3>
              </div>
              
              {/* Persona Toggle */}
              <div className="flex items-center gap-2 relative z-10 mr-2">
                <button 
                  onClick={() => setPersona(persona === "dr_sami" ? "ms_zain" : "dr_sami")}
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                  title="Switch Persona"
                >
                  {persona === "dr_sami" ? <Sparkles className="h-3.5 w-3.5 text-white" /> : <Stethoscope className="h-3.5 w-3.5 text-white" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Area: Transparent Glass */}
            <ScrollArea ref={scrollRef} className="flex-1 p-5 space-y-5 bg-transparent">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-polished-gold/20 to-transparent flex items-center justify-center border border-polished-gold/30 shadow-[0_4px_20px_-5px_rgba(212,175,55,0.3)] overflow-hidden">
                    <img 
                      src={persona === "ms_zain" ? "/ms-zain-avatar.png" : "/dr-bot-character.png"} 
                      className="w-16 h-16 object-contain" 
                      alt="Persona Icon" 
                    />
                  </div>
                  <h4 className="text-asper-ink font-heading text-xl font-bold mb-2">
                    {isAr ? "استشارة مجانية" : "Private Consultation"}
                  </h4>
                  <p className="text-asper-ink/70 text-sm max-w-xs mx-auto leading-relaxed mb-6 italic font-body">
                    {isAr 
                      ? (persona === "ms_zain" ? "أهلاً بكِ. دعينا نكتشف سر إشراقكِ اليوم." : "أهلاً بكِ في عيادتنا الرقمية. صفي لي حالة بشرتكِ بدقة.")
                      : (persona === "ms_zain" ? "Welcome. Let's find your signature glow today." : "Welcome to our digital clinic. Please describe your skin concerns.")}
                  </p>
                  
                  <div className="flex flex-col gap-2 px-4">
                    {['Routine for acne-prone skin', 'Best anti-aging serum', 'Daily hydration for sensitive skin'].map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="text-left px-4 py-3 text-sm bg-white border border-polished-gold/20 rounded-xl text-asper-ink/80 hover:bg-polished-gold/5 hover:border-polished-gold/40 hover:text-asper-ink transition-all shadow-sm active:scale-95 font-medium"
                      >
                        {isAr && idx === 0 ? "روتين للبشرة المعرضة لحب الشباب" : 
                         isAr && idx === 1 ? "أفضل سيروم مقاوم للتجاعيد" : 
                         isAr && idx === 2 ? "ترطيب يومي للبشرة الحساسة" : suggestion}
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
                    "max-w-[85%] p-4 text-[14px] leading-relaxed relative",
                    m.role === 'user' 
                      ? "bg-asper-ink text-polished-white font-medium rounded-2xl rounded-br-sm shadow-md" 
                      : "bg-white border border-polished-gold/20 text-asper-ink shadow-sm rounded-2xl rounded-bl-sm"
                  )}>
                    {m.content}
                    {m.trayProducts && (
                      <div className="mt-4">
                        <DigitalTray products={m.trayProducts} persona={persona} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-polished-gold/20 p-4 rounded-2xl rounded-bl-sm flex items-center gap-3 shadow-sm min-w-[200px]">
                    <div className="flex gap-1">
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        className={cn("w-1.5 h-1.5 rounded-full", persona === "ms_zain" ? "bg-[#D4AF37]" : "bg-[#800020]")}
                      />
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className={cn("w-1.5 h-1.5 rounded-full", persona === "ms_zain" ? "bg-[#D4AF37]" : "bg-[#800020]")}
                      />
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className={cn("w-1.5 h-1.5 rounded-full", persona === "ms_zain" ? "bg-[#D4AF37]" : "bg-[#800020]")}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      {isAr 
                        ? (persona === "ms_zain" ? "مس زين تنسق لكِ الأفضل..." : "د. سامي يحلل البيانات الطبية...") 
                        : (persona === "ms_zain" ? "Ms. Zain is curating your luxury edit..." : "Dr. Sami is analyzing clinical data...")}
                    </span>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white/60 border-t border-white/50 backdrop-blur-lg shrink-0">
              <div className="flex gap-3 relative">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isAr ? "اكتبي رسالتك هنا..." : "Type your message..."}
                  className="rounded-full border-gray-200 focus:border-polished-gold focus:ring-1 focus:ring-polished-gold/50 transition-all h-12 pr-14 pl-5 shadow-inner bg-white/80"
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full text-white transition-all shadow-md flex items-center justify-center p-0 hover:scale-105",
                    persona === "ms_zain" ? "bg-[#D4AF37] hover:bg-[#B48F17]" : "bg-[#800020] hover:bg-[#600018]"
                  )}
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
