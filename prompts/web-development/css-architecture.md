---
name: Scalable CSS Architecture for Beauty E-Commerce
description: Use this agent when you need to design a scalable CSS architecture for large e-commerce platforms. Covers CSS Modules, Tailwind utility strategy, token management, and performance patterns for 4,000+ SKU catalogs.
model: sonnet
---

# CSS Architecture Patterns

**Category:** web-development
**Difficulty:** Advanced
**Tags:** #css #architecture #tailwind #css-modules #performance #tokens #scalable

## Description

Design a scalable, maintainable CSS architecture for large React e-commerce applications. Covers the strategy for combining Tailwind utilities with CSS Modules, semantic token governance, critical CSS, and performance patterns for sites with thousands of products.

## Prompt

I need you to design a CSS architecture for the following project:

PROJECT CONTEXT:
- Framework: [React 18 + Vite + Tailwind CSS]
- Scale: [4,000+ products, 20+ pages]
- Special requirements: [RTL Arabic support, CSS Modules for complex components]
- Performance target: [LCP < 2.5s, bundle size < 1.5MB CSS]

CSS ARCHITECTURE REQUIREMENTS:

## LAYER 1: TOKEN GOVERNANCE (index.css)

```css
/* Strict hierarchy — tokens first, utilities second, components third */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Semantic tokens using HSL for flexibility */
    --soft-ivory: 240 100% 99%;
    --maroon: 345 100% 25%;
    --shiny-gold: 46 66% 46%;
    --dark-charcoal: 0 0% 20%;
  }
}
```

**Rule:** Never use raw hex values in component files. Always reference tokens.

## LAYER 2: TAILWIND UTILITY STRATEGY

```
Tailwind for:          CSS Modules for:
✅ Spacing             ✅ Complex animations
✅ Typography          ✅ Grid auto-fill patterns
✅ Colors (tokens)     ✅ Pseudo-element decorations
✅ Hover states        ✅ :focus-visible ring styles
✅ Responsive prefixes ✅ @keyframe definitions
```

## LAYER 3: CSS MODULES PATTERN

Use CSS Modules for components with > 5 unique style rules:

```css
/* ProductGrid.module.css */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--shiny-gold);  /* Token reference, not raw hex */
}
```

## LAYER 4: CRITICAL CSS STRATEGY

- Above-the-fold: Hero section, header, first 4 product cards
- Below-the-fold: Lazy-loaded with `<link rel="preload">`
- AI Chat Widget: Load CSS only on first interaction

## LAYER 5: RTL ARCHITECTURE

```css
/* ❌ Never */
.card { margin-left: 1rem; }

/* ✅ Always */
.card { margin-inline-start: 1rem; }
```

In Tailwind: `ms-4` not `ml-4`, `pe-6` not `pr-6`.

OUTPUT REQUIREMENTS:
1. `tailwind.config.ts` structure with token extensions
2. `index.css` layer organization
3. CSS Modules naming conventions
4. RTL-safe patterns cheat sheet
5. Bundle size optimization techniques

## Example Usage

**Input:**
```
Project: Asper Beauty Shop
Scale: 5,000 SKUs, 25 pages, bilingual English/Arabic
CSS approach: Tailwind primary, CSS Modules for ProductGrid and animations
Performance: Target LCP < 2.5s on 4G mobile
```

## Sample Results

The prompt would generate:
- `tailwind.config.ts` extending shadcn/ui with custom Asper tokens
- `ProductGrid.module.css` with fluid `auto-fill` grid (no media queries)
- `animations.module.css` with `@keyframes` for "Gold Stitch" reveal
- RTL cheat sheet: `ms-`/`me-`/`ps-`/`pe-` → `ml-`/`mr-`/`pl-`/`pr-` migration
- PurgeCSS configuration to remove unused Tailwind classes from 5,000-SKU pages
- Critical CSS inlining strategy for the hero section

## Notes

- CSS Modules give scoped class names — safe for large teams to work in parallel
- The `auto-fill` grid pattern eliminates the need for breakpoint media queries in product grids
- Never animate `width`, `height`, `padding`, or `border-width` — always use `transform` and `opacity`
- Add `will-change: transform` only on elements that actually animate
- RTL-first CSS: write logical properties from the start, not as an afterthought
