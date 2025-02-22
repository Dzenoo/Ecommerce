import { createGenericQueryHook } from './createGenericQueryHook';
import { GetProductsDto } from '@/types';
import { getReviews } from '@/lib/actions/review.actions';

const ReviewQueryFunctions = {
  GET_ALL: (params: { query: GetProductsDto; productId: string }) =>
    getReviews(params.query, params.productId),
} as const;

enum ReviewQueryType {
  GET_ALL = 'GET_ALL',
}

const useReviewQuery = createGenericQueryHook('reviews', ReviewQueryFunctions);

export { useReviewQuery, ReviewQueryType };
