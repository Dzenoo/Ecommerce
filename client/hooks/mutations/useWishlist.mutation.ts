import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  addToWishlist,
  removeFromWishlist,
} from '@/lib/actions/wishlist.actions';

import { useToast } from '../core/use-toast';

enum WishlistMutationType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

type WishlistMutationPayload =
  | {
      type: WishlistMutationType.ADD;
      productId: string;
    }
  | {
      type: WishlistMutationType.REMOVE;
      productId: string;
    };

const useWishlistMutation = (
  options?: Omit<
    UseMutationOptions<any, any, WishlistMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: WishlistMutationPayload) => {
    switch (payload.type) {
      case WishlistMutationType.ADD:
        return addToWishlist(payload.productId);
      case WishlistMutationType.REMOVE:
        return removeFromWishlist(payload.productId);
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

export { useWishlistMutation, WishlistMutationType };
