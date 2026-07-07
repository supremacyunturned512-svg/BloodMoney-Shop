/*
# BloodMoney RP Initial Schema

1. New Tables
- `profiles` - User profiles linked to auth.users with role, in-game name, steam64
- `orders` - Purchase orders with items, payment status, delivery status
- `suggestions` - User feedback and suggestions
- `supporters` - Recent purchase supporters for leaderboard
- `gift_codes` - Redeemable gift codes for items
- `visitor_count` - Single row table for tracking visitor count

2. Security
- Enable RLS on all tables
- Owner-scoped policies for profiles and orders (authenticated users only)
- Supporters and visitor_count use anon+authenticated (public data)
- Suggestions readable by anon, writable by authenticated
- Gift codes managed by admins only via service role

3. Notes
- profiles.role: 0=Player, 1=Admin, 2=Head Admin, 3=Owner, 9=Co-Owner
- orders.order_status: Pending, Processing, Completed, Failed, Refunded
- orders.delivery_status: Queued, Delivered, Failed, Manual Required
*/

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  ingame_name text DEFAULT '',
  steam64 text DEFAULT '',
  role int NOT NULL DEFAULT 0,
  owned_items text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id text UNIQUE NOT NULL,
  steam64 text DEFAULT '',
  gift_steam64 text DEFAULT '',
  is_gift boolean DEFAULT false,
  items jsonb NOT NULL DEFAULT '[]',
  total decimal NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'stripe',
  payment_status text DEFAULT 'Awaiting Payment',
  order_status text DEFAULT 'Pending',
  delivery_status text DEFAULT 'Queued',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  username text NOT NULL,
  type text NOT NULL DEFAULT 'suggestion',
  text text NOT NULL,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "suggestions_select_all" ON suggestions;
CREATE POLICY "suggestions_select_all" ON suggestions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "suggestions_insert_auth" ON suggestions;
CREATE POLICY "suggestions_insert_auth" ON suggestions FOR INSERT
  TO authenticated WITH CHECK (true);

-- Supporters table (for leaderboard)
CREATE TABLE IF NOT EXISTS supporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  amount decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "supporters_select_all" ON supporters;
CREATE POLICY "supporters_select_all" ON supporters FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "supporters_insert_auth" ON supporters;
CREATE POLICY "supporters_insert_auth" ON supporters FOR INSERT
  TO authenticated WITH CHECK (true);

-- Gift codes table
CREATE TABLE IF NOT EXISTS gift_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  item_key text NOT NULL,
  item_name text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  used boolean DEFAULT false,
  used_by text DEFAULT '',
  used_at timestamptz
);

ALTER TABLE gift_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gift_codes_select_all" ON gift_codes;
CREATE POLICY "gift_codes_select_all" ON gift_codes FOR SELECT
  TO anon, authenticated USING (true);

-- Visitor count table (single row)
CREATE TABLE IF NOT EXISTS visitor_count (
  id int PRIMARY KEY DEFAULT 1,
  count int NOT NULL DEFAULT 0,
  CHECK (id = 1)
);

ALTER TABLE visitor_count ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visitor_select_all" ON visitor_count;
CREATE POLICY "visitor_select_all" ON visitor_count FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "visitor_insert_all" ON visitor_count;
CREATE POLICY "visitor_insert_all" ON visitor_count FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "visitor_update_all" ON visitor_count;
CREATE POLICY "visitor_update_all" ON visitor_count FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert initial visitor count row
INSERT INTO visitor_count (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_supporters_created_at ON supporters(created_at DESC);