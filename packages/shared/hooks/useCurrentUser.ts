import { useAuth } from '@clerk/nextjs';
import { useUserQuery, UserQueryType } from './queries/useUser.query';

export function useCurrentUser() {
  const { isSignedIn, isLoaded } = useAuth();

  const { data, isLoading } = useUserQuery(
    { type: UserQueryType.GET_CURRENT_USER },
    { enabled: isLoaded && !!isSignedIn },
  );

  return {
    user: data?.user ?? null,
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded || isLoading,
  };
}
