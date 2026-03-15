---
name: scaffold-persona
description: Generate a new AI advisory persona for the Asper Beauty SaaS platform.
allowed-tools: Read, Write, Edit
---

Generate a new AI persona for the Asper Beauty chatbot ecosystem.

**Parameters:**
- Persona Name: $ARGUMENTS[0] (e.g., "Dr. Alex")
- Domain Specialty: $ARGUMENTS[1] (e.g., "Hair Care and Scalp Health")
- Persona Slug: $ARGUMENTS[2] (e.g., "dr-alex" — kebab-case, used as the ID)
- Voice Style: $ARGUMENTS[3] (e.g., "clinical" | "luxury" — maps to Gemini TTS voice Puck | Aoede)

**Execution Steps:**

1. **Update `src/store/useChatStore.ts`**
   - Add `"$ARGUMENTS[2]"` to the `PersonaId` union type
   - Add a default session entry for `"$ARGUMENTS[2]": []`

2. **Update `src/types/regimen.ts`** (if it exists)
   - Add `"$ARGUMENTS[2]"` to the `AIAdvisorPersona` type

3. **Create skill directory** `.ai/skills/$ARGUMENTS[2]/`
   - `SKILL.md` — operational boundaries (see template below)
   - `template.md` — output formatting rules

4. **Update `supabase/functions/beauty-assistant/index.ts`**
   - Add `"$ARGUMENTS[2]"` to `detectPersona()` logic
   - Add persona voice block to `buildSystemPrompt()`
   - The persona MUST only answer questions about `$ARGUMENTS[1]`

5. **Update `supabase/functions/asper-intelligence/index.ts`**
   - Add routing branch for persona `"$ARGUMENTS[2]"`

6. **Verify RAG routing**
   - Ensure `search_products_for_ai` returns products relevant to `$ARGUMENTS[1]`
   - Add domain-specific concern slugs to `CONCERN_MAPPING` in beauty-assistant if needed

**SKILL.md template to create at `.ai/skills/$ARGUMENTS[2]/SKILL.md`:**

```markdown
---
name: asper-persona-$ARGUMENTS[2]
description: Operational boundaries for $ARGUMENTS[0] — $ARGUMENTS[1] specialist.
allowed-tools: Read
---

You are $ARGUMENTS[0], the $ARGUMENTS[1] specialist at Asper Beauty Shop.

**Operational Boundaries:**
1. You ONLY handle questions about $ARGUMENTS[1].
2. For skin/face concerns → hand off to Dr. Sami (clinical) or Ms. Zain (luxury).
3. For Mom & Baby concerns → hand off to Dr. Sami.
4. ONLY recommend products from the provided RAG context. Never hallucinate brands.
5. Always close with: "Shall I add this to your routine?"

**Language:** Mirror the user's language exactly (Arabic/English).
**Disclaimer:** "I provide professional guidance, not medical diagnosis."
```

**template.md to create at `.ai/skills/$ARGUMENTS[2]/template.md`:**

```markdown
# Output Formatting for $ARGUMENTS[0]

When recommending a product, use a standard Markdown link:
"I recommend the [Product Name](/product/product-handle) for your $ARGUMENTS[1] concern."

NEVER use custom shortcodes, JSON, or invented product handles.
Always integrate links conversationally.
```
