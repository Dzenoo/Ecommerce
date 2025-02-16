import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getAnalytics } from '@/lib/actions/analytics.actions';

enum AnalyticsQueryType {
  GET_ANALYTICS = 'GET_ANALYTICS',
}

type AnalyticsQueryPayload = {
  type: AnalyticsQueryType.GET_ANALYTICS;
};

const useAnalyticsQuery = (
  payload: AnalyticsQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['analytics', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, AnalyticsQueryPayload];

      switch (payload.type) {
        case AnalyticsQueryType.GET_ANALYTICS:
          return getAnalytics();
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useAnalyticsQuery, AnalyticsQueryType };
