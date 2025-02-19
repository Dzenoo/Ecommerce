import React from 'react';
import { Heart } from 'lucide-react';

import { IProduct } from '@/types';

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
  return (
    <Button type="button" {...rest}>
      <Heart />
      {showText && <span className="ml-2">Add to favorites</span>}
    </Button>
  );
};

export default AddToFavorites;
