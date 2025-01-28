import { CreateAddressDto, GetAddressesDto } from '@/types';

import {
  postApiHandler,
  patchApiHandler,
  deleteApiHandler,
  getApiHandler,
} from '../api';

export const createAddress = async (
  data: CreateAddressDto,
): Promise<ServerResponse<{ address: Readonly<CreateAddressDto> }>> => {
  return await postApiHandler('address/create', data);
};

export const updateAddress = async (
  data: Partial<CreateAddressDto>,
  addressId: string,
): Promise<ServerResponse<{ address: Readonly<CreateAddressDto> }>> => {
  return await patchApiHandler(`address/update/${addressId}`, data);
};

export const deleteAddress = async (
  addressId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`address/delete/${addressId}`);
};

export const getAddresses = async ({
  page = 1,
  limit = 10,
}: GetAddressesDto): Promise<
  ServerResponse<{
    addresses: Readonly<CreateAddressDto[]>;
    totalAddresses: number;
  }>
> => {
  return await getApiHandler(`address/all?page=${page}&limit=${limit}`);
};
