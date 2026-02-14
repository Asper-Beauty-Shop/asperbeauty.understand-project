import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Shield, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string; persona?: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/beauty-assistant`;

async function streamChat({
  messages,
  forcePersona,
  onPersona,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  forcePersona?: string;
  onPersona: (p: string) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      forcePersona,
    }),
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
  { label: "Makeup look", text: "Recommend a natural everyday makeup look" },
];

export default function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<string>("ms_zain");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
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
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground font-body">
                  Ask me anything about skincare, beauty, or finding the perfect product ✨
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => send(qp.text)}
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
                    {isUser ? (
                      msg.content
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-1 [&>p]:last:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
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

          {/* Input */}
          <div className="border-t border-border/50 bg-card p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skincare, beauty..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
