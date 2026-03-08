import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Sparkles,
  Camera,
  Stethoscope,
  Wind,
  Info,
  Send,
  Loader2,
  Trash2,
  Database,
  Volume2,
  Upload,
  BadgeCheck,
  Sparkle,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

// --- Catalog Data (Refined based on uploaded product data) ---
const ASPER_CATALOG = [
  {
    handle: "maybelline-eraser",
    title: "Maybelline Instant Age Rewind Eraser",
    price: "12.30",
    vendor: "Maybelline",
    type: "Concealer",
    description:
      "Do-it-all concealer: hydrates, conceals, contours and corrects. 12hr wear.",
  },
  {
    handle: "vichy-liftactiv-c",
    title: "Vichy Liftactiv Vitamin C Serum",
    price: "38.50",
    vendor: "Vichy",
    type: "Serum",
    description:
      "15% Pure Vitamin C antioxidant treatment for brightness and firming.",
  },
  {
    handle: "good-girl-elixir",
    title: "Carolina Herrera Good Girl Blush Elixir",
    price: "145.00",
    vendor: "Carolina Herrera",
    type: "Fragrance",
    description:
      "Amber Floral with notes of black cherry, rose, and vanilla cocoa.",
  },
  {
    handle: "cerave-cleanser",
    title: "CeraVe Hydrating Cleanser",
    price: "15.00",
    vendor: "CeraVe",
    type: "Cleanser",
    description:
      "Essential ceramides to restore skin barrier. Non-foaming.",
  },
  {
    handle: "laroche-posay-anthelios",
    title: "La Roche-Posay Anthelios UVMune 400",
    price: "24.00",
    vendor: "La Roche-Posay",
    type: "Sunscreen",
    description:
      "Invisible fluid SPF50+. Ultimate protection against ultra-long UVA.",
  },
  {
    handle: "rimmel-stay-matte",
    title: "Rimmel Stay Matte Pressed Powder",
    price: "6.50",
    vendor: "Rimmel London",
    type: "Makeup",
    description:
      "Shine control powder for a natural matte finish. Long-lasting.",
  },
];

const PRIMARY_MAROON = "#800020";
const ANTIQUE_GOLD = "#C5A028";
const CHARCOAL = "#333333";
const IVORY = "#F8F8FF";

// --- Utility Functions ---

function pcmToWav(pcmData: Int16Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++)
      view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmData.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcmData.length * 2, true);
  for (let i = 0; i < pcmData.length; i++)
    view.setInt16(44 + i * 2, pcmData[i], true);
  return new Blob([buffer], { type: "audio/wav" });
}

