import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
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

/**
 * Options for Multer, a middleware for handling multipart/form-data requests.
 * @see https://github.com/expressjs/multer
 */
export const multerOptions: MulterOptions = {
  /**
   * The maximum file size for each uploaded file.
   * @see https://github.com/expressjs/multer#limits
   */
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file

  /**
   * A function to filter out files that are not images.
   * @param {Request} req - The ExpressJS request object.
   * @param {File} file - The file being uploaded.
   * @param {Function} callback - The callback function to call with the result.
   * @see https://github.com/expressjs/multer#filefilter
   */
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true); // Accept the file
    } else {
      callback(new Error('Only image files are allowed'), false); // Reject the file
    }
  },
};
