export interface PaddlePlan {
  name: string;
  productId: string;
  monthlyPriceId: string;
  annualPriceId: string;
  monthlyUsd: number;
  annualUsd: number;
  trialDays: number;
}

export const PADDLE_PLANS: Record<'starter' | 'pro' | 'advanced', PaddlePlan> = {
  starter: {
    name: 'RankLancr Starter',
    productId: 'pro_01m0w4bb3rfv9b5m3wp5xbbbza',
    monthlyPriceId: 'pri_01m0w4bc26vp5yybw48hbnsfg7',
    annualPriceId: 'pri_01m0w4bdeqw52790rz7sr8te93',
    monthlyUsd: 10,
    annualUsd: 100,
    trialDays: 7
  },
  pro: {
    name: 'RankLancr Pro',
    productId: 'pro_01m0w4bgjfvsh82g64m89wfpb7',
    monthlyPriceId: 'pri_01m0w4bkga0nqj98w90rbbsk8f',
    annualPriceId: 'pri_01m0w4bn0fc1bv768p0rzke6h5',
    monthlyUsd: 40,
    annualUsd: 400,
    trialDays: 7
  },
  advanced: {
    name: 'RankLancr Advanced',
    productId: 'pro_01m0w4bpvqn11svcgr1cy1mjz2',
    monthlyPriceId: 'pri_01m0w4brbyxyaz63kg4dkcgjwr',
    annualPriceId: 'pri_01m0w4bt9r0h5070hs1x6qcdfw',
    monthlyUsd: 120,
    annualUsd: 1200,
    trialDays: 7
  }
};
