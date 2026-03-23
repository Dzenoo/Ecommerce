import { z } from 'zod';

export const AddItemSchema = z.object({
  quantity: z.number().positive().min(1).max(100),
});
