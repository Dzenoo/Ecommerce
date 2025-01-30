import { useQuery } from '@tanstack/react-query';

import { getAddresses } from '@/lib/actions/address.actions';
import { GetAddressesDto } from '@/types';

const useAddressQuery = (query?: GetAddressesDto) => {
  return useQuery({
    queryFn: () => {
      return getAddresses({
        page: Number(query?.page) || 1,
        limit: Number(query?.limit) || 10,
      });
    },
    queryKey: ['address'],
  });
};

export { useAddressQuery };
