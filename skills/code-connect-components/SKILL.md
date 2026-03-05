---
name: code-connect-components
description: Wire React (or other UI) components to data, events, and each other; map Figma design components to code (Figma Code Connect). Use when connecting components to APIs/state, implementing parent-child or sibling communication, aligning UI with a design system, or mapping Figma components to code (Figma URL with node-id, scan codebase, present matches).
---

# Code Connect Components

Use this skill to **connect** or **wire** UI components: to data, events, or each other; or to **map Figma design components to code** (Figma Code Connect workflow).

---

## Figma Code Connect (design → code)

When the task is mapping **Figma** components to code (e.g. user provides a Figma URL or uses figma-desktop MCP):

1. **Get Code Connect suggestions** — Unmapped components: names, properties, thumbnails. Requires Figma URL with **node-id** or connection to figma-desktop MCP.
2. **Scan codebase** — Search for matching components in `src/components/`, `components/`, or `ui/`: matching names, variant props, structure.
3. **Present matches** — Show findings for user validation.

**Figma URL:** Must include node-id: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`. Convert to tool format: URLs use hyphens (`node-id=1-2`), tool may expect colons (`nodeId=1:2`).

**Install reference skill:** `npx skills add https://github.com/figma/mcp-server-guide --skill code-connect-components`

---

## In-app component wiring (data / events / composition)

When the task is connecting **existing code** components to data, events, or each other:

1. **Identify touchpoints** — Which component owns the data or event? Which consumes it?
2. **Choose pattern** — Props down, callbacks up; context for cross-tree; URL/query for shareable state.
3. **Implement** — Add props/events; connect to hooks or Supabase; preserve existing types and RTL/i18n where applicable.
4. **Verify** — No broken imports; component still used where it was (e.g. App shell, layout).

### Patterns in this project

- **Dr. Bot / Beauty Assistant** — Chat/concierge entry points (e.g. "Consult") should dispatch `open-beauty-assistant` or open the concierge UI. Persona: `supabase/functions/beauty-assistant/index.ts` (buildSystemPrompt).
- **Supabase** — Use `createClient` from `@supabase/supabase-js`; auth for protected flows. Concierge/telemetry: `log-concierge-events`, `log-telemetry` edge functions.
- **Bilingual / RTL** — Prefer existing i18n/theme hooks; keep Arabic/EN and RTL in mind when adding copy or layout.
- **Design system** — Reuse primitives from `src/components`; match clinical-luxury tone and brand tokens.

---

## When to use

- "Connect this component to…" / "Wire X to Y"
- "Make this button open the chat" / "Link to Dr. Bot"
- "Use the same data here as on page X"
- "Map this Figma component to our code" / Figma URL with node-id / Code Connect

## Out of scope

- Defining new design-system primitives from scratch (use existing; extend only when necessary).
- Backend-only changes (edge function logic lives in `supabase/functions`; connect via existing APIs).
