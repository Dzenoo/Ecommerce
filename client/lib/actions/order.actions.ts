import { CreateOrderDto, GetOrdersDto, IOrder } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createOrder = async (
  data: CreateOrderDto,
): Promise<
  ServerResponse<{
    order: IOrder;
  }>
> => {
  return await postApiHandler('order/create', data);
};

export const getOrdersByUser = async (
  query: GetOrdersDto,
): Promise<
  ServerResponse<{
    orders: IOrder[];
  }>
> => {
  return await getApiHandler(
    `order/user?page=${query.page}&limit=${query.limit}&sort=${query.sort}&status=${query.status}`,
  );
};

export const cancelOrder = async (
  orderId: string,
): Promise<
  ServerResponse<{
    order: IOrder;
  }>
> => {
  return await deleteApiHandler(`order/delete/${orderId}`);
};

export const getOrders = async (
  query: GetOrdersDto,
): Promise<
  ServerResponse<{
    orders: IOrder[];
    totalOrders: number;
  }>
> => {
  return await getApiHandler(
    `order/all?page=${query.page}&limit=${query.limit}&sort=${query.sort}&status=${query.status}`,
  );
};

export const getOrder = async (
  orderId: string,
): Promise<
  ServerResponse<{
    order: IOrder;
  }>
> => {
  return await getApiHandler(`order/${orderId}`);
};

export const updateOrderStatus = async (
  data: {},
  orderId: string,
): Promise<
  ServerResponse<{
    order: IOrder;
  }>
> => {
  return await patchApiHandler(`order/update/${orderId}`, data);
};
