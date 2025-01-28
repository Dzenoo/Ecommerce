import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createAddress = async (body: FormData) => {
  return await postApiHandler('address/create', body);
};

export const updateAddress = async (body: FormData, addressId: string) => {
  return await patchApiHandler(`address/update/${addressId}`, body);
};

export const deleteAddress = async (addressId: string) => {
  return await deleteApiHandler(`address/delete/${addressId}`);
};

export const getAddresses = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return await getApiHandler(`address/all?page=${page}&limit=${limit}`);
};
