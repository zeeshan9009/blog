/**
 * Official Paddle Product & Price IDs for RankLancr
 * Dynamically switches between Sandbox and Production based on VITE_PADDLE_ENV
 */

const IS_PRODUCTION = (import.meta as any).env?.VITE_PADDLE_ENV === 'production';

export const RANKLANCR_PADDLE_PRODUCTS = {
  // 1. Fixed $5.00 Challenge Entry Fee
  challengeEntry: {
    name: 'Challenge Entry Fee',
    productId: IS_PRODUCTION ? 'pro_01m0w8w6njv8abx6b661yvb6bb' : 'pro_01m0w4mbmr8amfdqke5xfqy463',
    priceId: IS_PRODUCTION ? 'pri_01m0w8w7399548kt8smrdjd6cy' : 'pri_01m0w4mc22szw3fwbpt3e4f131',
    amountUsd: 5.00,
    description: 'Digital submission right to enter one skill challenge arena.'
  },

  // 2. Fixed $50.00 Bronze Sponsorship
  bronzeSponsorship: {
    name: 'Bronze Brand Sponsorship',
    productId: IS_PRODUCTION ? 'pro_01m0w8w7js3dvzgpc5f1xg97gp' : 'pro_01m0w4mcgbx6fncz8n6hyj8f60',
    priceId: IS_PRODUCTION ? 'pri_01m0w8w8qrat368zwfnqfseqbx' : 'pri_01m0w4mcwys01wz7e5b9hwmr6t',
    amountUsd: 50.00,
    description: 'Instant brand banner placement inside the challenge arena.'
  },

  // 3. Fixed $150.00 Silver Sponsorship
  silverSponsorship: {
    name: 'Silver Brand Sponsorship',
    productId: IS_PRODUCTION ? 'pro_01m0w8w97ej3ycwxqkea0ymm4g' : 'pro_01m0w4mdbjxk9e788wnyhqhy89',
    priceId: IS_PRODUCTION ? 'pri_01m0w8w9mysbk78szep1w3x1dh' : 'pri_01m0w4mdqmted1qqzfy5110ph3',
    amountUsd: 150.00,
    description: 'Homepage challenge card logo and arena banner placement.'
  },

  // 4. Gold Flagship Outbid Auction ($100.00 Starting Floor)
  goldSponsorship: {
    name: 'Gold Flagship Co-Sponsorship',
    productId: IS_PRODUCTION ? 'pro_01m0w8wa4cbnydc6s3fb0nwgw2' : 'pro_01m0w4me5m1bwgwg4dyf6r54q7',
    priceId: IS_PRODUCTION ? 'pri_01m0w8wahvkfv4svw39nw1bn6e' : 'pri_01m0w4mehnjazf0vzvjees36rt',
    amountUsd: 100.00,
    description: 'Exclusive 48h co-branded Top Developer Rail showcase placement.'
  }
};
