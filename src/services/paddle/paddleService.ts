import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { RANKLANCR_PADDLE_PRODUCTS } from '../../config/paddleProducts';

let paddleInstance: Paddle | null = null;

// Read Paddle Environment & Client Token safely from environment
export const PADDLE_ENV = (import.meta as any).env?.VITE_PADDLE_ENV || 'sandbox';
export const PADDLE_CLIENT_TOKEN = (import.meta as any).env?.VITE_PADDLE_CLIENT_TOKEN || 'test_c77a942b083818e6e8e89547d04';

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
 * Open Paddle 1-Page Overlay Checkout for Challenge Entry or Sponsorship
 */
export async function openRankLancrCheckout(options: {
  priceId: string;
  customerEmail?: string;
  customData?: Record<string, any>;
  successUrl?: string;
}) {
  const paddle = await getPaddle();

  if (!paddle) {
    throw new Error('Paddle.js could not be initialized');
  }

  const successUrl = options.successUrl || `${window.location.origin}/welcome`;

  paddle.Checkout.open({
    settings: {
      displayMode: 'overlay',
      variant: 'one-page',
      theme: 'light',
      locale: 'en',
      successUrl
    },
    items: [
      { priceId: options.priceId, quantity: 1 }
    ],
    customer: options.customerEmail ? { email: options.customerEmail } : undefined,
    customData: options.customData || { platform: 'RankLancr' }
  });
}
