import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getProfile } from '@/lib/actions/user.actions';

enum UserQueryType {
  GET_PROFILE = 'GET_PROFILE',
}

type UserQueryPayload = {
  type: UserQueryType.GET_PROFILE;
};

const useUserQuery = (
  payload: UserQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['users', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, UserQueryPayload];

      switch (payload.type) {
        case UserQueryType.GET_PROFILE:
          return getProfile();
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useUserQuery, UserQueryType };
