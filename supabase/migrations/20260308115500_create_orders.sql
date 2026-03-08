CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_method TEXT NOT NULL,
    order_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ANÁLISE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
    establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (
    establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete own orders" ON orders FOR DELETE USING (
    establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid())
);
