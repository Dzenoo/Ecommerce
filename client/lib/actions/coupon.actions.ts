import { CreateCouponDto } from '@/types';

import { deleteApiHandler, getApiHandler, postApiHandler } from '../api';

export const createCoupon = async (
  data: CreateCouponDto,
): Promise<ServerResponse<{ coupon: any }>> => {
  return await postApiHandler('coupon/create', data);
};

export const updateCoupon = async (
  data: Partial<CreateCouponDto>,
  couponId: string,
): Promise<ServerResponse<{ coupon: any }>> => {
  return await postApiHandler(`coupon/update/${couponId}`, data);
};

export const deleteCoupon = async (
  couponId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`coupon/delete/${couponId}`);
};

export const getCoupons = async (query: {
  active?: boolean;
}): Promise<
  ServerResponse<{
    coupons: any;
  }>
> => {
  return getApiHandler(`coupon/all?active=${query.active}`);
};

export const getCoupon = async (
  couponId: string,
): Promise<
  ServerResponse<{
    coupon: any;
  }>
> => {
  return getApiHandler(`coupon/${couponId}`);
};

export const applyCoupon = async (
  cartId: string,
  data: { couponCode: string },
): Promise<ServerResponse> => {
  return await postApiHandler(`coupon/apply/${cartId}`, data);
};
