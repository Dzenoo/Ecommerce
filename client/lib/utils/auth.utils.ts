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

export const getRoleSpecificData = (isAdmin: boolean) => {
  return {
    actions: isAdmin ? AdminNavbarActions : UserNavbarActions,
  };
};
