

## Diagnosis: Blank Screen Root Cause

The console error is definitive:
```
Error: VITE_SUPABASE_PUBLISHABLE_KEY environment variable is required
```

In `src/integrations/supabase/client.ts` (line 8-10), there's a hard `throw` that kills React before it can mount. The `ErrorBoundary` wraps `<App />` but can't catch errors thrown during **module evaluation** — the `supabase/client.ts` module is imported eagerly by multiple components, so the throw happens before React's render cycle begins.

The `.env` file shown earlier was created during a previous AI edit session but no longer exists on disk. The Lovable secrets store has no `VITE_SUPABASE_PUBLISHABLE_KEY` entry either.

## Fix Plan

**1. Make the Supabase client resilient to missing env vars**
- In `src/integrations/supabase/client.ts`, replace the hard `throw` with a fallback to the hardcoded anon key (which is already present as a fallback for `SUPABASE_URL`)
- The anon key `eyJhbG...` from the original `.env` is a **publishable** key (safe to embed in client code), so hardcoding it as a fallback is the correct pattern — same as `SUPABASE_URL` already does on line 5

Concrete change:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qqceibvalkoytafynwoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzc1OTUsImV4cCI6MjA4NTkxMzU5NX0.cnstN7JUhkt-hevIWhaeYRu1Y51tPSTi7eOBM6RLz4Y";

// Remove the if/throw block entirely
```

**2. Add `resolve.dedupe` to Vite config**
- Add `dedupe: ["react", "react-dom"]` to `vite.config.ts` to prevent duplicate React instances after the force push (defensive measure per the stack overflow pattern)

