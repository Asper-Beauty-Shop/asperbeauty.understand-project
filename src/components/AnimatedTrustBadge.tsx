import { ShieldCheck } from "lucide-react";

export const AnimatedTrustBadge = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-spin" style={{ animationDuration: '8s' }} />
    <div className="absolute inset-2 rounded-full border border-accent/20" />
    <ShieldCheck className="w-8 h-8 text-accent" />
  </div>
);
