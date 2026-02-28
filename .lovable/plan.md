

## Summary

Three issues to fix:

1. **ManyChat extraction** — Currently reads `data.text`. The user wants `messaging[0].message.text`. This aligns with ManyChat's actual webhook payload structure.

2. **Gorgias extraction** — Currently reads `body.messages[last].body_text`. The user wants `body.message.body_text` (singular `message` object, not array). Will add this as a fallback path.

3. **Old Supabase project ID** — Three source files and `config.toml` still reference the obsolete `rgehleqcubtmcwyipyvi`. Must update to `qqceibvalkoytafynwoc`.

---

## Changes

### A. Update `extractFromManyChat` in `supabase/functions/beauty-assistant/index.ts`

Add `messaging[0].message.text` as the primary extraction path:

```typescript
function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  // ManyChat webhook: messaging[0].message.text
  const messaging = Array.isArray(body.messaging) ? body.messaging : [];
  const firstMsg = messaging[0] as Record<string, unknown> | undefined;
  const msgObj = firstMsg?.message as Record<string, unknown> | undefined;

  const text =
    typeof msgObj?.text === "string" ? msgObj.text
    : typeof (body.data as any)?.text === "string" ? (body.data as any).text
    : typeof (body as any).text === "string" ? (body as any).text
    : typeof (body as any).message === "string" ? (body as any).message
    : "";
  return { message: text || "(No message)" };
}
```

### B. Update `extractFromGorgias` in `supabase/functions/beauty-assistant/index.ts`

Add `body.message.body_text` as a fallback path (singular `message` object):

```typescript
function extractFromGorgias(body: Record<string, unknown>): { message: string } {
  // Try body.messages[] array first
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  // Try singular body.message object
  const singleMsg = (body.message && typeof body.message === "object") ? body.message as Record<string, unknown> : undefined;

  const text =
    typeof last?.body_text === "string" ? last.body_text
    : typeof last?.body_html === "string" ? last.body_html.replace(/<[^>]+>/g, "").trim()
    : typeof singleMsg?.body_text === "string" ? singleMsg.body_text
    : typeof singleMsg?.body_html === "string" ? (singleMsg.body_html as string).replace(/<[^>]+>/g, "").trim()
    : typeof (body as any).body_text === "string" ? (body as any).body_text
    : typeof (body as any).message === "string" ? (body as any).message
    : "";
  return { message: text || "(No message)" };
}
```

### C. Fix old project ID references

| File | Line | Change |
|------|------|--------|
| `supabase/config.toml` | 1 | `project_id = "rgehleqcubtmcwyipyvi"` → `"qqceibvalkoytafynwoc"` |
| `src/components/AIConcierge.tsx` | 25 | Fallback URL `rgehleq...` → `qqceib...` |
| `src/pages/LabTools.tsx` | 14 | Fallback URL `rgehleq...` → `qqceib...` |
| `src/pages/Intelligence.tsx` | 25 | Fallback URL `rgehleq...` → `qqceib...` |

All four files get the same string replacement: `rgehleqcubtmcwyipyvi` → `qqceibvalkoytafynwoc`.

### D. Redeploy edge function

After updating `beauty-assistant/index.ts`, deploy it so the ManyChat and Gorgias fixes go live.

