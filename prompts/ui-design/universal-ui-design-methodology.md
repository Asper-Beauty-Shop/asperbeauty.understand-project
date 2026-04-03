---
name: Universal UI/UX Design Methodology Expert
description: Use this agent when you need an adaptive design methodology that works across industries and project types. Covers semantic token architecture, color psychology, systematic component design, and scalable design principles.
model: sonnet
---

# Universal UI/UX Design System Methodology

**Category:** ui-design
**Difficulty:** Advanced
**Tags:** #design-system #methodology #semantic-tokens #responsive #accessibility #scalable

## Description

A comprehensive design methodology that adapts to any project type, focusing on semantic token architecture, color psychology, and systematic component design approaches. Creates a complete design system foundation with universal principles that scale across industries — demonstrated here through the Asper "Clinical Luxury" lens.

## Prompt

Create a comprehensive UI/UX design system methodology for my project:

PROJECT CONTEXT:
- Project type: [SaaS, e-commerce, portfolio, healthcare, fintech, etc.]
- Target audience: [developers, consumers, professionals, etc.]
- Brand personality: [Clinical Luxury, playful, serious, innovative, traditional]
- Industry: [technology, healthcare, finance, creative, beauty/wellness]

DESIGN SYSTEM REQUIREMENTS:

## PHASE 1: SEMANTIC TOKEN ARCHITECTURE

Create a semantic token system using HSL for flexibility:

```css
:root {
  /* Base semantic tokens */
  --primary: [hsl values];           /* Main brand color */
  --primary-glow: [lighter variant]; /* Interactive states */
  --accent: [hsl values];            /* Secondary brand */
  --surface: [hsl values];           /* Background canvas */

  /* Functional tokens */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  --shadow-brand: 0 0 40px hsl(var(--primary) / 0.15);
  --transition-standard: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-premium: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## PHASE 2: COLOR PSYCHOLOGY ANALYSIS

Based on project type and brand personality:
- Analyze appropriate color psychology for the industry
- Choose primary color using color theory principles
- Select harmony type: complementary, analogous, triadic, or monochromatic
- Define neutral scales for backgrounds and text
- Ensure WCAG AA contrast ratios throughout

## PHASE 3: COMPONENT VARIANT STRATEGY

Systematic component variants instead of one-off overrides:

```typescript
const cardVariants = cva("base-card-classes", {
  variants: {
    variant: {
      default: "bg-white border-transparent hover:border-accent",
      featured: "bg-surface border-primary shadow-brand",
      ghost: "bg-transparent border border-primary/20",
    },
    size: {
      sm: "p-4 rounded-sm",
      md: "p-6 rounded",
      lg: "p-8 rounded-lg",
    }
  }
})
```

## PHASE 4: ANIMATION SYSTEM

Tiered animation categories:
- **Micro** (150ms): Hover states, button feedback
- **Standard** (300-400ms): Transitions, reveals, data updates
- **Premium** (600-700ms): Brand moments, modal entrances
- **Ambient**: Subtle loops, breathing effects (only where meaningful)

## PHASE 5: RESPONSIVE METHODOLOGY

- Mobile-first with systematic breakpoints
- Consistent spacing scale using 4px base unit (0.25rem)
- Typography scale: clamp-based for fluid sizing
- RTL support using CSS logical properties throughout
- Container queries for component-level responsiveness

TECHNICAL RULES:
- NEVER use direct hex colors in components
- ALWAYS reference semantic tokens
- CREATE component variants instead of ad-hoc class overrides
- ENSURE WCAG AA compliance
- RESPECT `prefers-reduced-motion` for all animations

OUTPUT REQUIREMENTS:
1. Complete `index.css` with semantic token system
2. `tailwind.config.ts` configuration
3. Component variant definitions using `cva()`
4. Animation keyframe library
5. Responsive design patterns
6. Color psychology explanation for chosen palette
7. Quality checklist for design system compliance

## Example Usage

**Input:**
```
Project: B2B SaaS analytics dashboard
Audience: Data analysts, business intelligence professionals
Brand: Professional, trustworthy, innovative, data-driven
Industry: Business intelligence and data analytics
```

**Output would generate:**
- Blue primary (trust/tech) with complementary orange accent for data viz
- Complete HSL token system
- Dashboard-optimized component variants (minimal hover, dense data tables)
- Reduced animation system (professional contexts prefer subtlety)

## Sample Results

For **Asper Beauty Shop** ("Clinical Luxury"):
1. Soft Ivory canvas (`#F8F8FF`) — clinical cleanliness without sterility
2. Maroon primary (`#800020`) — pharmaceutical authority and heritage
3. Gold accent (`#C5A028`) — "Seal of Authenticity", precision, luxury
4. Component variants: Digital Tray (hover gold), Quiz Option (selected gold fill)
5. Animation: 400ms standard, 700ms premium brand moments
6. RTL: Full Tajawal Arabic support with logical CSS properties

## Notes

- Always start with semantic tokens before building components
- Focus on systematic approaches rather than one-off customizations
- Test across different devices and accessibility tools
- The semantic token system enables dark mode without component changes
- HSL format enables opacity variants: `hsl(var(--primary) / 0.1)` for ghost states
