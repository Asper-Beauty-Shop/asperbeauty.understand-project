import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function TrustBadge({ label, children, className }: TrustBadgeProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 group", className)}>
      {/* Hexagon container */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
          <polygon
            points="28,2 50,15 50,41 28,54 6,41 6,15"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="1.5"
            className="transition-all duration-300 group-hover:fill-[hsl(var(--gold)/0.08)] group-hover:stroke-[hsl(var(--gold-dark))]"
          />
        </svg>
        <div className="relative z-10 text-accent transition-colors duration-300 group-hover:text-gold-dark">
          {children}
        </div>
      </div>
      <span className="text-[10px] font-body uppercase tracking-[0.15em] text-primary-foreground/60 group-hover:text-accent transition-colors">
        {label}
      </span>
    </div>
  );
}

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Cruelty-Free: Rabbit */}
      <TrustBadge label="Cruelty Free">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 5c0-2-1.5-3-3-3s-2 1.5-2 3c0 .5.1 1 .3 1.4" />
          <path d="M11 5c0-2-1.5-3-3-3S6 3.5 6 5c0 .5.1 1 .3 1.4" />
          <circle cx="12" cy="13" r="5" />
          <circle cx="10" cy="12" r="0.7" fill="currentColor" />
          <circle cx="14" cy="12" r="0.7" fill="currentColor" />
          <path d="M10.5 14.5c.5.5 2.5.5 3 0" />
        </svg>
      </TrustBadge>

      {/* Vegan: Leaf */}
      <TrustBadge label="Vegan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </TrustBadge>

      {/* Dermatologist Tested: Checkmark in circle */}
      <TrustBadge label="Derm Tested">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12.5l2.5 3 5.5-6" />
        </svg>
      </TrustBadge>
    </div>
  );
}

