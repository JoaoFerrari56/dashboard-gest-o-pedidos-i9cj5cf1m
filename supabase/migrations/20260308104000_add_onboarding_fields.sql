-- Add schedule and logo_url if they don't exist
ALTER TABLE public.establishments ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.establishments ADD COLUMN IF NOT EXISTS schedule JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.establishments ALTER COLUMN operating_hours DROP NOT NULL;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

-- Policies for logos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload logos' AND tablename = 'objects') THEN
        CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update logos' AND tablename = 'objects') THEN
        CREATE POLICY "Authenticated users can update logos" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
    END IF;
END
$$;
