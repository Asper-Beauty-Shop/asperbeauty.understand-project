import { Badge } from "@/components/ui/badge";
import { Droplets, Mountain, Sparkles, Gem } from "lucide-react";
import shelfDisplay from "@/assets/asper-shelf-display.png";

const minerals = [
  { icon: Droplets, name: "Magnesium", benefit: "Deep hydration & barrier repair" },
  { icon: Gem, name: "Calcium", benefit: "Cell renewal & skin firmness" },
  { icon: Sparkles, name: "Potassium", benefit: "Moisture balance & radiance" },
  { icon: Mountain, name: "Bromide", benefit: "Soothing & anti-inflammatory" },
];

const HeritageSourcing = () => {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image with gold border */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden border-2 border-accent shadow-emerald-glow">
              <img
                src={shelfDisplay}
                alt="Asper Beauty pharmacy shelf with maroon products and gold fixtures"
                className="w-full h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating mineral badges */}
            <div className="absolute -bottom-4 -end-4 bg-card border border-accent/30 rounded-lg px-4 py-3 shadow-lg">
              <span className="font-heading text-xs text-accent tracking-[0.15em] uppercase">Dead Sea · Jordan</span>
            </div>
          </div>

          {/* Right — Text content */}
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-4 w-fit border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5">
              HERITAGE & SOURCING
            </Badge>
            <h2 className="font-arabic text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              Authentic Origins, <span className="text-primary">Clinical Results</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              Our formulations are rooted in the ancient healing power of the Dead Sea — the lowest point on Earth, 
              rich in magnesium, calcium, and potassium. Every mineral compound is sustainably harvested from 
              Jordanian sources and cold-processed to preserve its bioactive integrity, then paired with 
              globally sourced clinical-grade actives for modern skincare that honors tradition.
            </p>

            {/* Mineral grid */}
            <div className="grid grid-cols-2 gap-4">
              {minerals.map((mineral) => (
                <div
                  key={mineral.name}
                  className="group flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-accent/40 transition-colors duration-400"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors">
                    <mineral.icon className="h-4 w-4 text-primary group-hover:text-accent transition-colors duration-400" />
                  </div>
                  <div>
                    <span className="font-heading text-sm font-semibold text-foreground">{mineral.name}</span>
                    <p className="text-xs text-muted-foreground font-body leading-snug">{mineral.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSourcing;

