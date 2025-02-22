import { createGenericQueryHook } from './createGenericQueryHook';
import { getCoupons, getCoupon } from '@/lib/actions/coupon.actions';

const CouponQueryFunctions = {
  GET_ALL: (params: { query: {} }) => getCoupons(params.query),
  GET_ONE: (params: { couponId: string }) => getCoupon(params.couponId),
} as const;

enum CouponQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useCouponQuery = createGenericQueryHook('coupons', CouponQueryFunctions);

export { useCouponQuery, CouponQueryType };
