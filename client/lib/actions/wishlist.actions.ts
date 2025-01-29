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
  return await getApiHandler(
    `wishlist?page=${query.page}&limit=${query.limit}`,
  );
};
