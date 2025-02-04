import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/lib/actions/auth.actions';

const useCurrentUser = () => {
  return useQuery({
    queryFn: async () => {
      const user = await getCurrentUser();
      return user ?? null;
    },
    queryKey: ['currentUser'],
    retry: false,
  });
};

export { useCurrentUser };
