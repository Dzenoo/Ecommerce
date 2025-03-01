import { createGenericQueryHook } from './createGenericQueryHook';
import { GetAddressesDto } from '@/types';
import { getAddresses } from '@/lib/actions/address.actions';

const AddressQueryFunctions = {
  GET_ADDRESSES: (params: { query: GetAddressesDto }) =>
    getAddresses(params.query),
} as const;

enum AddressQueryType {
  GET_ADDRESSES = 'GET_ADDRESSES',
}

const useAddressQuery = createGenericQueryHook(
  'addresses',
  AddressQueryFunctions,
);

export { useAddressQuery, AddressQueryType };
