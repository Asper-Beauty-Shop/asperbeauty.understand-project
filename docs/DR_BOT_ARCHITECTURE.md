---
name: dr-bot-architecture
applyTo: ["*"]
description: "Defines the technical, conversational, and data structures for Dr. Bot, the e-commerce AI agent."
---

# Dr. Bot — AI Agent Structure for Asper Beauty Shop

## 1. Core Technical Architecture

```
[User Interface] <--> [Chatbot Frontend] <--> [Chatbot Backend/AI Engine] <--> [External Systems]
```

- **User Interface (UI):**
  - Floating chat widget, full-page bot, and voice interface.
  - Supports both Arabic and English.
- **Chatbot Frontend:**
  - Manages conversation display, user input (text, voice), and rich UI elements (buttons, product cards).
- **Chatbot Backend & AI Engine:**
  - Natural Language Processing (NLP/NLU) for intent/entity extraction.
  - Dialog management for context and flow.
  - Integration layer connects to:
    - Product Catalog API
    - Order Management API
    - CRM API
    - Inventory API
- **External Systems:**
  - Shopify, Supabase, shipping APIs, payment gateways, knowledge base.

## 2. Conversation Flow & Design Structure

- **Greeting & Onboarding:**
  - Welcomes, sets expectations, offers quick-reply buttons.
- **Product Discovery & Recommendation:**
  - Clarifies user needs, fetches products, presents rich cards, refines options.
- **Order & Shipping Support:**
  - Authenticates, fetches order status, handles follow-ups.
- **Customer Support & FAQ:**
  - Answers common queries, links to policies, escalates to human agent if needed.
- **Cart Abandonment & Engagement:**
  - Detects idle users, re-engages, offers help or discounts.
- **Multilingual Support:**
  - All flows and responses available in Arabic and English.

## 3. Data & Knowledge Structure

- **Intents:**
  - `find_product`, `track_order`, `return_item`, `complaint`, etc.
- **Entities:**
  - `product_type`, `order_number`, `date`, etc.
- **Training Data:**
  - Examples for both Arabic and English.
- **Product Catalog Data:**
  - Access to product info, tags, categories.
- **Response Templates:**
  - On-brand, pre-written responses for common scenarios (Arabic/English).
- **Conversation Logs:**
  - Used for performance analysis and improvement.

## 4. Additional Structures & Principles

- **Clear Escalation:**
  - Always provide a path to human support.
- **Context Maintenance:**
  - Track conversation history for continuity.
- **Personality & Brand Voice:**
  - Friendly, professional, empathetic; consistent tone in both languages.
- **Continuous Learning:**
  - Regularly review logs, update intents/entities, expand training data.
- **Accessibility:**
  - UI and flows designed for accessibility (screen readers, keyboard navigation).
- **Security & Privacy:**
  - Protect user data, comply with privacy standards.
  - Monitor bot performance, user satisfaction, conversion rates.

_Last updated: March 2026._

## 5. Advanced Features & Integration

- **Omnichannel Integration:**
  - Dr. Bot connects to web, mobile, social media, and messaging platforms (WhatsApp, Facebook Messenger, Instagram DMs).
  - Unified conversation history across channels.
- **Personalization:**
  - Uses CRM and purchase history to tailor recommendations and responses.
  - Supports user profiles, preferences, and loyalty programs.
- **Rich Media & Interactive Elements:**
  - Product videos, image carousels, interactive quizzes, and guided flows.
- **Voice & Speech:**
  - Voice-to-text and text-to-voice for accessibility and advanced UX.
- **Proactive Engagement:**
  - Triggers based on user behavior (cart abandonment, browsing history, special offers).
- **A/B Testing & Experimentation:**
  - Test new flows, responses, and UI elements to optimize conversion and satisfaction.
- **Feedback Collection:**
  - Built-in feedback prompts, ratings, and survey flows to improve bot quality.
- **Automated Escalation & Routing:**
  - Smart handoff to human agents, ticket creation, and routing based on issue complexity or sentiment.
- **Compliance & Audit:**
  - Logs all interactions for compliance, audit, and improvement.
- **Localization:**
  - Easily extend to other languages and regions; supports local currency, time, and cultural context.

## 6. Operational Best Practices

- **Monitoring & Alerting:**
  - Real-time monitoring of bot uptime, errors, and response latency.
- **Continuous Training:**
  - Automated retraining pipelines for NLP models using new conversation logs.
- **Documentation:**
  - Maintain up-to-date docs for flows, APIs, and integration points.
- **Testing:**
  - Automated tests for conversation flows, API integrations, and UI components.
- **Versioning:**
  - Track bot versions, rollback capability, and staged rollouts.
  - Work with product, support, and engineering teams for updates and improvements.


_For implementation, see src/components/AIConcierge.tsx and related backend integration files._

## 7. AI Safety, Ethics & Governance

- **Ethical Guidelines:**
  - Ensure Dr. Bot never provides medical advice beyond its scope; always escalate to licensed professionals for clinical questions.
  - Avoid bias in recommendations; regularly audit training data for fairness.
- **User Consent & Transparency:**
  - Clearly inform users when interacting with AI; provide privacy policy links and consent prompts.
- **Data Minimization:**
  - Only collect data necessary for the task; anonymize logs where possible.
- **Abuse Detection:**
  - Monitor for abusive language or misuse; auto-escalate or block as needed.
- **Regulatory Compliance:**
  - Adhere to GDPR, CCPA, and local privacy laws.

## 8. Multilingual & Regional Expansion

- **Language Expansion:**
  - Plan for additional languages (French, Spanish, etc.) as the business grows.
- **Cultural Adaptation:**
  - Localize flows, product recommendations, and tone for regional markets.
- **Regional Integrations:**
  - Integrate with local payment, shipping, and support systems.

## 9. Future Roadmap

- **AI Model Upgrades:**
  - Integrate advanced LLMs, voice assistants, and visual search.
- **Self-Service Admin Tools:**
  - Enable business users to update bot flows, FAQs, and product data without code.
- **Marketplace Integrations:**
  - Expand to new e-commerce platforms and marketplaces.
- **Advanced Analytics:**
  - Predictive insights, customer segmentation, and conversion optimization.
- **Community & Social Features:**
  - Enable user reviews, community Q&A, and social shopping experiences.
## 6. Visual Awareness & Brand Voice
Dr. Bot is aware of the "Asper Shine" visual language. Its responses should mirror the sterile, "clinical clean" reflection of the UI—bright, minimal, and authoritative. 
- **Hover State logic:** Shimmering light beam on Soft Ivory.
