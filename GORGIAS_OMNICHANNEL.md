# Gorgias omnichannel setup – Asper Beauty Shop

Use this checklist to keep **all channels connected** and the **website** working with Gorgias (AI Agent, Chat, Email, SMS).

---

## 1. Channel checklist

| Channel        | Where to check | Status / action |
|----------------|----------------|-----------------|
| **Shopify**    | AI Agent → project **lovable-project-milns** (green dot = connected) | ✅ Connected. Reconnect in Gorgias **Settings → Shopify** if needed. |
| **Chat**       | **Settings → Channels → Chat** (sidebar). Then **AI Agent → Deploy → Chat** | Create/name chat, choose “Quick install with Shopify” or “Install manually”. Enable **AI Agent on Chat** in Deploy → Chat. |
| **Email**      | **Settings → Channels → Email** | Connect support address (direct integration or forwarding). Link same address in Chat settings for transcripts. |
| **SMS**        | **Settings → Channels → SMS** (if on your plan) | Add/verify number and connect. Enable in **AI Agent → Deploy → SMS** if using AI there. |

---

## 2. Keep all channels connected

- **Chat**
  - Gorgias: **Settings** (gear) → **Channels** → **Chat**.
  - Ensure at least one chat integration exists and shows **Installed** (or install via “Quick install with Shopify” / “Install manually”).
  - AI Agent: **AI Agent** → **Deploy** → **Chat** → toggle **Enable AI Agent on Chat** ON and select the right chat.
- **Email**
  - **Settings → Channels → Email**. Confirm the support inbox is connected and receiving.
  - In **Chat** settings, optionally select an email for transcripts/offline capture.
- **SMS**
  - **Settings → Channels → SMS**. Verify number and connection.
  - **AI Agent → Deploy → SMS** if you use AI on SMS.
- **Shopify**
  - **Settings → Shopify** (or **Connections**). If the store shows disconnected, re-authorize the app.

---

## 3. Website: Gorgias chat on Asper Beauty Shop

Your site is a custom/Lovable app (not only Shopify theme). To show the chat widget:

1. In Gorgias: **Settings → Channels → Chat**.
2. Open your chat integration → **Install** (or **Installation** tab).
3. Choose **Install manually** → **Any Other Website** (or **Shopify Website** if it’s the headless store).
4. Copy the script snippet Gorgias gives you.
5. Add it to your site’s **index.html** inside `<body>`, just before `</body>` (see the placeholder comment in `index.html`).
6. Deploy the site and open a page where the widget should appear; refresh and confirm the bubble shows.
7. If the widget is blocked, add Gorgias domains to your [content security policy / allowlist](https://docs.gorgias.com/en-US/add-gorgias-chat-domains-to-your-allowlist-2254024).

---

## 4. AI Agent knowledge (Dr. Sami + store)

- **AI Agent → Train → Knowledge**: Store website synced; **Dr. Sami** guidance published.
- In **Knowledge** list, ensure **Dr. Sami** (and any other guidance) has **In use by AI Agent** turned **ON**.
- **AI Agent → Test**: Run test conversations (e.g. “Who is Dr. Sami?”, “Where is my order?”) to confirm answers and handover.

---

## 5. Quick links (when logged in)

| What              | URL |
|-------------------|-----|
| AI Agent overview | `https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns` |
| Knowledge         | `.../knowledge/sources` |
| Deploy Chat       | `.../deploy/chat` |
| Deploy Email      | `.../deploy/email` |
| Deploy SMS        | `.../deploy/sms` |
| Test              | `.../test` |
| Settings          | **Settings** (gear) in sidebar |

---

## 6. Website health (works well)

- **Routes**: Home, Shop, Product, Collections, Contact, etc. load without errors.
- **Contact page**: Shows Email, **Live chat** (widget), Phone, Location, and social links so all channels are visible. Copy mentions the chat widget.
- **Chat widget**: Once the Gorgias script is pasted in `index.html` (see placeholder) and deployed, the widget appears; no console errors related to Gorgias.
- **CSP**: If you use a strict Content-Security-Policy, allow Gorgias chat domains per the link in section 3.
- **In-app assistant**: The site’s BeautyAssistant component is separate from Gorgias; Gorgias chat is the support/order channel. Both can run on the site.

---

---

## Related docs

- **monitor-checklist.md** (Desktop) — Daily/weekly monitoring: Shopify, Gorgias, health URLs, chatbot channels. Use it to confirm all systems are up.
- **Asper-Beauty-Shop/CHATBOT_SOCIAL_MEDIA_SETUP.md** — Beauty Assistant webhooks (Gorgias HTTP, ManyChat) for the same backend.

*Last updated: Feb 2026. Adjust links if Gorgias UI paths change.*
