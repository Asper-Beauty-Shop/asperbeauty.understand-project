

# Security and Bug Fix Plan

## Summary
There are **2 critical bugs** and **several security findings** to address. Here's the full breakdown:

---

## 1. Fix `getClaims` Bug in Lab Tools Edge Function (Critical)

The `lab-tools` edge function has the exact same `supabase.auth.getClaims()` bug that was just fixed in `beauty-assistant`. This causes a 500 error whenever anyone uses the Lab Tools feature.

**Fix:** Replace `getClaims(token)` with `supabase.auth.getUser()` on lines 204-210 of `supabase/functions/lab-tools/index.ts`, identical to the beauty-assistant fix.

---

## 2. Fix Overly Permissive Chat Logs UPDATE Policy (Error)

The `chat_logs` table has an UPDATE policy named "Enable read access for all users" with `USING (true)`, meaning **any authenticated user can modify any other user's chat history**. This is a serious data integrity issue.

**Fix:** Replace the permissive policy with one restricted to the row owner:
```text
DROP the "Enable read access for all users" UPDATE policy
CREATE a new UPDATE policy: USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())
```

---

## 3. Update Stale Security Findings

Several findings from the `agent_security` scanner are outdated (e.g., profiles table supposedly having no policies, when it actually does). The scan will be re-run to refresh these.

---

## 4. Remaining Informational Items (No Action Needed Now)

- **Shopify Storefront token in client code** -- already marked as ignored (Storefront tokens are designed for client-side use)
- **`cleanup_allowlist` table with no RLS** -- admin-only utility table, low risk
- **Function search_path mutable** -- cosmetic warning on some DB functions

---

## Technical Steps

1. Edit `supabase/functions/lab-tools/index.ts`: replace lines 204-210 (`getClaims` block) with `supabase.auth.getUser()` pattern
2. Deploy the updated `lab-tools` edge function
3. Apply a database migration to fix the `chat_logs` UPDATE policy
4. Re-run the security scan and update/dismiss resolved findings
5. Test the lab-tools endpoint to confirm it returns 401 (not 500) for auth validation

