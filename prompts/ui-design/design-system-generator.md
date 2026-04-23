---
name: Clinical Luxury Design System Generator
description: Use this agent when you need to generate or extend the Asper Beauty Shop "Ivory & Gold" design system. Covers semantic tokens, component variants, color psychology, and the complete CSS/Tailwind configuration.
model: sonnet
---

# Design System Generator

**Category:** ui-design
**Difficulty:** Advanced
**Tags:** #design-system #tokens #tailwind #css #color-psychology #shadcn

## Description

Generate a complete "Clinical Luxury" design system with semantic token architecture, color psychology rationale, component variant strategy, and a full `tailwind.config.ts` + `index.css` setup. Based on the Asper Beauty Shop "Ivory & Gold" brand strategy.

## Prompt

I need you to create or extend a design system for my project using the following context:

PROJECT CONTEXT:
- Project type: [pharmacy e-commerce, SaaS, healthcare, fintech, etc.]
- Target audience: [beauty consumers, B2B professionals, etc.]
- Brand personality: [Clinical Luxury, Morning Spa, Nature Meets Science]
- Industry: [beauty retail, healthcare, wellness]

DESIGN SYSTEM REQUIREMENTS:

## PHASE 1: SEMANTIC TOKEN ARCHITECTURE

Create a semantic token system using HSL color format for flexibility:

```css
:root {
  /* Asper "Clinical Luxury" Palette */
  --soft-ivory: 240 100% 99%;     /* #F8F8FF — Global Canvas */
  --maroon: 345 100% 25%;         /* #800020 — Primary Action */
  --shiny-gold: 46 66% 46%;       /* #C5A028 — The "Gold Stitch" */
  --dark-charcoal: 0 0% 20%;      /* #333333 — Body Text */

  /* Interaction tokens */
  --gold-glow: 0 0 20px hsl(46 66% 46% / 0.3);
  --maroon-shadow: 0 15px 35px hsl(345 100% 25% / 0.08);
  --transition-standard: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-premium: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## PHASE 2: COLOR PSYCHOLOGY ANALYSIS

Based on the "Authentic Quality" brand strategy:
- Soft Ivory: Clinical cleanliness, reduces eye strain, "Morning Spa" canvas
- Deep Maroon: Pharmaceutical heritage, authority, seriousness, trust
- Shiny Gold: Pharmacist's stamp, "Seal of Authenticity", premium quality
- Dark Charcoal: Medical precision, readability, "Voice of Science"

## PHASE 3: COMPONENT VARIANT STRATEGY

Using `class-variance-authority` for systematic variants:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      primary: "bg-[#800020] text-white hover:bg-[#C5A028]",
      ghost: "border border-[#800020] text-[#800020] hover:border-[#C5A028]",
      gold: "border border-[#C5A028] text-[#C5A028]",
    }
  }
})
```

## PHASE 4: ANIMATION SYSTEM

Four animation tiers:
- Standard (300ms): Standard UI transitions
- Clinical (400ms): Data updates, cart interactions
- Premium (700ms): Brand elements, AI persona switch
- Ambient: Floating social icons, scroll reveals

OUTPUT REQUIREMENTS:
1. Complete `src/index.css` with HSL token system
2. `tailwind.config.ts` extending shadcn/ui base
3. Component variant definitions (Button, Card, Badge)
4. Typography scale (Playfair Display + Montserrat + Tajawal)
5. Quality checklist for design system compliance

## Example Usage

**Input:**
```
Project: Asper Beauty Shop — pharmacist-curated beauty e-commerce
Audience: Beauty consumers, 25-45, bilingual (English/Arabic)
Brand: Clinical Luxury — "Where Science Meets Elegance"
Extend: Existing shadcn/ui + Tailwind setup
```

## Sample Results

The prompt would generate:
1. `index.css` with full HSL token system and the "Clinical Luxury" palette
2. `tailwind.config.ts` with custom colors, fonts, border widths, and animations
3. Button, Card, Badge `cva()` variant definitions
4. Google Fonts import for Playfair Display + Montserrat + Tajawal
5. `verifyBrandDNA()` runtime check to alert if tokens drift from spec

## Notes

- Always use HSL format for tokens — enables opacity manipulation (`hsl(var(--maroon) / 0.1)`)
- Never use raw hex values in components — always reference semantic tokens
- The "Gold Stitch" uses `border-transparent` by default to prevent layout shift
- Add `--font-arabic: 'Tajawal', sans-serif` for RTL text nodes
