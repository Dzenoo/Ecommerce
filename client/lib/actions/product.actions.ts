import qs from 'qs';

import { CreateProductDto, GetProductsDto, IProduct } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createProduct = async (
  data: FormData,
): Promise<ServerResponse> => {
  return await postApiHandler('product/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = async (
  data: FormData,
  productId: string,
): Promise<ServerResponse> => {
  return await patchApiHandler(`product/update/${productId}`, data);
};

export const deleteProduct = async (
  productId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`product/delete/${productId}`);
};

export const getAllProducts = async (
  query: GetProductsDto,
): Promise<
  ServerResponse<{
    products: IProduct[];
    totalProducts: number;
  }>
> => {
  const queryString = qs.stringify(query, { skipNulls: true });

  return await getApiHandler(`product/all?${queryString}`, {
    withCredentials: false,
  });
};

export const getOneProduct = async (
  productId: string,
): Promise<
  ServerResponse<{
    product: IProduct;
  }>
> => {
  return await getApiHandler(`product/${productId}`, {
    withCredentials: false,
  });
};
