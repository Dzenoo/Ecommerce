import { createGenericQueryHook } from './createGenericQueryHook';
import { GetReviewsDto } from '@/types';
import { getReviews, getReviewsByUser } from '@/lib/actions/review.actions';

const ReviewQueryFunctions = {
  GET_ALL: (params: { query: GetReviewsDto; productId: string }) =>
    getReviews(params.query, params.productId),
  GET_ALL_BY_USER: (params: { query: GetReviewsDto }) =>
    getReviewsByUser(params.query),
} as const;

enum ReviewQueryType {
  GET_ALL = 'GET_ALL',
  GET_ALL_BY_USER = 'GET_ALL_BY_USER',
}

const useReviewQuery = createGenericQueryHook('reviews', ReviewQueryFunctions);

export { useReviewQuery, ReviewQueryType };
