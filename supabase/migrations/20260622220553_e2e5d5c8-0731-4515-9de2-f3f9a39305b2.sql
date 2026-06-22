
-- Fix profiles: restrict SELECT to self (or admin)
DROP POLICY IF EXISTS "profiles self read" ON public.profiles;
CREATE POLICY "profiles self read" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- Employees: admin-only full access, self read
DROP POLICY IF EXISTS "employees all auth" ON public.employees;
CREATE POLICY "employees admin all" ON public.employees
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "employees self read" ON public.employees
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Expenses: admin only
DROP POLICY IF EXISTS "expenses all auth" ON public.expenses;
CREATE POLICY "expenses admin all" ON public.expenses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Payments: admin only
DROP POLICY IF EXISTS "payments all auth" ON public.payments;
CREATE POLICY "payments admin all" ON public.payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix touch_updated_at search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
begin new.updated_at = now(); return new; end;
$$;

-- Lock down SECURITY DEFINER functions: revoke from public/anon
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role must remain executable by authenticated for RLS policies
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
