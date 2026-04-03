# Contributing to Asper Beauty Shop

Thank you for your interest in contributing! 🎉

This project is the codebase and prompt library for **Asper Beauty Shop** — a pharmacist-curated, AI-powered beauty platform built on React 18, Shopify, and Supabase with the "Ivory & Gold" design system.

---

## 🤝 Types of Contributions

### 📝 Adding New Prompts
- Frontend development prompts (React, Tailwind, shadcn/ui)
- UI/UX design prompts aligned with the "Clinical Luxury" aesthetic
- Prompts for any existing category (see `prompts/`)
- Asper-specific prompts (Digital Concierge, product cards, RTL layouts)

### 🔧 Improving Existing Prompts
- Enhancing prompt quality and specificity
- Improving examples and sample outputs
- Clarifying descriptions

### 🎨 UI/Component Contributions
- React components following the "Ivory & Gold" design tokens
- CSS Modules for product grids, cards, and brand elements
- Accessibility improvements (ARIA, keyboard navigation)

### 📋 Documentation
- README improvements
- Category descriptions
- Usage examples and guides

---

## 📂 Prompt Format

When adding new prompts, use this format:

```markdown
---
name: [Prompt Name]
description: [One-line description of what this prompt does]
model: sonnet
---

# [Prompt Title]

**Category:** [category-name]
**Difficulty:** Beginner/Intermediate/Advanced
**Tags:** #ui #design #react #css

## Description

[Description of what the prompt does and when to use it]

## Prompt

[The actual prompt text here]

## Example Usage

**Input:**
[Example of how to use the prompt — specific inputs]

**Expected Output:**
[What the user should expect]

## Sample Results

[Examples of what the prompt might generate]

## Notes

- [Any constraints, tips, or caveats]
- [Brand alignment notes for Asper-specific prompts]
```

---

## 🏷️ Brand Alignment (for Asper Prompts)

All UI/component prompts must enforce the **"Clinical Luxury"** design system:

| Token | Value | Usage |
|-------|-------|-------|
| Soft Ivory | `#F8F8FF` | Global canvas / backgrounds |
| Deep Maroon | `#800020` | Primary actions, buttons, headers |
| Shiny Gold | `#C5A028` | 1px borders on hover ("Gold Stitch") |
| Dark Charcoal | `#333333` | Body text |
| Pure White | `#FFFFFF` | Product card surfaces ("Digital Tray") |

**Typography:**
- Headings: `Playfair Display` (serif — "Voice of Luxury")
- Body/Data: `Montserrat` (sans-serif — "Voice of Science")
- Arabic: `Tajawal` (RTL support)

---

## 🚀 Contribution Process

### 1. Fork the Repository
```bash
# Click the fork button on GitHub
```

### 2. Clone Locally
```bash
git clone https://github.com/[your-username]/Asper-Beauty-Shop.git
cd Asper-Beauty-Shop
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create a New Branch
```bash
# Use descriptive branch names
git checkout -b add-react-card-prompt
git checkout -b improve-accessibility-prompt
git checkout -b fix-gold-stitch-component
```

### 5. Make Your Changes
- Add prompts to the correct `prompts/[category]/` directory
- Follow the prompt format above
- For code: ensure `npm run lint` passes with **0 errors**

### 6. Commit Your Changes
```bash
git add .
git commit -m "feat: add Digital Tray product card prompt"
git commit -m "improve: enhance ARIA implementation examples"
git commit -m "fix: correct Gold Stitch hover border radius"
```

### 7. Push and Open a Pull Request
```bash
git push origin your-branch-name
# Open Pull Request on GitHub
```

---

## ✅ PR Checklist

Before opening a pull request, verify:

**For New Prompts:**
- [ ] Follows the established prompt format?
- [ ] In the correct `prompts/[category]/` directory?
- [ ] Example usage included?
- [ ] Appropriate tags included?
- [ ] Tested with Claude?
- [ ] Frontend-focused content?

**For Code Changes:**
- [ ] `npm run lint` passes (0 errors)?
- [ ] `npm run build` succeeds?
- [ ] Uses Tailwind semantic tokens (not raw hex values)?
- [ ] RTL support not broken?

**For All Contributions:**
- [ ] Clear and understandable?
- [ ] No spelling/grammar errors?
- [ ] No duplicate content?
- [ ] No credentials or API keys committed?

---

## 📊 Prompt Categories

| Directory | Purpose |
|-----------|---------|
| `prompts/ui-design/` | UI design, design systems, color palettes |
| `prompts/web-development/` | React, CSS architecture, Shopify integration |
| `prompts/components/` | Reusable React component generation |
| `prompts/ux-research/` | User personas, journey mapping |
| `prompts/animation/` | CSS/JS micro-interactions and transitions |
| `prompts/responsive/` | Mobile-first and responsive design |
| `prompts/accessibility/` | ARIA, WCAG, screen reader support |

To suggest a **new category**, open an Issue with the label `category-proposal`.

---

## 📏 Quality Standards

### Prompt Quality ✅
- Clear and specific instructions
- Real-world usage examples
- Frontend-focused content
- Optimized for Claude Sonnet

### Code Examples ✅
- Modern TypeScript/React/Tailwind patterns
- Follows best practices
- RTL-compatible (use Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-`)
- Accessible (ARIA labels, semantic HTML)

### Not Accepted ❌
- Backend-only prompts
- General non-frontend programming prompts
- Content unrelated to beauty/e-commerce UI
- Copied or non-original content
- Low-quality or vague prompts
- Code that exposes credentials or API keys

---

## 💬 Communication

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, feature requests, prompt submissions |
| GitHub Discussions | General questions, ideas, feedback |
| Pull Requests | Code and prompt contributions |

### Getting Help
1. Check this `CONTRIBUTING.md`
2. Read the `README.md`
3. Search existing Issues
4. Open a new Issue

---

## 🎉 Acknowledgments

Thanks to all contributors! Your prompts and improvements help make Asper Beauty Shop's Digital Concierge smarter and the developer experience better.

> "Curated by Pharmacists. Powered by Intelligence." — *Asper Beauty Shop*
