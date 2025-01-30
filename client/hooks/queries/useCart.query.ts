import { useQuery } from '@tanstack/react-query';

import { getCart } from '@/lib/actions/cart.actions';

const useCartQuery = () => {
  return useQuery({
    queryFn: () => {
      return getCart();
    },
    queryKey: ['cart'],
  });
};

export { useCartQuery };
