# PLAN_FULL_AND_CLEAN_DESIGN.md
# Asper Beauty Shop — "Morning Spa" Aesthetic Blueprint
# Version: 2025.01 | Status: IMMUTABLE DESIGN LAW
# Last Updated: 2025-01
#
# ⛔ AI AGENTS: Do NOT deviate from this specification.
# Every color, font, and spacing decision below is final.

---

## 1. Design Philosophy: "Morning Spa at a Medical Clinic"

Every UI decision must evoke this precise emotional state:
- The **calm authority** of a well-lit dermatology consultation room
- The **sensory warmth** of an expensive spa's reception at 8am
- The **quiet confidence** that this product was chosen *for you*

This is NOT a generic beauty ecommerce site. Generic = wrong.

---

## 2. The Sacred Color Palette

These are immutable. No variations, no "close enough."

```css
:root {
  /* Primary Canvas */
  --color-ivory:    #F8F8FF;  /* Ghost White — the spa wall */

  /* Brand Anchor */
  --color-maroon:   #800020;  /* Burgundy — medical authority */

  /* Luxury Signal */
  --color-gold:     #C5A028;  /* Antique Gold — premium finish */

  /* Typography Base */
  --color-charcoal: #333333;  /* Soft Black — readable, not harsh */

  /* Derived Surfaces (DO NOT change base values above) */
  --color-ivory-dark:    #F0F0F8;  /* Card backgrounds */
  --color-maroon-light:  #A0002A;  /* Hover states */
  --color-gold-muted:    #D4B547;  /* Shimmer effects */
  --color-charcoal-light: #666666; /* Secondary text */
}
```

### Tailwind Extension (tailwind.config.ts)

```typescript
colors: {
  ivory:   { DEFAULT: '#F8F8FF', dark: '#F0F0F8' },
  maroon:  { DEFAULT: '#800020', light: '#A0002A' },
  gold:    { DEFAULT: '#C5A028', muted: '#D4B547' },
  charcoal:{ DEFAULT: '#333333', light: '#666666' },
}
```

### Extended Palette (Approved Derivatives Only)

| Token | Hex | Usage |
|-------|-----|--------|
| `color-maroon-light` | `#A0002A` | Hover on maroon elements |
| `color-maroon-dark` | `#600018` | Active/pressed states |
| `color-gold-muted` | `#D4B04A` | Disabled gold elements |
| `color-ivory-warm` | `#F5F0E8` | Section dividers only |
| `color-charcoal-xlight` | `#999999` | Placeholder text ONLY |

### Prohibited Colors

