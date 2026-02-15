
-- RLS policies for user_tenants: users can only see/manage their own tenant associations
CREATE POLICY "Users can view own tenants"
ON public.user_tenants FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tenants"
ON public.user_tenants FOR DELETE
USING (user_id = auth.uid());
