---
name: Mobile Design Philosophy for Clinical Luxury
description: Use this agent when designing mobile-first experiences for luxury beauty or wellness e-commerce. Covers touch interaction patterns, the "Morning Spa" mobile aesthetic, AI concierge mobile UX, and performance-first design.
model: sonnet
---

# Mobile Design Philosophy — Clinical Luxury

**Category:** ui-design
**Difficulty:** Advanced
**Tags:** #mobile #ux #luxury #beauty #performance #touch #concierge

## Description

Design mobile-first experiences that maintain the Asper "Clinical Luxury" aesthetic on small screens. The challenge: high-end luxury must translate to 375px without losing the "Morning Spa" warmth or the "Pharmacist Precision" feel. This prompt covers touch patterns, reduced-motion, AI concierge mobile UX, and performance philosophy.

## Prompt

Design a mobile-first UI/UX strategy for a luxury beauty e-commerce platform with the following context:

PLATFORM CONTEXT:
- Brand: [Clinical Luxury / Nature Meets Science]
- Primary mobile users: [25-45 women, bilingual English/Arabic]
- Key interactions: [product browsing, 3-Click skin quiz, AI concierge chat]
- Performance target: [LCP < 2.5s, FID < 100ms on mid-range Android]

MOBILE DESIGN PHILOSOPHY REQUIREMENTS:

1. THE CLEAN CARD RULE:
   - On mobile, the "Digital Tray" product cards are always clean white
   - The "Gold Stitch" border is desktop-only (hover doesn't exist on touch)
   - Tap feedback uses `active:scale-[0.98]` for physical response
   - Never cage mobile products in heavy borders — keep it airy

2. THE AI CONCIERGE MOBILE RULES:
   - Chat widget must NOT cover the "Add to Cart" button
   - Position: fixed bottom-right, collapsible to 56px icon
   - Font: 16px minimum to prevent iOS zoom on focus
   - The "3-Click Quiz" must be thumb-reachable (bottom 60% of screen)
   - Load on interaction only (lazy) to save LCP budget

3. TYPOGRAPHY AT 375px:
   - Playfair Display: clamp(1.5rem, 4vw, 2.5rem) for hero headings
   - Montserrat: minimum 16px for form inputs (prevents iOS auto-zoom)
   - Tajawal (Arabic): line-height: 1.8 for correct baseline rendering

4. TOUCH TARGETS:
   - Minimum 44×44px for all interactive elements
   - "Ask AI" icon button: 48px to accommodate thumb imprecision
   - Cart icon in header: 48px with sufficient spacing from adjacent icons

5. PERFORMANCE PHILOSOPHY:
   - Product images: `loading="lazy"`, `aspect-ratio: 1/1`, WebP format
   - Fonts: `font-display: swap` to prevent invisible text flash
   - AI chat widget: load script on first user interaction only
   - Avoid CSS animations that trigger layout reflow on scroll

OUTPUT REQUIREMENTS:
1. Mobile-first component designs with touch states
2. Tailwind CSS for the specific mobile patterns above
3. Performance audit checklist
4. RTL (Arabic) mobile layout adjustments
5. Accessibility on mobile (screen reader, zoom, font size)

## Example Usage

**Input:**
```
Design mobile UX for:
1. Product Grid Page (50+ items)
2. 3-Click Skin Concern Quiz
3. AI Concierge widget placement
Constraints: Must not block add-to-cart, must support RTL, LCP < 2.5s
```

## Sample Results

The prompt would generate:
- `grid-cols-2 gap-3` mobile product grid with `aspect-ratio-square` images
- Quiz as a bottom sheet (`fixed bottom-0 left-0 right-0`) for thumb reach
- AI widget as a floating 56px circle collapsible to avoid blocking CTAs
- `will-change: transform` on animated elements for GPU layers
- `<link rel="preload">` for Playfair Display and Montserrat critical fonts

## Notes

- The "Gold Stitch" is intentionally hidden on mobile — clean white cards perform better on small screens
- Never use `hover:` for mobile interactions — use `active:` or `focus-visible:`
- Disable heavy animations with `@media (prefers-reduced-motion: reduce)`
- Arabic mobile users need extra letter-spacing in Tajawal for small screens
- Test on a real mid-range Android device — don't only test on high-end iPhone
