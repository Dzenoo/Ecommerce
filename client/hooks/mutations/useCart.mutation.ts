import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '@/lib/actions/cart.actions';

import { AddItemToCartDto } from '@/types';

import { useToast } from '../core/use-toast';

enum CartMutationType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  CLEAR = 'CLEAR',
}

type CartMutationPayload =
  | {
      type: CartMutationType.ADD;
      data: AddItemToCartDto;
    }
  | {
      type: CartMutationType.UPDATE;
      data: {
        action: 'increment' | 'decrement';
      };
      itemId: string;
    }
  | {
      type: CartMutationType.REMOVE;
      productId: string;
    }
  | {
      type: CartMutationType.CLEAR;
    };

const useCartMutation = (
  options?: Omit<
    UseMutationOptions<any, any, CartMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: CartMutationPayload) => {
    switch (payload.type) {
      case CartMutationType.ADD:
        return addItem(payload.data);
      case CartMutationType.UPDATE:
        return updateItem(payload.data, payload.itemId);
      case CartMutationType.REMOVE:
        return removeItem(payload.productId);
      case CartMutationType.CLEAR:
        return clearCart();
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

export { useCartMutation, CartMutationType };
