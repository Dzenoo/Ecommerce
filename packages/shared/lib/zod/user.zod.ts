import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  first_name: z.string().min(2).max(15).optional(),
  last_name: z.string().min(2).max(15).optional(),
});
