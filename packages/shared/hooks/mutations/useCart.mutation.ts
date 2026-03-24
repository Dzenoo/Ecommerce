import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import {
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../../lib/actions/cart.actions';

import { AddItemToCartDto } from '../../types';

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
      itemId: string;
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
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const mutationFn = (payload: CartMutationPayload) => {
    switch (payload.type) {
      case CartMutationType.ADD:
        return addItem(payload.data);
      case CartMutationType.UPDATE:
        return updateItem(payload.data, payload.itemId);
      case CartMutationType.REMOVE:
        return removeItem(payload.itemId);
      case CartMutationType.CLEAR:
        return clearCart();
      default:
        throw new Error('Invalid mutation type');
    }
  };

  const mutation = useMutation({
    mutationFn,
    ...restOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: any, variables, onMutateResult, context) => {
      toast({ title: 'Error', description: error?.response?.data?.message });
      onError?.(error, variables, onMutateResult, context);
    },
  });

  return mutation;
};

export { useCartMutation, CartMutationType };
