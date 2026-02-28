import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Send, Stethoscope, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { trackQuizFunnel } from "@/lib/quizFunnelAnalytics";
import { SKIN_CONCERNS } from "@/lib/categoryHierarchy";
import { detectConcernFromText } from "@/lib/concernMapping";
import { ASPER_PROTOCOL } from "@/lib/asperProtocol";
import {
  getProductsByConcern,
  regimenToTrayProducts,
} from "@/lib/prescriptionBridge";
import ChatProductCard from "./ChatProductCard";
import { DigitalTray } from "./chat/DigitalTray";

/** Omnichannel: map intent from deep link (e.g. ?intent=acne&source=ig) to first message. */
function getIntentMessage(intent: string, language: string): string {
  const i = intent.toLowerCase();
  const en: Record<string, string> = {
    acne: "What's your best skincare routine for acne-prone skin?",
    "anti-aging": "I need help with anti-aging and fine lines.",
    hydration: "What do you recommend for dry, dehydrated skin?",
    sensitivity: "I have sensitive skin. What routine do you suggest?",
    "dark spots": "What's best for dark spots and pigmentation?",
  };
  const ar: Record<string, string> = {
    acne: "ما أفضل روتين للبشرة المعرضة لحب الشباب؟",
    "anti-aging": "أحتاج مساعدة في مكافحة الشيخوخة والتجاعيد.",
    hydration: "ماذا تنصح للبشرة الجافة والجافة؟",
    sensitivity: "بشرتي حساسة. ما الروتين الذي تقترحه؟",
    "dark spots": "ما الأفضل للبقع الداكنة والتصبغ؟",
  };
  const map = language === "ar" ? ar : en;
  return map[i] ||
    (language === "ar"
      ? `أحتاج مساعدة بخصوص: ${intent}`
      : `I need help with: ${intent}`);
}

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: Array<{ id: string; title?: string; price?: number; image_url?: string | null }>;
  /** From backend "recommend" event: link to concern collection for "See My Regimen" */
  shopRegimenPath?: string | null;
  /** 3-step regimen from Prescription Bridge (Shopify); when set, Digital Tray uses this */
  trayProducts?:
    | Array<{
      id: string;
      title: string;
      price: number;
      image_url: string | null;
      brand?: string | null;
      category?: string | null;
      original_price?: number | null;
    }>
    | null;
};

const CHAT_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/beauty-assistant`;
const CAPTURE_LEAD_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capture-bot-lead`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

// Smart Filter: map concern id to first message (Analyze step)
const concernToMessage: Record<string, { en: string; ar: string }> = {
  acne: {
    en: "What is the best skincare routine for acne-prone skin?",
    ar: "ما هو أفضل روتين للعناية بالبشرة المعرضة لحب الشباب؟",
  },
  "anti-aging": {
    en: "I need help with anti-aging and fine lines.",
    ar: "أحتاج مساعدة في مكافحة الشيخوخة والتجاعيد.",
  },
  hydration: {
    en: "My skin feels tight and dry. What do you recommend?",
    ar: "بشرتي تشعر بالجفاف والشد. ماذا تنصح؟",
  },
  sensitivity: {
    en: "I have sensitive skin. What regimen do you suggest?",
    ar: "بشرتي حساسة. ما الروتين الذي تقترحه؟",
  },
  "dark-spots": {
    en: "What's best for dark spots and pigmentation?",
    ar: "ما الأفضل للبقع الداكنة والتصبغ؟",
  },
  "sun-protection": {
    en: "I need a good sunscreen and sun protection routine.",
    ar: "أحتاج واقي شمس جيد وروتين للحماية من الشمس.",
  },
  wrinkles: {
    en: "I want to address wrinkles and firmness.",
    ar: "أريد التخلص من التجاعيد والترهلات.",
  },
  cleansing: {
    en: "What cleanser and cleansing routine do you recommend?",
    ar: "ما المنظف وروتين التنظيف الذي تنصح به؟",
  },
};

