import { createGenericQueryHook } from './createGenericQueryHook';
import { getProfile } from '@/lib/actions/user.actions';

const UserQueryFunctions = {
  GET_PROFILE: () => getProfile(),
} as const;

enum UserQueryType {
  GET_PROFILE = 'GET_PROFILE',
}

const useUserQuery = createGenericQueryHook('user', UserQueryFunctions);

export { useUserQuery, UserQueryType };
