import React from 'react';
import { Heart } from 'lucide-react';

import { IProduct } from '@/types';

import { Button } from '@/components/ui/buttons/button';

type AddToFavoritesProps = React.HTMLAttributes<HTMLButtonElement> & {
  product: IProduct;
};

const AddToFavorites: React.FC<AddToFavoritesProps> = ({
  product,
  ...rest
}) => {
  return (
    <Button variant="ghost" {...rest}>
      <Heart />
    </Button>
  );
};

export default AddToFavorites;
