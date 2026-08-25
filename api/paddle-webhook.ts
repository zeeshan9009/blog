import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const PADDLE_API_KEY = process.env.PADDLE_SANDBOX_API_KEY || process.env.PADDLE_API_KEY || '';
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET_KEY || '';
const PADDLE_ENV = process.env.VITE_PADDLE_ENV || 'sandbox';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://femtnrbswscrxidxuzgb.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM';

const paddle = new Paddle(PADDLE_API_KEY, {
  environment: PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to extract raw body text from request
async function getRawBody(req: any): Promise<string> {
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }
  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }

  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = (req.headers['paddle-signature'] || '') as string;

    if (!signature) {
      console.error('[Paddle Webhook] Missing paddle-signature header');
      return res.status(400).json({ error: 'Missing paddle-signature header' });
    }

    // 1. Verify Signature with Paddle SDK
    let eventData: any;
    try {
      eventData = await paddle.webhooks.unmarshal(rawBody, PADDLE_WEBHOOK_SECRET, signature);
    } catch (unmarshalErr: any) {
      console.error('[Paddle Webhook] Signature verification failed:', unmarshalErr.message || unmarshalErr);
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const eventType = eventData.eventType || eventData.event_type;
    console.log(`[Paddle Webhook] Verified event: ${eventType} (ID: ${eventData.eventId})`);

    const data = eventData.data;

    // 2. Route Typed Events
    switch (eventType) {
      case 'customer.created':
      case 'customer.updated': {
        const customerId = data.id;
        const email = data.email;
        const customData = data.customData || {};
        const userId = customData.userId || null;

        await supabase.from('customers').upsert({
          customer_id: customerId,
          email: email,
          user_id: userId,
          updated_at: new Date().toISOString()
        });
        console.log(`[Paddle Webhook] Mirrored customer ${customerId} (${email})`);
        break;
      }

      case 'subscription.created':
      case 'subscription.updated': {
        const subscriptionId = data.id;
        const customerId = data.customerId || data.customer_id;
        const status = data.status;
        const items = data.items || [];
        const firstItem = items[0] || {};
        const priceId = firstItem.price?.id || '';
        const productId = firstItem.price?.productId || '';
        const scheduledChange = data.scheduledChange || {};

        await supabase.from('subscriptions').upsert({
          subscription_id: subscriptionId,
          customer_id: customerId,
          status: status,
          price_id: priceId,
          product_id: productId,
          scheduled_change_action: scheduledChange.action || null,
          scheduled_change_at: scheduledChange.effectiveAt || null,
          updated_at: new Date().toISOString()
        });
        console.log(`[Paddle Webhook] Mirrored subscription ${subscriptionId} status: ${status}`);
        break;
      }

      case 'subscription.canceled': {
        const subscriptionId = data.id;
        await supabase.from('subscriptions').update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        }).eq('subscription_id', subscriptionId);
        console.log(`[Paddle Webhook] Subscription ${subscriptionId} marked canceled`);
        break;
      }

      case 'transaction.completed': {
        const transactionId = data.id;
        const customerId = data.customerId || data.customer_id;
        const status = data.status;
        const details = data.details || {};
        const totals = details.totals || {};
        const amountCents = parseInt(totals.total || '0', 10);
        const currencyCode = totals.currencyCode || 'USD';
        const customData = data.customData || {};

        await supabase.from('transactions').upsert({
          transaction_id: transactionId,
          customer_id: customerId,
          status: status,
          amount_cents: amountCents,
          currency_code: currencyCode,
          custom_data: customData,
          created_at: new Date().toISOString()
        });
        console.log(`[Paddle Webhook] Recorded completed transaction ${transactionId}`);
        break;
      }

      default:
        console.log(`[Paddle Webhook] Safely ignored unhandled event: ${eventType}`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('[Paddle Webhook] Handler error:', err.message || err);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
