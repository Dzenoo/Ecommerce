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
  return await postApiHandler('product/create', data);
};

export const updateProduct = async (
  data: Partial<CreateProductDto>,
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
  return await getApiHandler(
    `product/all?page=${query.page}&limit=${query.limit}&search=${query.search}&sort=${query.sort}&category=${query.category}&attributes=${query.attributes}&price[min]=${query.price?.min}&price[max]=${query.price?.max}`,
    { withCredentials: false },
  );
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
