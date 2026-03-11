# Asper Beauty Shop — Visual Values & Design System

**Use this document for every UI component and marketing asset.**
**When coding with Cursor/Claude, apply these rules to achieve consistent, on-brand results.**

---

## 1. Four Pillars of Design

Every visual and UX decision must align with at least one of these pillars.

| Pillar | Meaning | Implementation |
|--------|---------|----------------|
| **Resilience** | Beauty = strength and barrier protection, not superficial prettiness. | Stable layout, authoritative clinical copy, structural clarity. No frivolous decoration. |
| **Transparency** | "No hidden harshness." | Clear ingredient lists, visible pricing, uncluttered nav. No dark UX, no obscured shipping or terms. |
| **Refinement** | "The process of smoothing." | Move the user from fragmentation/overwhelm into a cohesive flow. Smooth transitions, optimized rendering, elegant micro-interactions. |
| **Empathy** | Acknowledge the user’s struggle. | Accessible support, empathetic AI (Dr. Sami, Ms. Zain), supportive language for sensitive skin (acne, rosacea). No judgment. |

---

## 2. Clinical Luxury Color Palette

Implement via **Tailwind CSS** (or equivalent). **Avoid pure white and pure black** for canvas and primary text—they cause eye strain on long reading (e.g. ingredient lists).

| Role | Name | Use |
|------|------|-----|
| **Primary canvas** | **Asper Stone** | Warm light gray / soft ivory. Sterile but welcoming (high-end dermatology feel). Lets thousands of SKU packaging colors sit without clashing. |
| **Feminine softness** | **Rose Clay** | Muted pink or terracotta. Softens clinical rigidity. Use for secondary backgrounds, highlights, or subtle CTAs. |
| **Primary actions & authority** | **Deep Burgundy / Maroon** | Headers, main nav, critical conversion buttons. Conveys authority, seriousness, brand heritage. |
| **Seal of authenticity** | **Polished Gold** (or Polished White) | Use sparingly: 1px borders, subtle hover ("Midas Touch"), select SVG icons. Highlights value without overwhelming. |

**Rules:**
- Backgrounds: Asper Stone (or compatible neutral). No `#FFFFFF` or `#000000` as main canvas.
- Primary text: Dark gray/charcoal, not pure black.
- CTAs and key nav: Deep Burgundy/Maroon.
- Accents: Polished Gold/White in small doses only.

### Tailwind tokens (paste into `tailwind.config.js` in understand-project)

```js
// Asper Beauty Shop — Clinical Luxury palette
colors: {
  // Primary canvas — warm light gray / soft ivory
  'asper-stone': {
    DEFAULT: '#F2EFEB',
    light: '#F8F6F3',
    dark: '#E8E4DE',
  },
  // Muted pink / terracotta — feminine softness
  'rose-clay': {
    DEFAULT: '#C4A494',
    light: '#D4B8A8',
    dark: '#A88B7A',
  },
  // Primary actions, nav, authority
  'burgundy': {
    DEFAULT: '#6B2D3A',
    light: '#8B3D4A',
    dark: '#4F222C',
  },
  // Accent only — borders, hover, icons
  'polished-gold': '#C9A962',
  'polished-white': '#FAF9F7',
  // Primary text (no pure black)
  'asper-ink': '#2C2825',
  'asper-ink-muted': '#5C5652',
}
```

Use in classes: `bg-asper-stone`, `text-burgundy`, `border-polished-gold`, `text-asper-ink`, `hover:bg-rose-clay-light`, etc.

---

## 3. Typographic Architecture

- **Readability first** for clinical and ingredient copy.
- **Hierarchy** clear: headings vs body vs captions.
- **No high-contrast strain**: avoid pure black on pure white for long text.

---

## 4. How to Use This With Claude / Cursor

When you ask Cursor or Claude to:
- Add or change a page, component, or style
- Implement a new feature or fix UI

**Reference this file:** "Follow DESIGN_SYSTEM.md" or "Use the four pillars and Clinical Luxury palette from DESIGN_SYSTEM.md."

The AI should:
1. Prefer **Asper Stone** for main backgrounds; **Rose Clay** for soft emphasis.
2. Use **Deep Burgundy/Maroon** for primary buttons and nav.
3. Use **Polished Gold** only for subtle borders, hovers, or icon accents.
4. Avoid pure black/white for canvas and primary text.
5. Keep copy **authoritative but empathetic**; support **transparency** (clear pricing, ingredients, nav).
6. Add **smooth transitions** and **refined micro-interactions** where appropriate.

---

*Main project: [MAIN_PROJECT.md](MAIN_PROJECT.md). Live site: https://asperbeautyshop-com.lovable.app/*
