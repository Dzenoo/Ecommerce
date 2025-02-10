import { AdminNavbarActions, UserNavbarActions } from '@/constants';
import { jwtDecode } from 'jwt-decode';

/**
 * Decodes token of the user.
 * @param token - A token for decoding.
 * @returns An decoded token.
 */
export function decodeToken(token: string): any {
  return jwtDecode(token);
}

/**
 * Returns data specific to the user's role.
 * @param isAdmin - A boolean to check if the user is an admin.
 * @returns An object with actions specific to the user's role.
 */
export const getRoleSpecificData = (
  isAdmin: boolean,
): {
  actions: typeof AdminNavbarActions | typeof UserNavbarActions;
} => {
  return {
    actions: isAdmin ? AdminNavbarActions : UserNavbarActions,
  };
};

/**
 * Returns the user's role if the token is valid. Otherwise returns null.
 * @param token - A token to decode and check the role.
 * @returns The user's role if the token is valid, otherwise null.
 */
export const getValidUserRole = (token?: string) => {
  if (!token) return null;

  try {
    const payload = decodeToken(token);
    return payload?.role || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
