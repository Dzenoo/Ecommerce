import * as z from 'zod';

export const CreateProductSchema = z.object({
  name: z
    .string()
    .nonempty()
    .min(2, 'Minimum 2 characters')
    .max(25, 'Maximum 25 characters'),

  price: z
    .number()
    .positive()
    .min(0, "Price can't be negative")
    .max(100000, 'Maximum 100000'),

  description: z
    .string()
    .nonempty()
    .min(10, 'Minimum 10 characters')
    .max(1000, 'Maximum 1000 characters'),

  stock: z.number().min(0).optional(),

  discount: z.number().min(0).max(100).optional(),

  category: z.string().nonempty(),

  attributes: z.any(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
