import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  cancelOrder,
  createOrder,
  updateOrderStatus,
} from '@/lib/actions/order.actions';

import { CreateOrderDto, UpdateOrderDto } from '@/types';

enum OrderMutationType {
  CREATE = 'CREATE',
  CANCEL = 'CANCEL',
  UPDATE = 'UPDATE',
}

type OrderMutationPayload =
  | {
      type: OrderMutationType.CREATE;
      data: CreateOrderDto;
    }
  | {
      type: OrderMutationType.UPDATE;
      data: UpdateOrderDto;
      orderId: string;
    }
  | {
      type: OrderMutationType.CANCEL;
      orderId: string;
    };

const useOrderMutation = (
  options?: Omit<
    UseMutationOptions<any, any, OrderMutationPayload>,
    'mutationFn'
  >,
) => {
  const mutationFn = (payload: OrderMutationPayload) => {
    switch (payload.type) {
      case OrderMutationType.CREATE:
        return createOrder(payload.data);
      case OrderMutationType.UPDATE:
        return updateOrderStatus(payload.data, payload.orderId);
      case OrderMutationType.CANCEL:
        return cancelOrder(payload.orderId);
      default:
        throw new Error('Invalid mutation type');
    }
  };

  const mutation = useMutation({
    mutationFn,
    ...options,
  });

  return mutation;
};

export { useOrderMutation, OrderMutationType };
