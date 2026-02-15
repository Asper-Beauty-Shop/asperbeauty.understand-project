
-- Restrict all relevant policies to authenticated users only
-- This resolves anonymous access warnings across tables

-- ========== Shopify pub ==========
DROP POLICY IF EXISTS "owner_update" ON public."Shopify pub";
CREATE POLICY "owner_update" ON public."Shopify pub" FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()) AND (tenant_id IN (SELECT ut.tenant_id FROM user_tenants ut WHERE ut.user_id = auth.uid())))
  WITH CHECK ((user_id = auth.uid()) AND (tenant_id IN (SELECT ut.tenant_id FROM user_tenants ut WHERE ut.user_id = auth.uid())));

DROP POLICY IF EXISTS "tenant_read" ON public."Shopify pub";
CREATE POLICY "tenant_read" ON public."Shopify pub" FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT ut.tenant_id FROM user_tenants ut WHERE ut.user_id = auth.uid()));

DROP POLICY IF EXISTS "tenant_update_own" ON public."Shopify pub";
CREATE POLICY "tenant_update_own" ON public."Shopify pub" FOR UPDATE TO authenticated
  USING ((tenant_id = ((auth.jwt() ->> 'tenant_id')::uuid)) AND (user_id = auth.uid()))
  WITH CHECK ((tenant_id = ((auth.jwt() ->> 'tenant_id')::uuid)) AND (user_id = auth.uid()));

DROP POLICY IF EXISTS "tenant_insert" ON public."Shopify pub";
CREATE POLICY "tenant_insert" ON public."Shopify pub" FOR INSERT TO authenticated
  WITH CHECK (tenant_id = ((auth.jwt() ->> 'tenant_id')::uuid));

DROP POLICY IF EXISTS "tenant_write" ON public."Shopify pub";
CREATE POLICY "tenant_write" ON public."Shopify pub" FOR INSERT TO authenticated
  WITH CHECK ((tenant_id IN (SELECT ut.tenant_id FROM user_tenants ut WHERE ut.user_id = auth.uid())) AND (user_id = auth.uid()));

-- ========== ai_message_audit ==========
DROP POLICY IF EXISTS "ai_audit_select_own" ON public.ai_message_audit;
CREATE POLICY "ai_audit_select_own" ON public.ai_message_audit FOR SELECT TO authenticated
  USING ((user_id IS NULL) OR (user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users insert own audit" ON public.ai_message_audit;
CREATE POLICY "Authenticated users insert own audit" ON public.ai_message_audit FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ========== chat_logs ==========
DROP POLICY IF EXISTS "Users can delete own chat logs" ON public.chat_logs;
CREATE POLICY "Users can delete own chat logs" ON public.chat_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own chat logs" ON public.chat_logs;
CREATE POLICY "Users can view own chat logs" ON public.chat_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users insert own logs" ON public.chat_logs;
CREATE POLICY "Authenticated users insert own logs" ON public.chat_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ========== concierge_profiles ==========
DROP POLICY IF EXISTS "Users can create their own profile" ON public.concierge_profiles;
CREATE POLICY "Users can create their own profile" ON public.concierge_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own concierge profile" ON public.concierge_profiles;
CREATE POLICY "Users can delete own concierge profile" ON public.concierge_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.concierge_profiles;
CREATE POLICY "Users can update their own profile" ON public.concierge_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.concierge_profiles;
CREATE POLICY "Users can view their own profile" ON public.concierge_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ========== newsletter_subscribers ==========
-- Admin read: restrict to authenticated
DROP POLICY IF EXISTS "Admins can read subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
-- NOTE: "Anyone can subscribe" INSERT policy intentionally kept for anon users

-- ========== products ==========
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
-- NOTE: public_read_in_stock SELECT policy intentionally kept for anon (storefront)

-- ========== profiles ==========
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_read_own" ON public.profiles;
CREATE POLICY "profile_read_own" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_write_own" ON public.profiles;
CREATE POLICY "profile_write_own" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_insert_self" ON public.profiles;
CREATE POLICY "profile_insert_self" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ========== prompt_experiments ==========
DROP POLICY IF EXISTS "read_active_experiments" ON public.prompt_experiments;
CREATE POLICY "read_active_experiments" ON public.prompt_experiments FOR SELECT TO authenticated
  USING (is_active = true);

-- ========== prompts ==========
DROP POLICY IF EXISTS "read_active_prompts" ON public.prompts;
CREATE POLICY "read_active_prompts" ON public.prompts FOR SELECT TO authenticated
  USING (is_active = true);

-- ========== telemetry_events ==========
DROP POLICY IF EXISTS "Users can delete own telemetry" ON public.telemetry_events;
CREATE POLICY "Users can delete own telemetry" ON public.telemetry_events FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own telemetry" ON public.telemetry_events;
CREATE POLICY "Users can view own telemetry" ON public.telemetry_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users insert own telemetry" ON public.telemetry_events;
CREATE POLICY "Authenticated users insert own telemetry" ON public.telemetry_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ========== user_roles ==========
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ========== user_tenants ==========
DROP POLICY IF EXISTS "Users can view own tenants" ON public.user_tenants;
CREATE POLICY "Users can view own tenants" ON public.user_tenants FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own tenants" ON public.user_tenants;
CREATE POLICY "Users can delete own tenants" ON public.user_tenants FOR DELETE TO authenticated
  USING (user_id = auth.uid());
