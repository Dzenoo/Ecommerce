import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),

  comment: z.string().optional(),
});

export const UpdateReviewSchema = CreateReviewSchema.partial();
