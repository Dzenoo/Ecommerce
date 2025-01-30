import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from '@/lib/actions/coupon.actions';

import { CreateCouponDto } from '@/types';

import { useToast } from '../core/use-toast';

enum CouponMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPLY = 'APPLY',
}

type CouponMutationPayload =
  | {
      type: CouponMutationType.CREATE;
      data: CreateCouponDto;
    }
  | {
      type: CouponMutationType.UPDATE;
      couponId: string;
      data: Partial<CreateCouponDto>;
    }
  | {
      type: CouponMutationType.DELETE;
      couponId: string;
    }
  | {
      type: CouponMutationType.APPLY;
      cartId: string;
      data: { couponCode: string };
    };

const useCouponMutation = (
  options?: Omit<
    UseMutationOptions<any, any, CouponMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: CouponMutationPayload) => {
    switch (payload.type) {
      case CouponMutationType.CREATE:
        return createCoupon(payload.data);
      case CouponMutationType.UPDATE:
        return updateCoupon(payload.data, payload.couponId);
      case CouponMutationType.DELETE:
        return deleteCoupon(payload.couponId);
      case CouponMutationType.APPLY:
        return applyCoupon(payload.cartId, payload.data);
      default:
        throw new Error('Invalid mutation type');
    }
  };

  const mutation = useMutation({
    mutationFn,
    onError: (error: any) => {
      toast({ title: 'Error', description: error?.response?.data?.message });
    },
    ...options,
  });

  return mutation;
};

export { useCouponMutation, CouponMutationType };
