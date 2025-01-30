import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createAddress,
  updateAddress,
  deleteAddress,
} from '@/lib/actions/address.actions';

import { CreateAddressDto } from '@/types';

import { useToast } from '../core/use-toast';

enum AddressMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type AddressMutationPayload =
  | {
      type: AddressMutationType.CREATE;
      data: CreateAddressDto;
    }
  | {
      type: AddressMutationType.UPDATE;
      addressId: string;
      data: Partial<CreateAddressDto>;
    }
  | {
      type: AddressMutationType.DELETE;
      addressId: string;
    };

const useAddressMutation = (
  options?: Omit<
    UseMutationOptions<any, any, AddressMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: AddressMutationPayload) => {
    switch (payload.type) {
      case AddressMutationType.CREATE:
        return createAddress(payload.data);
      case AddressMutationType.UPDATE:
        return updateAddress(payload.data, payload.addressId);
      case AddressMutationType.DELETE:
        return deleteAddress(payload.addressId);
      default:
        throw new Error('Invalid mutation type');
    }
  };

  const mutation = useMutation({
    mutationFn,
    onError: (error: any) => {
      toast({ title: 'Error', description: error?.response?.data?.message });
    },
    ...options,
  });

  return mutation;
};

export { useAddressMutation, AddressMutationType };
