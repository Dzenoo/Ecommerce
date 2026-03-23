import { createGenericQueryHook } from './createGenericQueryHook';
import { getCurrentUser } from '../../lib/actions/user.actions';

const UserQueryFunctions = {
  GET_CURRENT_USER: () => getCurrentUser(),
} as const;

enum UserQueryType {
  GET_CURRENT_USER = 'GET_CURRENT_USER',
}

const useUserQuery = createGenericQueryHook('user', UserQueryFunctions);

export { useUserQuery, UserQueryType };
