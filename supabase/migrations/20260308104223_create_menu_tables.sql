CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  size TEXT,
  serves TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  image_url TEXT,
  variations JSONB DEFAULT '[]'::jsonb,
  complement_groups JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view menu_categories" ON public.menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own menu_categories" ON public.menu_categories
  FOR INSERT WITH CHECK (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own menu_categories" ON public.menu_categories
  FOR UPDATE USING (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own menu_categories" ON public.menu_categories
  FOR DELETE USING (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can view menu_items" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own menu_items" ON public.menu_items
  FOR INSERT WITH CHECK (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own menu_items" ON public.menu_items
  FOR UPDATE USING (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own menu_items" ON public.menu_items
  FOR DELETE USING (
    establishment_id IN (SELECT id FROM public.establishments WHERE user_id = auth.uid())
  );
