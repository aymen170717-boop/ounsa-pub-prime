
-- Replace USING(true)/WITH CHECK(true) ALL policies with auth check
DO $$
DECLARE
  t text;
  pname text;
BEGIN
  FOR t, pname IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname='public' AND (qual='true' OR with_check='true')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', pname, t);
  END LOOP;
END $$;

-- Recreate with auth.uid() IS NOT NULL
CREATE POLICY "auth all" ON public.categories FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.clients FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.invoices FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.order_items FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.orders FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.products FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.quotes FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.stock_movements FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.suppliers FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth all" ON public.tasks FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Restore SELECT/INSERT-only intentional policies
CREATE POLICY "logs read auth" ON public.activity_logs FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "logs insert auth" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "notifications insert auth" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "settings read" ON public.settings FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);
