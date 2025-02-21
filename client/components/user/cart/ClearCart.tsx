import React from 'react';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import {
  CartMutationType,
  useCartMutation,
} from '@/hooks/mutations/useCart.mutation';

import { Button } from '@/components/ui/buttons/button';

const ClearCart: React.FC = () => {
  const { toast } = useToast();

  const mutation = useCartMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Success',
        description: response.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const handleClearCart = () => {
    return mutation.mutateAsync({
      type: CartMutationType.CLEAR,
    });
  };

  return (
    <Button variant="outline" onClick={handleClearCart}>
      Clear Cart
    </Button>
  );
};

export default ClearCart;
