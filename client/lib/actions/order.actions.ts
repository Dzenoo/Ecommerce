import qs from 'qs';

import { CreateOrderDto, GetOrdersDto, IOrder, UpdateOrderDto } from '@/types';

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
  let requestData;

  if (data.addressId) {
    requestData = { cartId: data.cartId, addressId: data.addressId };
  } else if (data.address) {
    requestData = { cartId: data.cartId, address: data.address };
  }

  return await postApiHandler('order/create', requestData);
};

export const getOrdersByUser = async (
  query: GetOrdersDto,
): Promise<
  ServerResponse<{
    orders: IOrder[];
  }>
> => {
  const queryString = qs.stringify(query, { skipNulls: true });
  return await getApiHandler(`order/user?${queryString}`);
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
  const queryString = qs.stringify(query, { skipNulls: true });
  return await getApiHandler(`order/all?${queryString}`);
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
  data: UpdateOrderDto,
  orderId: string,
): Promise<
  ServerResponse<{
    order: IOrder;
  }>
> => {
  return await patchApiHandler(`order/update/${orderId}`, data);
};
