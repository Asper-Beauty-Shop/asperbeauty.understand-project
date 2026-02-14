import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Shield, Heart, Loader2, Volume2, VolumeX, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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

const CHAT_URL = "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzc1OTUsImV4cCI6MjA4NTkxMzU5NX0.cnstN7JUhkt-hevIWhaeYRu1Y51tPSTi7eOBM6RLz4Y";

function getTextContent(content: string | MessageContent[]): string {
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: "text"; text: string } => (p as any).type === "text")
    .map((p) => p.text)
    .join(" ");
}

async function streamChat({
  messages,
  forcePersona,
  onPersona,
  onDelta,
  onDone,
  onSafetyFlags,
}: {
  messages: Msg[];
  forcePersona?: string;
  onPersona: (p: string) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
  onSafetyFlags?: (flags: string[]) => void;
}) {
  const payload = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ messages: payload, forcePersona }),
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

const personaConfig = {
  dr_sami: {
    name: "Dr. Sami",
    subtitle: "Clinical Authority",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  ms_zain: {
    name: "Ms. Zain",
    subtitle: "Beauty Concierge",
    icon: Heart,
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
};

const quickPrompts = [
  { label: "Acne routine", text: "I have acne-prone oily skin. What's a good 3-step routine?" },
  { label: "Gift ideas", text: "I need a luxury gift set for my friend's birthday" },
  { label: "Sunscreen help", text: "What SPF should I use for sensitive skin?" },
  { label: "📸 Skin check", text: "" }, // special: triggers image upload
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const clean = text.replace(/[#*_`~>\[\]()!]/g, "").replace(/\n+/g, ". ");
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
        onPersona: (p) => {
          detectedPersona = p;
          setCurrentPersona(p);
        },
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onSafetyFlags: (flags) => setSafetyFlags(flags),
      });
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${e.message}`, persona: currentPersona },
      ]);
      setIsLoading(false);
    }
  };

  const persona = personaConfig[currentPersona as keyof typeof personaConfig] || personaConfig.ms_zain;
  const PersonaIcon = persona.icon;

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

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110"
          aria-label="Open AI Concierge"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden border-border/50 shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-primary px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                <PersonaIcon className="h-4 w-4 text-primary-foreground" />
              </div>
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
          <ScrollArea className="flex-1 bg-background px-4 py-3" ref={scrollRef}>
            {/* Safety Interlock Banner */}
            {safetyFlags.length > 0 && (
              <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-body text-destructive flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Safety Interlock Active:</span>{" "}
                  {safetyFlags.join(", ")} flagged for your profile. Dr. Sami is ensuring all recommendations are safe.
                </div>
              </div>
            )}
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground font-body">
                  Ask me anything about skincare, beauty, or upload a photo for a skin diagnostic 📸
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => {
                        if (qp.label === "📸 Skin check") {
                          triggerFileInput();
                        } else {
                          send(qp.text);
                        }
                      }}
                      className="rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 text-left text-xs font-body text-foreground/80 transition-colors hover:bg-secondary hover:border-primary/20"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
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
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className={cn("text-[10px]", mp.bgColor, mp.color)}>
                        {mp.name.split(" ").map((w) => w[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm font-body",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
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
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className={cn("text-[10px]", persona.bgColor, persona.color)}>
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-xl rounded-bl-sm bg-secondary px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Pending image preview */}
          {pendingImage && (
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

          {/* Input */}
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
        </Card>
      )}
    </>
  );
}
