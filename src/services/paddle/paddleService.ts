import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { RANKLANCR_PADDLE_PRODUCTS } from '../../config/paddleProducts';

let paddleInstance: Paddle | null = null;

// Read Paddle Environment & Client Token safely from environment
export const PADDLE_ENV = (import.meta as any).env?.VITE_PADDLE_ENV || 'sandbox';
export const PADDLE_CLIENT_TOKEN = (import.meta as any).env?.VITE_PADDLE_CLIENT_TOKEN || 'test_52827333b4ae539266f310cdd8d';

/**
 * Initialize or return singleton instance of Paddle.js
 */
export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    paddleInstance = await initializePaddle({
      environment: PADDLE_ENV === 'production' ? 'production' : 'sandbox',
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          console.log('[Paddle Checkout Completed]', event.data);
        }
      }
    }) || null;

    return paddleInstance;
  } catch (err) {
    console.error('Failed to initialize Paddle.js:', err);
    return null;
  }
}

/**
 * Fetch localized country price previews directly from Paddle PricePreview API
 */
export async function getLocalizedPricePreviews(priceIds: string[]): Promise<Record<string, string>> {
  const paddle = await getPaddle();
  if (!paddle) return {};

  try {
    const preview = await paddle.PricePreview({
      items: priceIds.map(priceId => ({ priceId, quantity: 1 }))
    });

    const pricesMap: Record<string, string> = {};
    if (preview && preview.data && preview.data.details && preview.data.details.lineItems) {
      preview.data.details.lineItems.forEach((item: any) => {
        if (item.price && item.price.id && item.formattedTotals && item.formattedTotals.total) {
          pricesMap[item.price.id] = item.formattedTotals.total;
        }
      });
    }
    return pricesMap;
  } catch (err) {
    console.warn('Paddle.PricePreview warning (fallback to defaults):', err);
    return {};
  }
}

/**
 * Open Checkout for Challenge Entry or Sponsorship (Configured for Lemon Squeezy Verification)
 */
export async function openRankLancrCheckout(options: {
  priceId: string;
  customerEmail?: string;
  customData?: Record<string, any>;
  successUrl?: string;
}) {
  // During Lemon Squeezy store verification, prevent Paddle overlay from opening
  const LEMON_STORE_URL = 'https://ranklancr.lemonsqueezy.com';
  
  console.log('[Checkout Requested]', options);
  
  // Inform user that checkout is currently undergoing Lemon Squeezy store activation
  const message = 'Payment gateway is currently undergoing activation with Lemon Squeezy. Please check back shortly once review completes.';
  
  if (typeof window !== 'undefined') {
    // Check if custom lemon squeezy URL is available or notify user
    const hasLemonCheckout = false; // Set to true once Lemon Squeezy product URL is added
    if (hasLemonCheckout) {
      window.location.href = `${LEMON_STORE_URL}`;
    } else {
      alert(message);
    }
  }
}

/**
 * Mint and redirect to Paddle-hosted Customer Portal
 */
export async function openCustomerPortal(userId?: string, email?: string) {
  try {
    const res = await fetch('/api/paddle-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email })
    });

    const data = await res.json();
    if (!res.ok || data.error || !data.url) {
      throw new Error(data.error || 'Failed to open customer portal');
    }

    // Redirect to Paddle Customer Portal
    window.location.href = data.url;
  } catch (err: any) {
    console.error('Customer Portal Error:', err);
    throw err;
  }
}
