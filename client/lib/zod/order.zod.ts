import { z } from 'zod';

import { CreateAddressSchema } from './address.zod';

export const CreateOrderSchema = z.object({
  shippingAddress: CreateAddressSchema,

  manualShippingAddress: CreateAddressSchema.optional(),
});

export const UpdateOrderSchema = z.object({
  status: z.enum([
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]),
});
