---
name: React Component Architect
description: Use this agent when you need to create modern, production-ready React components with TypeScript and best practices. Examples include building reusable UI components, creating accessible form elements, developing complex interactive components with proper state management.
model: sonnet
---

# React Component Generator

**Category:** components
**Difficulty:** Intermediate
**Tags:** #react #components #jsx #typescript #tailwind #shadcn #accessibility

## Description

Generate modern React components with TypeScript support, proper prop types, and best practices including accessibility, error handling, and performance optimizations — all aligned with the Asper "Ivory & Gold" design system.

## Prompt

I need you to create a React component with the following specifications:

COMPONENT REQUIREMENTS:
- Component name: [COMPONENT_NAME]
- Purpose: [DESCRIBE_WHAT_THE_COMPONENT_DOES]
- Props needed: [LIST_PROPS_AND_TYPES]

TECHNICAL REQUIREMENTS:
- Use TypeScript with proper interfaces
- Include proper prop validation
- Add JSDoc comments for documentation
- Follow React best practices (hooks, functional components)
- Include error boundaries where appropriate
- Implement proper accessibility (ARIA labels, semantic HTML)
- Add loading and error states if applicable
- Make it responsive and support RTL (Arabic) using Tailwind logical properties

ASPER DESIGN SYSTEM (MANDATORY):
- Background canvas: Soft Ivory (#F8F8FF) — use `bg-[#F8F8FF]` or `var(--soft-ivory)`
- Primary actions: Deep Maroon (#800020) — use `bg-[#800020]` or `var(--maroon)`
- Gold Stitch: Shiny Gold (#C5A028) on hover — `hover:border-[#C5A028]`
- Text: Dark Charcoal (#333333) — `text-[#333333]` or `var(--dark-charcoal)`
- Product card surface: Pure White (#FFFFFF)
- Headings: `font-playfair` (Playfair Display)
- Body: `font-montserrat` (Montserrat)
- RTL: Use `ms-`, `me-`, `ps-`, `pe-` Tailwind logical properties instead of `ml-`, `mr-`, `pl-`, `pr-`

STYLING REQUIREMENTS:
- Use Tailwind CSS utilities
- Include hover and focus states
- Ensure proper contrast ratios (WCAG AA)
- Add the "Gold Stitch" (1px gold border) on interactive elements hover
- Smooth transitions (300ms standard, 700ms for premium brand elements)

OUTPUT FORMAT:
1. Component file (.tsx)
2. Usage example with different prop variations
3. Unit test structure (Vitest/React Testing Library)

## Example Usage

**Input:**
```
Component name: ProductCard (The "Digital Tray")
Purpose: Display product with image, brand, name, price, Add to Cart button, and Ask AI button
Props: product (object with handle, title, vendor, price, imageUrl), onAddToCart (function), onAskAI (function)
Styling: Tailwind — white card on ivory canvas, Gold Stitch on hover
```

**Expected Output:**
```tsx
interface ProductCardProps {
  product: {
    handle: string;
    title: string;
    vendor: string;
    price: string;
    imageUrl: string;
  };
  onAddToCart: (handle: string) => void;
  onAskAI: (handle: string) => void;
}

export function ProductCard({ product, onAddToCart, onAskAI }: ProductCardProps) {
  return (
    <article
      className="
        bg-white rounded-sm flex flex-col
        border border-transparent
        transition-all duration-300 ease-out
        hover:border-[#C5A028] hover:-translate-y-1
        hover:shadow-[0_15px_35px_rgba(128,0,32,0.08)]
      "
      aria-label={`${product.vendor} ${product.title}`}
    >
      {/* ... */}
    </article>
  );
}
```

## Sample Results

The prompt would generate:
- Full `ProductCard.tsx` with TypeScript interfaces
- `aria-label`, `role`, and keyboard navigation support
- Tailwind classes with Gold Stitch hover, translate lift, maroon shadow
- Loading skeleton variant using `ProductCardSkeleton`
- Vitest test stubs for render, click handlers, accessibility

## Notes

- Always specify the component purpose clearly
- Include all required props with types
- Mention RTL requirements if the component contains directional layout
- For Asper-specific components, include the "Ask AI" button to route users to the Digital Concierge
- The "Digital Tray" product card is the core conversion component — prioritize it
