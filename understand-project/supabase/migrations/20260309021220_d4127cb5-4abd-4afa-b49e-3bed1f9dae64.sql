-- ui_checks: admin-only management
CREATE POLICY "admins_manage_ui_checks" ON public.ui_checks
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ui_check_runs: admin-only management
CREATE POLICY "admins_manage_ui_check_runs" ON public.ui_check_runs
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ui_check_artifacts: admin-only management
CREATE POLICY "admins_manage_ui_check_artifacts" ON public.ui_check_artifacts
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- rate_limits: deny all direct access (managed by security definer function enforce_rate_limit)
CREATE POLICY "deny_all_rate_limits" ON public.rate_limits
FOR ALL
USING (false)
WITH CHECK (false);