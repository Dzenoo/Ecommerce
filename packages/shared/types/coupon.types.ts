export type CreateCouponDto = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: Date;
  maxUsage?: number;
  maxUsagePerUser?: number;
  active?: boolean;
  minPurchaseAmount?: number;
};

export interface ICoupon {
  _id: string;
  couponNumber: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: Date;
  maxUsage: number;
  maxUsagePerUser: number;
  usageCount: number;
  active: boolean;
  minPurchaseAmount: number;
  usedBy: { userId: string; count: number }[];
  createdAt: Date;
  updatedAt: Date;
}
