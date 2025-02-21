import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type QueryFunctionMap = Record<string, (params: any) => Promise<any>>;

function createGenericQueryHook<TQueryFunctions extends QueryFunctionMap>(
  domain: string,
  queryFunctions: TQueryFunctions,
) {
  type QueryKeys = keyof TQueryFunctions;
  type QueryPayload = {
    type: QueryKeys;
    params: Parameters<TQueryFunctions[QueryKeys]>[0];
  };

  type InferReturnType<T extends QueryPayload> = T extends { type: infer K }
    ? K extends keyof TQueryFunctions
      ? Awaited<ReturnType<TQueryFunctions[K]>>
      : never
    : never;

  function useDomainQuery<T extends QueryPayload>(
    payload: T,
    options?: Omit<
      UseQueryOptions<InferReturnType<T>, Error>,
      'queryKey' | 'queryFn'
    >,
  ) {
    return useQuery({
      queryKey: [domain, payload] as const,
      queryFn: async ({ queryKey }): Promise<InferReturnType<T>> => {
        const [, payload] = queryKey as [string, T];
        const queryFn = queryFunctions[payload.type];
        return queryFn(payload.params) as Promise<InferReturnType<T>>;
      },
      ...options,
    });
  }

  return useDomainQuery;
}

export { createGenericQueryHook };
