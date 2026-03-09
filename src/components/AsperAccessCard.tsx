import { useState, MouseEvent } from "react";
import { format } from "date-fns";

export interface LedgerEntry {
  persona: string;
  title: string;
  date: string;
}

interface AsperAccessCardProps {
  name?: string;
  protocol?: string;
  ledger?: LedgerEntry[];
}

export default function AsperAccessCard({ name = "Guest", protocol = "HYDRATION", ledger = [] }: AsperAccessCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    setRotateX(((y - centerY) / centerY) * -15);
    setRotateY(((x - centerX) / centerX) * 15);
    setGlareX((x / box.width) * 100);
    setGlareY((y / box.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFlipped) {
      setRotateX(0);
      setRotateY(0);
    }
    setGlareX(50);
    setGlareY(50);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  const displayLedger = ledger.length > 0
    ? ledger.slice(0, 3)
    : [
        { persona: "System", title: "No consultations yet", date: new Date().toISOString() },
      ];

  const personaColor = (persona: string) => {
    const lower = persona.toLowerCase();
    if (lower.includes("sami") || lower === "dr_sami") return "text-burgundy";
    if (lower.includes("zain") || lower === "ms_zain") return "text-polished-gold";
    return "text-burgundy";
  };

  const personaLabel = (persona: string) => {
    if (persona === "dr_sami") return "Dr. Sami";
    if (persona === "ms_zain") return "Ms. Zain";
    return persona;
  };

  return (
    <div
      className="relative w-[400px] h-[250px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={toggleFlip}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative transition-all duration-700 ease-luxury"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? 180 : rotateY}deg)`,
          transformStyle: "preserve-3d",
          boxShadow: isHovered && !isFlipped
            ? "0 30px 60px -12px hsl(var(--burgundy) / 0.3), 0 18px 36px -18px hsl(var(--polished-gold) / 0.2)"
            : "0 10px 30px -10px hsl(var(--burgundy) / 0.15)",
        }}
      >
        {/* ================= FRONT FACE ================= */}
        <div
          className="absolute inset-0 rounded-2xl bg-background border border-polished-gold overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, hsl(var(--polished-gold)) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute inset-0 z-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
            style={{
              opacity: isHovered && !isFlipped ? 0.6 : 0,
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 10%, transparent 60%)`,
            }}
          />
          <div className="relative z-30 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground tracking-widest uppercase">
                  Asper
                </h2>
                <p className="font-body text-[10px] text-burgundy tracking-[0.2em] font-bold mt-1">
                  CLINICAL ACCESS
                </p>
              </div>
              <div className="w-10 h-8 rounded bg-gradient-to-br from-[hsl(46,72%,58%)] to-polished-gold border border-polished-gold/60 opacity-80 flex items-center justify-center">
                <div className="w-6 h-4 border border-background/50 rounded-sm" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="font-body text-xs text-muted-foreground mb-1 uppercase tracking-widest">
                  Patient Profile
                </p>
                <p className="font-heading text-xl text-foreground">{name}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-[10px] text-burgundy mb-1 font-bold">
                  AES-256 SECURED
                </p>
                <div className="bg-foreground px-3 py-1 rounded-full">
                  <p className="font-body text-xs text-polished-gold tracking-wider">
                    TAP TO FLIP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div
          className="absolute inset-0 rounded-2xl bg-background border border-burgundy overflow-hidden p-6 flex items-center gap-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-1/3 flex flex-col items-center justify-center border-r border-polished-gold/30 pr-6">
            <div className="w-24 h-24 bg-background p-2 rounded-lg border border-border shadow-sm flex items-center justify-center">
              <div
                className="w-full h-full bg-cover opacity-80"
                style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')" }}
              />
            </div>
            <p className="font-body text-[8px] tracking-widest text-center text-burgundy mt-3 font-bold uppercase">
              Scan for Regimen
            </p>
          </div>

          <div className="w-2/3 flex flex-col justify-center h-full">
            <h3 className="font-heading text-sm text-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">
              Clinical Ledger
            </h3>
            <ul className="space-y-3">
              {displayLedger.map((entry, i) => (
                <li key={i} className="flex justify-between items-start">
                  <div>
                    <p className={`font-body text-[10px] font-bold ${personaColor(entry.persona)}`}>
                      {personaLabel(entry.persona)}
                    </p>
                    <p className="font-heading text-xs text-foreground">{entry.title}</p>
                  </div>
                  <span className="font-body text-[9px] text-muted-foreground whitespace-nowrap ml-2">
                    {format(new Date(entry.date), "MMM dd")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-12 left-10 right-10 h-8 transition-all duration-700 blur-md rounded-[100%]"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--burgundy) / 0.15) 0%, transparent 70%)",
          opacity: isHovered || isFlipped ? 1 : 0.4,
          transform: `scaleX(${isHovered || isFlipped ? 1.1 : 1})`,
        }}
      />
    </div>
  );
}

