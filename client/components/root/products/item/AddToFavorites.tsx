import React from 'react';
import { Heart } from 'lucide-react';

import { useToast } from '@/hooks/core/use-toast';
import {
  useWishlistMutation,
  WishlistMutationType,
} from '@/hooks/mutations/useWishlist.mutation';
import { IProduct } from '@/types';
import Loader from '@/components/ui/info/loader';

import { Button, ButtonProps } from '@/components/ui/buttons/button';

type AddToFavoritesProps = React.HTMLAttributes<HTMLButtonElement> &
  ButtonProps & {
    showText?: boolean;
    product: IProduct;
  };

const AddToFavorites: React.FC<AddToFavoritesProps> = ({
  product,
  showText = false,
  ...rest
}) => {
  const { toast } = useToast();

  const mutation = useWishlistMutation({
    onSuccess: (response) => {
      toast({
        title: 'Success',
        description:
          response.message || 'Product added to wishlist successfully 🚀',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const handleAddToWishlist = () => {
    mutation.mutateAsync({
      type: WishlistMutationType.ADD,
      productId: product._id,
    });
  };

  return (
    <Button type="button" onClick={handleAddToWishlist} {...rest}>
      {mutation.status === 'pending' ? (
        <Loader type="ScaleLoader" color="#ffffff" height={10} />
      ) : (
        <>
          <Heart />
          {showText && <span className="ml-2">Add to favorites</span>}
        </>
      )}
    </Button>
  );
};

export default AddToFavorites;
