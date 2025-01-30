import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getReviews } from '@/lib/actions/review.actions';

import { GetReviewsDto } from '@/types';

enum ReviewQueryType {
  GET_ALL = 'GET_ALL',
}

type ReviewQueryPayload = {
  type: ReviewQueryType.GET_ALL;
  query: GetReviewsDto;
  productId: string;
};

const useReviewQuery = (
  payload: ReviewQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['reviews', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, ReviewQueryPayload];

      switch (payload.type) {
        case ReviewQueryType.GET_ALL:
          return getReviews(payload.query, payload.productId);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useReviewQuery, ReviewQueryType };
