-- 014_paddle_customers_and_subscriptions.sql
-- Mirror Paddle state (customers, subscriptions, transactions) into PostgreSQL / Supabase

CREATE TABLE IF NOT EXISTS public.customers (
  customer_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  subscription_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES public.customers(customer_id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  scheduled_change_action TEXT,
  scheduled_change_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

CREATE TABLE IF NOT EXISTS public.transactions (
  transaction_id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES public.customers(customer_id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency_code TEXT NOT NULL,
  custom_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow public read of self data / authenticated read
CREATE POLICY "Allow anon/authenticated read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow anon/authenticated read subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow anon/authenticated read transactions" ON public.transactions FOR SELECT USING (true);