function buildQuickPrompts(language: string) {
  const isAr = language === "ar";
  const smartFilter = SKIN_CONCERNS.slice(0, 8).map((c) => ({
    label: isAr ? c.labelAr : c.labelEn,
    message: concernToMessage[c.id]?.[isAr ? "ar" : "en"] ??
      (isAr
        ? `أحتاج مساعدة بخصوص: ${c.labelAr}`
        : `I need help with: ${c.labelEn}`),
  }));
  const extra = isAr
    ? [
      {
        label: "آمن للحمل؟",
        message: "ما هي مكونات العناية بالبشرة الآمنة للاستخدام أثناء الحمل؟",
      },
      {
        label: "مقارنة السيروم",
        message:
          "هل يمكنك مقارنة سيروم فيتامين سي مع سيروم الريتينول لمكافحة الشيخوخة؟",
      },
    ]
    : [
      {
        label: "Safe for Pregnancy?",
        message: "Which skincare ingredients are safe to use during pregnancy?",
      },
      {
        label: "Compare Serums",
        message:
          "Can you compare vitamin C serums vs retinol serums for anti-aging?",
      },
    ];
  return [...smartFilter, ...extra];
}

export const BeautyAssistant = () => {
  const { language, isRTL } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveRoutineMsgIdx, setSaveRoutineMsgIdx] = useState<number | null>(
    null,
  );
  const [saveEmail, setSaveEmail] = useState("");
  const [saveWhatsapp, setSaveWhatsapp] = useState("");
  const [saveSaving, setSaveSaving] = useState(false);
  const [saveDone, setSaveDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intentAppliedRef = useRef(false);
  const fetchingRegimenForRef = useRef<Set<number>>(new Set());
  const translations = {
    en: {
      title: "Asper Digital Consult",
      subtitle: "Clinical Skincare Expert",
      placeholder: "Describe your skin concern...",
      welcome:
        "Hello. I am trained on clinical skincare data. Tell me your skin concern (e.g., Acne, Dryness) or ask about a specific ingredient.",
      buttonText: "Ask the Pharmacist",
    },
    ar: {
      title: "استشارة آسبر الرقمية",
      subtitle: "خبير العناية بالبشرة السريرية",
      placeholder: "صف مشكلة بشرتك...",
      welcome:
        "مرحباً. أنا مدرب على بيانات العناية بالبشرة السريرية. أخبرني عن مشكلة بشرتك (مثل حب الشباب، الجفاف) أو اسأل عن مكون معين.",
      buttonText: "اسأل الصيدلي",
    },
  };

  const t = translations[language];
  const prompts = buildQuickPrompts(language);
  const detectedConcern = detectConcernFromText(input);
  // Map slug to display label (concernMapping may return e.g. brightening/dryness; SKIN_CONCERNS uses dark-spots/hydration)
  const concernForLabel =
    detectedConcern === "brightening" || detectedConcern === "pigmentation"
      ? "dark-spots"
      : detectedConcern === "dryness"
      ? "hydration"
      : detectedConcern;
  const detectedLabel =
    concernForLabel && SKIN_CONCERNS.find((c) => c.id === concernForLabel)
      ? (language === "ar"
        ? SKIN_CONCERNS.find((c) => c.id === concernForLabel)!.labelAr
        : SKIN_CONCERNS.find((c) => c.id === concernForLabel)!.labelEn)
      : (detectedConcern
        ? (language === "ar"
          ? detectedConcern
          : detectedConcern.replace(/-/g, " "))
        : null);

  /** Diagnostic reply for Analyze step: "I am honored to serve. Based on your description, it appears you are experiencing [Concern]. May I recommend a regimen tailored to this concern?" */
  const diagnosticScriptEn = detectedLabel
    ? `I am honored to serve. Based on your description, it appears you are experiencing ${detectedLabel}. May I recommend a regimen tailored to this concern?`
    : null;
  const diagnosticScriptAr = detectedLabel
    ? `يشرفني أن أخدمك. بناءً على وصفك، يبدو أنك تعانين من ${detectedLabel}. هل أستطيع أن أوصي بروتين مصمم لهذا الاهتمام؟`
    : null;
  const diagnosticScript = language === "ar"
    ? diagnosticScriptAr
    : diagnosticScriptEn;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.welcome }]);
      trackQuizFunnel("START_QUIZ");
    }
  }, [isOpen, messages.length, t.welcome]);

  // Omnichannel: open chat and send intent when URL has ?intent=acne&source=ig
  useEffect(() => {
    const intent = searchParams.get("intent");
    if (!intent || intentAppliedRef.current) return;
    intentAppliedRef.current = true;
    setIsOpen(true);
    const intentMessage = getIntentMessage(intent, language);
    setMessages([{ role: "assistant", content: t.welcome }, {
      role: "user",
      content: intentMessage,
    }]);
    trackQuizFunnel("START_QUIZ");
    trackQuizFunnel("SELECT_CONCERN", { concern: intentMessage });
    setIsLoading(true);
    streamChat([{ role: "user", content: intentMessage }])
      .catch((err) => {
        console.error("Intent chat error:", err);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: language === "ar" ? ASPER_PROTOCOL.errorShort.ar : ASPER_PROTOCOL.errorShort.en,
        }]);
      })
      .finally(() => setIsLoading(false));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("intent");
      next.delete("source");
      return next;
    }, { replace: true });
    // Intent applied once from URL; language/setSearchParams/t.welcome are stable or intentionally excluded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Global open trigger (e.g. from Header "Consult" button)
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("open-beauty-assistant", open);
    return () => window.removeEventListener("open-beauty-assistant", open);
  }, []);

  // Prescription Bridge: when we have a concern (shopRegimenPath), fetch 3-step regimen from Shopify and use it for the Digital Tray
  useEffect(() => {
    messages.forEach((msg, idx) => {
      if (
        msg.role !== "assistant" ||
        !msg.shopRegimenPath ||
        msg.trayProducts !== undefined ||
        fetchingRegimenForRef.current.has(idx)
      ) {
        return;
      }
      const concern = msg.shopRegimenPath.replace(/^\/concerns\//, "").trim();
      if (!concern) return;
      fetchingRegimenForRef.current.add(idx);
      getProductsByConcern(concern)
        .then((regimen) => {
          const tray = regimenToTrayProducts(regimen);
          setMessages((prev) =>
            prev.map((m, i) =>
              i === idx
                ? { ...m, trayProducts: tray.length > 0 ? tray : null }
                : m
            )
          );
        })
        .catch(() => {
          setMessages((prev) =>
            prev.map((m, i) => (i === idx ? { ...m, trayProducts: null } : m))
          );
        })
        .finally(() => {
          fetchingRegimenForRef.current.delete(idx);
        });
    });
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    // Get the current session token for authenticated requests
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Please sign in to use the beauty assistant");
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        messages: userMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 401) {
        throw new Error("Please sign in to use the beauty assistant");
      }
      throw new Error("Failed to start stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    let products: Array<{ id: string; title?: string; price?: number; image_url?: string | null }> = [];
    let shopRegimenPath: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);

          if (parsed.type === "recommend" && parsed.shop_routine_path) {
            shopRegimenPath = parsed.shop_routine_path;
            continue;
          }

          if (parsed.type === "products" && parsed.products) {
            products = parsed.products;
            trackQuizFunnel("VIEW_PRESCRIPTION", {
              productCount: products.length,
              productIds: products.map((p: { id?: string }) => p.id).filter(
                Boolean,
              ),
            });
            continue;
          }

          const content = parsed.choices?.[0]?.delta?.content as
            | string
            | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) =>
                  i === prev.length - 1
                    ? {
                      ...m,
                      content: assistantContent,
                      products,
                      shopRegimenPath: shopRegimenPath ?? undefined,
                    }
                    : m
                );
              }
              return [...prev, {
                role: "assistant",
                content: assistantContent,
                products,
                shopRegimenPath: shopRegimenPath ?? undefined,
              }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    trackQuizFunnel("SELECT_CONCERN", { concern: input.trim() });
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages.filter((m) => m.content !== t.welcome));
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: language === "ar" ? ASPER_PROTOCOL.errorShort.ar : ASPER_PROTOCOL.errorShort.en,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitSaveRoutine = async (msgIdx: number) => {
    const msg = messages[msgIdx];
    if (!msg?.products?.length && !msg?.shopRegimenPath) return;
    const concern = msg.shopRegimenPath?.replace(/^\/concerns\//, "").trim() ||
      undefined;
    const recommended_product_ids = (msg.products ?? [])
      .map((p: { id?: string }) => p.id)
      .filter((id: string | undefined): id is string => typeof id === "string");
    if (!saveEmail.trim() && !saveWhatsapp.trim()) return;
    setSaveSaving(true);
    try {
      const res = await fetch(CAPTURE_LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(SUPABASE_ANON_KEY
            ? {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            }
            : {}),
        },
        body: JSON.stringify({
          contact_email: saveEmail.trim() || undefined,
          contact_whatsapp: saveWhatsapp.trim() || undefined,
          concern: concern || undefined,
          recommended_product_ids: recommended_product_ids.length
            ? recommended_product_ids
            : undefined,
          source: "chatbot",
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveDone(true);
      setSaveRoutineMsgIdx(null);
      setSaveEmail("");
      setSaveWhatsapp("");
      toast.success(
        language === "ar"
          ? "تم الحفظ. سنرسل لك الرابط قريباً."
          : "Saved. We'll send you the link shortly.",
      );
    } catch {
      setSaveDone(false);
      toast.error(
        language === "ar" ? ASPER_PROTOCOL.errorShort.ar : ASPER_PROTOCOL.errorShort.en,
      );
    } finally {
      setSaveSaving(false);
    }
  };

  const handleQuickPrompt = (message: string) => {
    if (isLoading) return;
    trackQuizFunnel("SELECT_CONCERN", { concern: message });
    setInput(message);
    // Auto-send after setting
    const userMsg: Message = { role: "user", content: message };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    streamChat(newMessages.filter((m) => m.content !== t.welcome))
      .catch((error) => {
        console.error("Chat error:", error);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: language === "ar" ? ASPER_PROTOCOL.errorShort.ar : ASPER_PROTOCOL.errorShort.en,
        }]);
      })
      .finally(() => {
        setIsLoading(false);
        setInput("");
      });
  };

  return (
    <>
      {/* Floating Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${
          isRTL ? "left-6" : "right-6"
        } z-50 flex items-center gap-3 px-5 py-3 bg-white border-2 border-gold rounded-full shadow-lg hover:shadow-xl transition-all duration-400 group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open beauty assistant"
      >
        <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-gold" />
        </div>
        <span className="font-body text-sm font-medium text-burgundy whitespace-nowrap">
          {t.buttonText}
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 ${
          isRTL ? "left-6" : "right-6"
        } z-50 w-[400px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gold/30 overflow-hidden transition-all duration-400 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header - Deep Burgundy */}
        <div className="bg-burgundy p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.title}
              </h3>
              <p className="text-xs text-gold/90 font-body">{t.subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-gold hover:bg-gold/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[320px] p-4 bg-cream/30" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                <div
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-burgundy text-white rounded-br-sm"
                        : "bg-white border border-gold/20 text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-body">
                      {msg.content}
                    </p>
                  </div>
                </div>

                {/* Product Cards + Digital Tray (Quick Add Routine) */}
                {msg.role === "assistant" && msg.products &&
                  msg.products.length > 0 && (
                  <div className="space-y-2 ml-2">
                    <p className="text-[10px] text-gold font-medium uppercase tracking-wider">
                      {language === "ar"
                        ? "المنتجات الموصى بها"
                        : "Recommended Products"}
                    </p>
                    {msg.products.slice(0, 3).map((product, pIdx) => (
                      <ChatProductCard
                        key={product.id || pIdx}
                        product={product}
                      />
                    ))}
                    <DigitalTray
                      products={(msg.trayProducts ?? msg.products).map((
                        p: { id: string; title?: string; price?: number | string; image_url?: string | null; brand?: string | null; category?: string | null; original_price?: number | null },
                      ) => ({
                        id: p.id,
                        title: p.title,
                        price: typeof p.price === "number"
                          ? p.price
                          : parseFloat(p.price) || 0,
                        image_url: p.image_url ?? null,
                        brand: p.brand ?? null,
                        category: p.category ?? null,
                        original_price: p.original_price ?? null,
                      }))}
                    />
                    <div className="flex flex-col gap-2 mt-2">
                      {msg.shopRegimenPath && (
                        <Link
                          to={msg.shopRegimenPath}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-burgundy text-gold text-xs font-medium border border-gold/30 hover:bg-burgundy/90 transition-colors"
                        >
                          {language === "ar"
                            ? "اعرض روتيني في المتجر"
                            : "See My Regimen"}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setSaveRoutineMsgIdx(
                            saveRoutineMsgIdx === idx ? null : idx,
                          )}
                        className="w-full py-2 px-3 rounded-lg border border-gold/40 text-burgundy text-xs font-medium hover:bg-gold/10 transition-colors"
                      >
                        {language === "ar"
                          ? "احفظ روتيني وأرسله لي"
                          : "Save My Routine"}
                      </button>
                    </div>
                    {saveRoutineMsgIdx === idx && (
                      <div className="mt-2 p-3 rounded-lg bg-cream/50 border border-gold/20 space-y-2">
                        <Input
                          type="email"
                          placeholder={language === "ar"
                            ? "البريد الإلكتروني"
                            : "Email"}
                          value={saveEmail}
                          onChange={(e) => setSaveEmail(e.target.value)}
                          className="text-sm h-8"
                        />
                        <Input
                          type="tel"
                          placeholder={language === "ar"
                            ? "واتساب (اختياري)"
                            : "WhatsApp (optional)"}
                          value={saveWhatsapp}
                          onChange={(e) => setSaveWhatsapp(e.target.value)}
                          className="text-sm h-8"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={saveSaving ||
                              (!saveEmail.trim() && !saveWhatsapp.trim())}
                            onClick={() => submitSaveRoutine(idx)}
                            className="flex-1 bg-burgundy text-gold text-xs"
                          >
                            {saveSaving
                              ? (language === "ar"
                                ? "جاري الحفظ..."
                                : "Saving...")
                              : (language === "ar" ? "إرسال" : "Send")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSaveRoutineMsgIdx(null);
                              setSaveEmail("");
                              setSaveWhatsapp("");
                            }}
                            className="border-gold/40 text-xs"
                          >
                            {language === "ar" ? "إلغاء" : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* See My Regimen + Save My Routine when backend sent recommend but no product cards */}
                {msg.role === "assistant" && msg.shopRegimenPath &&
                  (!msg.products || msg.products.length === 0) && (
                  <div className="ml-2 mt-2 space-y-2">
                    <Link
                      to={msg.shopRegimenPath}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-burgundy text-gold text-xs font-medium border border-gold/30 hover:bg-burgundy/90 transition-colors"
                    >
                      {language === "ar"
                        ? "اعرض روتيني في المتجر"
                        : "See My Regimen"}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setSaveRoutineMsgIdx(
                          saveRoutineMsgIdx === idx ? null : idx,
                        )}
                      className="w-full py-2 px-3 rounded-lg border border-gold/40 text-burgundy text-xs font-medium hover:bg-gold/10 transition-colors"
                    >
                      {language === "ar"
                        ? "احفظ روتيني وأرسله لي"
                        : "Save My Routine"}
                    </button>
                    {saveRoutineMsgIdx === idx && (
                      <div className="p-3 rounded-lg bg-cream/50 border border-gold/20 space-y-2">
                        <Input
                          type="email"
                          placeholder={language === "ar"
                            ? "البريد الإلكتروني"
                            : "Email"}
                          value={saveEmail}
                          onChange={(e) => setSaveEmail(e.target.value)}
                          className="text-sm h-8"
                        />
                        <Input
                          type="tel"
                          placeholder={language === "ar"
                            ? "واتساب (اختياري)"
                            : "WhatsApp (optional)"}
                          value={saveWhatsapp}
                          onChange={(e) => setSaveWhatsapp(e.target.value)}
                          className="text-sm h-8"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={saveSaving ||
                              (!saveEmail.trim() && !saveWhatsapp.trim())}
                            onClick={() => submitSaveRoutine(idx)}
                            className="flex-1 bg-burgundy text-gold text-xs"
                          >
                            {saveSaving
                              ? (language === "ar"
                                ? "جاري الحفظ..."
                                : "Saving...")
                              : (language === "ar" ? "إرسال" : "Send")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSaveRoutineMsgIdx(null);
                              setSaveEmail("");
                              setSaveWhatsapp("");
                            }}
                            className="border-gold/40 text-xs"
                          >
                            {language === "ar" ? "إلغاء" : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-white border border-gold/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gold" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 pt-2 bg-cream/30 border-t border-gold/10">
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt.message)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-body bg-white border border-gold/30 rounded-full text-burgundy hover:bg-gold hover:text-burgundy hover:border-gold transition-all duration-300 disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analyze step: detected concern + diagnostic script + "See My Regimen" CTA */}
        {detectedLabel && input.trim() && (
          <div className="px-4 pb-3 pt-2 border-t border-gold/10 bg-cream/20 space-y-2">
            <p className="text-[10px] text-gold font-medium uppercase tracking-wider">
              {language === "ar" ? "تم التعرف على الاهتمام" : "Detected concern"}
            </p>
            <span className="inline-block px-2 py-1 rounded-md bg-gold/10 text-burgundy text-xs font-body">
              {detectedLabel}
            </span>
            {diagnosticScript && (
              <>
                <p className="text-sm text-foreground/90 font-body leading-relaxed pt-1">
                  {diagnosticScript}
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="w-full bg-burgundy hover:bg-burgundy/90 text-gold border border-gold/30"
                >
                  {language === "ar" ? "اعرض روتيني" : "See My Regimen"}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gold/20 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 rounded-full bg-cream/50 border-gold/30 focus-visible:ring-gold font-body text-sm"
              disabled={isLoading}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-burgundy hover:bg-burgundy-light shrink-0"
            >
              <Send className="w-4 h-4 text-gold" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BeautyAssistant;
