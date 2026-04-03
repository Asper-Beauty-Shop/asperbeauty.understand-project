---
name: Mobile-First Layout Specialist
description: Use this agent when you need responsive, mobile-first layouts that work seamlessly across devices. Includes RTL (Arabic) support, fluid grids for large product catalogs, and touch-optimized interactions.
model: sonnet
---

# Mobile-First Layout Designer

**Category:** responsive
**Difficulty:** Intermediate
**Tags:** #responsive #mobile-first #rtl #tailwind #grid #css #arabic

## Description

Create mobile-first responsive layouts that work seamlessly from small phones to ultrawide monitors — including full RTL (Right-to-Left) Arabic support for Asper's bilingual platform. The "Clinical Luxury" aesthetic must hold at every breakpoint.

## Prompt

I need you to design a mobile-first responsive layout for the following:

LAYOUT CONTEXT:
- Component/Page: [product grid, header, checkout form, hero section, etc.]
- Content type: [product cards, form fields, navigation, images]
- Primary breakpoints: mobile (375px), tablet (768px), desktop (1280px)
- RTL requirement: [yes — supports Arabic | no]
- Product count: [for grids — how many items per row at each breakpoint]

MOBILE-FIRST REQUIREMENTS:
1. GRID STRATEGY:
   - Mobile: 1 or 2 columns
   - Tablet: 2-3 columns
   - Desktop: 3-4 columns
   - Use `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` for fluid product grids

2. RTL/LTR SUPPORT:
   - Use Tailwind logical properties exclusively:
     - `ms-` instead of `ml-` (margin-start)
     - `me-` instead of `mr-` (margin-end)
     - `ps-` instead of `pl-` (padding-start)
     - `pe-` instead of `pr-` (padding-end)
   - Use `dir="rtl"` on the root for Arabic

3. TOUCH OPTIMIZATION:
   - Minimum 44×44px touch targets (buttons, icons)
   - The "Gold Stitch" hover is desktop-only (no hover on touch devices)
   - Tap states use `active:` Tailwind prefix instead of `hover:`

4. TYPOGRAPHY SCALING:
   - Headings: clamp-based fluid sizing
   - Body: minimum 16px on mobile for readability
   - Arabic (Tajawal): ensure correct line-height for RTL text

OUTPUT REQUIREMENTS:
1. Tailwind CSS classes for the responsive layout
2. CSS Grid or Flexbox structure
3. RTL-safe CSS (logical properties)
4. Mobile interaction states (active/focus instead of hover)
5. Performance notes (image sizing, lazy loading)

## Example Usage

**Input:**
```
Component: Product Grid (5,000+ SKU catalog)
Content: ProductCard "Digital Tray" components
Breakpoints: 1-col mobile, 2-col tablet, 3-4-col desktop
RTL: Yes — must support Arabic layout
Performance: Lazy load images below the fold
```

**Expected Output:**
```tsx
<section className="bg-[#F8F8FF] px-4 py-10 md:px-8 lg:px-[5%]">
  <h2 className="font-playfair text-[#800020] text-2xl md:text-4xl text-center mb-8">
    Featured Products
  </h2>
  <div className="
    grid gap-6
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
  ">
    {products.map(product => (
      <ProductCard key={product.handle} product={product} />
    ))}
  </div>
</section>
```

## Sample Results

The prompt would generate:
- CSS Grid with `auto-fill` for fluid columns without media queries
- Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- `dir="rtl"` container with logical property Tailwind classes
- `loading="lazy"` on product images with `aspect-ratio: 1/1` placeholders
- Touch target CSS ensuring 44px minimum tap areas

## Notes

- The Gold Stitch hover is desktop-only — on mobile, cards are always clean white
- Use `@container` queries for component-level responsive behavior where possible
- Fluid grid with `minmax(280px, 1fr)` handles 1-4 columns automatically without breakpoints
- Tajawal Arabic font needs `line-height: 1.8` for proper readability
- Product images should use `aspect-ratio: 1/1` to guarantee uniform clinical photography
