import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

import { useToast } from '@shared/hooks/core/use-toast';
import { useCurrentUser } from '@shared/hooks/useCurrentUser';
import {
  useWishlistMutation,
  WishlistMutationType,
} from '@shared/hooks/mutations/useWishlist.mutation';
import {
  useWishlistQuery,
  WishlistQueryType,
} from '@shared/hooks/queries/useWishlist.query';
import { queryClient } from '@shared/context/react-query-client';
import { IProduct } from '@shared/types';
import Loader from '@shared/components/ui/info/loader';

import { Button, ButtonProps } from '@shared/components/ui/buttons/button';

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
  const { user, isAuthenticated } = useCurrentUser();
  const router = useRouter();

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

  if (user?.role === 'admin') {
    return null;
  }

  const isAlreadyInWishlist = data?.wishlist?.products?.some(
    (item: IProduct) => item._id === product._id,
  );

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      return router.push('/sign-in');
    }

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
