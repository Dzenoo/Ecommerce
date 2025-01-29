import { GetWishlistDto } from '@/types/wishlist.type';

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
    wishlist: any;
  }>
> => {
  return await patchApiHandler(`wishlist/remove/${productId}`, {});
};

export const getWishlist = async (
  query: GetWishlistDto,
): Promise<
  ServerResponse<{
    wishlist: any;
    totalProducts: number;
  }>
> => {
  return await getApiHandler(
    `wishlist?page=${query.page}&limit=${query.limit}`,
  );
};
