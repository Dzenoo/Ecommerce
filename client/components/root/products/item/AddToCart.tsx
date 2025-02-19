import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { IProduct } from '@/types';

import { Button, ButtonProps } from '@/components/ui/buttons/button';

type AddToCartProps = React.HTMLAttributes<HTMLButtonElement> &
  ButtonProps & {
    showText?: boolean;
    product: IProduct;
  };

const AddToCart: React.FC<AddToCartProps> = ({
  product,
  showText = false,
  ...rest
}) => {
  return (
    <Button type="button" {...rest}>
      <ShoppingBag />
      {showText && <span className="ml-2">Add to cart</span>}
    </Button>
  );
};

export default AddToCart;
