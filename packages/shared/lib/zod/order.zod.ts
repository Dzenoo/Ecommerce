import { z } from 'zod';

import { CreateAddressSchema } from './address.zod';

export const CreateOrderSchema = CreateAddressSchema.pick({
  fullName: true,
  phoneNumber: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
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
