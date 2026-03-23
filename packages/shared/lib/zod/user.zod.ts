import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  username: z.string().min(5).max(25).optional(),
});
