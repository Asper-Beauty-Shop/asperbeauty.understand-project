---
name: ARIA Accessibility Implementation Specialist
description: Use this agent when you need proper ARIA attributes and accessibility compliance for complex UI components. Examples include making custom dropdowns screen-reader accessible, implementing keyboard navigation for modals and menus, ensuring WCAG AA/AAA compliance for interactive elements.
model: sonnet
---

# ARIA Accessibility Implementation Guide

**Category:** accessibility
**Difficulty:** Intermediate
**Tags:** #accessibility #aria #wcag #screen-readers #react #keyboard-navigation

## Description

Generate proper ARIA (Accessible Rich Internet Applications) implementations for complex UI components to ensure screen reader compatibility and full accessibility compliance. Especially relevant for the Asper Beauty Shop's Digital Concierge quiz, modals, and product card interactions.

## Prompt

I need you to help me implement proper ARIA attributes and accessibility features for the following component:

COMPONENT DETAILS:
- Component type: [dropdown, modal, tabs, carousel, form, quiz, etc.]
- Current implementation: [describe existing HTML/React/Vue structure]
- Framework: [vanilla HTML, React, Vue, Angular]
- WCAG level target: [AA or AAA compliance]

ACCESSIBILITY REQUIREMENTS:

1. SCREEN READER SUPPORT:
- Proper labeling and descriptions
- Announce state changes
- Navigation instructions
- Content structure clarity

2. KEYBOARD NAVIGATION:
- Tab order and focus management
- Keyboard shortcuts (if applicable)
- Escape key handling
- Arrow key navigation (for complex components)

3. ARIA ATTRIBUTES NEEDED:
- Role definitions
- Properties (aria-labelledby, aria-describedby, etc.)
- States (aria-expanded, aria-selected, aria-pressed, etc.)
- Live regions for dynamic content (e.g., AI recommendation updates)

4. VISUAL INDICATORS:
- Focus indicators (must use Shiny Gold #C5A028 outline for brand consistency)
- High contrast support
- Reduced motion compliance

SPECIFIC CHALLENGES:
[Describe any specific accessibility challenges with your component]

OUTPUT REQUIREMENTS:
1. Updated HTML/JSX with proper ARIA attributes
2. JavaScript/TypeScript for managing dynamic ARIA states
3. CSS for visual accessibility features (focus rings, high contrast)
4. Testing checklist with screen reader instructions
5. Documentation explaining the accessibility features

Please ensure the implementation follows WCAG 2.1 guidelines and works well with popular screen readers (NVDA, JAWS, VoiceOver).

## Example Usage

**Input:**
```
Component type: "3-Click Skin Concern" quiz (custom radio button group)
Current implementation: React component with useState for selected concern
Framework: React with TypeScript
WCAG level target: AA compliance
Specific challenge: Users need to navigate between concern options (Acne, Anti-Aging, Dryness)
  using arrow keys, and screen readers must announce the selected option change.
```

**Expected Output:**
- Proper `role="radiogroup"` and `role="radio"` on concern options
- `aria-checked` state management in React
- `onKeyDown` handler for arrow key navigation
- `aria-live="polite"` region for announcing AI recommendation updates
- Focus ring using `focus:ring-2 focus:ring-shiny-gold` (Tailwind)

## Sample Results

The prompt would generate:
- Semantic HTML with `role="radiogroup"` wrapping concern buttons
- React hooks for managing focus and `aria-checked` states
- Keyboard event handlers for arrow navigation between skin concerns
- Screen reader announcements when the AI recommendation updates
- Gold focus ring (`outline: 2px solid #C5A028`) for brand-consistent accessibility
- Testing guide with NVDA/VoiceOver step-by-step instructions

## Notes

- Include your existing component code for more targeted advice
- Specify which screen readers you need to support
- For Asper-specific components, the Gold Stitch (`#C5A028`) doubles as a focus indicator
- The Digital Concierge quiz must be fully keyboard-navigable for medical accessibility
- Always test with `prefers-reduced-motion` — disable hover animations when active
