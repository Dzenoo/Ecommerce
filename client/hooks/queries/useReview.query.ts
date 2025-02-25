import { createGenericQueryHook } from './createGenericQueryHook';
import { GetReviewsDto } from '@/types';
import { getReviews } from '@/lib/actions/review.actions';

const ReviewQueryFunctions = {
  GET_ALL: (params: { query: GetReviewsDto; productId: string }) =>
    getReviews(params.query, params.productId),
} as const;

enum ReviewQueryType {
  GET_ALL = 'GET_ALL',
}

const useReviewQuery = createGenericQueryHook('reviews', ReviewQueryFunctions);

export { useReviewQuery, ReviewQueryType };
