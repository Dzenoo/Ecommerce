import { AddItemToCartDto } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const addItem = async (
  data: AddItemToCartDto,
): Promise<
  ServerResponse<{
    cart: any;
  }>
> => {
  return await postApiHandler('cart/add', data);
};

export const removeItem = async (
  productId: string,
): Promise<ServerResponse<{ cart: any }>> => {
  return deleteApiHandler(`cart/remove/${productId}`);
};

export const updateItem = async (
  data: {
    quantity: number;
    action: 'increment' | 'decrement';
  },
  productId: string,
): Promise<
  ServerResponse<{
    cart: any;
  }>
> => {
  return await patchApiHandler(`cart/update/${productId}`, data);
};

export const getCart = async (): Promise<
  ServerResponse<{
    cart: any;
  }>
> => {
  return getApiHandler('cart/get');
};

export const clearCart = async (): Promise<ServerResponse> => {
  return deleteApiHandler('cart/clear');
};
