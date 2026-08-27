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

// In-memory processed transactions cache for fast idempotency check
const PROCESSED_WEBHOOK_TRANSACTIONS = new Set<string>();

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
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = (req.headers['paddle-signature'] || '') as string;

    let eventData: any;
    if (signature && PADDLE_WEBHOOK_SECRET) {
      try {
        eventData = await paddle.webhooks.unmarshal(rawBody, PADDLE_WEBHOOK_SECRET, signature);
      } catch (unmarshalErr: any) {
        console.error('[Paddle Webhook] Signature verification failed:', unmarshalErr.message || unmarshalErr);
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid webhook signature' }));
        return;
      }
    } else {
      // In local dev/test without active webhook secret, parse payload safely
      try {
        eventData = JSON.parse(rawBody);
      } catch {
        eventData = {};
      }
    }

    const eventType = eventData.eventType || eventData.event_type || 'transaction.completed';
    const eventId = eventData.eventId || eventData.event_id || `evt_${Date.now()}`;
    console.log(`[Paddle Webhook] Processing event: ${eventType} (ID: ${eventId})`);

    const data = eventData.data || eventData;

    // 1. Route Typed Events
    switch (eventType) {
      case 'customer.created':
      case 'customer.updated': {
        const customerId = data.id;
        const email = data.email;
        const customData = data.customData || data.custom_data || {};
        const userId = customData.userId || customData.profileId || null;

        try {
          await supabase.from('customers').upsert({
            customer_id: customerId,
            email: email,
            user_id: userId,
            updated_at: new Date().toISOString()
          });
        } catch {}
        break;
      }

      case 'transaction.completed':
      case 'transaction.paid': {
        const transactionId = data.id || data.transaction_id || `txn_${Date.now()}`;
        const customerId = data.customerId || data.customer_id;
        const status = data.status || 'succeeded';
        const details = data.details || {};
        const totals = details.totals || {};
        const amountCents = parseInt(totals.total || data.amount_cents || '500', 10);
        const currencyCode = totals.currencyCode || data.currency_code || 'USD';
        const customData = data.customData || data.custom_data || {};

        const challengeId = customData.challengeId || customData.challenge_id;
        const profileId = customData.profileId || customData.profile_id;
        const submissionId = customData.submissionId || customData.submission_id;

        // Idempotency check
        if (PROCESSED_WEBHOOK_TRANSACTIONS.has(transactionId)) {
          console.log(`[Paddle Webhook] Duplicate transaction event ignored: ${transactionId}`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ received: true, duplicate: true }));
          return;
        }
        PROCESSED_WEBHOOK_TRANSACTIONS.add(transactionId);

        // Store transaction log
        try {
          await supabase.from('transactions').upsert({
            transaction_id: transactionId,
            customer_id: customerId,
            status: status,
            amount_cents: amountCents,
            currency_code: currencyCode,
            custom_data: customData,
            created_at: new Date().toISOString()
          });
        } catch {}

        // Challenge Entry & Submission Reconciliation
        if (challengeId && profileId) {
          console.log(`[Paddle Webhook] Linking challenge entry for challenge ${challengeId}, profile ${profileId}`);

          // 1. Upsert challenge_entries
          try {
            await supabase.from('challenge_entries').upsert({
              challenge_id: challengeId,
              profile_id: profileId,
              paddle_transaction_id: transactionId,
              status: 'succeeded'
            }, { onConflict: 'challenge_id,profile_id' });
          } catch (entryErr: any) {
            console.warn('[Paddle Webhook] challenge_entries upsert warning:', entryErr.message);
          }

          // 2. Automatically link & activate challenge_submissions
          try {
            const { data: existingSub } = await supabase
              .from('challenge_submissions')
              .select('*')
              .eq('challenge_id', challengeId)
              .eq('profile_id', profileId)
              .maybeSingle();

            if (existingSub) {
              const newStatus = existingSub.status === 'draft' || existingSub.status === 'payment_pending'
                ? (existingSub.submission_url ? 'submitted' : 'paid')
                : (existingSub.status || 'submitted');

              await supabase
                .from('challenge_submissions')
                .update({
                  payment_status: 'paid',
                  payment_transaction_id: transactionId,
                  status: newStatus,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingSub.id);

              console.log(`[Paddle Webhook] Updated existing submission ${existingSub.id} -> payment: paid, status: ${newStatus}`);
            } else if (submissionId) {
              await supabase
                .from('challenge_submissions')
                .update({
                  payment_status: 'paid',
                  payment_transaction_id: transactionId,
                  status: 'submitted',
                  updated_at: new Date().toISOString()
                })
                .eq('id', submissionId);
            }
          } catch (subErr: any) {
            console.warn('[Paddle Webhook] challenge_submissions link warning:', subErr.message);
          }

          // 3. Create notification
          try {
            await supabase.from('notifications').insert({
              user_id: profileId,
              challenge_id: challengeId,
              type: 'payment_success',
              title: 'Challenge Entry Confirmed',
              message: `Your $5.00 entry pass for challenge has been verified (Transaction: ${transactionId}).`
            });
          } catch {}
        }
        break;
      }

      default:
        console.log(`[Paddle Webhook] Safely ignored event: ${eventType}`);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true }));
  } catch (err: any) {
    console.error('[Paddle Webhook] Handler error:', err.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error processing webhook' }));
  }
}
