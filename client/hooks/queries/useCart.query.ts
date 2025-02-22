import { createGenericQueryHook } from './createGenericQueryHook';
import { getCart } from '@/lib/actions/cart.actions';

const CartQueryFunctions = {
  GET_CART: () => getCart(),
} as const;

enum CartQueryType {
  GET_CART = 'GET_CART',
}

const useCartQuery = createGenericQueryHook('cart', CartQueryFunctions);

export { useCartQuery, CartQueryType };
