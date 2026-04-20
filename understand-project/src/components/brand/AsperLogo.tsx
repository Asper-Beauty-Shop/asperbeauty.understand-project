import { cn } from "@/lib/utils";
import asperLogo from "@/assets/asper-logo-minimal-gold.png";

interface AsperLogoProps {
  variant?: "seal" | "bloom";
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function AsperLogo({ size = 160, className, animated }: AsperLogoProps) {
  return (
    <img
      src={asperLogo}
      alt="Asper Beauty Shop"
      width={size}
      height={size}
      className={cn(
        "object-contain",
        animated && "transition-transform duration-700 hover:scale-105",
        className
      )}
    />
  );
}

