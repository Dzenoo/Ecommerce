import { createGenericQueryHook } from './createGenericQueryHook';
import { GetOrdersDto } from '@/types';
import {
  getOrdersByUser,
  getOrders,
  getOrder,
} from '@/lib/actions/order.actions';

const OrderQueryFunctions = {
  GET_BY_USER: (params: { query: GetOrdersDto }) =>
    getOrdersByUser(params.query),
  GET_ALL: (params: { query: GetOrdersDto }) => getOrders(params.query),
  GET_ONE: (params: { orderId: string }) => getOrder(params.orderId),
} as const;

enum OrderQueryType {
  GET_BY_USER = 'GET_BY_USER',
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useOrderQuery = createGenericQueryHook('orders', OrderQueryFunctions);

export { useOrderQuery, OrderQueryType };
