import * as z from 'zod';

export const CreateAddressSchema = z.object({
  addressLine1: z
    .string()
    .nonempty()
    .min(5, 'Minimum 5 characters')
    .max(100, 'Maximum 100 characters'),

  addressLine2: z
    .string()
    .min(5, 'Minimum 5 characters')
    .max(100, 'Maximum 100 characters')
    .optional(),

  city: z
    .string()
    .nonempty()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters'),

  state: z
    .string()
    .nonempty()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters'),

  postalCode: z
    .string()
    .nonempty()
    .min(5, 'Minimum 5 characters')
    .max(10, 'Maximum 10 characters'),

  country: z
    .string()
    .nonempty()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters'),

  isDefault: z.boolean().optional(),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();
