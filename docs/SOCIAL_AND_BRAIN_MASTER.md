# SOCIAL_AND_BRAIN_MASTER.md
# Asper Beauty Shop — Unified Omnichannel AI Nervous System
# Version: 2025.01 | Status: AUTHORITATIVE SOURCE OF TRUTH
# Last Updated: 2025-01
# DO NOT MODIFY without updating all dependent Edge Functions.

---

## 1. System Philosophy

The Asper AI brain operates as a **unified consciousness** across all
touchpoints. A user who asks about dark circles on WhatsApp at 9am and
returns via the website at 3pm receives **contextual memory continuity**
— the AI picks up exactly where the conversation left off.

This is achieved through a **shared Supabase session store** that every
channel writes to and reads from as the single source of truth.

---

## 2. Channel Architecture Map

```
┌─────────────────────────────────────────────────────────────┐
│                    USER TOUCHPOINTS                          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│   WhatsApp   │  Instagram   │   Website    │    Email      │
│   (ManyChat) │  (ManyChat)  │  (Direct)    │  (Gorgias)    │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬───────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Webhook Router    │
                    │  (Supabase Edge)   │
                    │  Route: /ai/route │
                    └─────────┬──────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌─────▼────────┐
    │ beauty-assistant│ │   Gorgias   │ │   Analytics  │
    │  Edge Function  │ │  Connector  │ │    Logger    │
    └─────────┬──────┘ └──────┬──────┘ └──────────────┘
              │               │
              └───────┬───────┘
                      │
            ┌─────────▼──────────┐
            │  Supabase Database  │
            │  • user_sessions   │
            │  • conversation_   │
            │    memory          │
            │  • digital_tray_   │
            │    products        │
            │  • handoff_queue   │
            └────────────────────┘
```

---

## 3. UnifiedMessageEvent Schema

All webhook sources normalize to this contract before processing:

```typescript
interface UnifiedMessageEvent {
  // Identity
  user_id: string;              // Supabase UUID (created on first contact)
  session_id: string;            // Conversation session UUID
  platform: "whatsapp"
           | "instagram"
           | "website"
           | "gorgias_email";

  // Message Content
  message_text: string;
  message_type: "text" | "image" | "audio" | "product_inquiry";
  attachment_url?: string;

  // Routing Metadata
  timestamp: string;             // ISO 8601
  store_language: "en" | "ar";   // Detected from user locale
  is_returning_user: boolean;

  // Injected by Memory Service (after lookup)
  user_memory?: UserSkinMemory;
}
```

---

## 4. User Memory Schema (`user_skin_memory` table)

This is the brain's long-term memory. It persists across sessions
and platforms.

```sql
CREATE TABLE user_skin_memory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE,

  -- Skin Profile (built progressively)
  skin_concern    TEXT,           -- Primary: brightening | dryness | etc.
  skin_type       TEXT,           -- oily | dry | combination | sensitive
  known_allergies TEXT[],         -- e.g. ['fragrance', 'parabens']
  current_routine JSONB,          -- Products they've mentioned using

  -- Interaction History
  last_platform   TEXT,           -- Where they last spoke to us
  last_seen_at    TIMESTAMPTZ,
  total_sessions  INTEGER DEFAULT 1,

  -- Recommendation History
  products_shown  TEXT[],         -- Shopify handles shown in this lifetime
  products_bought TEXT[],         -- Post-purchase webhook updates this

  -- Safety Flags
  reported_reactions TEXT[],      -- If user reported a bad reaction
  is_pregnant       BOOLEAN DEFAULT FALSE,  -- Triggers ingredient restrictions

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Webhook Router Logic

```typescript
// supabase/functions/webhook-router/index.ts (pseudocode)

// STEP 1: Identify source and normalize payload
const source = detectWebhookSource(req.headers);
const event = normalizeToUnifiedEvent(req.body, source);

// STEP 2: Fetch or create user memory
const memory = await getOrCreateUserMemory(event.user_id);
event.user_memory = memory;

// STEP 3: Triage intent
const intent = await classifyIntent(event.message_text);

