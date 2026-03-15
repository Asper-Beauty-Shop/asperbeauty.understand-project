import { useState, useEffect } from "react";
import { FlaskConical, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const TIPS = [
  {
    tip: "Always apply SPF 30+ as the final step in your morning routine — even indoors. UVA rays penetrate glass.",
    author: "Dr. Sami, Clinical Pharmacist",
    category: "Sun Protection",
  },
  {
    tip: "Layer your actives thinnest to thickest: Vitamin C serum → Niacinamide toner → Moisturizer → SPF.",
    author: "Dr. Sami, Clinical Pharmacist",
    category: "Routine Building",
  },
  {
    tip: "For acne-prone skin, choose non-comedogenic moisturizers. Even oily skin needs hydration to prevent overproduction of sebum.",
    author: "Ms. Zain, Beauty Concierge",
    category: "Acne & Oily Skin",
  },
  {
    tip: "Retinol should be introduced slowly — start 2× per week at night. Always follow with a ceramide moisturizer to buffer irritation.",
    author: "Dr. Sami, Clinical Pharmacist",
    category: "Anti-Aging",
  },
  {
    tip: "Micellar water is gentle enough for sensitive skin and removes even waterproof makeup without harsh rubbing.",
    author: "Ms. Zain, Beauty Concierge",
    category: "Cleansing",
  },
  {
    tip: "Hyaluronic Acid works best applied to damp skin — it draws moisture from the environment, not your deeper skin layers.",
    author: "Dr. Sami, Clinical Pharmacist",
    category: "Hydration",
  },
  {
    tip: "For dark spots, Vitamin C in the morning + Niacinamide at night is a proven brightening duo supported by clinical studies.",
    author: "Dr. Sami, Clinical Pharmacist",
    category: "Pigmentation",
  },
];

interface ExpertTipWidgetProps {
  className?: string;
}

export function ExpertTipWidget({ className }: ExpertTipWidgetProps) {
  const [idx, setIdx] = useState(() => Math.floor(Date.now() / 86400000) % TIPS.length);
  const [animating, setAnimating] = useState(false);

  const cycle = () => {
    setAnimating(true);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % TIPS.length);
      setAnimating(false);
    }, 300);
  };

  const tip = TIPS[idx];

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Expert Tip
          </span>
        </div>
        <button
          onClick={cycle}
          className="text-muted-foreground hover:text-primary transition-colors"
          title="Next tip"
          aria-label="Next expert tip"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <blockquote
        className={cn(
          "text-sm text-foreground leading-relaxed font-body italic transition-opacity duration-300",
          animating ? "opacity-0" : "opacity-100",
        )}
      >
        "{tip.tip}"
      </blockquote>
      <footer className="flex items-center justify-between">
        <cite className="text-[10px] text-muted-foreground not-italic">{tip.author}</cite>
        <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">
          {tip.category}
        </span>
      </footer>
    </div>
  );
}
