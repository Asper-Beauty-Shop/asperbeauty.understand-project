-- Prevent any user from inserting roles (only service_role can)
CREATE POLICY "Only service role can insert roles"
ON public.user_roles
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- Prevent any user from deleting roles
CREATE POLICY "Only service role can delete roles"
ON public.user_roles
FOR DELETE
TO public
USING (auth.role() = 'service_role');

-- Prevent any user from updating roles
CREATE POLICY "Only service role can update roles"
ON public.user_roles
FOR UPDATE
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');