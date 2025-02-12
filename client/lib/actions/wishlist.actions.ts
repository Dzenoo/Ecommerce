import qs from 'qs';

import { GetWishlistDto, IWishlist } from '@/types/wishlist.types';

import { getApiHandler, patchApiHandler, postApiHandler } from '../api';

export const addToWishlist = async (
  productId: string,
): Promise<ServerResponse> => {
  return await postApiHandler(`wishlist/add/${productId}`, {});
};

export const removeFromWishlist = async (
  productId: string,
): Promise<
  ServerResponse<{
    wishlist: IWishlist;
  }>
> => {
  return await patchApiHandler(`wishlist/remove/${productId}`, {});
};

export const getWishlist = async (
  query: GetWishlistDto,
): Promise<
  ServerResponse<{
    wishlist: IWishlist;
    totalProducts: number;
  }>
> => {
  const queryString = qs.stringify(query, { skipNulls: true });
  return await getApiHandler(`wishlist?${queryString}`);
};
