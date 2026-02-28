import { ShieldCheck, Award, FlaskConical, Leaf } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "JFDA CERTIFIED" },
  { icon: Award, label: "100% AUTHENTIC GUARANTEED" },
  { icon: FlaskConical, label: "PHARMACIST VETTED" },
  { icon: Leaf, label: "CRUELTY-FREE" },
];

const ClinicalProof = () => {
  return (
    <section className="py-10 sm:py-12 bg-white border-t border-border/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-8 md:gap-12">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 justify-center md:justify-start">
              <badge.icon className="h-5 w-5 text-accent shrink-0" strokeWidth={1.6} />
              <span className="font-body text-[11px] sm:text-xs tracking-[0.15em] uppercase text-foreground font-medium">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicalProof;
