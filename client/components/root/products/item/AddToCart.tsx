import { ShoppingBag } from 'lucide-react';

import { useToast } from '@/hooks/core/use-toast';
import { useAuthStore } from '@/store/auth.store';
import {
  useCartMutation,
  CartMutationType,
} from '@/hooks/mutations/useCart.mutation';
import { IProduct } from '@/types';
import Loader from '@/components/ui/info/loader';

import { Button, ButtonProps } from '@/components/ui/buttons/button';

type AddToCartProps = React.HTMLAttributes<HTMLButtonElement> &
  ButtonProps & {
    product: IProduct;
    attributes: Record<string, any>;
    quantity?: number;
    showText?: boolean;
  };

const AddToCart: React.FC<AddToCartProps> = ({
  product,
  attributes,
  quantity = 1,
  showText = false,
  ...rest
}) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const mutation = useCartMutation({
    onSuccess: (response) => {
      toast({
        title: 'Success',
        description:
          response.message || 'Product added to cart successfully 🚀',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  const handleAddToCart = () => {
    if (
      !Object.keys(attributes).includes('size') &&
      !Object.keys(attributes).includes('color') &&
      Object.values(attributes).length === 0
    )
      return toast({
        title: 'Error',
        description: 'Please select attributes before adding to cart',
      });

    return mutation.mutateAsync({
      type: CartMutationType.ADD,
      data: { productId: product._id, quantity, attributes },
    });
  };

  return (
    <Button type="button" onClick={handleAddToCart} {...rest}>
      {mutation.status === 'pending' ? (
        <Loader type="ScaleLoader" color="#ffffff" height={10} />
      ) : (
        <>
          <ShoppingBag />
          {showText && <span className="ml-2">Add to cart</span>}
        </>
      )}
    </Button>
  );
};

export default AddToCart;