- Pure black (#000000) — use color-charcoal (#333333)
- Pure white (#FFFFFF) — use color-ivory (#F8F8FF)
- Any blue or green — not in palette
- CSS named colors ('red', 'gold', 'maroon') — always use hex tokens
- Gold opacity below 0.7 — becomes muddy

### Usage Rules

| Context | Correct Usage | ❌ Never Do |
|---------|---------------|-------------|
| Page background | `bg-ivory` | `bg-white`, `bg-gray-50` |
| Primary CTA | `bg-maroon text-ivory` | `bg-red-*`, `bg-pink-*` |
| Accent borders | `border-gold` | `border-yellow-*` |
| Body text | `text-charcoal` | `text-black`, `text-gray-900` |
| Section dividers | `border-gold/30` | `border-gray-200` |

---

## 3. Typography System

### Font Stack

```css
/* Headings (EN) — Elegance, editorial weight */
font-family: 'Playfair Display', Georgia, serif;

/* Body & UI (EN) — Clean, clinical readability */
font-family: 'Montserrat', 'Helvetica Neue', sans-serif;

/* All Arabic text — Designed for Arabic medical content */
font-family: 'Tajawal', 'Arabic Typesetting', sans-serif;
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?
  family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&
  family=Montserrat:wght@300;400;500;600&
  family=Tajawal:wght@300;400;500;700&
  display=swap" rel="stylesheet">
```

### Type Scale

```css
/* DO NOT use arbitrary Tailwind font sizes */

.text-display   { font: 700 3.5rem/1.1 'Playfair Display', serif; }
.text-heading-1 { font: 600 2.25rem/1.2 'Playfair Display', serif; }
.text-heading-2 { font: 600 1.75rem/1.3 'Playfair Display', serif; }
.text-heading-3 { font: 600 1.25rem/1.4 'Montserrat', sans-serif; }
.text-body-lg   { font: 400 1.125rem/1.7 'Montserrat', sans-serif; }
.text-body      { font: 400 1rem/1.7 'Montserrat', sans-serif; }
.text-body-sm   { font: 400 0.875rem/1.6 'Montserrat', sans-serif; }
.text-label     { font: 500 0.75rem/1.4 'Montserrat', sans-serif;
                  letter-spacing: 0.08em; text-transform: uppercase; }
```

### Arabic Typography Overrides

When `dir="rtl"` is active:

```css
[dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 1.1em;
}

[dir="rtl"] body, [dir="rtl"] p, [dir="rtl"] span {
  font-family: 'Tajawal', sans-serif;
  font-weight: 400;
  line-height: 1.9; /* Arabic needs more line height */
}
```

---

## 4. RTL/LTR Logical Property Rules

### THE RULE: Use logical properties ALWAYS. Physical properties NEVER.

This is non-negotiable for Arabic/English parity.

```css
/* ✅ CORRECT — Flips automatically with dir attribute */
margin-inline-start: 1rem;
margin-inline-end: 1rem;
padding-inline-start: 1.5rem;
padding-inline-end: 1.5rem;
border-inline-start: 2px solid var(--color-gold);
inset-inline-start: 0;

/* ❌ FORBIDDEN — Breaks Arabic layout */
margin-left: 1rem;
padding-right: 1.5rem;
border-left: 2px solid gold;
left: 0;
```

### Tailwind Logical Property Classes

```
/* Use these Tailwind prefixes ONLY */
ms-*   → margin-inline-start
me-*   → margin-inline-end
ps-*   → padding-inline-start
pe-*   → padding-inline-end
rounded-s-*  → border-start-radius
rounded-e-*  → border-end-radius

/* NEVER use */
ml-*, mr-*, pl-*, pr-*
rounded-l-*, rounded-r-*
```

### Language Toggle Implementation

```typescript
// The ONLY place where dir is set — do not replicate this logic
// File: src/components/LanguageToggle.tsx

const setLanguage = (lang: 'en' | 'ar') => {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem('asper_language', lang);
};
```

---

## 5. Component Isolation Standards

### 5.1 Digital Tray Product Card

The product card is the primary conversion surface.
Pixel-perfect implementation required.

```
┌─────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← bg-ivory-dark, rounded-2xl
│ ░░░  [PRODUCT IMAGE]   ░░░ │ ← aspect-square, object-cover
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────────┤
│  [Brand Name]               │ ← text-label text-gold
│  [Product Title]            │ ← text-heading-3 text-charcoal
│  ✦ [Key Ingredient 1]       │ ← text-body-sm text-charcoal-light
│  ✦ [Key Ingredient 2]       │
│  [Clinical Note]            │ ← italic text-body-sm text-maroon
├─────────────────────────────┤
│  [Price]      [Add to Tray] │ ← CTA: bg-maroon text-ivory
└─────────────────────────────┘
  border: 1px solid gold/20
  shadow: 0 4px 24px rgba(197,160,40,0.08)
  hover: shadow increases, border gold/40
  transition: all 0.3s ease
```

### 5.2 AudioWaveformReplay Component

Used for the Dr. Sami / Ms. Zain voice message feature.

```
Anatomy:
┌──────────────────────────────────────────────────┐
│  [Avatar]  [Speaker Name]              [▶ / ‖]   │
│            [Timestamp]                            │
│  ████████████░░░░░░░░░░░░░░░░░  0:23 / 1:15     │
│  └── waveform bars: bg-gold                      │
│       played: bg-maroon  unplayed: bg-gold/30    │
└──────────────────────────────────────────────────┘
```

**Strict Implementation Rules:**
- Waveform bars: 40 bars, 2px wide, 2px gap, height varies 4-32px
- Played portion: `bg-maroon`
- Unplayed portion: `bg-gold opacity-30`
- Play button: `rounded-full bg-maroon text-ivory w-10 h-10`
- This component is `position: relative` — never `position: absolute`
- RTL: Play button moves to `inset-inline-end`, waveform fills correctly

### 5.3 3-Click Funnel Concern Badge

```css
.concern-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background: rgba(197, 160, 40, 0.1);
  border: 1px solid rgba(197, 160, 40, 0.4);
  border-radius: 9999px;
  font: 500 0.75rem/1 'Montserrat', sans-serif;
  color: #C5A028;
  letter-spacing: 0.05em;
}
```

### 5.4 AudioWaveformReplay Specs

- **Bar count:** 40 bars; **bar width:** 2px; **bar gap:** 2px; **max height:** 32px; **min height:** 4px.
- **Colors:** dr-sami → maroon; ms-zain → gold; user → charcoal-light.
- **Play button:** `rounded-full bg-maroon text-ivory w-10 h-10`; focus ring: `ring-2 ring-gold ring-offset-2`.

### 5.5 Digital Tray Product Card Specs

- **Width:** 280px (carousel); **image aspect:** 4:3; **border-radius:** 16px.
- **Shadow:** resting `0 2px 8px rgba(128, 0, 32, 0.08)`; hover `0 8px 24px rgba(128, 0, 32, 0.16)`.
- **SPF badge:** when `spf_value` present — `absolute top-2 end-2 bg-maroon text-ivory text-xs px-2 py-1 rounded-full`.

---

## 6. Spacing & Layout System

```
Base unit: 4px (Tailwind default)

Section vertical padding:  py-16 (64px) desktop, py-10 (40px) mobile
Card padding:              p-6 (24px)
Component gap (grid):      gap-6 (24px) or gap-8 (32px)
Text block max-width:      max-w-prose (65ch)
Content container:         max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

---

## 7. Animation Principles

```css
/* The only permitted easing curves */
--ease-luxury: cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* Smooth reveals */
--ease-snap:   cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Micro-interactions */

/* Standard durations */
--duration-fast:   150ms;   /* Hover states */
--duration-normal: 300ms;   /* Transitions */
--duration-slow:   600ms;   /* Page entrances */

/* FORBIDDEN: */
/* transition: all — always specify properties */
/* animation duration > 800ms without user intent */
/* transform: scale > 1.05 on product images */
```

---

## 8. Accessibility Requirements

- Minimum contrast ratio: 4.5:1 for all body text
- `#800020` on `#F8F8FF`: ratio 8.1:1 ✅
- `#C5A028` on `#F8F8FF`: ratio 3.2:1 — use only for decorative elements
- All interactive elements: visible focus ring using `ring-2 ring-gold ring-offset-2`
- AudioWaveformReplay: full keyboard control (Space = play/pause, arrows = scrub)
- Arabic text: never use `letter-spacing` (breaks Arabic ligatures)

---

## 9. What "Morning Spa" Explicitly Excludes

Any of these patterns automatically signals a wrong implementation:

❌ Bright white (#FFFFFF) backgrounds  
❌ Generic gray color scales (gray-100, gray-200, etc.)  
❌ Sans-serif headings in English layouts  
❌ Red tones that aren't exactly #800020 (no pink, no crimson)  
❌ Yellow tones that aren't exactly #C5A028 (no amber, no yellow-*)  
❌ Rounded corners > 16px on product cards  
❌ Drop shadows with black (use gold-tinted shadows only)  
❌ Animations faster than 150ms  
❌ More than 3 products per row on desktop  
❌ Physical CSS properties (left/right/padding-left) anywhere in codebase  

---

## 10. AI Agent Compliance Checklist

Before submitting any UI-related code, verify:

- [ ] All background colors use palette variables, not Tailwind defaults
- [ ] All font families explicitly set (no system-font fallbacks as primary)
- [ ] All spacing uses logical properties (ms-/me-/ps-/pe-)
- [ ] No `left:`, `right:`, `margin-left:`, `padding-right:` in new CSS
- [ ] Arabic content uses Tajawal with `line-height: 1.9` minimum
- [ ] New components documented under Section 5 of this file
- [ ] Color contrast verified for any new text/background combinations

---

## 11. Implementation Checklist (AI Agents)

- [ ] All colors use token names (maroon, gold, ivory, charcoal) — no raw hex
- [ ] All directional spacing uses logical properties (ms-, me-, ps-, pe-)
- [ ] English headings use font-playfair; Arabic use font-tajawal
- [ ] All interactive elements have focus-visible:ring-2 focus-visible:ring-gold
- [ ] No physical direction classes (ml-, mr-, pl-, pr-, left-, right-)
- [ ] Card shadows use maroon-tinted rgba values in §5.2/5.5
- [ ] AudioWaveformReplay always renders exactly 40 bars
- [ ] Product cards use 4:3 image aspect ratio
- [ ] RTL toggle updates both `lang` and `dir` on `<html>`
