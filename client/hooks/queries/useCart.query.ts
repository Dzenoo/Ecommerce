import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getCart } from '@/lib/actions/cart.actions';

enum CartQueryType {
  GET_CART = 'GET_CART',
}

type CartQueryPayload = {
  type: CartQueryType.GET_CART;
};

const useCartQuery = (
  payload: CartQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['cart', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, CartQueryPayload];

      switch (payload.type) {
        case CartQueryType.GET_CART:
          return getCart();
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useCartQuery, CartQueryType };
