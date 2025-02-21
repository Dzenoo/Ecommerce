import { createGenericQueryHook } from './createGenericQueryHook';
import { GetProductsDto } from '@/types';
import { getAllProducts, getOneProduct } from '@/lib/actions/product.actions';

const ProductQueryFunctions = {
  GET_ALL: (params: GetProductsDto) => getAllProducts(params),
  GET_ONE: (params: { productId: string }) => getOneProduct(params.productId),
} as const;

enum ProductQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useProductQuery = createGenericQueryHook(
  'products',
  ProductQueryFunctions,
);

export { useProductQuery, ProductQueryType };
