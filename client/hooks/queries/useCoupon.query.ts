import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getCoupons, getCoupon } from '@/lib/actions/coupon.actions';

enum CouponQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

type CouponQueryPayload =
  | {
      type: CouponQueryType.GET_ALL;
      query?: {
        active?: boolean;
      };
    }
  | {
      type: CouponQueryType.GET_ONE;
      couponId: string;
    };

const useCouponQuery = (
  payload: CouponQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['coupons', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, CouponQueryPayload];

      switch (payload.type) {
        case CouponQueryType.GET_ALL:
          return getCoupons(payload.query);
        case CouponQueryType.GET_ONE:
          return getCoupon(payload.couponId);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useCouponQuery, CouponQueryType };
