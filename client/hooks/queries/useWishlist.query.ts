import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getWishlist } from '@/lib/actions/wishlist.actions';

import { GetWishlistDto } from '@/types';

enum WishlistQueryType {
  GET_WISHLIST = 'GET_WISHLIST',
}

type WishlistQueryPayload = {
  type: WishlistQueryType.GET_WISHLIST;
  query: GetWishlistDto;
};

const useWishlistQuery = (
  payload: WishlistQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['wishlist', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, WishlistQueryPayload];

      switch (payload.type) {
        case WishlistQueryType.GET_WISHLIST:
          return getWishlist(payload.query);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useWishlistQuery, WishlistQueryType };
