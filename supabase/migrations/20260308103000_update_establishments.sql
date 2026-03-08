ALTER TABLE public.establishments ADD COLUMN logo_url TEXT;
ALTER TABLE public.establishments ADD COLUMN schedule JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.establishments ALTER COLUMN operating_hours DROP NOT NULL;

INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
