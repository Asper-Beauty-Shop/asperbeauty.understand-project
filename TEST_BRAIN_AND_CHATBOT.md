# Testing the Brain & Beauty Assistant

> **Complete guide** to testing the AI-powered Beauty Assistant and chatbot functionality in Asper Beauty Shop.

---

## Quick Test

Run the automated test script:

```bash
npm run test:brain
```

This checks:
- ✓ Supabase connectivity
- ✓ Beauty Assistant edge function endpoint exists
- ✓ AI Concierge widget presence on the site

For a complete test, follow the manual testing steps below.

---

## Manual Testing Checklist

### 1. Verify Widget Appears

1. Open the main site: **https://asperbeautyshop-com.lovable.app/**
2. Look for the AI Concierge widget:
   - Should appear in the bottom-right corner
   - Icon: Chat bubble or concierge icon
   - Label: "Beauty Assistant" or "Ask me anything"

**✓ Pass:** Widget is visible and clickable  
**✗ Fail:** Widget missing or not clickable

---

### 2. Open the Chat Interface

1. Click the AI Concierge widget
2. The chat panel should open with:
   - Welcome message
   - Input field at the bottom
   - Send button or Enter-to-send
   - Clear chat history (optional)

**✓ Pass:** Chat opens smoothly with welcome message  
**✗ Fail:** Chat doesn't open or UI is broken

---

### 3. Test Basic Conversation

**Test Case 1: Greeting**
- **User input:** "Hello"
- **Expected:** Friendly greeting from the assistant, offer to help with beauty concerns

**Test Case 2: Product Inquiry**
- **User input:** "I need help with acne"
- **Expected:** Assistant asks follow-up questions (skin type, severity, etc.) and suggests relevant products

**Test Case 3: Specific Product**
- **User input:** "Tell me about [Product Name]"
- **Expected:** Assistant provides product details, ingredients, usage, and a link to the product page

**Test Case 4: General Advice**
- **User input:** "What's a good skincare routine?"
- **Expected:** Assistant provides general skincare advice or asks about skin concerns to personalize

**✓ Pass:** All responses are relevant, helpful, and on-brand  
**✗ Fail:** Responses are generic, unrelated, or error messages

---

### 4. Test Product Recommendations

1. Ask: **"Recommend products for dry skin"**
2. The assistant should:
   - Ask clarifying questions (age, sensitivities, etc.) OR
   - Provide a list of 3-5 products from the catalog
   - Include product names, brief descriptions, and links
3. Click on a product link
4. Verify it opens the correct product page

**✓ Pass:** Recommendations are relevant and links work  
**✗ Fail:** Products are irrelevant, links broken, or no recommendations given

---

### 5. Test "Find My Ritual" Flow

1. Click **"Find My Ritual"** or similar CTA on the homepage
2. The flow should guide you through:
   - **Step 1: Analyze** — Answer questions about skin concerns
   - **Step 2: Recommend** — AI suggests personalized products
   - **Step 3: Add to Cart** — Option to add recommended products
3. Complete the flow and verify products are added to cart

**✓ Pass:** Flow is smooth, recommendations are relevant, products added successfully  
**✗ Fail:** Flow broken, recommendations missing, or cart not updated

---

### 6. Test Chat History & Context

1. Send: **"I have dry skin"**
2. Wait for response
3. Send: **"What about acne?"**
4. The assistant should:
   - Remember your previous mention of dry skin
   - Provide advice for both dry skin and acne (if possible) OR
   - Acknowledge the change in concern

**✓ Pass:** Assistant maintains context across messages  
**✗ Fail:** Assistant forgets previous messages or repeats itself

---

### 7. Test Error Handling

**Test Case 1: Nonsense Input**
- **User input:** "asdfghjkl"
- **Expected:** Polite message asking to clarify or rephrase

**Test Case 2: Off-Topic Question**
- **User input:** "What's the weather today?"
- **Expected:** Assistant redirects to beauty/skincare topics

**Test Case 3: Empty Message**
- **User input:** (blank)
- **Expected:** Input field validation or "Please enter a message"

**✓ Pass:** Errors are handled gracefully with helpful prompts  
**✗ Fail:** Errors break the chat or produce unhelpful messages

---

### 8. Test Multi-Language Support (Optional)

If bilingual support (English/Arabic) is enabled:

1. Send: **"مرحبا"** (Arabic for "Hello")
2. The assistant should respond in Arabic
3. Switch back to English: **"Tell me about your products"**
4. The assistant should respond in English

**✓ Pass:** Assistant detects and responds in the correct language  
**✗ Fail:** Language detection fails or responses are mixed