switch (intent.type) {
  case "skin_concern_query":
    // Route to Gemini Clinical Auditor
    return await beautyAssistantHandler(event);

  case "order_status":
  case "return_request":
    // Route to Gorgias directly
    return await gorgiasHandoff(event, "order_management");

  case "medical_emergency":
    // Immediate human escalation
    return await gorgiasHandoff(event, "urgent_medical", {
      priority: "CRITICAL",
      alert_pharmacist: true
    });

  case "general_chat":
    return await beautyAssistantHandler(event);
}

// STEP 4: Update memory with new signal
await updateUserMemory(event.user_id, extractMemorySignals(event, response));
```

---

## 6. The Pharmacist Handoff Protocol

### When to Escalate (Automatic Triggers)

The AI MUST escalate to a human agent via Gorgias when ANY of
these conditions are detected:

| Trigger | Detection Signal | Gorgias Priority |
|---------|------------------|------------------|
| Severe allergic reaction | Keywords: "rash", "swelling", "can't breathe" | CRITICAL |
| Medical condition interaction | "I have [condition]" + product ingredient conflict | HIGH |
| Pregnancy skincare query | "pregnant", "breastfeeding", "trimester" | HIGH |
| Prescription medication mention | Drug names in message text | HIGH |
| User frustration (3rd complaint) | Sentiment score < -0.7 for 3 consecutive messages | MEDIUM |
| Product harm report | "burned", "scarred", "doctor told me" | CRITICAL |

### Handoff Message Template

When escalating, the AI sends this bridging message:

```
// English:
"I want to make sure you get the best care possible.
I'm connecting you with our clinical support team right now.
They have your full conversation history and will respond within
[X minutes]. Your skin health is our top priority. 💚"

// Arabic:
"أريد التأكد من حصولك على أفضل رعاية ممكنة.
سأوصلك بفريق الدعم السريري الآن.
لديهم كامل تاريخ محادثتك وسيردون خلال [X دقائق].
صحة بشرتك هي أولويتنا القصوى. 💚"
```

### Gorgias Ticket Payload

```typescript
interface GorgiasEscalationTicket {
  channel: "chat";
  subject: `[AI Handoff] ${escalationType} - ${userId}`;
  customer_email: string;
  tags: ["ai-escalation", escalationType, platform];
  custom_fields: {
    skin_concern: memory.skin_concern;
    full_conversation: ConversationHistory[];
    escalation_trigger: string;
    ai_confidence_at_handoff: number;
  };
  priority: "normal" | "high" | "urgent";
}
```

---

## 7. Memory Update Triggers

After every AI response, extract and persist these signals:

```typescript
const MEMORY_EXTRACTION_RULES = {
  // If user mentions skin type → update skin_type
  skin_type_signals: ["oily skin", "dry skin", "sensitive", "combination"],

  // If user mentions concern → update skin_concern
  concern_signals: ["dark spots", "wrinkles", "sunscreen", "moisture"],

  // If user mentions allergy → append to known_allergies
  allergy_signals: ["allergic to", "can't use", "reacts to"],

  // If user mentions pregnancy → set is_pregnant = true
  pregnancy_signals: ["pregnant", "expecting", "breastfeeding"],
};
```

---

## 8. Platform-Specific Notes

### WhatsApp (ManyChat)
- Max message length: 1024 characters. AI truncates at sentence boundary.
- Product cards use ManyChat's "Gallery" element (3 products max per card)
- Voice messages: Transcribe via Gemini before processing

### Instagram DM (ManyChat)
- Story reply context is passed as `attachment_url`
- Max 3 quick-reply buttons per message
- Product links use Instagram Shopping tags when available

### Website Chat
- Full rich UI — AudioWaveformReplay component enabled
- Digital Tray shows up to 6 products
- RTL/LTR switches based on `<html dir>` attribute

---

## 9. AI Agent Instructions

**DO NOT** modify the `user_skin_memory` schema without updating
this document and running a migration.

**DO NOT** add new webhook sources without normalizing to
`UnifiedMessageEvent`.

**DO NOT** bypass the Pharmacist Handoff Protocol for any
medical-adjacent keywords.

**DO** update `last_platform` and `last_seen_at` on every
interaction.
