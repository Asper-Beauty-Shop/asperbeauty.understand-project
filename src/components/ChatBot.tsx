accept /**
 * Dr. Bot — Dual-Persona AI Assistant (Medical Luxury)
 * Persona A: Dr. Sami (Clinical Authority) — Shield, Deep Burgundy #6A1E2A
 * Persona B: Ms. Zain (Beauty Advisor) — Sparkle, Shiny Gold #C5A028
 * UI: Glass-morphism over Soft Ivory (#F5F1E8), Playfair Display headers,
 * Gold Stitch (1px solid #C5A028) for product cards. Bilingual: Tajawal + RTL for Arabic.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Send,
  Shield,
  Sparkles,
  Loader2,
  Volume2,
  VolumeX,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { playNotificationSound } from "@/lib/sounds";
import {
  detectPersonaFromInput,
  getSafetyDisclaimer,
  PERSONA_CONFIG,
  type PersonaId,
} from "@/lib/drBotPersona";
import { useLanguage } from "@/contexts/LanguageContext";

type MessageContent =
  | string
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Msg = {
  role: "user" | "assistant";
  content: string | MessageContent[];
  persona?: string;
  imagePreview?: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CHAT_URL = `${SUPABASE_URL}/functions/v1/beauty-assistant`;

function getTextContent(content: string | MessageContent[]): string {
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: "text"; text: string } => (p as { type: string }).type === "text")
    .map((p) => p.text)
    .join(" ");
}

async function streamChat({
  messages,
  userProfile,
  onPersona,
  onDelta,
  onDone,
  onSafetyFlags,
}: {
  messages: Msg[];
  userProfile?: { skin_type: string | null; skin_concern: string; tags: string[] } | null;
  onPersona: (p: string) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
  onSafetyFlags?: (flags: string[]) => void;
}) {
  const payload = messages.map((m) => ({ role: m.role, content: m.content }));

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Please sign in to use Dr. Bot.");

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: payload, userProfile }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Connection failed" }));
    throw new Error(err.error || `Error ${resp.status}`);
  }

  const persona = resp.headers.get("X-Persona");
  if (persona) onPersona(persona);

  const safetyFlags = resp.headers.get("X-Safety-Flags");
  if (safetyFlags && safetyFlags !== "none" && onSafetyFlags) {
    onSafetyFlags(safetyFlags.split(","));
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const quickPrompts = [
  { label: "✨ Find My Routine", text: "I want a personalized skincare routine based on my concerns" },
  { label: "🧪 Ingredients & Safety", text: "Which ingredients are safe during pregnancy?" },
  { label: "💄 Glow & Makeup", text: "How do I get a natural glow for a special occasion?" },
  { label: "📸 Skin Analysis", text: "" },
];

export default function ChatBot() {
  const { language, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaId>("ms_zain");
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [pendingImage, setPendingImage] = useState<{ file: File; preview: string } | null>(null);
  const [safetyFlags, setSafetyFlags] = useState<string[]>([]);
  const [safetyBanner, setSafetyBanner] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    skin_type: string | null;
    skin_concern: string;
    tags: string[];
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("concierge_profiles")
          .select("skin_type, skin_concern")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setUserProfile({
            skin_type: data.skin_type,
            skin_concern: data.skin_concern ?? "",
            tags: [],
          });
        }
      } catch {
        // ignore
      }
    })();
  }, [open, isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Platform-wide: Header/Footer "Consult" and "Ask Pharmacist" open Dr. Bot
  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener("open-beauty-assistant", open);
    return () => window.removeEventListener("open-beauty-assistant", open);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    };
  }, [pendingImage]);

  const personaId = (currentPersona === "dr_sami" || currentPersona === "ms_zain"
    ? currentPersona
    : "ms_zain") as PersonaId;
  const config = PERSONA_CONFIG[personaId];
  const PersonaIcon = personaId === "dr_sami" ? Shield : Sparkles;
  const isAr = language === "ar";
  const name = isAr ? config.nameAr : config.nameEn;
  const subtitle = isAr ? config.subtitleAr : config.subtitleEn;

  const speakText = useCallback((text: string, persona: string | undefined, idx: number) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`~>\[\]()!]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    if (persona === "dr_sami") {
      const male = voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"))
        || voices.find((v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("female"));
      if (male) utterance.voice = male;
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
    } else {
      const female = voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
        || voices.find((v) => v.lang.startsWith("en"));
      if (female) utterance.voice = female;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
    }
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  }, [speakingIdx]);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }
    setPendingImage({ file, preview: URL.createObjectURL(file) });
  };

  const send = async (text: string) => {
    if (isLoading) return;
    if (!text.trim() && !pendingImage) return;

    setSafetyBanner(null);
    const disclaimer = getSafetyDisclaimer(text, language);
    if (disclaimer) {
      setSafetyBanner(disclaimer);
      // Safety first: do not call API for diagnosis-seeking queries; show disclaimer only.
      const userMsg: Msg = { role: "user", content: text.trim() };
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: disclaimer, persona: "dr_sami" },
      ]);
      setInput("");
      return;
    }

    const detected = detectPersonaFromInput(text);
    setCurrentPersona(detected);

    let userContent: string | MessageContent[];
    let imagePreview: string | undefined;

    if (pendingImage) {
      const base64 = await fileToBase64(pendingImage.file);
      const textPart = text.trim() || "Please analyze my skin in this photo and recommend a routine.";
      userContent = [
        { type: "text", text: textPart },
        { type: "image_url", image_url: { url: base64 } },
      ];
      imagePreview = pendingImage.preview;
      setPendingImage(null);
    } else {
      userContent = text.trim();
    }

    const userMsg: Msg = { role: "user", content: userContent, imagePreview };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    let detectedPersona = detected;

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar, persona: detectedPersona } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar, persona: detectedPersona }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        userProfile,
        forcePersona: detected,
        onPersona: (p) => {
          detectedPersona = p as PersonaId;
          setCurrentPersona(detectedPersona);
        },
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          playNotificationSound();
        },
        onSafetyFlags: setSafetyFlags,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${msg}`, persona: currentPersona },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageSelect(file);
          e.target.value = "";
        }}
      />

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full dr-bot-fab",
            isRTL ? "left-6" : "right-6"
          )}
          style={{ backgroundColor: config.accentColor }}
          aria-label="Open Dr. Bot"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {open && (
        <Card
          className={cn(
            "dr-bot-panel fixed bottom-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden shadow-2xl sm:w-[400px]",
            isRTL ? "left-6 right-auto" : "right-6"
          )}
          style={{ borderColor: config.borderColor, borderWidth: 1 }}
        >
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ backgroundColor: config.accentColor, borderColor: "rgba(255,255,255,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <PersonaIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-white/80">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ScrollArea
            className={cn(
              "flex-1 px-4 py-3 dr-bot-glass",
              isAr && "font-arabic"
            )}
            ref={scrollRef}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isAuthenticated === false && (
              <div className="flex h-full flex-col items-center justify-center space-y-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full dr-bot-burgundy-muted">
                  <Shield className="h-8 w-8 text-[#6A1E2A]" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {isAr ? "مرحباً بكم في آسبر" : "Welcome to Asper Dr. Bot"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[260px] font-body">
                    {isAr
                      ? "سجّل الدخول للحصول على نصائح من د. سامي والسيدة زين"
                      : "Sign in to get personalized advice from Dr. Sami & Ms. Zain"}
                  </p>
                </div>
                <a href="/auth">
                  <Button className="bg-[#6A1E2A] text-white hover:bg-[#5a1a24]">
                    {isAr ? "تسجيل الدخول" : "Sign in"}
                  </Button>
                </a>
              </div>
            )}

            {isAuthenticated && safetyBanner && (
              <div className="mb-3 rounded-lg border border-amber-600/40 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs font-body text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{safetyBanner}</span>
              </div>
            )}

            {isAuthenticated && safetyFlags.length > 0 && (
              <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-body text-destructive flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{safetyFlags.join(", ")} — {isAr ? "توصيات آمنة" : "Safe recommendations active."}</span>
              </div>
            )}

            {isAuthenticated && messages.length === 0 && (
              <div className="space-y-4 py-4">
                <div className="text-center space-y-2">
                  <p className="font-display text-sm font-semibold text-foreground">
                    {isAr ? "متجر آسبر للجمال" : "Asper Beauty Shop"}
                  </p>
                  <p className="text-xs text-muted-foreground font-body max-w-[280px] mx-auto leading-relaxed">
                    {isAr
                      ? "د. سامي للسريريات، السيدة زين للجمال. اسأل أي شيء."
                      : "Dr. Sami for clinical advice, Ms. Zain for beauty. Ask anything."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => {
                        if (qp.label === "📸 Skin Analysis") {
                          fileInputRef.current?.click();
                        } else {
                          send(qp.text);
                        }
                      }}
                      className="gold-stitch-card rounded-lg px-3 py-2.5 text-left text-xs font-body text-foreground/90 transition-all hover:bg-[#C5A028]/10"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated && messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const mp = msg.persona
                ? PERSONA_CONFIG[msg.persona as PersonaId]
                : null;
              const displayText = getTextContent(msg.content);
              const Icon = msg.persona === "dr_sami" ? Shield : Sparkles;

              return (
                <div key={i} className={cn("mb-3 flex gap-2", isUser && "flex-row-reverse")}>
                  {!isUser && mp && (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback
                        className="text-[10px] text-white"
                        style={{ backgroundColor: mp.accentColor }}
                      >
                        <Icon className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm font-body",
                      isUser
                        ? "bg-muted text-foreground rounded-br-sm"
                        : "gold-stitch-card rounded-bl-sm text-foreground"
                    )}
                  >
                    {isUser && msg.imagePreview && (
                      <div className="mb-2">
                        <img
                          src={msg.imagePreview}
                          alt="Upload"
                          className="max-h-32 rounded-md border border-[#C5A028]/30 object-cover"
                        />
                      </div>
                    )}
                    {isUser ? (
                      displayText
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-1 [&>p]:last:mb-0">
                        <ReactMarkdown>{displayText}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {!isUser && displayText && !isLoading && (
                    <button
                      onClick={() => speakText(displayText, msg.persona, i)}
                      className="mt-1 self-end shrink-0 text-muted-foreground/50 hover:text-primary"
                      aria-label={speakingIdx === i ? "Stop" : "Read aloud"}
                    >
                      {speakingIdx === i ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}

            {isAuthenticated && isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="mb-3 flex gap-2">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback
                    className="text-[10px] text-white"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="gold-stitch-card rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A028] [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A028]/70 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A028]/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {isAuthenticated && pendingImage && (
            <div className="border-t border-border/50 bg-muted/50 px-3 py-2 flex items-center gap-2">
              <img
                src={pendingImage.preview}
                alt="Selected"
                className="h-12 w-12 rounded-md object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body truncate">{pendingImage.file.name}</p>
                <p className="text-[10px] text-muted-foreground">{isAr ? "جاهز للتحليل" : "Ready for analysis"}</p>
              </div>
              <button onClick={() => setPendingImage(null)} className="shrink-0 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {isAuthenticated && (
            <div className="border-t border-[#C5A028]/20 bg-card/80 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-[#C5A028]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  aria-label="Upload photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isAr ? "اسأل عن العناية أو الجمال..." : "Ask about skincare or beauty..."}
                  className="flex-1 text-sm"
                  disabled={isLoading}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || (!input.trim() && !pendingImage)}
                  className="shrink-0 bg-[#6A1E2A] text-white hover:bg-[#5a1a24]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