---

### 9. Test Performance & Responsiveness

1. Send multiple messages rapidly (5-10 in a row)
2. Verify:
   - Responses arrive in order
   - No duplicate responses
   - No "stuck" loading states
   - Response time < 5 seconds per message

**✓ Pass:** Chat is responsive and handles rapid input  
**✗ Fail:** Chat lags, duplicates messages, or freezes

---

### 10. Test on Mobile

1. Open the site on a mobile device or resize browser to mobile width
2. Verify:
   - Widget appears and is easily tappable
   - Chat panel opens and fills the screen appropriately
   - Input field and send button are accessible
   - Scrolling works smoothly
   - No UI overflow or layout issues

**✓ Pass:** Mobile experience is smooth and usable  
**✗ Fail:** UI is broken or unusable on mobile

---

## Automated Testing with Scripts

### Health Check (includes basic Brain check)

```bash
npm run health
```

**What it checks:**
- Main site homepage (200 OK)
- `/health` endpoint (200 OK, valid JSON)
- Products page loads

### Brain-Specific Test

```bash
npm run test:brain
```

**What it checks:**
- Supabase API connectivity
- Beauty Assistant edge function endpoint exists (not 404)
- AI Concierge presence on site (basic HTML check)

**Note:** This script does NOT test actual AI responses. For that, manual testing is required.

---

## Debugging Tips

### Widget Not Appearing

1. Check browser console for errors
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Lovable env vars
3. Ensure AIConcierge component is imported in `src/App.tsx`
4. Check if widget is hidden by CSS (z-index, display, etc.)

### No Response from Assistant

1. Open browser DevTools → Network tab
2. Send a test message
3. Look for a request to `/functions/v1/beauty-assistant`
4. Check the response:
   - **400/401:** Authentication issue (check Supabase keys)
   - **404:** Edge function not deployed (deploy from Supabase CLI)
   - **500:** Server error (check Supabase Edge Function logs)
   - **Timeout:** Edge function is slow or stuck

### Responses Are Generic or Wrong

1. Check Edge Function logs in Supabase Dashboard
2. Verify the AI model and prompt configuration
3. Ensure product catalog is accessible to the edge function
4. Test edge function directly via `curl` or Postman

### Edge Function Logs

**Supabase Dashboard:**
1. Go to https://supabase.com/dashboard/project/qqceibvalkoytafynwoc
2. Navigate to **Edge Functions** → `beauty-assistant`
3. Click **Logs** to see recent invocations and errors

**Using Supabase CLI:**
```bash
supabase functions logs beauty-assistant --project-ref qqceibvalkoytafynwoc
```

---

## Expected Behavior Summary

| Feature | Expected Behavior |
|---------|-------------------|
| **Widget appearance** | Visible in bottom-right corner on all pages |
| **Chat open/close** | Smooth animation, no lag |
| **Welcome message** | Friendly, on-brand, offers help |
| **Product recommendations** | 3-5 relevant products with links |
| **Context memory** | Remembers previous messages in session |
| **Error handling** | Polite, helpful messages for invalid input |
| **Response time** | < 5 seconds per message |
| **Mobile usability** | Full-screen or overlay, easy to type and scroll |
| **Language support** | Detects and responds in user's language (if enabled) |

---

## Success Criteria

✅ **Pass** — All manual test cases pass, `npm run test:brain` returns 0 exit code, no errors in console  
⚠️ **Partial** — Most tests pass, minor issues (e.g., slow responses, occasional errors)  
❌ **Fail** — Widget missing, no responses, or critical errors

---

## Reporting Issues

If testing reveals issues:

1. **Document the issue:**
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or screen recordings
   - Browser console errors
   - Network tab (request/response details)

2. **Check Supabase logs** for server-side errors

3. **Create a GitHub issue** in asperpharma/understand-project with:
   - Issue title: "Brain/Assistant: [brief description]"
   - Full details from step 1
   - Priority label (critical, high, medium, low)

4. **Notify the team** via Discord/Slack if critical

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run health` | Full site health check (includes basic Brain check) |
| `npm run test:brain` | Specific Brain/chatbot connectivity test |
| `npm run dev` | Run site locally for testing |

| URL | Purpose |
|-----|---------|
| https://asperbeautyshop-com.lovable.app/ | Live site |
| https://asperbeautyshop-com.lovable.app/health | Health endpoint |
| https://supabase.com/dashboard/project/qqceibvalkoytafynwoc | Supabase Dashboard (logs, edge functions) |

---

**Last Updated:** February 2026  
**Contact:** See MAIN_PROJECT.md for team info
