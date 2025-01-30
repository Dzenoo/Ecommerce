import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  getOrders,
  getOrder,
  getOrdersByUser,
} from '@/lib/actions/order.actions';

import { GetOrdersDto } from '@/types';

enum OrderQueryType {
  GET_BY_USER = 'GET_BY_USER',
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

type OrderQueryPayload =
  | {
      type: OrderQueryType.GET_BY_USER;
      query: GetOrdersDto;
    }
  | {
      type: OrderQueryType.GET_ALL;
      query: GetOrdersDto;
    }
  | {
      type: OrderQueryType.GET_ONE;
      orderId: string;
    };

const useOrderQuery = (
  payload: OrderQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['orders', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, OrderQueryPayload];

      switch (payload.type) {
        case OrderQueryType.GET_BY_USER:
          return getOrdersByUser(payload.query);
        case OrderQueryType.GET_ALL:
          return getOrders(payload.query);
        case OrderQueryType.GET_ONE:
          return getOrder(payload.orderId);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useOrderQuery, OrderQueryType };
