import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Sparkles, Camera, Volume2, Upload, Trash2,
  Send, Loader2, Database, BadgeCheck, Info, Stethoscope,
  Wind, Globe, ShoppingCart, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import AuthButton from "@/components/AuthButton";

type MessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

// --- Catalog snapshot ---
const ASPER_CATALOG = [
  { handle: "maybelline-eraser", title: "Maybelline Instant Age Rewind Eraser", price: "12.30", vendor: "Maybelline", type: "Concealer" },
  { handle: "vichy-liftactiv-c", title: "Vichy Liftactiv Vitamin C Serum", price: "38.50", vendor: "Vichy", type: "Serum" },
  { handle: "good-girl-elixir", title: "Carolina Herrera Good Girl Blush Elixir", price: "145.00", vendor: "Carolina Herrera", type: "Fragrance" },
  { handle: "cerave-cleanser", title: "CeraVe Hydrating Cleanser", price: "15.00", vendor: "CeraVe", type: "Cleanser" },
  { handle: "laroche-posay-anthelios", title: "La Roche-Posay Anthelios UVMune 400", price: "24.00", vendor: "La Roche-Posay", type: "Sunscreen" },
  { handle: "rimmel-stay-matte", title: "Rimmel Stay Matte Pressed Powder", price: "6.50", vendor: "Rimmel London", type: "Makeup" },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vhgwvfedgfmcixhdyttt.supabase.co";
const CHAT_URL = `${SUPABASE_URL}/functions/v1/beauty-assistant`;

type Msg = {
  role: "user" | "assistant";
  content: string;
  persona?: string;
  image?: string | null;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Streaming via existing beauty-assistant edge function
async function streamChat({
  messages,
  forcePersona,
  onPersona,
  onDelta,
  onDone,
}: {
  messages: { role: string; content: string | MessageContent[] }[];
  forcePersona?: string;
  onPersona: (p: string) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Please sign in to use the AI assistant.");

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, forcePersona }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Connection failed" }));
    throw new Error(err.error || `Error ${resp.status}`);
  }

  const persona = resp.headers.get("X-Persona");
  if (persona) onPersona(persona);

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

// Asper Logo SVG
function AsperLogo({ mode = "clinical", size = "xl" }: { mode?: string; size?: string }) {
  const sizes: Record<string, string> = { md: "h-24 w-24", lg: "h-48 w-48", xl: "h-64 w-64" };
  const primary = mode === "clinical" ? "hsl(var(--primary))" : "hsl(var(--accent))";
  const accent = mode === "clinical" ? "hsl(var(--accent))" : "hsl(var(--primary))";

  return (
    <div className={cn("relative flex items-center justify-center transition-all duration-700", sizes[size] || sizes.xl)}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
        <circle cx="100" cy="100" r="92" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M60 150 L100 50 L140 150" fill="none" stroke={primary} strokeWidth="12" />
        <path d="M80 115 Q100 100 120 115" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Intelligence() {
  const [activeTab, setActiveTab] = useState("intelligence");
  const [persona, setPersona] = useState<"clinical" | "aesthetic">("clinical");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isClinical = persona === "clinical";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !capturedImage) return;

    const userText = inputValue.trim() || "Please analyze this image and recommend a routine.";

    let userContent: string | MessageContent[];
    if (capturedImage) {
      userContent = [
        { type: "text", text: userText },
        { type: "image_url", image_url: { url: capturedImage } },
      ];
    } else {
      userContent = userText;
    }

    const userMsg: Msg = { role: "user", content: userText, image: capturedImage };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    const currentImage = capturedImage;
    setCapturedImage(null);
    setIsLoading(true);

    let assistantSoFar = "";
    let detectedPersona = isClinical ? "dr_sami" : "ms_zain";

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
      const apiMessages: { role: string; content: string | MessageContent[] }[] = messages
        .map((m) => ({ role: m.role, content: m.content as string | MessageContent[] }));

      // Add current message
      apiMessages.push({ role: "user", content: userContent });

      await streamChat({
        messages: apiMessages,
        forcePersona: isClinical ? "dr_sami" : "ms_zain",
        onPersona: (p) => {
          detectedPersona = p;
        },
        onDelta: upsert,
        onDone: () => setIsLoading(false),
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errMsg}`, persona: detectedPersona },
      ]);
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`~>[\]()!]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    if (isClinical) {
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
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground transition-colors duration-700">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <span className="font-heading text-xl font-bold text-primary">Asper</span>
              <span className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground mt-0.5">Intelligence</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Tab navigation */}
              <div className="hidden md:flex bg-card shadow-sm p-1 rounded-xl border border-border/50">
                {["intelligence", "identity", "application"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-semibold font-body transition-all",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Persona Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-card rounded-2xl shadow-lg border border-border/50">
            <button
              onClick={() => setPersona("clinical")}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl transition-all",
                isClinical
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Stethoscope size={18} />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase opacity-70 tracking-wider">Persona A</p>
                <p className="font-heading text-sm">Dr. Sami</p>
              </div>
            </button>
            <button
              onClick={() => setPersona("aesthetic")}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl transition-all",
                !isClinical
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wind size={18} />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase opacity-70 tracking-wider">Persona B</p>
                <p className="font-heading text-sm">Ms. Zain</p>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "intelligence" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Image Upload */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Multimodal Lens</h3>
                    <p className="text-[10px] text-muted-foreground">Upload for skin analysis</p>
                  </div>
                </div>

                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const b64 = await fileToBase64(file);
                        setCapturedImage(b64);
                      }
                      e.target.value = "";
                    }}
                  />
                  <div
                    className={cn(
                      "p-6 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center text-center",
                      capturedImage
                        ? "border-green-300 bg-green-50 dark:bg-green-950/20"
                        : "border-accent/20 hover:border-accent bg-secondary/30"
                    )}
                  >
                    {capturedImage ? (
                      <img src={capturedImage} className="max-h-32 w-full object-contain rounded-xl" alt="Uploaded" />
                    ) : (
                      <>
                        <Upload className="text-accent mb-3 opacity-50" size={28} />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Upload for Audit
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {capturedImage && (
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleSendMessage} className="flex-1" size="sm">
                      Run Analysis
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCapturedImage(null)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Catalog Snapshot */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <Database size={14} className="text-accent" /> Catalog Snapshot
                </h3>
                <div className="space-y-2">
                  {ASPER_CATALOG.slice(0, 4).map((item) => (
                    <div
                      key={item.handle}
                      className="p-3 bg-secondary/50 rounded-xl flex justify-between items-center border border-transparent hover:border-accent/10 transition-all"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.vendor}</p>
                        <p className="text-[11px] font-semibold truncate text-foreground">{item.title}</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary whitespace-nowrap">{item.price} JOD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-8 bg-card rounded-3xl shadow-xl border border-border/50 flex flex-col overflow-hidden h-[700px]">
              {/* Chat Header */}
              <div className="p-5 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl text-white shadow-md",
                      isClinical ? "bg-primary" : "bg-accent"
                    )}
                  >
                    {isClinical ? <ShieldCheck size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl tracking-tight text-foreground">
                      {isClinical ? "Clinical Hub" : "Aesthetic Concierge"}
                    </h3>
                    <div className="text-[9px] font-bold text-green-500 uppercase tracking-wider flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Streaming Active
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMessages([])}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-6 py-4">
                {messages.length === 0 && (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-30">
                    <AsperLogo mode={persona} size="xl" />
                    <p className="mt-6 font-heading text-xl italic text-foreground">
                      "Nature Contained. Intelligence Active."
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="w-12 h-0.5 bg-accent" />
                      <Sparkles size={14} className="text-accent" />
                      <div className="w-12 h-0.5 bg-accent" />
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={cn("mb-4 flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm relative",
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm border-l-4 border-primary"
                      )}
                    >
                      {msg.image && msg.role === "user" && (
                        <div className="mb-3 rounded-xl overflow-hidden">
                          <img src={msg.image} className="max-h-40 w-full object-contain" alt="Uploaded" />
                        </div>
                      )}
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-1 [&>p]:last:mb-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.role === "assistant" && msg.content && !isLoading && (
                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
                          <button
                            onClick={() => handleSpeech(msg.content)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-100 opacity-50 transition-opacity"
                          >
                            {isSpeaking ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                            Speak
                          </button>
                          <BadgeCheck size={14} className="text-accent opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-secondary p-4 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-3">
                      <Loader2 className="animate-spin text-primary" size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </ScrollArea>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-secondary/30 border-t border-border/50 flex gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      isClinical
                        ? "Ask Dr. Sami about clinical results or product safety..."
                        : "Ask Ms. Zain for a luxury ritual recommendation..."
                    }
                    className="w-full bg-card border border-border/50 rounded-xl px-5 py-3.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-body text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || (!inputValue.trim() && !capturedImage)}
                  size="icon"
                  className={cn("h-12 w-12 rounded-xl", !isClinical && "bg-accent hover:bg-accent/90")}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab !== "intelligence" && (
          <div className="p-16 bg-card rounded-3xl border border-border/50 shadow-xl flex flex-col items-center justify-center text-center min-h-[500px]">
            <AsperLogo mode={persona} size="xl" />
            <h2 className="font-heading text-3xl mt-8 mb-3 text-foreground">
              {activeTab === "identity" ? "Brand Identity" : "Application Layer"}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed mb-8 italic font-body">
              "The Morning Spa theme prioritizes transparent trust through soft ivory canvases and authoritative
              clinical accents."
            </p>
            <div className="flex gap-3">
              {["hsl(var(--background))", "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--foreground))"].map(
                (c) => (
                  <div key={c} className="w-10 h-10 rounded-full border border-border shadow-md" style={{ backgroundColor: c }} />
                )
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-8">
          <div className="flex items-center gap-4">
            <span className="font-heading text-sm font-bold italic text-primary">ASPER.AI</span>
            <span className="w-px h-4 bg-accent/20" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-body">
              Amman HQ • 2026
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-wider font-body">
            <span className="flex items-center gap-1.5">
              <Globe size={12} className="text-accent" /> Levant Region
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingCart size={12} className="text-primary" /> JOD Currency
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

