import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/actions/product.actions';

import { CreateProductDto } from '@/types';

import { useToast } from '../core/use-toast';

enum ProductMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type ProductMutationPayload =
  | {
      type: ProductMutationType.CREATE;
      data: FormData;
    }
  | {
      type: ProductMutationType.UPDATE;
      data: FormData;
      productId: string;
    }
  | {
      type: ProductMutationType.DELETE;
      productId: string;
    };

const useProductMutation = (
  options?: Omit<
    UseMutationOptions<any, any, ProductMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: ProductMutationPayload) => {
    switch (payload.type) {
      case ProductMutationType.CREATE:
        return createProduct(payload.data);
      case ProductMutationType.UPDATE:
        return updateProduct(payload.data, payload.productId);
      case ProductMutationType.DELETE:
        return deleteProduct(payload.productId);
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

export { useProductMutation, ProductMutationType };
