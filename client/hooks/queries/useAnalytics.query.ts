import { createGenericQueryHook } from './createGenericQueryHook';
import { getAnalytics } from '@/lib/actions/analytics.actions';

const AnalyticsQueryFunctions = {
  GET_ANALYTICS: () => getAnalytics(),
} as const;

enum AnalyticsQueryType {
  GET_ANALYTICS = 'GET_ANALYTICS',
}

const useAnalyticsQuery = createGenericQueryHook(
  'analytics',
  AnalyticsQueryFunctions,
);

export { useAnalyticsQuery, AnalyticsQueryType };
