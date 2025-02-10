import { z } from 'zod';

export const CreateCouponSchema = z.object({
  code: z.string().nonempty(),

  discountType: z.enum(['percentage', 'fixed']),

  discountValue: z.number().positive().min(0).max(100),

  expirationDate: z.date(),

  maxUsage: z.number().optional(),

  active: z.boolean().optional(),

  minPurchaseAmount: z.number().optional(),

  userLimit: z.array(z.string()).optional(),
});

export const UpdateCouponSchema = CreateCouponSchema.partial();

export const ApplyCouponSchema = z.object({
  couponCode: z.string().nonempty(),
});
