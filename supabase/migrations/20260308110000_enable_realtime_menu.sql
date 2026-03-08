-- Make sure the realtime publication exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN 
    CREATE PUBLICATION supabase_realtime; 
  END IF;
END $$;

-- Safely add menu tables to the publication
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'menu_categories'
  ) THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories; 
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'menu_items'
  ) THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items; 
  END IF;
END $$;
