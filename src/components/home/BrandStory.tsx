import { Badge } from "@/components/ui/badge";
import { Shield, Lightbulb, Award } from "lucide-react";
import botanicalElegance from "@/assets/asper-botanical-elegance.png";
import minimalistBottle from "@/assets/asper-minimalist-bottle.png";

const features = [
  { icon: Shield, en: "Curated Authority", ar: "سلطة طبية مختارة" },
  { icon: Lightbulb, en: "Smart Solutions", ar: "حلول ذكية" },
  { icon: Award, en: "Guaranteed Originality", ar: "جودة أصلية مضمونة" },
];

export default function BrandStory() {
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 font-body text-xs tracking-wider">
            OUR STORY
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Sanctuary of <span className="text-primary">Science</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Asper Beauty Shop is not merely a retailer; it is a pharmacist-curated authority. 
            We have shifted from the &lsquo;Evening Gala&rsquo; of exclusivity to the &lsquo;Morning Spa&rsquo; of transparent trust. 
            Every product — from the clinical precision of La Roche-Posay to the daily style of Maybelline — is 
            vetted, sourced directly, and guaranteed original.
          </p>
        </div>

        {/* Visual showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Product bottle — dramatic maroon scene */}
          <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src={botanicalElegance}
              alt="Asper Beauty botanical elegance collection with lotus flowers"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-primary-foreground text-xs font-body uppercase tracking-[0.2em]">
                Signature Collection
              </p>
            </div>
          </div>

          {/* Skincare closeup — soft spa feel */}
          <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src={minimalistBottle}
              alt="Asper Beauty minimalist serum bottle with gold cap"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-primary-foreground text-xs font-body uppercase tracking-[0.2em]">
                Pharmacist-Led Rituals
              </p>
            </div>
          </div>
        </div>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{f.en}</h3>
              <p className="font-body text-sm text-accent" dir="rtl">{f.ar}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
