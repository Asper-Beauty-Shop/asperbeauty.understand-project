-- Add indexes on unindexed foreign keys and frequently filtered columns

-- cod_orders
CREATE INDEX IF NOT EXISTS idx_cod_orders_user_id ON public.cod_orders (user_id);
CREATE INDEX IF NOT EXISTS idx_cod_orders_driver_id ON public.cod_orders (driver_id);
CREATE INDEX IF NOT EXISTS idx_cod_orders_status ON public.cod_orders (status);

-- concierge_profiles
CREATE INDEX IF NOT EXISTS idx_concierge_profiles_user_id ON public.concierge_profiles (user_id);

-- consultations
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations (user_id);

-- product_reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

-- regimen_plans
CREATE INDEX IF NOT EXISTS idx_regimen_plans_user_id ON public.regimen_plans (user_id);

-- regimen_steps
CREATE INDEX IF NOT EXISTS idx_regimen_steps_plan_id ON public.regimen_steps (plan_id);
CREATE INDEX IF NOT EXISTS idx_regimen_steps_product_id ON public.regimen_steps (product_id);

-- telemetry_events
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON public.telemetry_events (user_id);

-- user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

-- products (frequently filtered columns)
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_primary_concern ON public.products (primary_concern);
CREATE INDEX IF NOT EXISTS idx_products_availability_status ON public.products (availability_status);
CREATE INDEX IF NOT EXISTS idx_products_bestseller_rank ON public.products (bestseller_rank);

-- email_send_log
CREATE INDEX IF NOT EXISTS idx_email_send_log_recipient ON public.email_send_log (recipient_email);

-- suppressed_emails
CREATE INDEX IF NOT EXISTS idx_suppressed_emails_email ON public.suppressed_emails (email);