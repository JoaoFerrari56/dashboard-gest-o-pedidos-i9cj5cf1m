// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      establishments: {
        Row: {
          category: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          operating_hours: string | null
          schedule: Json
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          operating_hours?: string | null
          schedule?: Json
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          operating_hours?: string | null
          schedule?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'establishments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'menu_categories_establishment_id_fkey'
            columns: ['establishment_id']
            isOneToOne: false
            referencedRelation: 'establishments'
            referencedColumns: ['id']
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string
          complement_groups: Json | null
          created_at: string
          description: string | null
          establishment_id: string
          id: string
          image_url: string | null
          name: string
          price: string | null
          serves: string | null
          size: string | null
          sort_order: number | null
          status: string
          variations: Json | null
        }
        Insert: {
          category_id: string
          complement_groups?: Json | null
          created_at?: string
          description?: string | null
          establishment_id: string
          id?: string
          image_url?: string | null
          name: string
          price?: string | null
          serves?: string | null
          size?: string | null
          sort_order?: number | null
          status?: string
          variations?: Json | null
        }
        Update: {
          category_id?: string
          complement_groups?: Json | null
          created_at?: string
          description?: string | null
          establishment_id?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: string | null
          serves?: string | null
          size?: string | null
          sort_order?: number | null
          status?: string
          variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'menu_items_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'menu_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'menu_items_establishment_id_fkey'
            columns: ['establishment_id']
            isOneToOne: false
            referencedRelation: 'establishments'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          customer_whatsapp: string
          delivery_address: Json
          establishment_id: string
          id: string
          order_items: Json
          payment_method: string
          status: string
          total_price: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_whatsapp: string
          delivery_address?: Json
          establishment_id: string
          id?: string
          order_items?: Json
          payment_method: string
          status?: string
          total_price: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_whatsapp?: string
          delivery_address?: Json
          establishment_id?: string
          id?: string
          order_items?: Json
          payment_method?: string
          status?: string
          total_price?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_establishment_id_fkey'
            columns: ['establishment_id']
            isOneToOne: false
            referencedRelation: 'establishments'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: establishments
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   category: text (not null)
//   operating_hours: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   logo_url: text (nullable)
//   schedule: jsonb (not null, default: '{}'::jsonb)
// Table: menu_categories
//   id: uuid (not null, default: gen_random_uuid())
//   establishment_id: uuid (not null)
//   name: text (not null)
//   sort_order: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: menu_items
//   id: uuid (not null, default: gen_random_uuid())
//   establishment_id: uuid (not null)
//   category_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   price: text (nullable)
//   size: text (nullable)
//   serves: text (nullable)
//   status: text (not null, default: 'Ativo'::text)
//   image_url: text (nullable)
//   variations: jsonb (nullable, default: '[]'::jsonb)
//   complement_groups: jsonb (nullable, default: '[]'::jsonb)
//   sort_order: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: orders
//   id: uuid (not null, default: gen_random_uuid())
//   establishment_id: uuid (not null)
//   customer_name: text (not null)
//   customer_whatsapp: text (not null)
//   delivery_address: jsonb (not null, default: '{}'::jsonb)
//   payment_method: text (not null)
//   order_items: jsonb (not null, default: '[]'::jsonb)
//   total_price: text (not null)
//   status: text (not null, default: 'ANÁLISE'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: users
//   id: uuid (not null)
//   email: text (not null)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: establishments
//   PRIMARY KEY establishments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY establishments_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//   UNIQUE establishments_user_id_key: UNIQUE (user_id)
// Table: menu_categories
//   FOREIGN KEY menu_categories_establishment_id_fkey: FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE
//   PRIMARY KEY menu_categories_pkey: PRIMARY KEY (id)
// Table: menu_items
//   FOREIGN KEY menu_items_category_id_fkey: FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
//   FOREIGN KEY menu_items_establishment_id_fkey: FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE
//   PRIMARY KEY menu_items_pkey: PRIMARY KEY (id)
// Table: orders
//   FOREIGN KEY orders_establishment_id_fkey: FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE
//   PRIMARY KEY orders_pkey: PRIMARY KEY (id)
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: establishments
//   Policy "Public can view establishments" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Users can insert own establishment" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can update own establishment" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can view own establishment" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: menu_categories
//   Policy "Public can view menu_categories" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Users can delete own menu_categories" (DELETE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can insert own menu_categories" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can update own menu_categories" (UPDATE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
// Table: menu_items
//   Policy "Public can view menu_items" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Users can delete own menu_items" (DELETE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can insert own menu_items" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can update own menu_items" (UPDATE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
// Table: orders
//   Policy "Public can insert orders" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Users can delete own orders" (DELETE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can update own orders" (UPDATE, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
//   Policy "Users can view own orders" (SELECT, PERMISSIVE) roles={public}
//     USING: (establishment_id IN ( SELECT establishments.id    FROM establishments   WHERE (establishments.user_id = auth.uid())))
// Table: users
//   Policy "Users can insert own record" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own record" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
//   Policy "Users can view own record" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.users (id, email)
//     VALUES (NEW.id, NEW.email)
//     ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
//     RETURN NEW;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: establishments
//   CREATE UNIQUE INDEX establishments_user_id_key ON public.establishments USING btree (user_id)
