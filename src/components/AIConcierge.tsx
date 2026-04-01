import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Shield, Heart, Loader2, Volume2, VolumeX, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { playNotificationSound } from "@/lib/sounds";

type MessageContent =
  | string
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Msg = {
  role: "user" | "assistant";
  content: string | MessageContent[];
  persona?: string;
  imagePreview?: string; // local preview URL for display
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vhgwvfedgfmcixhdyttt.supabase.co";
const CHAT_URL = `${SUPABASE_URL}/functions/v1/beauty-assistant`;

function getTextContent(content: string | MessageContent[]): string {
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: "text"; text: string } => (p as { type: string }).type === "text")
    .filter((p): p is { type: "text"; text: string } => typeof p === "object" && p !== null && "type" in p && p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

async function streamChat({
  messages,
  forcePersona,
  userProfile,
  campaignSource,
  onPersona,
  onDelta,
  onDone,
  onSafetyFlags,
}: {
  messages: Msg[];
  forcePersona?: string;
  userProfile?: { skin_type: string | null; skin_concern: string; tags: string[] } | null;
  campaignSource?: string | null;
  onPersona: (p: string) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
  onSafetyFlags?: (flags: string[]) => void;
}) {
  const payload = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Please sign in to use the AI concierge.");

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: payload, forcePersona, userProfile, ...(campaignSource ? { source: campaignSource } : {}) }),
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

