import { CreateAddressDto, GetAddressesDto, IAddress } from '@/types';

import {
  postApiHandler,
  patchApiHandler,
  deleteApiHandler,
  getApiHandler,
} from '../api';

export const createAddress = async (
  data: CreateAddressDto,
): Promise<ServerResponse<{ address: IAddress }>> => {
  return await postApiHandler('address/create', data);
};

export const updateAddress = async (
  data: Partial<CreateAddressDto>,
  addressId: string,
): Promise<ServerResponse<{ address: IAddress }>> => {
  return await patchApiHandler(`address/update/${addressId}`, data);
};

export const deleteAddress = async (
  addressId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`address/delete/${addressId}`);
};

export const getAddresses = async (
  query: GetAddressesDto,
): Promise<
  ServerResponse<{
    addresses: IAddress[];
    totalAddresses: number;
  }>
> => {
  return await getApiHandler(
    `address/all?page=${query.page}&limit=${query.limit}`,
  );
};
