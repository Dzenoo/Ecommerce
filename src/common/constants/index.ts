import { CookieOptions } from 'express';

/**
 * Regular expression for validating strong passwords.
 * Requirements:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one numeric digit
 * - At least one special character (@, $, !, %, *, ?, &)
 * - Minimum length of 8 characters
 * Usage: Ensures passwords meet security requirements.
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Options for the cookie that stores the JWT.
 * @property {boolean} httpOnly - The cookie will be set with the `httpOnly` flag.
 * @property {boolean} secure - The cookie will be set with the `secure` flag.
 * @property {string} sameSite - The cookie will be set with the `sameSite` flag.
 * @property {number} maxAge - The maximum age of the cookie in milliseconds.
 */
export const cookieOptions: CookieOptions = {
  httpOnly: false, // Set to true in production
  secure: false, // Set to true in production
  //   sameSite: 'strict',
  maxAge: 3600000,
  path: '/',
};