/* Inline SVG persona avatars — transparent, no white box */
const DrSamiAvatar = ({ size = 28 }: { size?: number }) => (
  <div
    className="rounded-full border border-polished-gold bg-transparent p-1 flex items-center justify-center shrink-0"
    style={{ width: size, height: size }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v20M8 6c0-1.5 1.8-3 4-3s4 1.5 4 3-1.8 3-4 3-4-1.5-4-3zM8 10c0-1.5 1.8-3 4-3s4 1.5 4 3-1.8 3-4 3-4-1.5-4-3z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22h6" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

const MsZainAvatar = ({ size = 28 }: { size?: number }) => (
  <div
    className="rounded-full border border-polished-gold bg-transparent p-1 flex items-center justify-center shrink-0"
    style={{ width: size, height: size }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22c-2-4-6-8-6-12a6 6 0 0112 0c0 4-4 8-6 12z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22c-4-2-8-4-9-8 2 0 5 1 9 8zM12 22c4-2 8-4 9-8-2 0-5 1-9 8z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const personaConfig = {
  dr_sami: {
    name: "Dr. Sami",
    subtitle: "Clinical Authority",
    icon: Shield,
    avatar: DrSamiAvatar,
    color: "text-primary",
    bgColor: "bg-primary/10",
    shape: "clip-hexagon",
    chatBg: "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 L50 17.5 L50 42.5 L30 55 L10 42.5 L10 17.5 Z' fill='none' stroke='%23800020' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E\")]",
  },
  ms_zain: {
    name: "Ms. Zain",
    subtitle: "Beauty Concierge",
    icon: Heart,
    avatar: MsZainAvatar,
    color: "text-gold",
    bgColor: "bg-gold/10",
    shape: "rounded-full",
    chatBg: "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='%23C5A028' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E\")]",
  },
};

const quickPrompts = [
  { label: "✨ Find My Routine", text: "I want a personalized skincare routine based on my concerns" },
  { label: "🧪 Shop by Ingredient", text: "I'm looking for products with Vitamin C, Retinol, or Hyaluronic Acid" },
  { label: "🌿 Natural Options", text: "What natural and organic skincare products do you recommend?" },
  { label: "📸 Skin Analysis", text: "" }, // special: triggers image upload
];

export default function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<string>("ms_zain");
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [pendingImage, setPendingImage] = useState<{ file: File; preview: string } | null>(null);
  const [safetyFlags, setSafetyFlags] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ skin_type: string | null; skin_concern: string; tags: string[] } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deepLinkHandled = useRef(false);
  const pendingDeepLinkPrompt = useRef<string | null>(null);
  const deepLinkSource = useRef<string | null>(null);

  // Intent-to-prompt mapping for marketing deep links
  const INTENT_PROMPTS: Record<string, string> = {
    acne: "I'm struggling with acne and oiliness. What's the best clinical routine?",
    glow: "I want radiant, glowing skin. What do you recommend?",
    "anti-aging": "I'm looking for an anti-aging routine with proven actives.",
    hydration: "My skin is very dry. I need a deep hydration regimen.",
    bridal: "I'm getting married soon! Help me with a bridal skincare bootcamp.",
    pregnancy: "I'm pregnant and need a safe skincare routine.",
    pigmentation: "I have uneven skin tone and dark spots. What treatments work best?",
    sensitivity: "My skin is very sensitive and reactive. I need a gentle routine.",
  };

  // Deep link support: ?intent=acne&source=ig auto-opens with tailored prompt & auto-send
  useEffect(() => {
    if (deepLinkHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent");
    const source = params.get("source");
    if (intent) {
      deepLinkHandled.current = true;
      setOpen(true);
      const prompt = INTENT_PROMPTS[intent.toLowerCase()] || `I need help with ${intent}.`;
      pendingDeepLinkPrompt.current = prompt;
      deepLinkSource.current = source;
      // Clean up URL params without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("intent");
      url.searchParams.delete("source");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }, []);

  // Auto-send deep link prompt once authenticated
  useEffect(() => {
    if (pendingDeepLinkPrompt.current && isAuthenticated === true) {
      const prompt = pendingDeepLinkPrompt.current;
      pendingDeepLinkPrompt.current = null;
      // Small delay to ensure panel is rendered
      setTimeout(() => send(prompt), 300);
    }
  }, [isAuthenticated]);

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch concierge_profiles on open
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
          setUserProfile({ skin_type: data.skin_type, skin_concern: data.skin_concern ?? "", tags: [] });
        }
      } catch {
        // Not logged in or no profile — proceed without context
      }
    })();
  }, [open, isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    };
  }, [pendingImage]);

  const speakText = useCallback((text: string, persona: string | undefined, idx: number) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`~>[\]()!]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    if (persona === "dr_sami") {
      const male = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"))
        || voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("female"));
      if (male) utterance.voice = male;
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
    } else {
      const female = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
        || voices.find(v => v.lang.startsWith("en"));
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
    const preview = URL.createObjectURL(file);
    setPendingImage({ file, preview });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePendingImage = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.preview);
      setPendingImage(null);
    }
  };

  const send = async (text: string) => {
    if (isLoading) return;
    if (!text.trim() && !pendingImage) return;

    let userContent: string | MessageContent[];
    let imagePreview: string | undefined;

    if (pendingImage) {
      // Convert image to base64 and build multimodal content
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
    let detectedPersona = currentPersona;

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
        campaignSource: deepLinkSource.current,
        onPersona: (p) => {
          detectedPersona = p;
          setCurrentPersona(p);
        },
        onDelta: upsert,
        onDone: () => { setIsLoading(false); playNotificationSound(); },
        onSafetyFlags: (flags) => setSafetyFlags(flags),
      });
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      let displayError = `⚠️ ${errMsg}`;
      
      // Luxury fallback for high demand or connection issues
      if (errMsg.toLowerCase().includes("high demand") || 
          errMsg.toLowerCase().includes("rate limit") || 
          errMsg.toLowerCase().includes("too many requests") ||
          errMsg.toLowerCase().includes("connection failed")) {
        displayError = "### 🌿 Our Concierge is currently assisting many guests.\n\nTo maintain our standards of clinical excellence, we are limiting new requests temporarily. \n\n**Please leave your details or try again in a few moments.** We appreciate your patience.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: displayError, persona: currentPersona },
      ]);
      setIsLoading(false);
    }
  };

  const persona = personaConfig[currentPersona as keyof typeof personaConfig] || personaConfig.ms_zain;
  const PersonaIcon = persona.icon;

  /* ─── Swipe-to-dismiss for mobile ─── */
  const touchStartRef = useRef({ x: 0, y: 0 });
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    // Swipe right or down to dismiss
    if ((dx > 80 && Math.abs(dy) < 60) || (dy > 100 && Math.abs(dx) < 60)) {
      setOpen(false);
    }
  }, []);

  return (
    <>
      {/* Hidden file input */}
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

      {/* Floating "Medical Concierge" badge */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground concierge-badge transition-transform hover:scale-110"
          aria-label="Open AI Concierge"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <Card
          className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden border-accent/30 shadow-2xl sm:w-[400px]"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-primary px-4 py-3">
            <div className="flex items-center gap-3">
              <persona.avatar size={36} />
              <div>
                <p className="font-heading text-sm font-semibold text-primary-foreground">{persona.name}</p>
                <p className="text-xs text-primary-foreground/70">{persona.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className={cn("flex-1 bg-background px-4 py-3", persona.chatBg)} ref={scrollRef}>
            {/* Sign-in prompt for unauthenticated users */}
            {isAuthenticated === false && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Welcome to Asper AI</h3>
                  <p className="text-sm text-muted-foreground font-body max-w-[260px]">
                    Sign in to access personalized skincare advice from Dr. Sami & Ms. Zain ✨
                  </p>
                </div>
                <a href="/auth">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="currentColor" fillOpacity="0.7" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" fillOpacity="0.8" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" fillOpacity="0.6" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" fillOpacity="0.9" />
                    </svg>
                    Sign in with Google
                  </button>
                </a>
              </div>
            )}
            {/* Safety Interlock Banner */}
            {isAuthenticated && safetyFlags.length > 0 && (
              <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-body text-destructive flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Safety Interlock Active:</span>{" "}
                  {safetyFlags.join(", ")} flagged for your profile. Dr. Sami is ensuring all recommendations are safe.
                </div>
              </div>
            )}
            {isAuthenticated && messages.length === 0 && (
              <div className="space-y-4 py-4">
                {/* Pharmacist greeting */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">🌿</span>
                    </div>
                  </div>
                  <p className="text-sm font-heading font-semibold text-foreground">
                    Welcome to Asper Beauty Shop
                  </p>
                  <p className="text-xs text-muted-foreground font-body max-w-[280px] mx-auto leading-relaxed">
                    I am your Pharmacist-led Concierge. I'm here to help you navigate the intersection of Nature & Science.
                  </p>
                </div>
                {/* Quick action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => {
                        if (qp.label === "📸 Skin Analysis") {
                          triggerFileInput();
                        } else {
                          send(qp.text);
                        }
                      }}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-left text-xs font-body text-foreground/80 transition-all hover:bg-primary/10 hover:border-primary/40 hover:shadow-sm"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] text-accent font-body uppercase tracking-[0.15em]">
                  Nature Meets Science ✦ Pharmacist Verified
                </p>
              </div>
            )}

            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const mp = msg.persona
                ? personaConfig[msg.persona as keyof typeof personaConfig]
                : null;
              const displayText = getTextContent(msg.content);

              return (
                <div key={i} className={cn("mb-3 flex gap-2", isUser && "flex-row-reverse")}>
                  {!isUser && mp && (
                    <mp.avatar size={28} />
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm font-body",
                      isUser
                        ? "bg-muted text-foreground rounded-br-sm"
                        : "bg-background border border-accent/30 text-foreground rounded-bl-sm"
                    )}
                  >
                    {/* Show uploaded image thumbnail */}
                    {isUser && msg.imagePreview && (
                      <div className="mb-2">
                        <img
                          src={msg.imagePreview}
                          alt="Uploaded skin photo"
                          className="max-h-32 rounded-md border border-primary-foreground/20 object-cover"
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
                      className="mt-1 self-end shrink-0 text-muted-foreground/50 hover:text-primary transition-colors"
                      aria-label={speakingIdx === i ? "Stop speaking" : "Read aloud"}
                      title={speakingIdx === i ? "Stop" : `Listen to ${mp?.name || "response"}`}
                    >
                      {speakingIdx === i ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="mb-3 flex gap-2">
                <div className="relative">
                  <persona.avatar size={28} />
                  <Loader2 className="absolute inset-0 m-auto h-3 w-3 animate-spin text-polished-gold" />
                </div>
                <div className="rounded-xl rounded-bl-sm bg-background border border-accent/30 px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent/70 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Pending image preview */}
          {isAuthenticated && pendingImage && (
            <div className="border-t border-border/50 bg-muted/50 px-3 py-2 flex items-center gap-2">
              <img
                src={pendingImage.preview}
                alt="Selected photo"
                className="h-12 w-12 rounded-md object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-body truncate">{pendingImage.file.name}</p>
                <p className="text-[10px] text-muted-foreground">Ready for skin analysis</p>
              </div>
              <button
                onClick={removePendingImage}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input — hidden when not authenticated */}
          {isAuthenticated && (
          <div className="border-t border-border/50 bg-card p-3">
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
                className="shrink-0 text-muted-foreground hover:text-primary"
                onClick={triggerFileInput}
                disabled={isLoading}
                title="Upload skin photo for analysis"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pendingImage ? "Describe your concern (optional)..." : "Ask about skincare, beauty..."}
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || (!input.trim() && !pendingImage)}
                className="shrink-0"
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

