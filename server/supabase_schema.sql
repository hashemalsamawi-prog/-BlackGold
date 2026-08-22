-- =================================================================
-- BLACK GOLD STORE (متجر فحم الذهب الأسود - صنعاء)
-- SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & ACCOUNTS (Management, Drivers, Verified Customers)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'employee', 'delivery', 'customer')),
    pin_hash TEXT,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pouches', 'wholesale', 'local', 'premium', 'bbq', 'incense')),
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percent NUMERIC,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    origin TEXT DEFAULT 'الذهب الأسود - صنعاء',
    burn_duration_hours TEXT DEFAULT '6+ ساعات متواصلة',
    ash_percentage TEXT DEFAULT 'أقل من 1.5% رماد أبيض',
    moisture TEXT DEFAULT '< 2%',
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 1,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    weight_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT true,
    is_best_seller BOOLEAN DEFAULT false,
    stock INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

-- 4. INVENTORY TRANSACTIONS
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'adjustment', 'damage', 'return')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_tx_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_tx_date ON inventory_transactions(date);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('received', 'preparing', 'shipped', 'delivering', 'delivered', 'cancelled')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC NOT NULL,
    discount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    address JSONB NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    notes TEXT DEFAULT '',
    driver_notes TEXT DEFAULT '',
    driver_id TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driver_id);

-- 6. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- 7. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    discount_percent NUMERIC NOT NULL,
    max_discount NUMERIC NOT NULL DEFAULT 3000,
    min_order_amount NUMERIC NOT NULL DEFAULT 2000,
    is_active BOOLEAN DEFAULT true,
    valid_until TEXT DEFAULT '2026-12-31',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DELIVERY AGENTS (Fleet)
CREATE TABLE IF NOT EXISTS delivery_agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL DEFAULT 'motorcycle',
    district_zone TEXT NOT NULL,
    active_orders_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 4.9,
    is_online BOOLEAN DEFAULT true,
    avatar TEXT,
    vehicle_plate TEXT,
    pin_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    store_name_ar TEXT NOT NULL DEFAULT 'الذهب الأسود',
    store_name_en TEXT NOT NULL DEFAULT 'Black Gold',
    slogan_ar TEXT NOT NULL DEFAULT 'فحم يمني فاخر - جودة لا تنطفئ',
    logo_text TEXT NOT NULL DEFAULT 'الذهب الأسود',
    custom_logo_url TEXT,
    top_banner_notice_ar TEXT DEFAULT '🔥 توصيل فوري خلال 30-45 دقيقة لجميع أحياء صنعاء | فحم طبيعي نقي 100%',
    top_banner_notice_en TEXT DEFAULT 'Fast delivery across Sanaa in 30-45 mins',
    whatsapp_phone TEXT DEFAULT '775000150',
    call_phone TEXT DEFAULT '775000150',
    contact_email TEXT DEFAULT 'blackgoled.ye@gmail.com',
    free_delivery_threshold NUMERIC DEFAULT 8000,
    is_store_open BOOLEAN DEFAULT true,
    default_coupon_code TEXT DEFAULT 'GOLD2026',
    delivery_districts JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GALLERY
CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name_ar TEXT NOT NULL,
    category_name_en TEXT NOT NULL,
    image TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    badge_ar TEXT NOT NULL,
    badge_en TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANALYTICS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    event_data JSONB,
    user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STORAGE BUCKETS (Execute in Supabase Storage SQL Editor or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blackgold-assets', 'blackgold-assets', true) ON CONFLICT (id) DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
