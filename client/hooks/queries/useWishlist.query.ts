import { createGenericQueryHook } from './createGenericQueryHook';
import { GetWishlistDto } from '@/types';
import { getWishlist } from '@/lib/actions/wishlist.actions';

const WishlistQueryFunctions = {
  GET_WISHLIST: (params: { query: GetWishlistDto }) =>
    getWishlist(params.query),
} as const;

enum WishlistQueryType {
  GET_WISHLIST = 'GET_WISHLIST',
}

const useWishlistQuery = createGenericQueryHook(
  'wishlist',
  WishlistQueryFunctions,
);

export { useWishlistQuery, WishlistQueryType };
