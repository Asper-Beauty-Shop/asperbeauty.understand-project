# ManyChat "Medical Luxury" Flow Templates

These templates are designed for the **ManyChat External Request** block. They connect your social media traffic (Instagram, Facebook, WhatsApp) directly to the **Super Smart Dr. Bot Brain**.

---

## 1. Connection Details (Global)

**Request Type:** POST  
**Request URL:** `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant?route=manychat`  
**Content-Type:** `application/json`

---

## 2. Template: General Skincare Consult
*Use this for your "Get Started" or "Consult Now" buttons.*

**Request Body (JSON):**
```json
{
  "messenger_id": "{{user_id}}",
  "message": "{{last_user_input}}",
  "user_context": {
    "full_name": "{{first_name}} {{last_name}}",
    "platform": "manychat_ig",
    "language": "auto"
  }
}
```

---

## 3. Template: Acne Protocol (Deep Link)
*Use this for Instagram Ads or Stories specifically about Acne.*

**Request Body (JSON):**
```json
{
  "messenger_id": "{{user_id}}",
  "message": "I need help with my acne breakouts.",
  "intent": "acne",
  "user_context": {
    "full_name": "{{first_name}}",
    "campaign": "acne_ad_march_2026"
  }
}
```

---

## 4. Template: The Radiance Ritual (Glow)
*Use this for luxury aesthetic queries and "Glass Skin" promotion.*

**Request Body (JSON):**
```json
{
  "messenger_id": "{{user_id}}",
  "message": "How do I get a healthy skin glow?",
  "intent": "glow",
  "user_context": {
    "full_name": "{{first_name}}",
    "persona_preference": "ms_zain"
  }
}
```

---

## 5. Template: Human Concierge Handoff
*Triggered when the AI detects frustration or a clinical medical complication.*

**Request Body (JSON):**
```json
{
  "messenger_id": "{{user_id}}",
  "message": "I need to speak with a human pharmacist.",
  "intent": "human_handoff",
  "user_context": {
    "escalation_level": "high",
    "reason": "medical_query"
  }
}
```

---

## 6. Response Mapping (Dynamic)
The AI Brain returns a `v2` ManyChat response. You do **not** need to map fields manually if you use the dynamic response feature, but if you do, map the following:

- `$.content.messages[0].text` → `{{bot_response}}`
- `$.content.quick_replies` → *Auto-rendered by ManyChat*

---

### **Implementation Guide:**
1.  In ManyChat, create a new Flow.
2.  Add an **External Request** block.
3.  Paste the **Request URL** and the chosen **JSON Body**.
4.  Add a **Message** block after it that displays `{{bot_response}}`.
5.  Set the message to **Arabic/English** based on user preference.

*Last updated: March 6, 2026.*

---

## 7. Template: 'Surprise Soon' Campaign Broadcaster
*Use this to trigger the omnichannel blast for the new Medical Luxury teaser.*

**Request Body (JSON):**
``json
{
  "messenger_id": "{{user_id}}",
  "message": "SEND_TEASER_CAMPAIGN_01",
  "intent": "campaign_broadcast",
  "payload": {
    "image_prompt": "Professional product photography of elegant lady holding a lipstick near her face. Clinical high-key lighting, minimalist medical spa background, soft shadows, sharp focus on product texture, 8k resolution, photorealistic, clean Soft Ivory background. Text overlay: 'Something Beautiful is Coming... Surprise Soon'",
    "caption": "? Something Beautiful is Coming... At Asper Beauty Shop, we believe in the harmony of Science and Style. We are preparing a special surprise that redefines Medical Luxury. Stay tuned as we unveil the next chapter of your beauty ritual. Experience the Asper Shine soon. ?",
    "target_channels": ["instagram_story", "whatsapp_status", "facebook_post"]
  }
}
``

