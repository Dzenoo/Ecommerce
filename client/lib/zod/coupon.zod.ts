import { z } from 'zod';

export const BaseCouponSchema = z.object({
  code: z.string().min(5).max(10).nonempty(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z
    .number({
      invalid_type_error: 'Discount value must be a number',
    })
    .positive('Discount value must be a positive number'),
  expirationDate: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Expiration date must be in the future',
  }),
  maxUsage: z.number().optional(),
  minPurchaseAmount: z.number().optional(),
});

export const CreateCouponSchema = BaseCouponSchema.superRefine((data, ctx) => {
  const { discountType, discountValue } = data;

  if (
    discountType === 'percentage' &&
    (discountValue < 0 || discountValue > 100)
  ) {
    ctx.addIssue({
      path: ['discountValue'],
      code: z.ZodIssueCode.custom,
      message: 'Percentage discount must be between 0 and 100',
    });
  } else if (
    discountType === 'fixed' &&
    (discountValue < 1 || discountValue > 1000)
  ) {
    ctx.addIssue({
      path: ['discountValue'],
      code: z.ZodIssueCode.custom,
      message: 'Fixed discount must be between 1 and 1000',
    });
  }
});

export const UpdateCouponSchema = BaseCouponSchema.partial().superRefine(
  (data, ctx) => {
    const { discountType, discountValue } = data;

    if (discountType && discountValue !== undefined) {
      if (
        discountType === 'percentage' &&
        (discountValue < 0 || discountValue > 100)
      ) {
        ctx.addIssue({
          path: ['discountValue'],
          code: z.ZodIssueCode.custom,
          message: 'Percentage discount must be between 0 and 100',
        });
      } else if (
        discountType === 'fixed' &&
        (discountValue < 1 || discountValue > 1000)
      ) {
        ctx.addIssue({
          path: ['discountValue'],
          code: z.ZodIssueCode.custom,
          message: 'Fixed discount must be between 1 and 1000',
        });
      }
    }
  },
);
export const ApplyCouponSchema = z.object({
  couponCode: z.string().min(5).max(10).nonempty(),
});
