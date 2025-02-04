import zod from 'zod';

import { sanitizeInput } from '@/lib/utils';
import { PASSWORD_REGEX } from '@/constants';

export const LoginSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email must not be empty' })
    .max(255, { message: 'Email must be at most 255 characters long' })
    .email()
    .transform((value) => sanitizeInput(value)),
  password: zod
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(
      PASSWORD_REGEX,
      'Password must be at least 8 characters long, start with uppercase letter and contain symbols and numbers',
    )
    .transform((value) => sanitizeInput(value)),
});
