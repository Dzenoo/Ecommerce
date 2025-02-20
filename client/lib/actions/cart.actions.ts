import { AddItemToCartDto, ICart } from '@/types';

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
    cart: ICart;
  }>
> => {
  return await postApiHandler('cart/add', data);
};

export const removeItem = async (
  productId: string,
): Promise<ServerResponse<{ cart: ICart }>> => {
  return deleteApiHandler(`cart/remove/${productId}`);
};

export const updateItem = async (
  data: {
    action: 'increment' | 'decrement';
  },
  itemId: string,
): Promise<
  ServerResponse<{
    cart: ICart;
  }>
> => {
  return await patchApiHandler(`cart/update/${itemId}`, data);
};

export const getCart = async (): Promise<
  ServerResponse<{
    cart: ICart;
  }>
> => {
  return getApiHandler('cart/get');
};

export const clearCart = async (): Promise<ServerResponse> => {
  return deleteApiHandler('cart/clear');
};
