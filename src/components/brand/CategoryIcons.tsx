/**
 * Asper Beauty Shop — "Nature Meets Science" Category Icon Set
 *
 * Design DNA:
 * - Style: Nano minimalist — 1.2px ultra-thin lines
 * - Primary: Emerald Green (inherits from parent via currentColor)
 * - Accent: Gold highlights on specific elements
 * - Canvas: 24×24 grid
 * - Corners: 2px radius, slightly softened
 */

import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
  goldAccent?: boolean;
}

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: cn("shrink-0", className),
});

const GOLD = "#C5A028";

/** Dropper bottle — Skincare */
export function IconCatSkincare({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="8" y="10" width="8" height="11" rx="1.5" />
      <path d="M10 10V8a2 2 0 0 1 4 0v2" />
      <path d="M12 5V3" />
      {/* Gold drop highlight */}
      <circle cx="12" cy="6.5" r="1" fill={goldAccent ? GOLD : "none"} stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.8" />
    </svg>
  );
}

/** Capsule — Vitamins & Supplements */
export function IconCatVitamins({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="8" y="2" width="8" height="20" rx="4" />
      {/* Gold dividing line */}
      <line x1="8" y1="12" x2="16" y2="12" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="1" />
      <circle cx="10.5" cy="15" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="15" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Mortar & Pestle — Prescriptions */
export function IconCatPrescriptions({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 16c0 2.5 3.5 5 8 5s8-2.5 8-5" />
      <path d="M4 16c0-1 1-2 3-3l10 0c2 1 3 2 3 3" />
      {/* Gold pestle */}
      <line x1="12" y1="4" x2="12" y2="13" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1.5" fill="none" stroke={goldAccent ? GOLD : "currentColor"} />
    </svg>
  );
}

/** Leaf & Drop — Mother & Baby */
export function IconCatMomBaby({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      {/* Leaf */}
      <path d="M6 18C6 12 10 6 17 4c0 0-1 8-5 11s-6 3-6 3z" />
      <path d="M6 18c2-2 5-4 8-5" />
      {/* Gold droplet */}
      <path d="M18 14c-1.5 2-2.5 3.5-2.5 5a2.5 2.5 0 0 0 5 0c0-1.5-1-3-2.5-5z" fill={goldAccent ? GOLD : "none"} stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.8" />
    </svg>
  );
}

/** Pump Bottle — Personal Care */
export function IconCatPersonalCare({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="7" y="10" width="10" height="11" rx="2" />
      <rect x="9" y="7" width="6" height="3" rx="1" />
      {/* Gold pump */}
      <path d="M12 7V4h3" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="1.2" />
      <rect x="14" y="3" width="3" height="2" rx="0.5" fill={goldAccent ? GOLD : "none"} stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.8" />
    </svg>
  );
}

/** Medical Cross — First Aid */
export function IconCatFirstAid({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 8v8M8 12h8" strokeWidth="1.5" />
      {/* Subtle gold glow circle behind cross */}
      <circle cx="12" cy="12" r="5" fill="none" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}

/** Toothbrush — Oral Care */
export function IconCatOralCare({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="10" y="2" width="4" height="6" rx="2" />
      <rect x="11" y="8" width="2" height="14" rx="1" />
      {/* Gold sparkle */}
      <path d="M17 4l-1 1M17 4l1 0M17 4l0-1" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="1" />
    </svg>
  );
}

/** Shield — Men's Health */
export function IconCatMensHealth({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      {/* Gold rim line */}
      <path d="M12 5l5 2.2v3.8c0 3.8-2.2 6.2-5 7.8" stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.6" fill="none" />
    </svg>
  );
}

/** Floral — Beauty */
export function IconCatBeauty({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      {/* Petals */}
      <path d="M12 4c-2 2-3 4-3 6s1 3 3 3 3-1 3-3-1-4-3-6z" />
      <path d="M4 12c2-2 4-3 6-3s3 1 3 3-1 3-3 3-4-1-6-3z" />
      <path d="M20 12c-2-2-4-3-6-3s-3 1-3 3 1 3 3 3 4-1 6-3z" />
      <path d="M12 20c-2-2-3-4-3-6s1-3 3-3 3 1 3 3-1 4-3 6z" />
      {/* Gold center pistil */}
      <circle cx="12" cy="12" r="1.5" fill={goldAccent ? GOLD : "none"} stroke={goldAccent ? GOLD : "currentColor"} />
    </svg>
  );
}

/** Zen Stones — Wellness */
export function IconCatWellness({ className, size = 24, goldAccent = true }: IconProps) {
  return (
    <svg {...base(size, className)}>
      {/* Stacked stones */}
      <ellipse cx="12" cy="19" rx="5" ry="2.5" />
      <ellipse cx="12" cy="14" rx="4" ry="2" />
      <ellipse cx="12" cy="10" rx="3" ry="1.5" />
      {/* Gold leaf accent */}
      <path d="M16 6c0 0-1.5 3-4 3s-2-3-2-3c1-1 3-2 4-1.5s2 1.5 2 1.5z" fill={goldAccent ? GOLD : "none"} stroke={goldAccent ? GOLD : "currentColor"} strokeWidth="0.8" />
    </svg>
  );
}

/** Full category list for navigation */
export const categoryList = [
  { key: "skincare", label: "Skincare", labelAr: "العناية بالبشرة", Icon: IconCatSkincare, href: "/products?category=skincare" },
  { key: "vitamins", label: "Vitamins", labelAr: "فيتامينات", Icon: IconCatVitamins, href: "/products?category=vitamins" },
  { key: "prescriptions", label: "Prescriptions", labelAr: "وصفات طبية", Icon: IconCatPrescriptions, href: "/products?category=prescriptions" },
  { key: "mom-baby", label: "Mother & Baby", labelAr: "الأم والطفل", Icon: IconCatMomBaby, href: "/mom-baby" },
  { key: "personal-care", label: "Personal Care", labelAr: "العناية الشخصية", Icon: IconCatPersonalCare, href: "/products?category=personal-care" },
  { key: "first-aid", label: "First Aid", labelAr: "إسعافات أولية", Icon: IconCatFirstAid, href: "/products?category=first-aid" },
  { key: "oral-care", label: "Oral Care", labelAr: "العناية بالفم", Icon: IconCatOralCare, href: "/products?category=oral-care" },
  { key: "mens-health", label: "Men's Health", labelAr: "صحة الرجل", Icon: IconCatMensHealth, href: "/products?category=mens-health" },
  { key: "beauty", label: "Beauty", labelAr: "الجمال", Icon: IconCatBeauty, href: "/products?category=beauty" },
  { key: "wellness", label: "Wellness", labelAr: "العافية", Icon: IconCatWellness, href: "/products?category=wellness" },
] as const;
