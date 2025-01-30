import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getAddresses } from '@/lib/actions/address.actions';

import { GetAddressesDto } from '@/types';

enum AddressQueryType {
  GET_ADDRESSES = 'GET_ADDRESSES',
}

type AddressQueryPayload = {
  type: AddressQueryType.GET_ADDRESSES;
  query: GetAddressesDto;
};

const useAddressQuery = (
  payload: AddressQueryPayload,
  options?: Omit<UseQueryOptions<any, any, any>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['address', payload] as const,
    queryFn: async ({ queryKey }) => {
      const [, payload] = queryKey as [string, AddressQueryPayload];

      switch (payload.type) {
        case AddressQueryType.GET_ADDRESSES:
          return getAddresses(payload.query);
        default:
          throw new Error('Invalid query type');
      }
    },
    ...options,
  });
};

export { useAddressQuery, AddressQueryType };
