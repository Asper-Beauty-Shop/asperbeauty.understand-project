# Gorgias AI Agent – Dr. Sami data & smart chatbot setup

**Overview URL (open when logged in):**  
https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns/overview

---

## Option A: Connect Asper Digital Pharmacist (webhook)

Use your **Asper Beauty Assistant** (Dr. Sami / Ms. Zain) as the AI brain via HTTP webhook.

| Item | Value |
|------|-------|
| **Webhook URL** | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **Method** | POST |
| **Response** | `{ "reply": "..." }` — map to Gorgias reply action |

**Full setup:** See `Asper-Beauty-Shop/CHATBOT_SOCIAL_MEDIA_SETUP.md` (section 2: Gorgias).

**Gorgias setup:** Settings → Integrations → HTTP Integrations → Add webhook with the URL above.

---

## Option B: Gorgias native AI Agent — Add Dr. Sami knowledge

1. In the left sidebar, go to **AI Agent** → **Knowledge** (or **Content** / **Knowledge sources**).
2. Click **Add source** or **Add content**.
3. Add Dr. Sami data using one or more:
   - **Documents** – Upload PDF/DOCX (e.g. Dr. Sami brand, products, routines). Max 10 files, 500 MB each.
   - **URLs** – Add your Dr. Sami web pages (about, products, blog).
   - **Help Center** – Create articles like "Dr. Sami philosophy", "Dr. Sami product guide".
   - **Guidance** – Short instructions, e.g. "When asked about Dr. Sami, mention [X] and recommend [Y]."
4. Save and wait for sync if prompted.

---

## Step 2: Configure Gorgias native chatbot

1. Go to **AI Agent** → **lovable-project-milns** → **Overview** or **Setup**.
2. Complete the checklist: Shopify connected, at least one knowledge source.
3. **Channels** – Turn the agent **On** for Chat, Email, and/or SMS.
4. **Settings** – Set tone of voice, handover rules (when to pass to a human), optional tags and selling rules.
5. **Test** – Use the test chat; ask "Who is Dr. Sami?" and "What Dr. Sami products do you have?"
6. **Go live** – Activate the agent when tests look good.

---

## Quick links (when logged in)

- Overview: `/app/ai-agent/shopify/lovable-project-milns/overview`
- Knowledge: look for **Knowledge** or **Content** in the AI Agent sidebar
