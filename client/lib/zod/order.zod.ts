import { z } from 'zod';

import { CreateAddressSchema } from './address.zod';

export const CreateOrderSchema = CreateAddressSchema.pick({
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
});
// .merge(
//   z.object({
//     first_name: z
//       .string()
//       .min(2, { message: 'First Name must be at least 2 characters long' })
//       .max(15, { message: 'First Name must be at most 15 characters long' })
//       .regex(
//         /^[A-Z][a-zA-Z\s]*$/,
//         'First name must start with an uppercase letter',
//       )
//       .transform((value) => sanitizeInput(value)),

//     last_name: z
//       .string()
//       .min(2, { message: 'Last Name must be at least 2 characters long' })
//       .max(15, { message: 'Last Name must be at most 15 characters long' })
//       .regex(
//         /^[A-Z][a-zA-Z\s]*$/,
//         'Last name must start with an uppercase letter',
//       )
//       .transform((value) => sanitizeInput(value)),
//   }),
// );

export const UpdateOrderSchema = z.object({
  status: z.enum([
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]),
});
