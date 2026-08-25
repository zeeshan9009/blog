import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export const PADDLE_ENV = (import.meta as any).env?.VITE_PADDLE_ENV || 'sandbox';
export const PADDLE_CLIENT_TOKEN = (import.meta as any).env?.VITE_PADDLE_CLIENT_TOKEN || 'test_c77a942b083818e6e8e89547d04';

/**
 * Initialize or get cached Paddle instance
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
        console.log('[Paddle Event]', event);
      }
    }) || null;

    return paddleInstance;
  } catch (err) {
    console.error('Failed to initialize Paddle.js:', err);
    return null;
  }
}

/**
 * Open Paddle Overlay Checkout with items or custom price
 */
export async function openPaddleCheckout(options: {
  priceId?: string;
  items?: Array<{ priceId: string; quantity: number }>;
  customerEmail?: string;
  customData?: Record<string, any>;
  successUrl?: string;
}) {
  const paddle = await getPaddle();

  if (!paddle) {
    throw new Error('Paddle.js is not loaded yet');
  }

  const items = options.items || (options.priceId ? [{ priceId: options.priceId, quantity: 1 }] : []);

  paddle.Checkout.open({
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      locale: 'en',
      successUrl: options.successUrl || `${window.location.origin}/dashboard`
    },
    items,
    customer: options.customerEmail ? { email: options.customerEmail } : undefined,
    customData: options.customData
  });
}
