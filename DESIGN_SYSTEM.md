# Asper Beauty Shop — Design System

> **"Morning Spa" / Medical Luxury**  
> Warm, clinical elegance meets feminine wellness. No cold whites, no stark blacks—only soothing ivory, rose clay, deep burgundy, and polished gold accents.

---

## Brand Identity

**Asper Beauty Shop** is the online home of an Egyptian pharmaceutical beauty brand. Our design conveys:

- **Clinical trust** — Medical authority, dermatologist-approved formulations  
- **Feminine warmth** — Soft pinks, terracotta, and nurturing tones  
- **Understated luxury** — Muted elegance, never flashy or loud  
- **Approachability** — Friendly, confident, and welcoming

---

## Color Palette

All colors below are defined in `tailwind.config.ts` and available via Tailwind utility classes (e.g., `bg-asper-stone`, `text-burgundy`, `border-polished-gold`).

### Primary Canvas — Asper Stone (Warm Ivory / Light Gray)

| Token | Hex | Usage |
|-------|-----|-------|
| `asper-stone` (DEFAULT) | `#F2EFEB` | Main background, cards, sections |
| `asper-stone-light` | `#F8F6F3` | Lightest variant, subtle backgrounds |
| `asper-stone-dark` | `#E8E4DE` | Darker variant for contrast within ivory areas |

**Never use pure white (`#FFF`)** — always prefer `asper-stone` or `polished-white` for a warmer feel.

### Feminine Softness — Rose Clay (Muted Pink / Terracotta)

| Token | Hex | Usage |
|-------|-----|-------|
| `rose-clay` (DEFAULT) | `#C4A494` | Subtle highlights, warm accents, secondary backgrounds |
| `rose-clay-light` | `#D4B8A8` | Very soft pink, hover states, delicate elements |
| `rose-clay-dark` | `#A88B7A` | Deeper terracotta, text on light backgrounds |

Use for:
- Section backgrounds (alternate with asper-stone)
- Soft hover states
- Callout boxes or featured content
- Feminine wellness messaging

### Primary Actions & Authority — Burgundy

| Token | Hex | Usage |
|-------|-----|-------|
| `burgundy` (DEFAULT) | `#6B2D3A` | Primary buttons, CTAs, navigation background |
| `burgundy-light` | `#8B3D4A` | Hover states on burgundy elements |
| `burgundy-dark` | `#4F222C` | Active states, deep emphasis |

Use for:
- Primary CTA buttons ("Add to Cart", "Shop Now")
- Navigation bars and headers
- Emphasis on clinical authority
- Links and active states

### Accent — Polished Gold

| Token | Hex | Usage |
|-------|-----|-------|
| `polished-gold` | `#C9A962` | Borders, icons, "Midas Touch" accents |

Use **sparingly** to add sophistication:
- Icon highlights
- Border accents on hover
- Badges or labels ("Best Seller", "New")
- Decorative elements (never as a primary action color)

### Text — Asper Ink (Soft Black / Charcoal)

| Token | Hex | Usage |
|-------|-----|-------|
| `asper-ink` | `#2C2825` | Primary body text, headings |
| `asper-ink-muted` | `#5C5652` | Secondary text, captions, placeholders |

**Never use pure black (`#000`)** — always prefer `asper-ink` for softer readability.

### Utility

| Token | Hex | Usage |
|-------|-----|-------|
| `polished-white` | `#FAF9F7` | Off-white for cards on colored backgrounds |

---

## Typography

### Font Families

Defined in `tailwind.config.ts`:

- **Headings:** `font-heading` → Playfair Display (serif, elegant)
- **Body:** `font-body` → Montserrat (sans-serif, clean, readable)
- **Arabic support:** `font-arabic` → Tajawal (for bilingual content)

### Usage Guidelines

| Element | Font | Weight | Size (Desktop) | Size (Mobile) | Color |
|---------|------|--------|----------------|---------------|-------|
| Hero Title | Playfair Display | 700 (bold) | 3.5rem | 2.25rem | `asper-ink` |
| Section Headings | Playfair Display | 600 (semibold) | 2.5rem | 1.875rem | `asper-ink` |
| Product Titles | Montserrat | 600 | 1.5rem | 1.25rem | `asper-ink` |
| Body Text | Montserrat | 400 | 1rem | 0.875rem | `asper-ink` |
| Small Print | Montserrat | 400 | 0.875rem | 0.75rem | `asper-ink-muted` |
| Buttons | Montserrat | 600 (semibold) | 1rem | 0.875rem | White on burgundy |

---

## Components

### Buttons

**Primary (Burgundy)**
- Background: `bg-burgundy`
- Text: `text-white`
- Hover: `hover:bg-burgundy-light`
- Border radius: `rounded-md` (8px)
- Padding: `px-6 py-3`
- Font: `font-body font-semibold`

