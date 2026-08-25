import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const PADDLE_API_KEY = process.env.PADDLE_SANDBOX_API_KEY || process.env.PADDLE_API_KEY || '';
const PADDLE_ENV = process.env.VITE_PADDLE_ENV || 'sandbox';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://femtnrbswscrxidxuzgb.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM';

const paddle = new Paddle(PADDLE_API_KEY, {
  environment: PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, email } = req.body || {};

    if (!userId && !email) {
      return res.status(401).json({ error: 'Unauthorized: Missing user authentication session' });
    }

    // 1. Resolve Customer ID from Database
    let customerId: string | null = null;
    let query = supabase.from('customers').select('customer_id');

    if (userId) {
      const { data: byUser } = await query.eq('user_id', userId).limit(1);
      if (byUser && byUser[0]) {
        customerId = byUser[0].customer_id;
      }
    }

    if (!customerId && email) {
      const { data: byEmail } = await supabase.from('customers').select('customer_id').eq('email', email).limit(1);
      if (byEmail && byEmail[0]) {
        customerId = byEmail[0].customer_id;
      }
    }

    // Fallback: If not yet in local DB, search Paddle customer catalog by email
    if (!customerId && email) {
      try {
        const paddleCustomers = await paddle.customers.list({ search: email }).next();
        if (paddleCustomers && paddleCustomers.length > 0) {
          customerId = paddleCustomers[0].id;
        }
      } catch (custErr) {
        console.warn('Could not query Paddle customers list:', custErr);
      }
    }

    if (!customerId) {
      return res.status(404).json({ error: 'No active Paddle customer profile found for this account. Make your first transaction or entry to access the portal.' });
    }

    // 2. Resolve Customer Subscriptions (if any)
    let subscriptionIds: string[] = [];
    try {
      const { data: subRows } = await supabase.from('subscriptions').select('subscription_id').eq('customer_id', customerId);
      if (subRows && subRows.length > 0) {
        subscriptionIds = subRows.map(r => r.subscription_id);
      }
    } catch {}

    // 3. Mint Customer Portal Session with Paddle SDK
    const session = await paddle.customerPortalSessions.create(customerId, subscriptionIds);

    const portalUrl = session?.urls?.general?.overview || session?.urls?.subscriptions?.[0]?.cancelSubscription;

    if (!portalUrl) {
      return res.status(500).json({ error: 'Failed to mint customer portal session URL from Paddle' });
    }

    return res.status(200).json({
      url: portalUrl,
      customerId
    });

  } catch (err: any) {
    console.error('[Paddle Portal] Error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Internal server error minting portal session' });
  }
}
