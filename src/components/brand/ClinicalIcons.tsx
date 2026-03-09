/**
 * Asper Beauty Shop â€” Clinical Elegance Icon Library
 *
 * Design DNA:
 * - Stroke: 1.2px, consistent weight
 * - Color: Inherits from parent (currentColor)
 * - Fill: None (transparent) â€” exception: EzabilaSparkle is solid
 * - Corners: Slightly softened (strokeLinejoin="round")
 * - Canvas: 24Ã—24 grid
 */

import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SET 1: Primary Departments (Product Type)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** Serum dropper bottle with a suspended drop */
export function IconSkincare({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="8" y="10" width="8" height="11" rx="1.5" />
      <path d="M10 10V8a2 2 0 0 1 4 0v2" />
      <path d="M12 5V3" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="23.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Flowing wave of hair curling into a droplet */
export function IconHairCare({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 4c2 0 3 2 5 2s3-2 5-2" />
      <path d="M6 8c2 0 3 2 5 2s3-2 5-2" />
      <path d="M8 12c1.5 0 2.5 1.5 4 1.5s2.5-1.5 4-1.5" />
      <path d="M12 16c-2.5 0-3.5 2-3.5 4a3.5 3.5 0 0 0 7 0c0-2-1-4-3.5-4z" />
    </svg>
  );
}

/** Capsule pill with powder dots inside the bottom half */
export function IconSupplements({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="8" y="2" width="8" height="20" rx="4" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <circle cx="10.5" cy="15" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="15" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="19.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="19.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Graceful shoulder/arm silhouette with a lather bubble */
export function IconBodyBath({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 20c0-4 3-7 6-9 2-1.5 3-3 3-5" />
      <path d="M13 6c1-2 3-3 5-3" />
      <circle cx="16" cy="16" r="2.5" />
      <circle cx="19" cy="13.5" r="1.5" />
      <circle cx="18.5" cy="17.5" r="1" />
    </svg>
  );
}

/** High-tech facial wand with vibration lines */
export function IconToolsDevices({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="10.5" y="6" width="3" height="14" rx="1.5" />
      <circle cx="12" cy="5" r="2.5" />
      <path d="M7.5 4L6 2.5" />
      <path d="M16.5 4L18 2.5" />
      <path d="M7 7L5 6.5" />
      <path d="M17 7L19 6.5" />
    </svg>
  );
}

/** Sun half-rising with a shield arc */
export function IconSunProtection({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 18h16" />
      <path d="M12 18c-4 0-7-3.5-7-7" />
      <path d="M12 18c4 0 7-3.5 7-7" />
      <line x1="12" y1="8" x2="12" y2="6" />
      <line x1="8" y1="9.5" x2="6.5" y2="8" />
      <line x1="16" y1="9.5" x2="17.5" y2="8" />
      <path d="M6 5c3.5 1 8.5 1 12 0" strokeDasharray="2 1.5" />
    </svg>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SET 2: Shop by Concern (The Clinic)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** Face circle with three T-zone dots */
export function IconAcne({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Almond eye shape with crow's feet lines */
export function IconAntiAging({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 12c3-4 6-5 9-5s6 1 9 5c-3 4-6 5-9 5s-6-1-9-5z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M21 12c.5-.8 1-1.8 1.5-2" />
      <path d="M21.5 10c.5-.3 1-.8 1.5-1" />
      <path d="M22 12.5c.5.5 1 1 1.5 1" />
    </svg>
  );
}

/** Water droplet hitting surface with ripple rings */
export function IconHydration({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3c-3 4.5-5 7-5 10a5 5 0 0 0 10 0c0-3-2-5.5-5-10z" />
      <ellipse cx="12" cy="20" rx="3" ry="0.8" />
      <ellipse cx="12" cy="20" rx="5.5" ry="1.3" />
    </svg>
  );
}

/** Four-pointed sparkle starburst with rays */
export function IconGlow({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <path d="M12 8l-1-2M12 8l1-2M8 12l-2-1M8 12l-2 1M16 12l2-1M16 12l2 1M12 16l-1 2M12 16l1 2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/** Feather gently resting on a skin surface curve */
export function IconSensitivity({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 21c4-1 8-1 14 0" />
      <path d="M17 3c-2 2-4 4-6 7-1.5 2.5-2.5 5-3 8" />
      <path d="M17 3c0 3-1 5.5-3 8" />
      <path d="M17 3c-1.5 1-3.5 2.5-5.5 5" />
    </svg>
  );
}

/** Circle with two overlapping organic blob shapes */
export function IconPigmentation({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="10" cy="11" rx="3" ry="2.5" transform="rotate(-15 10 11)" />
      <ellipse cx="14" cy="13.5" rx="2.5" ry="2" transform="rotate(20 14 13.5)" />
    </svg>
  );
}

/** Simple redness icon â€” face circle with flushed cheeks */
export function IconRedness({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="13" r="2" strokeDasharray="1.5 1" />
      <circle cx="15.5" cy="13" r="2" strokeDasharray="1.5 1" />
    </svg>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SET 3: Special Navigation & Utility
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** Solid gold three-pointed sparkle â€” the ONLY filled icon */
export function IconEzabila({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={cn("shrink-0", className)}
    >
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

/** Retail hang-tag with 'N' inside */
export function IconNewArrivals({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 4h12a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1z" />
      <path d="M10 9v6l4-6v6" />
    </svg>
  );
}

/** Award ribbon with star */
export function IconBestSellers({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14l-2 7 3.5-2 2 3" />
      <path d="M15.5 14l2 7-3.5-2-2 3" />
      <path d="M12 6l1 2 2 .3-1.5 1.4.4 2.3L12 11l-1.9 1 .4-2.3L9 8.3l2-.3 1-2z" />
    </svg>
  );
}

/** Gift box with bow */
export function IconGiftSets({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="10" width="18" height="11" rx="1.5" />
      <rect x="2" y="7" width="20" height="3" rx="1" />
      <line x1="12" y1="7" x2="12" y2="21" />
      <path d="M12 7c-1-3-4-4-5-3s0 3 5 3" />
      <path d="M12 7c1-3 4-4 5-3s0 3-5 3" />
    </svg>
  );
}

/** Envelope with phone handset overlay */
export function IconContact({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="2" y="5" width="16" height="12" rx="1.5" />
      <path d="M2 5l8 6 8-6" />
      <path d="M18 14c.5 0 1 .2 1.3.6l1.5 2c.3.4.2 1-.2 1.3l-1.5 1a1 1 0 0 1-1.1 0c-2-1.2-3.5-2.7-4.7-4.7a1 1 0 0 1 0-1.1l1-1.5c.3-.4.9-.5 1.3-.2l2 1.5c.4.3.6.8.6 1.3" />
    </svg>
  );
}