**Secondary (Outlined)**
- Border: `border-2 border-burgundy`
- Text: `text-burgundy`
- Background: `bg-transparent`
- Hover: `hover:bg-burgundy hover:text-white`

**Accent (Gold — use sparingly)**
- Border: `border-2 border-polished-gold`
- Text: `text-asper-ink`
- Background: `bg-transparent`
- Hover: `hover:bg-polished-gold hover:text-white`

### Cards

- Background: `bg-asper-stone` or `bg-polished-white`
- Border: `border border-rose-clay-light` (optional)
- Border radius: `rounded-lg` (12px)
- Shadow: `shadow-sm` or `shadow-maroon-glow`
- Padding: `p-6` (desktop), `p-4` (mobile)

### Navigation

- Background: `bg-burgundy`
- Text: `text-white`
- Active link: `text-polished-gold`
- Hover: `hover:text-polished-gold`

### Product Cards

- Background: `bg-polished-white`
- Image: rounded corners `rounded-t-lg`
- Title: `text-asper-ink font-body font-semibold`
- Price: `text-burgundy font-semibold text-lg`
- CTA button: Primary burgundy button

### Inputs

- Background: `bg-white` or `bg-polished-white`
- Border: `border border-rose-clay`
- Focus: `focus:ring-2 focus:ring-polished-gold focus:border-polished-gold`
- Text: `text-asper-ink`
- Placeholder: `placeholder:text-asper-ink-muted`

---

## Spacing & Layout

Use Tailwind's spacing scale with these conventions:

- **Section padding:** `py-16` (desktop), `py-12` (mobile)
- **Container max-width:** `max-w-7xl`
- **Grid gaps:** `gap-6` (desktop), `gap-4` (mobile)
- **Component spacing:** Use consistent `space-y-4` or `space-y-6` for vertical rhythm

---

## Shadows

Custom shadows defined in `tailwind.config.ts`:

- **Subtle elevation:** `shadow-sm`
- **Maroon glow (cards, buttons on hover):** `shadow-maroon-glow`
- **Deep emphasis (modals, dropdowns):** `shadow-maroon-deep`

---

## Animations

All animations use the custom `luxury` easing: `cubic-bezier(0.19, 1, 0.22, 1)`

Available utility classes:
- `animate-fade-in` — Fade in with slight upward movement (0.6s)
- `animate-fade-up` — Fade in with pronounced upward movement
- `animate-shake` — Shake animation for errors or emphasis
- `animate-skeleton-breathe` — Breathing animation for loading skeletons

---

## Accessibility

- **Contrast:** All text colors meet WCAG AA standards against their backgrounds
- **Focus states:** All interactive elements have visible focus rings (`focus:ring-2 focus:ring-polished-gold`)
- **Touch targets:** Minimum 44×44px for mobile
- **Semantic HTML:** Use proper heading hierarchy (`h1` → `h6`), landmarks (`<nav>`, `<main>`, `<footer>`)

---

## Implementation Checklist

When building new components or pages:

- [ ] Use only the approved color palette (no pure white/black)
- [ ] Apply `font-heading` to titles and `font-body` to body text
- [ ] Use `rounded-md` or `rounded-lg` for border radius
- [ ] Add shadows with `shadow-maroon-glow` for cards
- [ ] Ensure all interactive elements have hover and focus states
- [ ] Test on mobile (responsive spacing and typography)
- [ ] Verify contrast ratios for accessibility

---

## Quick Reference

```html
<!-- Example: Primary CTA Button -->
<button class="bg-burgundy text-white px-6 py-3 rounded-md font-body font-semibold hover:bg-burgundy-light transition-colors">
  Add to Cart
</button>

<!-- Example: Product Card -->
<div class="bg-polished-white rounded-lg shadow-maroon-glow overflow-hidden">
  <img src="..." alt="..." class="w-full h-48 object-cover rounded-t-lg">
  <div class="p-4 space-y-2">
    <h3 class="text-asper-ink font-body font-semibold text-lg">Product Name</h3>
    <p class="text-asper-ink-muted text-sm">Short description...</p>
    <p class="text-burgundy font-semibold text-lg">€25.99</p>
  </div>
</div>

<!-- Example: Section with Warm Background -->
<section class="bg-rose-clay-light py-16">
  <div class="container max-w-7xl mx-auto px-4">
    <h2 class="font-heading text-4xl text-asper-ink mb-8">Discover Your Ritual</h2>
    <!-- Content -->
  </div>
</section>
```

---

**Last updated:** February 2026  
**Contact:** Design Team — [Lovable Project](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6)
