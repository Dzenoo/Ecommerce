import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getAllProducts, getOneProduct } from '@/lib/actions/product.actions';

import { GetProductsDto } from '@/types';

enum ProductQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

type ProductQueryPayload =
  | {
      type: ProductQueryType.GET_ALL;
      query: GetProductsDto;
    }
  | {
      type: ProductQueryType.GET_ONE;
      productId: string;
    };

const useProductQuery = (
  payload: ProductQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['products', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, ProductQueryPayload];

      switch (payload.type) {
        case ProductQueryType.GET_ALL:
          return getAllProducts(payload.query);
        case ProductQueryType.GET_ONE:
          return getOneProduct(payload.productId);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useProductQuery, ProductQueryType };
