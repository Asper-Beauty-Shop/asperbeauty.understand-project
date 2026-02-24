-- Remove the overly permissive policy on events table
DROP POLICY IF EXISTS "Allow service role and internal" ON public.events;

-- Service role bypasses RLS entirely, so no policy is needed for it.
-- By having NO permissive policies, regular authenticated/anon users are blocked.