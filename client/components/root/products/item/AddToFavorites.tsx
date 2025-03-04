import { Heart } from 'lucide-react';

import { useToast } from '@/hooks/core/use-toast';
import { useAuthStore } from '@/store/auth.store';
import {
  useWishlistMutation,
  WishlistMutationType,
} from '@/hooks/mutations/useWishlist.mutation';
import {
  useWishlistQuery,
  WishlistQueryType,
} from '@/hooks/queries/useWishlist.query';
import { queryClient } from '@/context/react-query-client';
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
  const { user, isAuthenticated } = useAuthStore();

  const { data } = useWishlistQuery({
    type: WishlistQueryType.GET_WISHLIST,
    params: { query: {} },
  });

  const mutation = useWishlistMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
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

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  const isAlreadyInWishlist = data?.wishlist?.products?.some(
    (item: IProduct) => item._id === product._id,
  );

  const handleAddToWishlist = () => {
    mutation.mutateAsync({
      type: isAlreadyInWishlist
        ? WishlistMutationType.REMOVE
        : WishlistMutationType.ADD,
      productId: product._id,
    });
  };

  return (
    <Button type="button" onClick={handleAddToWishlist} {...rest}>
      {mutation.status === 'pending' ? (
        <Loader type="ScaleLoader" color="#ffffff" height={10} />
      ) : (
        <>
          <Heart fill={isAlreadyInWishlist ? 'black' : 'none'} />
          {showText && (
            <span className="ml-2">
              {isAlreadyInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

export default AddToFavorites;
