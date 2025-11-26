-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage alerts" ON public.alerts;
DROP POLICY IF EXISTS "Anyone can view active alerts" ON public.alerts;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Admins can manage alerts" 
ON public.alerts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active alerts" 
ON public.alerts 
FOR SELECT 
USING (is_active = true);