import { Badge } from "@/components/ui/badge";
import { Shield, Lightbulb, Award } from "lucide-react";

const features = [
  { icon: Shield, en: "Curated Authority", ar: "سلطة طبية مختارة" },
  { icon: Lightbulb, en: "Smart Solutions", ar: "حلول ذكية" },
  { icon: Award, en: "Guaranteed Originality", ar: "جودة أصلية مضمونة" },
];

export default function BrandStory() {
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-4 font-body text-xs tracking-wider">
          OUR STORY
        </Badge>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          The Sanctuary of <span className="text-primary">Science</span>
        </h2>
        <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
          Asper Beauty Shop is not merely a retailer; it is a pharmacist-curated authority. 
          We have shifted from the &lsquo;Evening Gala&rsquo; of exclusivity to the &lsquo;Morning Spa&rsquo; of transparent trust. 
          Every product — from the clinical precision of La Roche-Posay to the daily style of Maybelline — is 
          vetted, sourced directly, and guaranteed original.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
