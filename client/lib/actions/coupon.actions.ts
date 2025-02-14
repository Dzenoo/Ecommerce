import qs from 'qs';

import { CreateCouponDto, ICoupon } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createCoupon = async (
  data: CreateCouponDto,
): Promise<ServerResponse<{ coupon: ICoupon }>> => {
  return await postApiHandler('coupon/create', data);
};

export const updateCoupon = async (
  data: Partial<CreateCouponDto>,
  couponId: string,
): Promise<ServerResponse<{ coupon: ICoupon }>> => {
  return await patchApiHandler(`coupon/update/${couponId}`, data);
};

export const deleteCoupon = async (
  couponId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`coupon/delete/${couponId}`);
};

export const getCoupons = async (query?: {}): Promise<
  ServerResponse<{
    coupons: ICoupon;
  }>
> => {
  const queryString = qs.stringify(query, { skipNulls: true });
  return getApiHandler(`coupon/all?${queryString}`);
};

export const getCoupon = async (
  couponId: string,
): Promise<
  ServerResponse<{
    coupon: ICoupon;
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
