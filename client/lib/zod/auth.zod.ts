import zod from 'zod';

import { sanitizeInput } from '@/lib/utils';
import { PASSWORD_REGEX } from '@/constants';

export const SignupSchema = zod.object({
  first_name: zod
    .string()
    .min(2, { message: 'First Name must be at least 2 characters long' })
    .max(15, { message: 'First Name must be at most 15 characters long' })
    .regex(
      /^[A-Z][a-zA-Z\s]*$/,
      'First name must start with an uppercase letter',
    )
    .transform((value) => sanitizeInput(value)),
  last_name: zod
    .string()
    .min(2, { message: 'Last Name must be at least 2 characters long' })
    .max(15, { message: 'Last Name must be at most 15 characters long' })
    .regex(
      /^[A-Z][a-zA-Z\s]*$/,
      'Last name must start with an uppercase letter',
    )
    .transform((value) => sanitizeInput(value)),
  email: zod
    .string()
    .min(5, { message: 'Email must be at least 5 characters long' })
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
