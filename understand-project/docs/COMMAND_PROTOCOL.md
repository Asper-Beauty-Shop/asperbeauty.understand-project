# Issue/Command Run & Update Protocol

> Defines the accepted slash commands, execution rules, and update mechanism for AI-assisted workflows in `asperpharma/understand-project`.
> Last updated: 2026-03-04.

---

## Accepted Commands

| Command | Behaviour |
|---|---|
| `/breakdown` | Instantly provide project breakdown using the "Master Project Breakdown" structure. |
| `/status` | Instantly report live or current status of the project, infrastructure, or workflow. |
| `/pre-launch` | Instantly enumerate finalized pre-launch steps, technical checks, and critical paths for deployment. |
| `/scaffold` | Instantly output clean, production-ready technical scaffolding or starter code, per the design system and data mapping rules. |
| `/debug` | Instantly diagnose issues with high-detail, structured output; always grounded in real logs, error messages, or workflow events. |

---

## Run Procedure

- Commands are executed immediately, never delayed for clarification.
- All outputs strictly observe:
  - **"Medical Luxury" / "Morning Spa" design system** (Soft Ivory, Deep Maroon, Shiny Gold, Dark Charcoal; Playfair Display, Montserrat, Tajawal).
  - **Professional, elegant, and confident tone** (never playful, trendy, or casual).
  - **No hallucinated/invented product data** — always sourced from live Shopify Storefront API.
  - **No private/internal keys** are exposed in responses or code.

---

## Issue Handling

- New issues or updates are formatted with clean, detailed technical language.
- Data models and process notes are mapped in JSON/SQL if relevant.
- If new context or raw notes are pasted, outputs are re-framed using "Master Project Breakdown" (Core Identity, Strategic Purpose, Tech Stack, Phased Breakdown).
- Workflow or CI/CD troubleshooting always references actual logs, file states, or error messages.

---

## Update Mechanism

- Any infrastructure, code, or context changes are instantly reflected in the next status, breakdown, or debug outputs.
- Design, identity, and technical preferences are recalibrated if the memory block is updated.
- Schema, technical mapping, and UI/UX structure remain consistent across all outputs.

---

*This protocol guarantees professional, elegant, and actionable responses for all issue and command workflows in the `asperpharma/understand-project` repository.*
