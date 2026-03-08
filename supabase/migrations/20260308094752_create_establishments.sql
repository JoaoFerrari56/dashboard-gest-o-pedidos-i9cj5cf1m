CREATE TABLE public.establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own establishment" ON public.establishments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own establishment" ON public.establishments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own establishment" ON public.establishments
    FOR UPDATE USING (auth.uid() = user_id);
