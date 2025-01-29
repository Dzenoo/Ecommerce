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

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: Date;
  maxUsage: number;
  usageCount: number;
  active: boolean;
  minPurchaseAmount: number;
  userLimit: string[];
  createdAt: Date;
  updatedAt: Date;
}
