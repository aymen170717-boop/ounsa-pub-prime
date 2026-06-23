DROP POLICY IF EXISTS "logs read auth" ON public.activity_logs;
CREATE POLICY "logs read admin" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "notifications read own" ON public.notifications;
CREATE POLICY "notifications read own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());