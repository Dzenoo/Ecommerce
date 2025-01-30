import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createReview,
  updateReview,
  deleteReview,
} from '@/lib/actions/review.actions';

import { CreateReviewDto } from '@/types';

import { useToast } from '../core/use-toast';

enum ReviewMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type ReviewMutationPayload =
  | {
      type: ReviewMutationType.CREATE;
      data: CreateReviewDto;
      productId: string;
    }
  | {
      type: ReviewMutationType.UPDATE;
      data: Partial<CreateReviewDto>;
      reviewId: string;
    }
  | {
      type: ReviewMutationType.DELETE;
      reviewId: string;
      productId: string;
    };

const useReviewMutation = (
  options?: Omit<
    UseMutationOptions<any, any, ReviewMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: ReviewMutationPayload) => {
    switch (payload.type) {
      case ReviewMutationType.CREATE:
        return createReview(payload.data, payload.productId);
      case ReviewMutationType.UPDATE:
        return updateReview(payload.data, payload.reviewId);
      case ReviewMutationType.DELETE:
        return deleteReview(payload.reviewId, payload.productId);
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

export { useReviewMutation, ReviewMutationType };
