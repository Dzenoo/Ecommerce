export type CreateCouponDto = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: string;
  maxUsage?: number;
  active?: boolean;
  minPurchaseAmount?: number;
  userLimit?: string[];
};
