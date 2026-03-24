import { queryClient } from '@shared/context/react-query-client';
import { useToast } from '@shared/hooks/core/use-toast';
import {
  CartMutationType,
  useCartMutation,
} from '@shared/hooks/mutations/useCart.mutation';

import { Button } from '@shared/components/ui/buttons/button';

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
    <Button
      variant="outline"
      onClick={handleClearCart}
      className="max-sm:w-full"
    >
      Clear Cart
    </Button>
  );
};

export default ClearCart;