const AsperLogo = ({
  mode = "clinical",
  style = "v1",
  size = "md",
}: {
  mode?: "clinical" | "aesthetic";
  style?: "v1" | "v2";
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizes = {
    sm: "h-12 w-12",
    md: "h-24 w-24",
    lg: "h-48 w-48",
    xl: "h-64 w-64",
  };
  const primary = mode === "clinical" ? PRIMARY_MAROON : ANTIQUE_GOLD;
  const accent = mode === "clinical" ? ANTIQUE_GOLD : PRIMARY_MAROON;

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 ${sizes[size]}`}
    >
      {style === "v1" ? (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M60 150 L100 50 L140 150"
            fill="none"
            stroke={primary}
            strokeWidth="12"
          />
          <path
            d="M80 115 Q100 100 120 115"
            fill="none"
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
        >
          <path
            d="M100 70 L126 85 L126 115 L100 130 L74 115 L74 85 Z"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <path
              key={i}
              transform={`rotate(${angle} 100 100)`}
              d="M100 70 C110 40 130 40 140 70 L100 70"
              fill="none"
              stroke={primary}
              strokeWidth="3"
            />
          ))}
          <circle cx="100" cy="100" r="8" fill={primary} />
        </svg>
      )}
    </div>
  );
};

export default function AsperIntelligence() {
  const [activeTab, setActiveTab] = useState("intelligence");
  const [persona, setPersona] = useState<"clinical" | "aesthetic">("clinical");
  const [logoStyle] = useState<"v1" | "v2">("v1");
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      image?: string | null;
      persona?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const isClinical = persona === "clinical";
  const hasApiKey = Boolean(apiKey);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callGemini = async (
    prompt: string,
    image: string | null = null
  ): Promise<string> => {
    if (!hasApiKey) {
      return "Configure VITE_GEMINI_API_KEY in .env to enable Asper Intelligence.";
    }
    try {
      const inventory = ASPER_CATALOG.map(
        (p) => `${p.title} (${p.price} JOD)`
      ).join(", ");
      const systemInstruction = `
        You are the Asper AI Protocol. Inventory: ${inventory}.
        ${
          isClinical
            ? "Role: Dr. Sami (Pharmacist). Tone: Clinical, safety-first, authoritative. Jordan market context. Sign: '- Dr. Sami, Asper Clinical'."
            : "Role: Ms. Zain (Beauty Concierge). Tone: Radiant, high-end, friendly. Focus on rituals. Sign: '- Ms. Zain, Concierge'."
        }
        Limit to 3 concise sentences. Priority: Catalog recommendations.
      `;

      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
        {
          text: `Context: ${systemInstruction}\n\nUser Query: ${prompt}`,
        },
      ];
      if (image) {
        const base64 = image.split(",")[1];
        if (base64) {
          parts.push({
            inlineData: { mimeType: "image/png", data: base64 },
          });
        }
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
          }),
        }
      );

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Intelligence protocol reset required. Please standby.";
    } catch (error) {
      return "Intelligence protocol reset required. Please standby.";
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !capturedImage) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputValue || "Analyzing Visual Context...",
        image: capturedImage,
      },
    ]);
    const currentInput = inputValue;
    const currentImg = capturedImage;
    setInputValue("");
    setCapturedImage(null);
    setIsLoading(true);

    const response = await callGemini(currentInput || "Audit this asset.", currentImg);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response, persona },
    ]);
    setIsLoading(false);
  };

  const handleSpeech = async (text: string) => {
    if (!hasApiKey) return;
    setIsSpeaking(true);
    try {
      const voiceName = isClinical ? "Puck" : "Aoede";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          }),
        }
      );
      const data = await response.json();
      const part = data.candidates?.[0]?.content?.parts?.[0];
      if (!part?.inlineData) {
        setIsSpeaking(false);
        return;
      }
      const audioData = part.inlineData.data;
      const mimeMatch = part.inlineData.mimeType?.match(/rate=(\d+)/);
      const sampleRate = mimeMatch ? parseInt(mimeMatch[1], 10) : 24000;
      const bytes = Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0));
      const pcmData = new Int16Array(bytes.buffer);
      const wavBlob = pcmToWav(pcmData, sampleRate);
      const audio = new Audio(URL.createObjectURL(wavBlob));
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF]">
      <Header />
      <div className="pt-24 md:pt-32 p-4 md:p-10 font-sans text-[#333333] transition-colors duration-700">
        <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#C5A028]/10 pb-8">
          <div>
            <h1
              className="text-5xl font-serif text-[#800020] mb-2 tracking-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Asper{" "}
              <span className="font-light italic text-[#C5A028]">
                Intelligence
              </span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[#800020]/5 text-[#800020] text-[10px] font-black tracking-widest rounded-sm border border-[#800020]/10 uppercase">
                Morning Spa Theme Active
              </span>
              <p className="text-gray-400 font-medium tracking-[0.2em] uppercase text-[9px]">
                Pharmacist Curated • Jordan HQ
              </p>
            </div>
          </div>
          <nav className="flex bg-white shadow-xl shadow-black/5 p-1.5 rounded-[1.2rem] border border-[#C5A028]/10">
            {["intelligence", "identity", "application"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#800020] text-white shadow-lg"
                    : "text-gray-400 hover:text-[#800020]"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-white rounded-[1.5rem] shadow-2xl shadow-maroon/5 border border-maroon/5">
              <button
                onClick={() => setPersona("clinical")}
                className={`flex items-center gap-4 px-8 py-3 rounded-2xl transition-all ${
                  isClinical
                    ? "bg-[#800020] text-white shadow-xl"
                    : "text-gray-400 grayscale"
                }`}
              >
                <Stethoscope size={20} />{" "}
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase opacity-60">
                    Persona A
                  </p>
                  <p className="font-serif text-sm">Dr. Sami</p>
                </div>
              </button>
              <button
                onClick={() => setPersona("aesthetic")}
                className={`flex items-center gap-4 px-8 py-3 rounded-2xl transition-all ${
                  !isClinical
                    ? "bg-[#C5A028] text-white shadow-xl"
                    : "text-gray-400 grayscale"
                }`}
              >
                <Wind size={20} />{" "}
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase opacity-60">
                    Persona B
                  </p>
                  <p className="font-serif text-sm">Ms. Zain</p>
                </div>
              </button>
            </div>
          </div>

          {!hasApiKey && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
              Add <code className="font-mono">VITE_GEMINI_API_KEY</code> to your{" "}
              <code className="font-mono">.env</code> to enable chat and TTS. Get
              a key at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Google AI Studio
              </a>
              .
            </div>
          )}

          {activeTab === "intelligence" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-[#C5A028]/10 shadow-2xl shadow-black/5 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A028]/5 rounded-full blur-3xl group-hover:bg-[#C5A028]/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#800020]/5 rounded-2xl text-[#800020]">
                      <Camera size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#333333]">
                        Multimodal Lens
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        High-Key Asset Audit
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setCapturedImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      className={`p-8 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center text-center ${
                        capturedImage
                          ? "border-green-300 bg-green-50"
                          : "border-[#C5A028]/20 hover:border-[#C5A028] bg-[#F8F8FF]/50"
                      }`}
                    >
                      {capturedImage ? (
                        <img
                          src={capturedImage}
                          className="h-32 w-full object-contain rounded-xl"
                          alt="Asset"
                        />
                      ) : (
                        <>
                          <Upload
                            className="text-[#C5A028] mb-4 opacity-50"
                            size={32}
                          />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Upload for Audit
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                  {capturedImage && (
                    <button
                      onClick={() => handleSendMessage()}
                      className="mt-6 w-full bg-[#800020] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform"
                    >
                      Run Strategic Scan
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-[#C5A028]/10 shadow-xl shadow-black/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#333333] mb-6 flex items-center gap-2">
                    <Database size={14} className="text-[#C5A028]" /> Catalog
                    Snapshot
                  </h3>
                  <div className="space-y-3">
                    {ASPER_CATALOG.slice(0, 4).map((item) => (
                      <div
                        key={item.handle}
                        className="p-3 bg-[#F8F8FF] rounded-xl flex justify-between items-center border border-transparent hover:border-[#C5A028]/10 transition-all cursor-default group"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">
                            {item.vendor}
                          </p>
                          <p className="text-[11px] font-bold truncate text-[#333333] group-hover:text-[#800020] transition-colors">
                            {item.title}
                          </p>
                        </div>
                        <span className="text-[10px] font-black text-[#800020] whitespace-nowrap">
                          {item.price} JOD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-[#C5A028]/5 flex flex-col relative overflow-hidden h-[750px]">
                <div className="p-8 border-b border-[#F8F8FF] flex justify-between items-center bg-[#F8F8FF]/50 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        isClinical ? "bg-[#800020]" : "bg-[#C5A028]"
                      } text-white shadow-xl`}
                    >
                      {isClinical ? (
                        <ShieldCheck size={24} />
                      ) : (
                        <Sparkles size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl tracking-tight text-[#333333]">
                        {isClinical
                          ? "Clinical Hub"
                          : "Aesthetic Concierge"}
                      </h3>
                      <div className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
                        Secure API Link Active
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMessages([])}
                    className="p-3 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] scroll-smooth">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <AsperLogo mode={persona} style={logoStyle} size="xl" />
                      <p className="mt-8 font-serif text-2xl italic text-[#333333]">
                        "Nature Contained. Intelligence Active."
                      </p>
                      <div className="mt-6 flex gap-4 items-center">
                        <div className="w-12 h-0.5 bg-[#C5A028]" />
                        <Sparkle size={16} className="text-[#C5A028]" />
                        <div className="w-12 h-0.5 bg-[#C5A028]" />
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-6 rounded-[2rem] text-sm shadow-2xl shadow-black/5 relative transition-all ${
                          msg.role === "user"
                            ? "bg-[#333333] text-white rounded-tr-none"
                            : "bg-white border-l-4 border-[#800020] text-[#333333] rounded-tl-none ring-1 ring-black/5"
                        }`}
                      >
                        {msg.image && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-black/5">
                            <img
                              src={msg.image}
                              className="max-h-48 w-full object-contain"
                              alt="Context"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap leading-relaxed font-medium">
                          {msg.content}
                        </p>
                        {msg.role === "assistant" && (
                          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                            <button
                              onClick={() => handleSpeech(msg.content)}
                              disabled={isSpeaking}
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#800020] hover:opacity-100 transition-opacity opacity-50 disabled:opacity-30"
                            >
                              {isSpeaking ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Volume2 size={14} />
                              )}{" "}
                              Speak Result
                            </button>
                            <BadgeCheck
                              size={16}
                              className="text-[#C5A028] opacity-50"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-gray-100 flex items-center gap-4">
                        <Loader2
                          className="animate-spin text-[#800020]"
                          size={18}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Asper Intelligence Thinking...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-6 bg-[#F8F8FF]/80 backdrop-blur-md border-t border-[#C5A028]/10 flex gap-4"
                >
                  <div className="flex-1 relative flex items-center">
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        isClinical
                          ? "Inquire about clinical results or product safety..."
                          : "Ask Ms. Zain for a luxury ritual recommendation..."
                      }
                      className="w-full bg-white border-none rounded-[1.5rem] px-8 py-5 text-sm outline-none shadow-xl shadow-black/5 focus:ring-2 focus:ring-[#800020]/10 transition-all font-medium pr-16 text-[#333333]"
                    />
                    <div className="absolute right-4 flex items-center gap-2">
                      <Info size={18} className="text-gray-300" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`p-5 rounded-[1.5rem] text-white shadow-2xl transition-all transform hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 ${
                      isClinical ? "bg-[#800020]" : "bg-[#C5A028]"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Send size={24} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab !== "intelligence" && (
            <div className="p-20 bg-white rounded-[4rem] border border-[#C5A028]/10 shadow-2xl shadow-black/5 flex flex-col items-center justify-center text-center min-h-[500px]">
              <AsperLogo mode={persona} style={logoStyle} size="xl" />
              <h2 className="text-4xl font-serif mt-10 mb-4 text-[#333333]">
                Strategic Theme Implemented
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-10 italic">
                "The Morning Spa theme prioritizes transparent trust through soft
                ivory canvases and authoritative clinical accents."
              </p>
              <div className="flex gap-4">
                {[IVORY, PRIMARY_MAROON, ANTIQUE_GOLD, CHARCOAL].map((c) => (
                  <div
                    key={c}
                    className="w-12 h-12 rounded-full border border-gray-100 shadow-xl"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="max-w-6xl mx-auto mt-20 pt-10 border-t border-[#C5A028]/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium pb-10">
          <div className="flex items-center gap-6">
            <span className="text-[#800020] font-black italic text-sm">
              ASPER.AI
            </span>
            <span className="w-px h-4 bg-[#C5A028]/20" />
            <span>Amman Headquarters • Strategic Launch 2026</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-[#C5A028]" /> Levant Region Active
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-[#800020]" /> JOD Currency
              Verified
            </div>
            <span>© 2025 Asper Beauty Shop</span>
          </div>
        </footer>
      </div>
      <Footer />
    </div>
  );
}
