CREATE POLICY "Public can view establishments"
ON public.establishments
FOR SELECT
USING (true);
